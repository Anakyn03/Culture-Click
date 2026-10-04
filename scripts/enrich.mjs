#!/usr/bin/env node
/**
 * Enrich the content with the two things that must not be invented.
 *
 *   npm run enrich                      # every state file
 *   npm run enrich -- --state rajasthan # one state
 *   npm run enrich -- --report          # print coverage, write nothing
 *
 * For each place, this asks Wikipedia for the article about that place and takes from it:
 *
 *   - COORDINATES, so a place sits where it actually is. The article's own coordinate record is
 *     cross-checked against the state's bounding box, which is what catches a match that landed
 *     on a same-named place in another part of the country.
 *   - a LEAD IMAGE, pinned to one of Wikimedia's standard thumbnail widths (any other width is
 *     answered with a 400), plus up to two more photographs from the same article, stored as
 *     `photos` so the site can rotate them on a five-day clock without any runtime requests.
 *   - the ARTICLE URL, stored as `sourceUrl` so every page can link to what its copy is based on.
 *
 * Districts and states borrow the photograph of their highest-rated place, which is how a state
 * card ends up showing a real landmark rather than a montage or a locator map.
 *
 * The run is all-or-nothing: if any lookup fails, nothing is written, so a flaky network cannot
 * half-blank the atlas.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bboxOf, validateAll } from './lib/validate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = resolve(ROOT, 'data', 'states');

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes('--report') || args.includes('--dry-run');
const STATE_FILTER = args.includes('--state') ? args[args.indexOf('--state') + 1] : null;

/**
 * Wikipedia's API answers 429 when it is hammered, and a run that ignores that writes nothing.
 * Requests are therefore spaced out, and a 429 (or a 5xx) is retried with exponential backoff
 * rather than being reported as a content problem.
 */
const REQUEST_GAP_MS = Number(args.includes('--delay') ? args[args.indexOf('--delay') + 1] : 1100);
const MAX_ATTEMPTS = 4;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** Wikimedia only serves these widths; anything else is a 400. */
const STANDARD_STEPS = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840];
const STORE_WIDTH = 1920;

const API = 'https://en.wikipedia.org/w/api.php';
const UA = 'CultureClick/0.1 (content enrichment; contact: repository owner)';

/** Words that carry no identity, so they can't count as a match on their own. */
const STOPWORDS = new Set([
  'the', 'and', 'of', 'fort', 'palace', 'temple', 'lake', 'garden', 'museum', 'national',
  'park', 'india', 'indian', 'city', 'town', 'village', 'river', 'hill', 'island', 'beach',
  'cave', 'caves', 'waterfall', 'falls', 'monastery', 'church', 'mosque', 'tomb', 'mahal',
  'group', 'complex', 'site', 'heritage', 'old', 'new', 'north', 'south', 'east', 'west',
]);

const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
const distinctive = (value) =>
  slug(value).filter((word) => word.length >= 3 && !STOPWORDS.has(word));

/**
 * How well an article title matches a place name. Zero means no shared distinctive word, which
 * is how "French Quarter" stops resolving to New Orleans and "Golden Temple" stops resolving to
 * a temple in Vellore.
 */
function matchScore(placeName, articleTitle) {
  const title = distinctive(articleTitle.replace(/,\s*.*$/, ''));
  const wanted = distinctive(placeName);
  return wanted.filter((word) => title.includes(word)).length;
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json', origin: '*' })}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': UA } });

    if (response.ok) {
      await sleep(REQUEST_GAP_MS);
      return response.json();
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === MAX_ATTEMPTS) {
      throw new Error(`Wikipedia answered ${response.status}`);
    }

    const after = Number(response.headers.get('retry-after'));
    const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 2 ** attempt * 1000;
    console.log(`  … rate limited (${response.status}), waiting ${Math.round(wait / 1000)}s`);
    await sleep(wait);
  }

  throw new Error('Wikipedia request failed');
}

/** Per-mille of the state's span that a coordinate may sit outside the box. */
const BBOX_SLACK = 0.2;

/**
 * Reject anything that isn't a usable photograph in the right part of the country.
 *
 * Coordinates are only *required* for a place that has none of its own: plenty of articles —
 * Cellular Jail, Neermahal, the living root bridges — carry a lead image but no coordinate
 * record, and refusing them would throw away a verified photograph for no reason. When the
 * place already has curated coordinates, the article just supplies the photo and the link.
 */
