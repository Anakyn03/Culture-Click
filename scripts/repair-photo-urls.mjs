#!/usr/bin/env node
/**
 * One-off repair pass: re-derive every stored photo URL from Wikimedia's canonical
 * imageinfo response, so URLs whose upload hash path changed (a moved or re-uploaded
 * file 404s on its old /8/84/-style path) and thumbnails wider than the original file
 * (also 404s) are rewritten to URLs that resolve.
 *
 *   node scripts/repair-photo-urls.mjs
 *
 * URL shapes handled:
 *   .../wikipedia/commons/<h1>/<h2>/<Name>.jpg                  (original)
 *   .../wikipedia/commons/thumb/<h1>/<h2>/<Name>.jpg/960px-<Name>.jpg
 *   .../wikipedia/commons/thumb/<h1>/<h2>/<X>.TIF/lossy-page1-960px-<X>.TIF.jpg
 *   .../wikipedia/en/...                                        (enwiki-local files — left alone)
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'data', 'states');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'CultureClick/0.1 (photo URL repair; contact: repository owner)';
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const COMMONS_URL = /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//;

/** Pull the original filename and stored width out of any thumbnail/original URL. */
function readStored(url) {
  // MediaWiki canonical titles use spaces; URLs use underscores.
  const segment = decodeURIComponent(url.split('/').pop()).replace(/_/g, ' ');
  const thumb = /^(?:lossy-page\d+-)?(\d+)px-(.+)$/.exec(segment);
  if (!thumb) return { width: null, name: segment };
  // A TIF thumb renders as a JPEG derivative (`X.TIF/lossy-page1-960px-X.TIF.jpg`);
  // the Commons file is the TIF, so only that renderer suffix is stripped. MediaWiki
  // canonical titles use spaces, so the URL's underscores go too.
  const name = /\.tiff?\.jpe?g$/i.test(thumb[2]) ? thumb[2].replace(/\.jpe?g$/i, '') : thumb[2];
  return { width: Number(thumb[1]), name };
}

// ---------------------------------------------------------------------------
// Pass 1: collect every commons-hosted URL's file title
// ---------------------------------------------------------------------------

const docs = readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .map((f) => ({ path: join(DATA_DIR, f), doc: JSON.parse(readFileSync(f ? join(DATA_DIR, f) : f, 'utf8')) }));

/** Every entity that can carry photos, with a setter that writes back. */
function* entities({ doc }) {
  yield doc;
  for (const district of doc.districts) {
    yield district;
    for (const place of district.places) yield place;
  }
}

const titles = new Set();
for (const entry of docs) {
  for (const entity of entities(entry)) {
    for (const url of [entity.photo?.url, ...(entity.photos ?? [])].filter(Boolean)) {
      if (!COMMONS_URL.test(url)) continue;
      titles.add(`File:${readStored(url).name}`);
    }
  }
}
console.log(`  ${titles.size} distinct Commons file(s)`);

// ---------------------------------------------------------------------------
// Pass 2: resolve canonical original + 1920px thumb for each title
// ---------------------------------------------------------------------------

const canonical = new Map(); // title -> { original, thumb1920, width }
const titleList = [...titles];
for (let i = 0; i < titleList.length; i += 40) {
  const batch = titleList.slice(i, i + 40);
  let data;
  try {
    const response = await fetch(
      `${API}?${new URLSearchParams({
        action: 'query', format: 'json', titles: batch.join('|'),
        prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: '1920',
      })}`,
      { headers: { 'User-Agent': UA } }
    );
    if (!response.ok) throw new Error(`API ${response.status}`);
    data = await response.json();
  } catch (error) {
    // A transient failure here must not blank photos: retry once, then abort the run.
    await sleep(5000);
    const retry = await fetch(
      `${API}?${new URLSearchParams({
        action: 'query', format: 'json', titles: batch.join('|'),
        prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: '1920',
      })}`,
      { headers: { 'User-Agent': UA } }
    );
    if (!retry.ok) throw new Error(`API ${retry.status} (after retry): ${error.message}`);
    data = await retry.json();
  }
  for (const page of Object.values(data.query?.pages ?? {})) {
    if (page.missing !== undefined) {
      console.log(`  ! missing on Commons, left as stored: ${page.title}`);
      continue;
    }
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const original = info.url.split('?')[0];
    const thumb1920 = info.thumburl ? info.thumburl.split('?')[0] : null;
    canonical.set(page.title, { original, thumb1920, width: info.width });
  }
  await sleep(1200);
}

/**
 * Canonical URL for a stored URL's (file, width). Thumbs below the original's width keep
 * their stored width (only the hash path is refreshed) — a thumbnail URL is derived from
 * the same canonical file path, so rewriting the width segment on the fresh thumb is safe.
 * A stored width at or above the original's size can never resolve: fall back to the
 * original file, which `resolvePhoto` passes through unthumbed.
 */
function canonicalFor(url, info) {
  const stored = readStored(url);
  if (stored.width && stored.width < info.width) {
    if (!info.thumb1920) return info.original;
    return info.thumb1920.replace(/(\d+)px-/, `${stored.width}px-`);
  }
  return info.original;
}

// ---------------------------------------------------------------------------
// Pass 3: rewrite the data
// ---------------------------------------------------------------------------

let rewritten = 0;
const failures = [];
for (const entry of docs) {
  let dirty = false;
  for (const entity of entities(entry)) {
    if (entity.photo?.url) {
      if (COMMONS_URL.test(entity.photo.url)) {
        const info = canonical.get(`File:${readStored(entity.photo.url).name}`);
        if (info) {
          const fresh = canonicalFor(entity.photo.url, info);
          if (fresh !== entity.photo.url) { entity.photo.url = fresh; rewritten += 1; dirty = true; }
        } else failures.push(entity.photo.url);
      }
    }
    if (Array.isArray(entity.photos)) {
      entity.photos = entity.photos.map((url) => {
        if (!COMMONS_URL.test(url)) return url;
        const info = canonical.get(`File:${readStored(url).name}`);
        if (!info) { failures.push(url); return url; }
        const fresh = canonicalFor(url, info);
        if (fresh !== url) { rewritten += 1; dirty = true; }
        return fresh;
      });
      if (new Set(entity.photos).size !== entity.photos.length) {
        entity.photos = [...new Set(entity.photos)];
        dirty = true;
      }
      if (entity.photos.length < 2) delete entity.photos;
      else if (entity.photo?.url && !entity.photos.includes(entity.photo.url)) {
        // The lead may have fallen back to an original whose thumb doesn't exist;
        // keep the set coherent with whatever the lead now is.
        entity.photos = [entity.photo.url, ...entity.photos.filter((u) => u !== entity.photo.url)].slice(0, 3);
        dirty = true;
      }
    }
  }
  if (dirty) writeFileSync(entry.path, `${JSON.stringify(entry.doc, null, 2)}\n`, 'utf8');
}

console.log(`  ${rewritten} URL(s) rewritten across the dataset`);
if (failures.length) console.log(`  ! ${failures.length} URL(s) had no resolvable file (left as stored):\n      ${[...new Set(failures)].join('\n      ')}`);
