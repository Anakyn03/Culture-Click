import { supabase, isSupabaseConfigured, supabaseConfigIssue } from './supabaseClient';

/**
 * Every read of atlas content goes through here.
 *
 * The atlas lives in Postgres and is fetched in pieces — an index at boot, one state per
 * navigation, one place per place page — because a few hundred places is megabytes of JSON and
 * no page needs more than a slice of it.
 *
 * Two behaviours make that feel instant rather than merely correct:
 *   - a session cache, so going back to a state you already opened renders from memory with no
 *     request and no spinner;
 *   - in-flight de-duplication, so React's StrictMode double-invoke (mount → cleanup → mount)
 *     shares one request instead of firing two.
 *
 * Nothing here aborts a request. Cancellation is unnecessary: `useResource` discards results
 * for a key it has moved away from, and an aborted-and-deduped promise is exactly the bug that
 * once made the weather widget hide itself forever.
 */

const cache = new Map();
const inFlight = new Map();
const SEARCH_CACHE_LIMIT = 30;

async function rpc(name, params) {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigIssue ?? 'The content database is not configured.');
  }
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw new Error(error.message);
  return data;
}

/** Run `load` once per key, remembering the result (and any request already running). */
function once(key, load, remember = true) {
  if (remember && cache.has(key)) return Promise.resolve(cache.get(key));
  if (inFlight.has(key)) return inFlight.get(key);

  const promise = load()
    .then((value) => {
      if (remember) cache.set(key, value);
      return value;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
}

export const readCache = (key) => cache.get(key);

/** Boot payload: the 36 states with counts, culture and photos. Small by design. */
export const INDEX_KEY = 'index';
export const fetchIndex = () => once(INDEX_KEY, () => rpc('atlas_index'));

export const stateKey = (stateId) => `state:${stateId}`;
export const fetchState = (stateId) => once(stateKey(stateId), () => rpc('state_atlas', { p_state_id: stateId }));

export const placeKey = (placeId) => `place:${placeId}`;
export const fetchPlace = (placeId) => once(placeKey(placeId), () => rpc('place_detail', { p_place_id: placeId }));

export const FESTIVALS_KEY = 'festivals';
export const fetchFestivals = () => once(FESTIVALS_KEY, () => rpc('festivals_index'));

export const TIMELINE_KEY = 'timeline';
export const fetchTimeline = () => once(TIMELINE_KEY, () => rpc('timeline_index', {}));

/** Resolve saved `type:id` keys back into renderable entities, in the order given. */
export const entitiesKey = (keys) => `entities:${[...keys].sort().join(',')}`;
export const fetchEntities = (keys) => once(entitiesKey(keys), () => rpc('entities', { p_keys: [...keys] }));

/**
 * Search runs in Postgres, against the trigram indexes — the client never holds enough of the
 * atlas to match against it. Cached per query so backspacing or re-opening the panel is free,
 * with a cap so a long session can't grow the map without bound.
 */
export function searchPlaces(query) {
  const key = `search:${query.trim().toLowerCase()}`;
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (inFlight.has(key)) return inFlight.get(key);

  const promise = rpc('search_places', { p_query: query.trim() })
    .then((hits) => {
      cache.set(key, hits);
      if (cache.size > SEARCH_CACHE_LIMIT + 32) {
        for (const existing of cache.keys()) {
          if (existing.startsWith('search:') && cache.size > SEARCH_CACHE_LIMIT) cache.delete(existing);
        }
      }
      return hits;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
}
