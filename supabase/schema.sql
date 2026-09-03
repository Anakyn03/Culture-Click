-- Culture Click — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is guarded so it won't error on a second run.

-- ============================================================================
-- WISHLIST — one row per (user, saved item). item_key matches the same format
-- already used client-side, e.g. "place:taj-mahal", "state:rajasthan", "dist:jaipur".
-- ============================================================================
create table if not exists public.wishlist_items (
  user_id    uuid references auth.users(id) on delete cascade not null,
  item_key   text not null,
  created_at timestamptz default now() not null,
  primary key (user_id, item_key)
);

alter table public.wishlist_items enable row level security;

drop policy if exists "Users manage their own wishlist" on public.wishlist_items;
create policy "Users manage their own wishlist"
  on public.wishlist_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- PHOTOS — one row per curated image for a state/district/place. Keeping photo
-- credit as data (not hardcoded JSX) means photos can be added/swapped without a
-- code deploy. entity_type + entity_id together identify what the photo belongs to.
-- ============================================================================
create table if not exists public.photos (
  id                  bigint generated always as identity primary key,
  entity_type         text not null check (entity_type in ('state', 'district', 'place')),
  entity_id           text not null,          -- matches the id used in statesData.js, e.g. 'taj-mahal'
  image_url           text not null,          -- the CDN URL to actually render
  thumbnail_url       text,                   -- optional smaller variant for grid cards
  blur_hash            text,                  -- Unsplash blurhash, for a placeholder while loading
  photographer_name    text not null,
  photographer_url     text,                  -- link back to the photographer's profile
  source                text not null default 'unsplash' check (source in ('unsplash', 'pexels', 'other')),
  source_url             text,                -- link back to the original photo page (attribution requirement)
  is_primary               boolean default false, -- the main hero/card image for this entity, if more than one is stored
  created_at                 timestamptz default now() not null
);

create index if not exists photos_entity_idx on public.photos (entity_type, entity_id);

alter table public.photos enable row level security;

-- Photos are public content (curated by us, not user-submitted) — anyone can read, nobody
-- can write from the client. Inserts/updates happen from the Supabase dashboard or a trusted
-- server-side script using the service role key, never from the browser.
drop policy if exists "Anyone can read photos" on public.photos;
create policy "Anyone can read photos"
  on public.photos
  for select
  using (true);

-- ============================================================================
-- Handy view: one "best" photo per entity (the primary one if set, otherwise the
-- most recently added), so the frontend can do a single simple query per card.
-- ============================================================================
create or replace view public.primary_photos as
select distinct on (entity_type, entity_id)
  entity_type, entity_id, image_url, thumbnail_url, blur_hash,
  photographer_name, photographer_url, source, source_url
from public.photos
order by entity_type, entity_id, is_primary desc, created_at desc;