function judge(candidate, bbox, stateName, rejected, requireCoords) {
  if (!candidate.image) {
    rejected.push(`${candidate.title} (no lead image)`);
    return false;
  }
  if (/\.(svg|gif)$/i.test(candidate.image)) {
    rejected.push(`${candidate.title} (locator map, not a photo)`);
    return false;
  }
  if (!candidate.coords) {
    if (requireCoords) {
      rejected.push(`${candidate.title} (no coordinates to place it)`);
      return false;
    }
    return true;
  }
  if (bbox) {
    const padLat = (bbox.maxLat - bbox.minLat) * BBOX_SLACK;
    const padLng = (bbox.maxLng - bbox.minLng) * BBOX_SLACK;
    const { lat, lon } = candidate.coords;
    const inside =
      lat >= bbox.minLat - padLat &&
      lat <= bbox.maxLat + padLat &&
      lon >= bbox.minLng - padLng &&
      lon <= bbox.maxLng + padLng;
    if (!inside) {
      rejected.push(`${candidate.title} (${lat.toFixed(2)},${lon.toFixed(2)} is outside ${stateName})`);
      return false;
    }
  }
  return true;
}

/**
 * Find the best article for a place.
 *
 * The exact-title lookup comes first, and that ordering matters: our names are the common
 * names, and Wikipedia's canonical titles often differ slightly — “Amer Fort” redirects to
 * “Amber Fort”, “Patwon Ki Haveli” to “Patwon Ji Ki Haveli”. Trusting the redirect is exactly
 * right, so those hits are accepted without a token match; only the search fallback has to
 * score candidates, and it still has to land in the right state.
 */
