/**
 * BUILD-TIME IMAGE RESOLVER
 * =========================
 * Reads the curated article titles in `image-sources.mjs`, resolves each one's
 * lead photograph via the Wikipedia/Wikimedia APIs, and writes a committed
 * manifest to `src/data/imageManifest.json`.
 *
 * Run with:  npm run fetch:images
 *
 * Why a committed manifest rather than live client requests:
 *   - the app ships zero third-party API calls at runtime
 *   - images can't silently change or disappear between deploys
 *   - author/license text travels with the URL, so attribution stays correct
 *
 * Every entry is validated before it is written. A result is REJECTED if the
 * file looks like a map, flag, emblem, seal or logo rather than a photograph —
 * those are common Wikipedia lead images for administrative regions and would
 * otherwise put a locator map where a photo belongs. Rejected and missing
 * entries are simply absent from the manifest, and the UI falls back to the
 * existing gradient motif.
 */

import { writeFile } from 'node:fs/promises';
import { DATA } from '../src/data/statesData.js';
import { IMAGE_SOURCES } from './image-sources.mjs';

const UA = 'CultureClick/1.0 (heritage atlas; https://github.com/Anakyn03/Culture-Click)';
const API = 'https://en.wikipedia.org/w/api.php';

/** Lead images for regions are often cartography or insignia, never a photo. */
const REJECT = /(locator|location_map|\bmap\b|_map|map_|flag|emblem|seal|coat_of_arms|logo|blank|outline|district|boundary|chart|graph)/i;
const ALLOWED_EXT = /\.(jpe?g|png|webp)$/i;

