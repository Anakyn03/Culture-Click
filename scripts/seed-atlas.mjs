#!/usr/bin/env node
/**
 * Seed the Culture Click content tables from data/states/*.json.
 *
 *   npm run seed
 *   npm run seed -- --dry-run     # validate and report, write nothing
 *
 * `data/states/<id>.json` is the source of truth — versioned, diffable and
 * reviewable — and it is *not* bundled into the app. The browser reads content from
 * Supabase, so this script is the only path from an edit to a live site.
 *
 * Seeding is idempotent: it upserts every row and prunes anything no longer present
 * in the dataset. Content is read-only to the browser by design (see
 * supabase/schema.sql), so this script needs a service-role key — it must never run
 * in a browser context or ship to a client bundle.
 *
 * Credentials are read from the environment, falling back to `.env.local`:
 *
 *   VITE_SUPABASE_URL            (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY    Project Settings → API → service_role secret
 *
 * NEVER commit the service-role key, and never prefix it with VITE_ — Vite inlines
 * any VITE_-prefixed variable into the client bundle.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { labelize, slugify, validateAll } from './lib/validate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = resolve(ROOT, 'data', 'states');
const DRY_RUN = process.argv.includes('--dry-run');
const CHUNK = 50;

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/** Minimal .env reader — avoids adding a dependency for one file. */
function loadEnvFile() {
  const path = resolve(ROOT, '.env.local');
  if (!existsSync(path)) return {};

  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (/^\s*#/.test(line)) continue;
    const match = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    out[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const fileEnv = loadEnvFile();
const readEnv = (key) => process.env[key] || fileEnv[key];

const url = readEnv('SUPABASE_URL') || readEnv('VITE_SUPABASE_URL');
const serviceKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

/**
 * Credentials are only needed to write. `--dry-run` is a content check, so it runs
 * anywhere — including CI, and on a machine that has never seen the project's keys.
 */
function requireCredentials() {
  if (url && serviceKey) return;
  console.error(
    [
      '',
      'Missing credentials. This script needs:',
      '  VITE_SUPABASE_URL          (Project Settings → API → Project URL)',
      '  SUPABASE_SERVICE_ROLE_KEY  (Project Settings → API → service_role secret)',
      '',
      'Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or export both before running.',
      'The service-role key bypasses Row Level Security — keep it out of git and out of',
      'any VITE_-prefixed variable name.',
      '',
    ].join('\n')
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

function readDataset() {
  if (!existsSync(DATA_DIR)) {
    console.error(`\n  ✗ ${DATA_DIR} does not exist — nothing to seed.\n`);
    process.exit(1);
  }

  return readdirSync(DATA_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')));
}

const documents = readDataset();

// ---------------------------------------------------------------------------
// Validation — nothing is written until the content is sound
// ---------------------------------------------------------------------------

const { errors, warnings, counts } = validateAll(documents);

console.log(`\nCulture Click — atlas seed${DRY_RUN ? ' (dry run)' : ''}`);
console.log(`  target: ${url ?? '(no Supabase URL configured)'}`);
console.log(
  `  dataset: ${counts.states} states · ${counts.districts} districts · ${counts.places} places\n`
);

for (const warning of warnings) console.log(`  ! ${warning}`);

if (errors.length) {
  console.error(`\n  ✗ ${errors.length} content problem(s):\n`);
  for (const error of errors.slice(0, 40)) console.error(`      ${error}`);
  if (errors.length > 40) console.error(`      … and ${errors.length - 40} more`);
  console.error('');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Row mapping — authoring shape (nested) → relation shape (tables)
// ---------------------------------------------------------------------------

const stateRows = [];
const districtRows = [];
const placeRows = [];
const festivalRows = new Map();   // id → row
const tagRows = new Map();        // id → row
const stateFestivalRows = new Map();
const stateTagRows = new Map();
const placeTagRows = new Map();

const addTag = (kind, rawName) => {
  const id = `${kind}:${slugify(rawName)}`;
  if (!tagRows.has(id)) tagRows.set(id, { id, kind, name: labelize(slugify(rawName)) });
  return id;
};

documents.forEach((doc, stateIndex) => {
  stateRows.push({
    id: doc.id,
    name: doc.name,
    region: doc.region,
    tagline: doc.tagline ?? null,
    unesco: Boolean(doc.unesco),
    blurb: doc.blurb ?? null,
    stats: doc.stats ?? {},
    // Only the parts that have no table of their own stay in jsonb; festivals, dance
    // and cuisine live in the relation tables and are composed back by the RPCs.
    culture: { dress: doc.culture?.dress ?? null },
    photo_url: doc.photo?.url ?? null,
    photo_title: doc.photo?.title ?? null,
    photo_set: doc.photos ?? null,
    sort_order: stateIndex,
    updated_at: new Date().toISOString(),
  });

  for (const festival of doc.culture?.festivals ?? []) {
    const id = `festival:${slugify(festival.name)}`;
    if (!festivalRows.has(id)) festivalRows.set(id, { id, name: festival.name, month: festival.month });
    stateFestivalRows.set(`${doc.id}|${id}`, { state_id: doc.id, festival_id: id });
  }

  for (const [kind, list] of [
    ['dance', doc.culture?.dance ?? []],
    ['cuisine', doc.culture?.cuisine ?? []],
  ]) {
    for (const name of list) {
      const tagId = addTag(kind, name);
      stateTagRows.set(`${doc.id}|${tagId}`, { state_id: doc.id, tag_id: tagId });
    }
  }

  doc.districts.forEach((district, districtIndex) => {
    districtRows.push({
      id: district.id,
      state_id: doc.id,
      name: district.name,
      blurb: district.blurb ?? null,
      photo_url: district.photo?.url ?? null,
      photo_title: district.photo?.title ?? null,
      photo_set: district.photos ?? null,
      sort_order: districtIndex,
    });

    district.places.forEach((place, placeIndex) => {
      placeRows.push({
        id: place.id,
        district_id: district.id,
        name: place.name,
        type: place.type ?? null,
        blurb: place.blurb ?? null,
        rating: place.rating ?? null,
        entry: place.entry ?? null,
        open_hours: place.open ?? null,
        best_season: place.bestSeason ?? null,
        budget: place.budget ?? null,
        difficulty: place.difficulty ?? null,
        best_photo: place.bestPhoto ?? null,
        history: place.history ?? null,
        architecture: place.architecture ?? null,
        timeline: place.timeline ?? [],
        facts: place.facts ?? [],
        hidden_gems: place.hiddenGems ?? [],
        food: place.food ?? [],
        experiences: place.experiences ?? [],
        travel: place.travel ?? {},
        lat: place.lat ?? null,
        lng: place.lng ?? null,
        photo_url: place.photo?.url ?? null,
        photo_title: place.photo?.title ?? null,
        photo_set: place.photos ?? null,
        source_url: place.sourceUrl ?? null,
        sort_order: placeIndex,
        updated_at: new Date().toISOString(),
      });

      for (const theme of place.themes ?? []) {
        const tagId = addTag('theme', theme);
        placeTagRows.set(`${place.id}|${tagId}`, { place_id: place.id, tag_id: tagId });
      }
    });
  });
});

const tables = [
  ['states', stateRows],
  ['districts', districtRows],
  ['places', placeRows],
  ['festivals', [...festivalRows.values()]],
  ['tags', [...tagRows.values()]],
  ['state_festivals', [...stateFestivalRows.values()]],
  ['state_tags', [...stateTagRows.values()]],
  ['place_tags', [...placeTagRows.values()]],
];

if (DRY_RUN) {
  console.log('\n  rows that would be written:');
  for (const [table, rows] of tables) console.log(`      ${table}: ${rows.length}`);
  console.log('\n  dry run — nothing written.\n');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

requireCredentials();
const client = createClient(url, serviceKey, { auth: { persistSession: false } });

/**
 * Upsert a table, tolerating a database that predates the photo-rotation column.
 * `photo_set` is the only field the schema migration adds; if the database has not
 * had supabase/schema.sql re-run yet, we drop it and seed everything else, so an
 * authentic-photo fix never has to wait on a dashboard visit.
 */
const ROTATION_COLUMN = 'photo_set';
const withoutRotation = (rows) => rows.map(({ [ROTATION_COLUMN]: _drop, ...rest }) => rest);

async function upsertAll(table, rows, conflict, { retried = false } = {}) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await client.from(table).upsert(batch, conflict ? { onConflict: conflict } : undefined);
    if (!error) continue;

    if (!retried && error.message.includes(ROTATION_COLUMN)) {
      console.log(
        `  ! ${table}: ${ROTATION_COLUMN} column missing — re-run supabase/schema.sql in the\n` +
          '    Supabase SQL Editor to enable photo rotation; seeding without it now.'
      );
      return upsertAll(table, withoutRotation(rows), conflict, { retried: true });
    }
    throw new Error(`upsert into ${table} failed: ${error.message}`);
  }
  if (!retried) console.log(`  ✓ ${table}: ${rows.length} row(s)`);
  else console.log(`  ✓ ${table}: ${rows.length} row(s) (without ${ROTATION_COLUMN})`);
}

/** Delete rows that are no longer in the dataset. Children first, so FKs stay satisfied. */
async function prune(table, keepIds, idColumn = 'id') {
  const { data, error } = await client.from(table).select(idColumn);
  if (error) throw new Error(`could not read ${table}: ${error.message}`);

  const stale = (data ?? []).filter((row) => !keepIds.has(row[idColumn]));
  if (!stale.length) return 0;

  for (let i = 0; i < stale.length; i += CHUNK) {
    const batch = stale.slice(i, i + CHUNK).map((row) => row[idColumn]);
    const { error: delError } = await client.from(table).delete().in(idColumn, batch);
    if (delError) throw new Error(`could not prune ${table}: ${delError.message}`);
  }
  return stale.length;
}

/** Junction tables have composite keys, so they are pruned by full row match. */
async function prunePairs(table, keys, columns) {
  const { data, error } = await client.from(table).select(columns.join(','));
  if (error) throw new Error(`could not read ${table}: ${error.message}`);

  const stale = (data ?? []).filter((row) => !keys.has(columns.map((c) => row[c]).join('|')));
  if (!stale.length) return 0;

  for (const row of stale) {
    let query = client.from(table).delete();
    for (const column of columns) query = query.eq(column, row[column]);
    const { error: delError } = await query;
    if (delError) throw new Error(`could not prune ${table}: ${delError.message}`);
  }
  return stale.length;
}

try {
  // Prune before upsert: junctions first, then the rows they point at.
  let removed = 0;
  removed += await prunePairs('place_tags', new Set(placeTagRows.keys()), ['place_id', 'tag_id']);
  removed += await prunePairs('state_tags', new Set(stateTagRows.keys()), ['state_id', 'tag_id']);
  removed += await prunePairs('state_festivals', new Set(stateFestivalRows.keys()), ['state_id', 'festival_id']);
  removed += await prune('places', new Set(placeRows.map((r) => r.id)));
  removed += await prune('districts', new Set(districtRows.map((r) => r.id)));
  removed += await prune('states', new Set(stateRows.map((r) => r.id)));
  removed += await prune('tags', new Set(tagRows.keys()));
  removed += await prune('festivals', new Set(festivalRows.keys()));

  await upsertAll('states', stateRows);
  await upsertAll('districts', districtRows);
  await upsertAll('places', placeRows);
  await upsertAll('festivals', [...festivalRows.values()]);
  await upsertAll('tags', [...tagRows.values()]);
  await upsertAll('state_festivals', [...stateFestivalRows.values()], 'state_id,festival_id');
  await upsertAll('state_tags', [...stateTagRows.values()], 'state_id,tag_id');
  await upsertAll('place_tags', [...placeTagRows.values()], 'place_id,tag_id');

  if (removed) console.log(`  ✓ ${removed} stale row(s) removed`);
  console.log('\nDone. The app reads this on the next page load.\n');
} catch (err) {
  console.error(`\n  ✗ ${err.message}`);
  console.error(
    '    If this mentions a missing table or function, apply supabase/schema.sql first\n' +
      '    (Supabase → SQL Editor → New query → paste the file → Run).\n'
  );
  process.exit(1);
}
