/**
 * Pure helpers shared by the pages.
 *
 * There are no selectors here that reach into a whole atlas any more: content is fetched a
 * state or a place at a time (see lib/atlasApi.js), so anything that used to walk every state
 * now happens in Postgres.
 */

/** Dates before 1000 CE read as approximations rather than exact years. */
export function formatYear(y) {
  return y < 1000 ? `~${y} CE` : String(y);
}

/** Canonical external reference for a place — one place to change the convention. */
export function wikipediaUrl(name) {
  const cleaned = name.replace(/\s*\(.*\)/, '').trim();
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(cleaned)}`;
}

export function mapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * The route for a state, district or place — whether it came from a search hit or a resolved
 * wishlist key. Every entity shape the API returns carries its owner ids, so a saved item can
 * be turned back into a link without knowing where it came from.
 */
export function routeFor(entity) {
  if (!entity) return '/';
  if (entity.kind === 'state') return `/state/${entity.id}`;
  if (entity.kind === 'district') return `/state/${entity.stateId}/${entity.id}`;
  return `/state/${entity.stateId}/${entity.districtId}/${entity.id}`;
}

/** Find a district inside one fetched state slice. */
export function districtIn(state, districtId) {
  return state?.districts?.find((d) => d.id === districtId) ?? null;
}