const q = (params) => `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      // 429 is expected under load — back off exponentially rather than failing.
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === tries - 1) throw err;
      await sleep(1000 * 2 ** i + Math.random() * 400);
    }
  }
}

const stripHTML = (s) =>
  s ? String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';

/** The API decorates image URLs with utm_* tracking params; drop them. */
const cleanUrl = (u) => (u ? String(u).split('?')[0] : u);

/** Turn a full-size upload URL into a resizable /thumb/ base. */
function thumbBase(original) {
  const m = cleanUrl(original).match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/);
  if (!m) return null;
  const [, root, d1, d2, file] = m;
  return { base: `${root}/thumb/${d1}/${d2}/${file}`, file };
}

const isPhoto = (name) => ALLOWED_EXT.test(name) && !REJECT.test(name);

/** Meaningful words from an article title, for matching against file names. */
const titleTokens = (title) =>
  title
    .toLowerCase()
    .replace(/[(),.'"]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['the', 'and', 'of', 'in', 'at', 'temple', 'fort', 'national', 'park'].includes(w));

/**
 * Score a candidate file. Files whose name echoes the article title are far more
 * likely to actually depict the subject, so they win over incidental images
 * (a related monument, a portrait, a diagram) that also appear on the page.
 */
function scoreFile(name, tokens) {
  const n = name.toLowerCase();
  let score = tokens.reduce((acc, t) => (n.includes(t) ? acc + 10 : acc), 0);
  if (/\.jpe?g$/i.test(name)) score += 2; // prefer photos over PNG screenshots/diagrams
  if (/\b(18|19)\d{2}\b/.test(name)) score -= 4; // deprioritise archival B&W scans
  if (/(painting|mural|drawing|sketch|engraving|restored|logo|icon|team)/i.test(n)) score -= 12;
  return score;
}

/** Resolve one entity -> photo + license, or a reason it was skipped. */
async function resolve(key, titles) {
  const candidates = Array.isArray(titles) ? titles : [titles];
  const problems = [];

  for (const title of candidates) {
    // One request gets the lead image AND the full image list for fallback.
    const page = await getJSON(
      q({
        action: 'query',
        titles: title,
        prop: 'pageimages|images',
        piprop: 'original|thumbnail',
        pithumbsize: '1600',
        imlimit: '40',
        redirects: '1',
      })
    );

    const pg = Object.values(page?.query?.pages || {})[0];
    if (!pg || pg.missing !== undefined) {
      problems.push(`article not found: ${title}`);
      continue;
    }

    // Preferred: the article's designated lead image.
    let fileName = pg.pageimage ? decodeURIComponent(pg.pageimage) : null;
    if (fileName && !isPhoto(fileName)) fileName = null;

    // Fallback: pageimages is empty for a fair number of articles, so pick the
    // best-matching photo out of the images actually used on the page.
    if (!fileName) {
      const tokens = titleTokens(pg.title);
      const ranked = (pg.images || [])
        .map((i) => i.title.replace(/^File:/, ''))
        .filter(isPhoto)
        .map((name) => ({ name, score: scoreFile(name, tokens) }))
        .sort((a, b) => b.score - a.score);
      if (ranked.length && ranked[0].score > 0) fileName = ranked[0].name;
    }

    if (!fileName) {
      problems.push(`no usable photo on: ${pg.title}`);
      continue;
    }

    const info = await getJSON(
      q({ action: 'query', titles: `File:${fileName}`, prop: 'imageinfo', iiprop: 'url|size|extmetadata' })
    );
    const ii = Object.values(info?.query?.pages || {})[0]?.imageinfo?.[0];
    if (!ii?.url) {
      problems.push(`no file info: ${fileName}`);
      continue;
    }

    const parts = thumbBase(ii.url);
    if (!parts) {
      problems.push(`unparseable upload URL: ${ii.url}`);
      continue;
    }

    const meta = ii.extmetadata || {};
    return {
      key,
      value: {
        article: pg.title,
        file: fileName,
        thumbBase: parts.base,
        fileBase: parts.file,
        width: ii.width || null,
        height: ii.height || null,
        author: stripHTML(meta.Artist?.value) || 'Unknown photographer',
        license: stripHTML(meta.LicenseShortName?.value) || 'See source',
        licenseUrl: meta.LicenseUrl?.value || '',
        descriptionUrl:
          ii.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`,
        articleUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}`,
      },
    };
  }

  return { key, error: problems.join(' | ') };
}

/** Small concurrency pool — stays polite to the API. */
async function pool(items, limit, worker) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await worker(items[idx]);
        await sleep(150); // stay well inside Wikimedia's rate limits
      }
    })
  );
  return out;
}

// ---- Build the key list straight from the dataset so nothing drifts --------
const keys = [];
for (const s of DATA.states) {
  keys.push({ key: `state:${s.id}`, label: s.name });
  for (const d of s.districts) {
    keys.push({ key: `district:${s.id}/${d.id}`, label: `${d.name} (${s.name})` });
    for (const p of d.places) {
      keys.push({ key: `place:${s.id}/${d.id}/${p.id}`, label: `${p.name} (${s.name})` });
    }
  }
}

const uncurated = keys.filter((k) => !IMAGE_SOURCES[k.key]);
const targets = keys.filter((k) => IMAGE_SOURCES[k.key]);

console.log(`Entities in dataset : ${keys.length}`);
console.log(`Curated titles      : ${targets.length}`);
if (uncurated.length) {
  console.log(`\nNOT CURATED (will use gradient fallback):`);
  uncurated.forEach((k) => console.log(`  - ${k.key}  [${k.label}]`));
}

console.log('\nResolving against Wikimedia...');
const results = await pool(targets, 3, ({ key }) =>
  resolve(key, IMAGE_SOURCES[key]).catch((e) => ({ key, error: e.message }))
);

const manifest = {};
const failures = [];
for (const r of results) {
  if (r.value) manifest[r.key] = r.value;
  else failures.push(r);
}

// Stable key order keeps the committed diff readable.
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));

await writeFile(
  new URL('../src/data/imageManifest.json', import.meta.url),
  `${JSON.stringify(sorted, null, 2)}\n`,
  'utf8'
);

console.log(`\nResolved  : ${Object.keys(sorted).length}/${keys.length}`);
console.log(`Failed    : ${failures.length}`);
if (failures.length) {
  console.log('\nFAILURES (these fall back to the gradient motif):');
  failures.forEach((f) => console.log(`  - ${f.key}\n      ${f.error}`));
}
console.log('\nWrote src/data/imageManifest.json');
