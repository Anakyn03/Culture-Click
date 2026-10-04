import { supabase, isSupabaseConfigured, supabaseConfigIssue } from './supabaseClient';

/**
 * The signed-in visitor's own rows: reviews and check-ins.
 *
 * Kept apart from `atlasApi` on purpose. That module caches the curated atlas for the whole
 * session, which is safe because nobody edits it; these rows change under the user's own
 * hands, and a session cache would show a stale list right after a save. So each call hits the
 * database and the caller refreshes its own state.
 *
 * Rows come back snake_cased from PostgREST and leave this module camelCased, so components
 * see one shape whether an entity arrived through an RPC or through a table select.
 *
 * Reviews are readable by anyone (they attribute a public display name); check-ins and their
 * notes are private to their owner, enforced by row level security rather than here.
 */

function client() {
  if (!isSupabaseConfigured) throw new Error(supabaseConfigIssue ?? 'The database is not configured.');
  return supabase;
}

/** PostgREST upsert target: one row per person per place. */
const UNIQUE = { onConflict: 'user_id,place_id' };

/** Who wrote it — the display name and avatar their profile carries, never their email. */
const REVIEW_COLUMNS = 'user_id, place_id, rating, body, updated_at, profiles(display_name, avatar_url)';

/**
 * A personal row plus the place it belongs to. The ids come along because a place's URL is
 * built from its state and district, not from the place alone.
 */
const REVIEWED_PLACE_COLUMNS =
  'place_id, rating, body, updated_at, places(name, photo_url, districts(id, name, states(id, name)))';

const VISITED_PLACE_COLUMNS =
  'place_id, visited_on, note, places(name, photo_url, districts(id, name, states(id, name)))';

async function rows(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Where a reviewed or visited place lives, flattened for linking back to it. */
function toPlaceRef(row) {
  const districts = row.places?.districts;
  return {
    placeId: row.place_id,
    name: row.places?.name ?? row.place_id,
    photoUrl: row.places?.photo_url ?? null,
    districtId: districts?.id ?? null,
    districtName: districts?.name ?? null,
    stateId: districts?.states?.id ?? null,
    stateName: districts?.states?.name ?? null,
  };
}

function toReview(row) {
  return {
    userId: row.user_id,
    placeId: row.place_id,
    rating: row.rating,
    body: row.body ?? '',
    updatedAt: row.updated_at,
    author: {
      name: row.profiles?.display_name || 'A Culture Click traveller',
      avatarUrl: row.profiles?.avatar_url ?? null,
    },
  };
}

/** Every review of one place, newest first — the visitor's own included. */
export const fetchPlaceReviews = (placeId) =>
  rows(
    client()
      .from('reviews')
      .select(REVIEW_COLUMNS)
      .eq('place_id', placeId)
      .order('updated_at', { ascending: false })
      .limit(50)
  ).then((data) => data.map(toReview));

/** Upsert: one review per person per place, editable forever. */
export async function saveReview(userId, placeId, rating, body) {
  const { error } = await client()
    .from('reviews')
    .upsert({ user_id: userId, place_id: placeId, rating, body: body.trim() || null }, UNIQUE);
  if (error) throw new Error(error.message);
}

export async function deleteReview(userId, placeId) {
  const { error } = await client().from('reviews').delete().eq('user_id', userId).eq('place_id', placeId);
  if (error) throw new Error(error.message);
}

/** The visitor's private check-in, or null when they have not marked the place. */
export async function fetchVisit(userId, placeId) {
  const { data, error } = await client()
    .from('visits')
    .select('visited_on, note')
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? { visitedOn: data.visited_on, note: data.note ?? '' } : null;
}

export async function saveVisit(userId, placeId, visitedOn, note) {
  const { error } = await client()
    .from('visits')
    .upsert(
      { user_id: userId, place_id: placeId, visited_on: visitedOn || null, note: note.trim() || null },
      UNIQUE
    );
  if (error) throw new Error(error.message);
}

export async function deleteVisit(userId, placeId) {
  const { error } = await client().from('visits').delete().eq('user_id', userId).eq('place_id', placeId);
  if (error) throw new Error(error.message);
}

/** Everything the account page lists: the visitor's reviews, newest first. */
export const fetchMyReviews = (userId) =>
  rows(
    client().from('reviews').select(REVIEWED_PLACE_COLUMNS).eq('user_id', userId).order('updated_at', {
      ascending: false,
    })
  ).then((data) =>
    data.map((row) => ({
      ...toPlaceRef(row),
      rating: row.rating,
      body: row.body ?? '',
      updatedAt: row.updated_at,
    }))
  );

/** The visitor's check-ins, most recent trip first, undated ones last. */
export const fetchMyVisits = (userId) =>
  rows(
    client()
      .from('visits')
      .select(VISITED_PLACE_COLUMNS)
      .eq('user_id', userId)
      .order('visited_on', { ascending: false, nullsFirst: false })
  ).then((data) =>
    data.map((row) => ({ ...toPlaceRef(row), visitedOn: row.visited_on, note: row.note ?? '' }))
  );
