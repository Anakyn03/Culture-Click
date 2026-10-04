/**
 * Content validation — the gate every state file passes before it can be seeded.
 *
 * The dataset is hand-authored JSON, and at a few hundred places the failure modes
 * that matter are silent ones: an id typo that orphans a row, a coordinate copied
 * from the wrong state that puts a Kerala backwater in Rajasthan, a place missing
 * half its fields so its page renders as a skeleton of empty sections. All of those
 * are rejected here, before a single request reaches the database.
 *
 * Used by `npm run seed` and by the enrichment script, so the two can never disagree
 * about what "valid" means.
 */

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_PLACE_TEXT = [
  'name',
  'type',
  'blurb',
  'history',
  'architecture',
  'bestPhoto',
  'entry',
  'open',
  'bestSeason',
  'budget',
  'difficulty',
];
const REQUIRED_PLACE_LISTS = ['timeline', 'facts', 'hiddenGems', 'food', 'experiences'];
const REQUIRED_TRAVEL = ['railway', 'airport', 'parking', 'tip'];

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Human label for a slug: "heritage-village" → "Heritage Village". */
export const labelize = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Bounding box for a state, derived from the coordinates it already holds and
 * padded generously. It cannot prove a coordinate is right, but it reliably catches
 * one that belongs to a different part of the country. Exported because the
 * enrichment pipeline rejects a Wikipedia match with the same test.
 */
export function bboxOf(places) {
  const points = places.filter(
    (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
  );
  if (points.length < 2) return null;

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padLat = Math.max(0.75, (maxLat - minLat) * 0.15);
  const padLng = Math.max(0.75, (maxLng - minLng) * 0.15);

  return {
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
  };
}

/**
 * Validate one state document.
 *
 * @param {object} doc            parsed data/states/<id>.json
 * @param {{ ids: Map, strict: boolean }} context  shared id registry
 * @returns {{ errors: string[], warnings: string[], counts: object }}
 */
export function validateState(doc, context) {
  const errors = [];
  const warnings = [];
  const at = (path, message) => errors.push(`${doc.id ?? '?'}: ${path} — ${message}`);

  if (!doc.id || !ID.test(doc.id)) at('id', `must be a lowercase slug, got ${JSON.stringify(doc.id)}`);
  for (const field of ['name', 'region', 'blurb', 'tagline']) {
    if (!doc[field]) at(field, 'is required');
  }
  if (!doc.stats || typeof doc.stats !== 'object') at('stats', 'is required');
  if (!doc.photo?.url || !doc.photo?.title) at('photo', 'needs url and title');

  const claimId = (id, kind, path) => {
    if (!id || !ID.test(id)) {
      at(path, `id must be a lowercase slug, got ${JSON.stringify(id)}`);
      return;
    }
    const existing = context.ids.get(id);
    if (existing) at(path, `id "${id}" is already used by ${existing}`);
    else context.ids.set(id, `${doc.id} ${kind}`);
  };

  claimId(doc.id, 'state', 'id');

  const places = [];
  for (const [di, district] of (doc.districts ?? []).entries()) {
    const where = `districts[${di}]`;
    if (!district.name) at(where, 'name is required');
    if (!district.blurb) at(where, 'blurb is required');
    if (!district.photo?.url || !district.photo?.title) at(`${where}.photo`, 'needs url and title');
    claimId(district.id, 'district', `${where}.id`);

    if (!Array.isArray(district.places) || district.places.length === 0) {
      warnings.push(`${doc.id}/${district.id}: no places yet`);
    }

    for (const [pi, place] of (district.places ?? []).entries()) {
      const path = `${where}.places[${pi}]`;
      claimId(place.id, 'place', `${path}.id`);

      for (const field of REQUIRED_PLACE_TEXT) {
        if (!place[field]) at(`${path}.${field}`, 'is required');
      }
      for (const field of REQUIRED_PLACE_LISTS) {
        if (!Array.isArray(place[field]) || place[field].length === 0) {
          at(`${path}.${field}`, 'must be a non-empty array');
        }
      }
      if (typeof place.rating !== 'number' || place.rating < 0 || place.rating > 5) {
        at(`${path}.rating`, `must be a number from 0 to 5, got ${JSON.stringify(place.rating)}`);
      }
      if (!Array.isArray(place.themes) || place.themes.length === 0) {
        at(`${path}.themes`, 'must list at least one theme slug');
      } else if (place.themes.some((theme) => !ID.test(theme))) {
        at(`${path}.themes`, 'every theme must be a lowercase slug');
      }
      for (const field of REQUIRED_TRAVEL) {
        if (!place.travel?.[field]) at(`${path}.travel.${field}`, 'is required');
      }
      for (const [ti, event] of (place.timeline ?? []).entries()) {
        if (typeof event?.y !== 'number') at(`${path}.timeline[${ti}].y`, 'must be a number');
        if (!event?.label) at(`${path}.timeline[${ti}].label`, 'is required');
      }
      if (typeof place.lat !== 'number' || typeof place.lng !== 'number') {
        at(path, 'lat and lng are required numbers');
      }
      if (!place.photo?.url || !place.photo?.title) at(`${path}.photo`, 'needs url and title');

      places.push(place);
    }
  }

  // Coordinates are checked across the whole state, so a place can only be judged
  // against its neighbours — and never against itself.
  const bbox = bboxOf(places);
  if (!bbox) {
    warnings.push(`${doc.id}: fewer than two coordinates, geospatial check skipped`);
  } else {
    for (const place of places) {
      if (typeof place.lat !== 'number' || typeof place.lng !== 'number') continue;
      const inside =
        place.lat >= bbox.minLat &&
        place.lat <= bbox.maxLat &&
        place.lng >= bbox.minLng &&
        place.lng <= bbox.maxLng;
      if (!inside) {
        at(
          place.id,
          `coordinates ${place.lat},${place.lng} fall outside ${doc.name}'s bounding box ` +
            `(${bbox.minLat.toFixed(2)}..${bbox.maxLat.toFixed(2)} lat, ` +
            `${bbox.minLng.toFixed(2)}..${bbox.maxLng.toFixed(2)} lng)`
        );
      }
    }
  }

  return {
    errors,
    warnings,
    counts: {
      states: 1,
      districts: (doc.districts ?? []).length,
      places: places.length,
    },
  };
}

/** Validate a whole set of state documents, reporting shared-id clashes across files. */
export function validateAll(documents) {
  const ids = new Map();
  const errors = [];
  const warnings = [];
  const counts = { states: 0, districts: 0, places: 0 };

  for (const doc of documents) {
    const result = validateState(doc, { ids });
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    counts.states += result.counts.states;
    counts.districts += result.counts.districts;
    counts.places += result.counts.places;
  }

  return { errors, warnings, counts };
}