async function lookupPlace(place, stateName, districtName, bbox) {
  const rejected = [];
  const requireCoords = typeof place.lat !== 'number' || typeof place.lng !== 'number';

  // `wikiTitle` in the JSON is the author's way of pointing at the right article when the
  // name alone is ambiguous or when Wikipedia files it under something else.
  // `pithumbsize: 1920` makes `thumbnail.source` a 1920px thumb with a `1920px-` path segment,
  // which is what lets the client rewrite widths for srcSet. `original` alone has no width
  // segment, so it is only the fallback for articles too small to thumbnail.
  const exact = await api({
    action: 'query',
    titles: place.wikiTitle ?? place.name,
    prop: 'coordinates|pageimages|images|info',
    inprop: 'url',
    piprop: 'thumbnail|original',
    pithumbsize: String(STORE_WIDTH),
    imlimit: '30',
    redirects: '1',
  });

  // A missing page comes back as `missing: ""` — an empty string, which is falsy, so this has
  // to test for the key rather than for truthiness.
  const exactPage = Object.values(exact?.query?.pages ?? {}).find((page) => page.missing === undefined);
  if (exactPage) {
    const candidate = {
      title: exactPage.title,
      url: exactPage.fullurl,
      coords: exactPage.coordinates?.[0] ?? null,
      image: exactPage.thumbnail?.source ?? exactPage.original?.source ?? null,
      files: (exactPage.images ?? []).map((image) => image.title),
    };
    if (judge(candidate, bbox, stateName, rejected, requireCoords)) return { accepted: candidate, rejected };
  } else {
    rejected.push(`${place.name} (no article at that title)`);
  }

  const query = [place.name, districtName, stateName].filter(Boolean).join(' ');
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: '6',
    prop: 'coordinates|pageimages|images|info',
    inprop: 'url',
    piprop: 'thumbnail|original',
    pithumbsize: String(STORE_WIDTH),
    imlimit: '30',
    redirects: '1',
  });

  const ranked = Object.values(data?.query?.pages ?? {})
    .map((page) => ({
      title: page.title,
      url: page.fullurl,
      coords: page.coordinates?.[0] ?? null,
      image: page.thumbnail?.source ?? page.original?.source ?? null,
      files: (page.images ?? []).map((image) => image.title),
      score: matchScore(place.name, page.title),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || (b.image ? 1 : 0) - (a.image ? 1 : 0));

  for (const candidate of ranked) {
    if (judge(candidate, bbox, stateName, rejected, requireCoords)) return { accepted: candidate, rejected };
  }

  return { accepted: null, rejected };
}

/**
 * Filename key so an encoded thumb URL and its `File:` title compare equal. The `File:`
 * namespace prefix has to go too, or a title key never matches its own URL key.
 */
function fileKey(urlOrTitle) {
  const base = String(urlOrTitle)
    .replace(/^file:/i, '')
    .split('/')
    .pop();
  return decodeURIComponent(base)
    .replace(/^\d+px-/, '')
    .replace(/\.[a-z]+$/i, '')
    .replace(/_/g, ' ')
    .toLowerCase();
}

/**
 * What counts as a photograph in the side door (an article's own file list). Logos,
 * icons, locator and district maps all hide behind ordinary filenames — "Bikaner
 * District with subdistricts.png" says nothing about being a map — so anything that
 * is not a JPEG or TIFF is out, along with the usual junk words.
 */
const PHOTO_FILE = /\.(jpe?g|tiff?)$/i;
const NON_PHOTO_NAME = /\b(map|icon|logo|symbol|seal|coat|flag|stamp|locator|diagram|chart)\b/i;

async function collectPhotos(candidate, limit = 3, prefer = null) {
  const photos = [];
  const seen = new Set();
  const lead = standardiseImage(candidate.image);
  photos.push(lead);
  seen.add(fileKey(lead));

  const extras = (candidate.files ?? [])
    .filter((file) => PHOTO_FILE.test(file))
    .filter((file) => !NON_PHOTO_NAME.test(file))
    .filter((file) => !seen.has(fileKey(file)));
  if (!extras.length) return photos.slice(0, limit);
  // The author's `preferPhoto` names the file that actually shows the place — used when
  // an article's lead is technically correct but visually wrong (a satellite view, for
  // instance). Fetch it first and let it win the lead slot below.
  const preferred = prefer ? extras.find((file) => fileKey(file) === fileKey(prefer)) : null;
  const ordered = preferred ? [preferred, ...extras.filter((file) => file !== preferred)] : extras;
  const fetchList = ordered.slice(0, 24);

  let data;
  try {
    data = await api({
      action: 'query',
      titles: fetchList.join('|'),
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(STORE_WIDTH),
    });
  } catch {
    return photos.slice(0, limit);   // rotation is a bonus; a lead-only place is fine
  }

  for (const page of Object.values(data?.query?.pages ?? {})) {
    const thumb = page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url;
    if (!thumb) continue;
    const clean = standardiseImage(thumb);
    const key = fileKey(clean);
    if (seen.has(key)) continue;
    seen.add(key);
    if (preferred && key === fileKey(preferred)) photos.unshift(clean);
    else photos.push(clean);
    if (photos.length >= limit + 1) break;
  }
  return photos.slice(0, limit);
}

/** Pin a Commons thumbnail to a standard width so the stored URL always resolves. */
function standardiseImage(url) {
  // The API appends tracking params (`?utm_source=...`) to thumb URLs; they are junk
  // in a stored URL and pointless on a hotlink.
  // eslint-disable-next-line no-param-reassign
  url = url.split('?')[0];
  const cut = url.lastIndexOf('/') + 1;
  const segment = url.slice(cut);
  const match = /(\d+)px-/.exec(segment);
  if (!match) return url;

  const stored = Number(match[1]);
  const step = STANDARD_STEPS.filter((s) => s <= Math.min(stored, STORE_WIDTH)).pop() ?? stored;
  return url.slice(0, cut) + segment.replace(/(\d+)px-/, `${step}px-`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

if (!existsSync(DATA_DIR)) {
  console.error(`\n  ✗ ${DATA_DIR} does not exist.\n`);
  process.exit(1);
}

const files = readdirSync(DATA_DIR)
  .filter((file) => file.endsWith('.json'))
  .filter((file) => !STATE_FILTER || file === `${STATE_FILTER}.json`)
  .sort();

if (!files.length) {
  console.error(`\n  ✗ no state file matched${STATE_FILTER ? ` --state ${STATE_FILTER}` : ''}.\n`);
  process.exit(1);
}

console.log(`\nCulture Click — enrich${REPORT_ONLY ? ' (report only)' : ''}`);
console.log(`  ${files.length} state file(s)\n`);

const failures = [];   // network/server trouble — the run refuses to write
const skipped = [];    // Wikipedia has no article for this place — reported, not fatal
const stats = { places: 0, resolved: 0, coordinatesFilled: 0, coordinatesConfirmed: 0, photosReplaced: 0 };
const writes = [];

for (const file of files) {
  const path = join(DATA_DIR, file);
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  const allPlaces = doc.districts.flatMap((d) => d.places.map((p) => ({ district: d, place: p })));
  const bbox = bboxOf(allPlaces.map(({ place }) => place));

  let accepted = 0;

  for (const { district, place } of allPlaces) {
    stats.places += 1;

    const hasCoords = typeof place.lat === 'number' && typeof place.lng === 'number';

    let result;
    try {
      result = await lookupPlace(place, doc.name, district.name, bbox);
    } catch (error) {
      failures.push(`${doc.id}/${place.id}: ${error.message}`);
      continue;
    }

    const { accepted: match, rejected } = result;
    if (!match) {
      // Not every notable place has an English Wikipedia article. That is a fact about
      // Wikipedia, not a failure — the place keeps the photo and coordinates it already has.
      // What it may not do is stay empty: a place with no photograph renders a grey box, so
      // that is still fatal, with the two ways out named.
      if (!place.photo?.url || !hasCoords) {
        failures.push(
          `${doc.id}/${place.id} — no article found and no photo/coordinates of its own; ` +
            `set "wikiTitle" to the right article, or give it a photo and lat/lng by hand` +
            (rejected.length ? ` (tried: ${rejected.join('; ')})` : '')
        );
      } else {
        skipped.push(`${doc.id}/${place.id} — no article for “${place.name}”, keeping its own photo`);
      }
      continue;
    }

    accepted += 1;
    stats.resolved += 1;

    if (!hasCoords && match.coords) {
      place.lat = Number(match.coords.lat.toFixed(5));
      place.lng = Number(match.coords.lon.toFixed(5));
      stats.coordinatesFilled += 1;
    } else if (hasCoords && match.coords) {
      // The curated coordinate is kept: for a monument it is usually the entrance, which is
      // what a visitor needs, while the article's is often the settlement it sits in.
      const drift = Math.hypot(place.lat - match.coords.lat, place.lng - match.coords.lon);
      if (drift > 0.25) {
        console.log(
          `  ! ${doc.id}/${place.id}: stored ${place.lat},${place.lng} is ${drift.toFixed(2)}° from ` +
            `${match.title} (${match.coords.lat.toFixed(4)},${match.coords.lon.toFixed(4)})`
        );
      } else {
        stats.coordinatesConfirmed += 1;
      }
    }

    // The rotation set: lead image plus up to two verified extras, all-or-nothing per
    // place — if the batched lookup fails the place just keeps a single photo.
    try {
      const photos = await collectPhotos(match, 3, place.preferPhoto);
      const lead = photos[0] ?? standardiseImage(match.image);
      if (photos.length > 1) place.photos = photos.slice(0, 3);
      else delete place.photos;
      if (place.photo?.url !== lead) stats.photosReplaced += 1;
      place.photo = { url: lead, title: match.title };
    } catch (error) {
      failures.push(`${doc.id}/${place.id}: rotation — ${error.message}`);
      continue;
    }

    place.sourceUrl = match.url;
  }


  // Districts and states inherit their flagship place's photograph when they have none.
  // The rotation set travels with it: a district card rotates the same photographs its
  // flagship place does, which keeps the imagery coherent.
  for (const district of doc.districts) {
    if (!district.photo?.url) {
      const best = [...district.places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
      if (best?.photo) {
        district.photo = { ...best.photo };
        if (best.photos?.length > 1) district.photos = [...best.photos];
        else delete district.photos;
      }
    }
  }
  if (!doc.photo?.url) {
    const best = doc.districts
      .flatMap((d) => d.places)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
    if (best?.photo) {
      doc.photo = { ...best.photo };
      if (best.photos?.length > 1) doc.photos = [...best.photos];
      else delete doc.photos;
    }
  }

  console.log(`  ${doc.id}: ${accepted}/${allPlaces.length} places resolved`);
  writes.push([path, doc]);
}

console.log(
  `\n  ${stats.resolved}/${stats.places} places resolved · ` +
    `${stats.coordinatesFilled} coordinates filled · ${stats.coordinatesConfirmed} confirmed · ` +
    `${stats.photosReplaced} photo(s) replaced`
);

if (skipped.length) {
  console.log(`\n  ${skipped.length} place(s) left as they were (no Wikipedia article):`);
  for (const skip of skipped) console.log(`      ${skip}`);
}

if (failures.length) {
  console.error(`\n  ✗ ${failures.length} place(s) could not be resolved — nothing written:\n`);
  for (const failure of failures.slice(0, 30)) console.error(`      ${failure}`);
  if (failures.length > 30) console.error(`      … and ${failures.length - 30} more`);
  console.error('');
  process.exit(1);
}

if (REPORT_ONLY) {
  console.log('\n  report only — nothing written.\n');
  process.exit(0);
}

// Validate before writing: enrichment must not be able to save content that fails the gate the
// seeder applies.
const { errors, counts } = validateAll(writes.map(([, doc]) => doc));
if (errors.length) {
  console.error(`\n  ✗ enriched content failed validation (${errors.length} problem(s)):\n`);
  for (const error of errors.slice(0, 20)) console.error(`      ${error}`);
  process.exit(1);
}

for (const [path, doc] of writes) {
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

console.log(
  `\n  ✓ wrote ${writes.length} state file(s) — ${counts.states} states · ` +
    `${counts.districts} districts · ${counts.places} places\n`
);
