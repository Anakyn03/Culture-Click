-- ============================================================================
-- Culture Click — Supabase schema
--
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query). Safe to re-run: every statement is
-- guarded or replaced rather than appended.
--
-- Load the content afterwards with `npm run seed` (scripts/seed-atlas.mjs).
--
-- Four concerns live here:
--   1. CONTENT   — states / districts / places, exposed through four RPCs so the
--                  client never fetches the whole atlas at once.
--   2. RELATIONS — festivals and tags (dance, cuisine, theme) as real rows joined
--                  to states and places, so "all the forts" is a query.
--   3. PROFILES  — one row per auth user, created automatically on signup.
--   4. PERSONAL  — wishlist, reviews and visits, each readable/writable only as
--                  far as Row Level Security allows.
-- ============================================================================


-- ============================================================================
-- 1. CONTENT
--
-- The long-form parts of a place (history, timeline, facts, food, experiences,
-- travel) stay jsonb: they are always read and written whole with their parent and
-- never queried across entities, so normalising them would buy joins and nothing
-- else. The parts that ARE queried across entities — festivals and tags — are
-- tables (section 2).
-- ============================================================================

create extension if not exists pg_trgm;

create table if not exists public.states (
  id          text primary key,
  name        text not null,
  region      text not null,
  tagline     text,
  unesco      boolean not null default false,
  blurb       text,
  stats       jsonb not null default '{}'::jsonb,
  culture     jsonb not null default '{}'::jsonb,
  photo_url   text,
  photo_title text,
  -- Rotation set: up to three verified photographs, cycled on a five-day clock by
  -- the client. Null (or a single-element array) means the lead photo only.
  photo_set   jsonb,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.districts (
  id          text primary key,
  state_id    text not null references public.states(id) on delete cascade,
  name        text not null,
  blurb       text,
  photo_url   text,
  photo_title text,
  photo_set   jsonb,
  sort_order  int not null default 0
);

create table if not exists public.places (
  id            text primary key,
  district_id   text not null references public.districts(id) on delete cascade,
  name          text not null,
  type          text,
  blurb         text,
  rating        numeric(3, 1) check (rating is null or rating between 0 and 5),
  entry         text,
  open_hours    text,
  best_season   text,
  budget        text,
  difficulty    text,
  best_photo    text,
  history       text,
  architecture  text,
  timeline      jsonb not null default '[]'::jsonb,
  facts         jsonb not null default '[]'::jsonb,
  hidden_gems   jsonb not null default '[]'::jsonb,
  food          jsonb not null default '[]'::jsonb,
  experiences   jsonb not null default '[]'::jsonb,
  travel        jsonb not null default '{}'::jsonb,
  lat           double precision check (lat is null or lat between -90 and 90),
  lng           double precision check (lng is null or lng between -180 and 180),
  photo_url     text,
  photo_title   text,
  photo_set     jsonb,
  source_url    text,
  sort_order    int not null default 0,
  updated_at    timestamptz not null default now()
);

-- The photo-rotation columns are included in the table definitions above; these
-- ALTERs bring a database created before they existed up to the same shape.
alter table public.states    add column if not exists photo_set jsonb;
alter table public.districts add column if not exists photo_set jsonb;
alter table public.places    add column if not exists photo_set jsonb;

create index if not exists districts_state_idx on public.districts (state_id);
create index if not exists places_district_idx on public.places (district_id);
create index if not exists places_type_idx     on public.places (type);

-- Trigram indexes back the search RPC, which matches on substrings rather than
-- prefixes ("mahal" has to find "Hawa Mahal").
create index if not exists places_name_trgm    on public.places    using gin (name gin_trgm_ops);
create index if not exists districts_name_trgm on public.districts using gin (name gin_trgm_ops);
create index if not exists states_name_trgm    on public.states    using gin (name gin_trgm_ops);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists states_touch on public.states;
create trigger states_touch before update on public.states
  for each row execute function public.touch_updated_at();

drop trigger if exists places_touch on public.places;
create trigger places_touch before update on public.places
  for each row execute function public.touch_updated_at();


-- ============================================================================
-- 2. RELATIONS
--
-- festivals ←→ states and tags ←→ (states | places). `tags.kind` separates the
-- three vocabularies the atlas already uses, so the festival calendar, the dance
-- and cuisine chips, and the place themes all come from one pair of tables.
-- ============================================================================

create table if not exists public.festivals (
  id    text primary key,
  name  text not null,
  month text not null
);

create table if not exists public.state_festivals (
  state_id   text not null references public.states(id)   on delete cascade,
  festival_id text not null references public.festivals(id) on delete cascade,
  primary key (state_id, festival_id)
);

create table if not exists public.tags (
  id   text primary key,
  kind text not null check (kind in ('dance', 'cuisine', 'theme')),
  name text not null
);

create table if not exists public.state_tags (
  state_id text not null references public.states(id) on delete cascade,
  tag_id   text not null references public.tags(id)   on delete cascade,
  primary key (state_id, tag_id)
);

create table if not exists public.place_tags (
  place_id text not null references public.places(id) on delete cascade,
  tag_id   text not null references public.tags(id)   on delete cascade,
  primary key (place_id, tag_id)
);

create index if not exists state_tags_tag_idx on public.state_tags (tag_id);
create index if not exists place_tags_tag_idx on public.place_tags (tag_id);

-- Festivals belong on a calendar, not in an alphabetical list.
create or replace function public.month_index(name text)
returns int
language sql
immutable
as $$
  select coalesce(
    array_position(
      array['January','February','March','April','May','June',
            'July','August','September','October','November','December'],
      name
    ),
    99
  );
$$;


-- ============================================================================
-- 3. PROFILES
--
-- One row per auth user, created by a trigger rather than by the client: a user
-- who signs in with Google never passes through the sign-up form, so an
-- application-side insert would leave them without a profile.
-- ============================================================================

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  bio           text,
  home_state_id text references public.states(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- 4. PERSONAL — wishlist, reviews, visits
-- ============================================================================

create table if not exists public.wishlist_items (
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_key   text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

-- Reviews and visits reference the *profile*, not auth.users, purely so PostgREST can embed
-- the author's display name in one request (`profiles(display_name, avatar_url)`). Without a
-- direct foreign key it refuses to join, and every review list would need a second round-trip.
-- Cascades still reach auth.users through profiles.id.
create table if not exists public.reviews (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  place_id   text not null references public.places(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  body       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

drop trigger if exists reviews_touch on public.reviews;
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();

-- A visit is a private check-in: `note` is the trip note for that place, which is
-- why there is no separate notes table.
create table if not exists public.visits (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  place_id   text not null references public.places(id) on delete cascade,
  visited_on date,
  note       text,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create index if not exists reviews_place_idx on public.reviews (place_id);


-- ============================================================================
-- 5. ROW LEVEL SECURITY
--
-- Content is curated by us, not user-submitted: anyone may read it, nobody may
-- write it from the browser (writes happen through `npm run seed` with a
-- service-role key, or from the dashboard).
-- ============================================================================

alter table public.states          enable row level security;
alter table public.districts       enable row level security;
alter table public.places          enable row level security;
alter table public.festivals       enable row level security;
alter table public.state_festivals enable row level security;
alter table public.tags            enable row level security;
alter table public.state_tags      enable row level security;
alter table public.place_tags      enable row level security;

drop policy if exists "Content is public" on public.states;
create policy "Content is public" on public.states          for select using (true);
drop policy if exists "Content is public" on public.districts;
create policy "Content is public" on public.districts       for select using (true);
drop policy if exists "Content is public" on public.places;
create policy "Content is public" on public.places          for select using (true);
drop policy if exists "Content is public" on public.festivals;
create policy "Content is public" on public.festivals       for select using (true);
drop policy if exists "Content is public" on public.state_festivals;
create policy "Content is public" on public.state_festivals for select using (true);
drop policy if exists "Content is public" on public.tags;
create policy "Content is public" on public.tags            for select using (true);
drop policy if exists "Content is public" on public.state_tags;
create policy "Content is public" on public.state_tags      for select using (true);
drop policy if exists "Content is public" on public.place_tags;
create policy "Content is public" on public.place_tags      for select using (true);

grant select on public.states, public.districts, public.places, public.festivals,
  public.state_festivals, public.tags, public.state_tags, public.place_tags
  to anon, authenticated;

-- Profiles carry no email address, so they are readable by anyone signed out or in
-- (review attribution needs the display name), and writable only by their owner.
alter table public.profiles enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"      on public.profiles for select using (true);
drop policy if exists "Own profile insert" on public.profiles;
create policy "Own profile insert"       on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Own profile update" on public.profiles;
create policy "Own profile update"       on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

-- Reviews are public reading, own-row writing.
alter table public.reviews enable row level security;

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public" on public.reviews for select using (true);
drop policy if exists "Write own review" on public.reviews;
create policy "Write own review"   on public.reviews for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;

-- Visits and notes are private to their owner, in every direction.
alter table public.visits enable row level security;

drop policy if exists "Own visits only" on public.visits;
create policy "Own visits only" on public.visits for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.visits to authenticated;

-- Wishlist: same shape, one row per (user, saved item). item_key keeps the
-- `type:id` form the client already uses: "place:taj-mahal", "state:rajasthan",
-- "dist:jaipur".
alter table public.wishlist_items enable row level security;

drop policy if exists "Users manage their own wishlist" on public.wishlist_items;
create policy "Users manage their own wishlist" on public.wishlist_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.wishlist_items to authenticated;


-- ============================================================================
-- 6. READ APIs
--
-- The atlas is fetched in pieces, never whole: at a few hundred places a single
-- "everything" payload is megabytes. `atlas_index` boots the app, `state_atlas`
-- serves one state per navigation, `place_detail` serves one place, and
-- `search_places` runs server-side against the trigram indexes.
-- ============================================================================

-- The JSON shape the client consumes for a state, used by both atlas_index and
-- state_atlas so the two can never drift apart.
create or replace function public.state_culture_json(p public.states)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'dress', p.culture ->> 'dress',
    'festivals', coalesce((
      select jsonb_agg(jsonb_build_object('name', f.name, 'month', f.month)
                       order by public.month_index(f.month), f.name)
      from public.state_festivals sf
      join public.festivals f on f.id = sf.festival_id
      where sf.state_id = p.id
    ), '[]'::jsonb),
    'dance', coalesce((
      select jsonb_agg(t.name order by t.name)
      from public.state_tags st
      join public.tags t on t.id = st.tag_id
      where st.state_id = p.id and t.kind = 'dance'
    ), '[]'::jsonb),
    'cuisine', coalesce((
      select jsonb_agg(t.name order by t.name)
      from public.state_tags st
      join public.tags t on t.id = st.tag_id
      where st.state_id = p.id and t.kind = 'cuisine'
    ), '[]'::jsonb)
  );
$$;

create or replace function public.state_json(p public.states)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'region', p.region,
    'tagline', p.tagline,
    'unesco', p.unesco,
    'blurb', p.blurb,
    'stats', p.stats,
    'culture', public.state_culture_json(p),
    'districtCount', (select count(*) from public.districts d where d.state_id = p.id),
    'placeCount', (select count(*)
                   from public.places pl
                   join public.districts d on d.id = pl.district_id
                   where d.state_id = p.id),
    -- The state card has no place of its own, so "best season" is the best season
    -- of its highest-rated place. Used by the compare table.
    'bestSeason', (
      select pl.best_season
      from public.places pl
      join public.districts d on d.id = pl.district_id
      where d.state_id = p.id and pl.best_season is not null
      order by pl.rating desc nulls last, pl.name
      limit 1
    ),
    'photoUrl', p.photo_url,
    'photoTitle', p.photo_title,
    'photoSet', p.photo_set
  );
$$;

-- The list-level shape of a place: everything a card, map marker or search hit
-- needs, and nothing from the long-form columns.
create or replace function public.place_summary_json(p public.places)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'type', p.type,
    'blurb', p.blurb,
    'rating', p.rating,
    'entry', p.entry,
    'open', p.open_hours,
    'bestSeason', p.best_season,
    'budget', p.budget,
    'difficulty', p.difficulty,
    'lat', p.lat,
    'lng', p.lng,
    'photoUrl', p.photo_url,
    'photoTitle', p.photo_title,
    'photoSet', p.photo_set,
    'themes', coalesce((
      select jsonb_agg(t.name order by t.name)
      from public.place_tags pt
      join public.tags t on t.id = pt.tag_id
      where pt.place_id = p.id and t.kind = 'theme'
    ), '[]'::jsonb)
  );
$$;

-- Boot payload: 36 rows, a few kilobytes. Drives the map, the state cards, the
-- stat strip and the compare table without fetching a single place.
create or replace function public.atlas_index()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'stateCount', (select count(*) from public.states),
    'districtCount', (select count(*) from public.districts),
    'placeCount', (select count(*) from public.places),
    'states', (
      select coalesce(jsonb_agg(public.state_json(s) order by s.sort_order, s.id), '[]'::jsonb)
      from public.states s
    ),
    -- The home page's "top-rated heritage" strip. Resolved here rather than by the client
    -- because the client deliberately never holds every place.
    'highlights', (
      select coalesce(jsonb_agg(item order by score desc nulls last, name), '[]'::jsonb)
      from (
        select
          public.place_summary_json(p)
            || jsonb_build_object(
                 'stateId', s.id, 'stateName', s.name,
                 'districtId', d.id, 'districtName', d.name
               ) as item,
          p.rating as score,
          p.name as name
        from public.places p
        join public.districts d on d.id = p.district_id
        join public.states s on s.id = d.state_id
        order by p.rating desc nulls last, p.name
        limit 8
      ) h
    )
  );
$$;

-- One state, complete: its districts and the place summaries inside them. ~34 KB
-- at 5 districts × 5 places, which is what makes per-state navigation cheap.
create or replace function public.state_atlas(p_state_id text)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'state', public.state_json(s),
    'districts', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'id', d.id,
          'name', d.name,
          'blurb', d.blurb,
          'photoUrl', d.photo_url,
          'photoTitle', d.photo_title,
          'photoSet', d.photo_set,
          'places', coalesce((
            select jsonb_agg(public.place_summary_json(p) order by p.sort_order, p.id)
            from public.places p
            where p.district_id = d.id
          ), '[]'::jsonb)
        ) order by d.sort_order, d.id
      ), '[]'::jsonb)
      from public.districts d
      where d.state_id = s.id
    )
  )
  from public.states s
  where s.id = p_state_id;
$$;

-- One place, complete, plus the neighbour links the page renders: its district
-- siblings and up to six same-category places elsewhere in India.
create or replace function public.place_detail(p_place_id text)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'place', public.place_summary_json(p) || jsonb_build_object(
      'bestPhoto', p.best_photo,
      'history', p.history,
      'architecture', p.architecture,
      'timeline', p.timeline,
      'facts', p.facts,
      'hiddenGems', p.hidden_gems,
      'food', p.food,
      'experiences', p.experiences,
      'travel', p.travel,
      'sourceUrl', p.source_url
    ),
    'state', jsonb_build_object('id', s.id, 'name', s.name, 'region', s.region),
    'district', jsonb_build_object('id', d.id, 'name', d.name),
    'siblings', (
      select coalesce(jsonb_agg(public.place_summary_json(x) order by x.rating desc nulls last, x.name), '[]'::jsonb)
      from public.places x
      where x.district_id = d.id and x.id <> p.id
    ),
    'related', (
      select coalesce(jsonb_agg(item order by score desc nulls last), '[]'::jsonb)
      from (
        select public.place_summary_json(x) as item, x.rating as score
        from public.places x
        where x.type = p.type and x.id <> p.id
        order by x.rating desc nulls last, x.name
        limit 6
      ) r
    )
  )
  from public.places p
  join public.districts d on d.id = p.district_id
  join public.states s on s.id = d.state_id
  where p.id = p_place_id;
$$;

-- Server-side search. Ranks real entities above incidental mentions so that
-- "Forts" returns forts rather than restaurant recommendations that mention one,
-- and matches the plural a chip is written in ("Temples" → type "Temple").
create or replace function public.search_places(p_query text, p_limit int default 40)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with q as (
    -- An empty query returns no rows, which empties every branch below and yields
    -- '[]' — without this a blank search matched the whole atlas.
    select
      lower(trim(p_query)) as raw,
      case
        -- "Temples" → "Temple", "Monasteries" → "Monastery", "Forts" → "Fort". The
        -- length guards keep a one- or two-character query from being truncated into
        -- an empty prefix that would match every place in the atlas.
        when length(trim(p_query)) > 3 and lower(trim(p_query)) ~ 'ies$'
          then left(lower(trim(p_query)), length(trim(p_query)) - 3) || 'y'
        when length(trim(p_query)) > 2 and lower(trim(p_query)) ~ 's$' and lower(trim(p_query)) !~ 'ss$'
          then left(lower(trim(p_query)), length(trim(p_query)) - 1)
        else lower(trim(p_query))
      end as singular
    where trim(coalesce(p_query, '')) <> ''
  ),
  hits as (
    select 1 as rank, 'state' as kind, s.id, s.name, 'State'::text as type,
           s.region || ' India'::text as sub, s.id as state_id, null::text as district_id,
           null::numeric as score, s.photo_url, s.photo_title
    from public.states s, q where s.name ilike '%' || q.raw || '%'

    union all
    select 3, 'state', s.id, s.name, 'State', s.region || ' India', s.id, null, null, s.photo_url, s.photo_title
    from public.states s, q
    where exists (
      select 1 from public.state_festivals sf
      join public.festivals f on f.id = sf.festival_id
      where sf.state_id = s.id and f.name ilike '%' || q.raw || '%'
    ) or exists (
      select 1 from public.state_tags st
      join public.tags t on t.id = st.tag_id
      where st.state_id = s.id and t.name ilike '%' || q.raw || '%'
    )

    union all
    select 2, 'state', s.id, s.name, 'State', 'UNESCO listed · ' || s.region || ' India', s.id, null, null, s.photo_url, s.photo_title
    from public.states s, q where q.raw = 'unesco' and s.unesco

    union all
    select 1, 'district', d.id, d.name, 'District', s.name, s.id, d.id, null, d.photo_url, d.photo_title
    from public.districts d
    join public.states s on s.id = d.state_id, q
    where d.name ilike '%' || q.raw || '%'

    union all
    select 1, 'place', p.id, p.name, p.type, d.name || ', ' || s.name, s.id, d.id, p.rating, p.photo_url, p.photo_title
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id, q
    where p.name ilike '%' || q.raw || '%'

    union all
    select 2, 'place', p.id, p.name, p.type, d.name || ', ' || s.name, s.id, d.id, p.rating, p.photo_url, p.photo_title
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id, q
    where p.type ilike q.singular || '%'

    union all
    select 3, 'place', p.id, p.name, p.type, d.name || ', ' || s.name, s.id, d.id, p.rating, p.photo_url, p.photo_title
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id, q
    where exists (
      select 1 from public.place_tags pt
      join public.tags t on t.id = pt.tag_id
      where pt.place_id = p.id and t.name ilike '%' || q.raw || '%'
    )

    union all
    select 4, 'place', p.id, p.name, p.type, d.name || ', ' || s.name, s.id, d.id, p.rating, p.photo_url, p.photo_title
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id, q
    where p.blurb ilike '%' || q.raw || '%'

    -- Incidental mentions: a dish, an experience or a hidden gem named in a
    -- place's own copy. Ranked last, so a real entity always outranks these.
    union all
    select 5, 'place', p.id, p.name, p.type, d.name || ', ' || s.name, s.id, d.id, p.rating, p.photo_url, p.photo_title
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id, q
    where exists (select 1 from jsonb_array_elements_text(p.food)        as v(value) where v.value ilike '%' || q.raw || '%')
       or exists (select 1 from jsonb_array_elements_text(p.experiences) as v(value) where v.value ilike '%' || q.raw || '%')
       or exists (select 1 from jsonb_array_elements_text(p.hidden_gems) as v(value) where v.value ilike '%' || q.raw || '%')
       or exists (select 1 from jsonb_array_elements_text(p.facts)       as v(value) where v.value ilike '%' || q.raw || '%')
  ),
  best as (
    select distinct on (kind, id) *
    from hits
    order by kind, id, rank
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'kind', kind,
      'id', id,
      'name', name,
      'type', type,
      'sub', sub,
      'stateId', state_id,
      'districtId', district_id,
      'rating', score,
      'photoUrl', photo_url,
      'photoTitle', photo_title
    ) order by rank, score desc nulls last, name
  -- Search hits keep the single lead photo: the rotation set would mean adding a
  -- column to every union branch for a thumbnail-size image.
  ), '[]'::jsonb)
  from (select * from best order by rank, score desc nulls last, name limit p_limit) t;
$$;

-- The festival calendar, one row per (festival, state) so each entry links home.
create or replace function public.festivals_index()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'name', f.name,
      'month', f.month,
      'stateId', s.id,
      'stateName', s.name
    ) order by public.month_index(f.month), f.name
  ), '[]'::jsonb)
  from public.festivals f
  join public.state_festivals sf on sf.festival_id = f.id
  join public.states s on s.id = sf.state_id;
$$;

-- Every dated event in the atlas, flattened for the timeline page. Returns the
-- total alongside the page so the heading can report the full count even when a
-- limit applies.
create or replace function public.timeline_index(p_limit int default 800)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with events as (
    select
      p.id as place_id, p.name as place_name,
      d.id as district_id, d.name as district_name,
      s.id as state_id, s.name as state_name,
      nullif(e.value ->> 'y', '')::int as y,
      e.value ->> 'label' as label
    from public.places p
    join public.districts d on d.id = p.district_id
    join public.states s on s.id = d.state_id
    cross join lateral jsonb_array_elements(p.timeline) as e(value)
    where jsonb_typeof(p.timeline) = 'array'
  )
  select jsonb_build_object(
    'total', (select count(*) from events),
    'events', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'placeId', place_id, 'placeName', place_name,
          'districtId', district_id, 'districtName', district_name,
          'stateId', state_id, 'stateName', state_name,
          'y', y, 'label', label
        ) order by y nulls last, place_name
      )
      from (select * from events order by y nulls last, place_name limit p_limit) t
    ), '[]'::jsonb)
  );
$$;

-- Resolve saved `type:id` keys (wishlist, and anything else that stores keys)
-- back into renderable entities, in the order they were asked for.
create or replace function public.entities(p_keys text[])
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(jsonb_agg(item order by ord), '[]'::jsonb)
  from (
    select k.ord, r.item
    from unnest(p_keys) with ordinality as k(key, ord)
    join lateral (
      select jsonb_build_object(
        'key', k.key,
        'kind', 'state',
        'id', s.id,
        'name', s.name,
        'type', 'State',
        'blurb', s.blurb,
        'rating', null,
        'stateId', s.id,
        'stateName', s.name,
        'districtId', null,
        'districtName', null,
        'placeCount', (select count(*)
                       from public.places pl
                       join public.districts d on d.id = pl.district_id
                       where d.state_id = s.id),
        'districtCount', (select count(*) from public.districts d where d.state_id = s.id),
        'photoUrl', s.photo_url,
        'photoTitle', s.photo_title,
        'photoSet', s.photo_set
      ) as item
      from public.states s
      where k.key like 'state:%' and s.id = split_part(k.key, ':', 2)

      union all

      select jsonb_build_object(
        'key', k.key,
        'kind', 'district',
        'id', d.id,
        'name', d.name,
        'type', 'District',
        'blurb', d.blurb,
        'rating', null,
        'stateId', s.id,
        'stateName', s.name,
        'districtId', d.id,
        'districtName', d.name,
        'placeCount', (select count(*) from public.places pl where pl.district_id = d.id),
        'districtCount', null,
        'photoUrl', d.photo_url,
        'photoTitle', d.photo_title,
        'photoSet', d.photo_set
      )
      from public.districts d
      join public.states s on s.id = d.state_id
      where k.key like 'dist:%' and d.id = split_part(k.key, ':', 2)

      union all

      select jsonb_build_object(
        'key', k.key,
        'kind', 'place',
        'id', p.id,
        'name', p.name,
        'type', p.type,
        'blurb', p.blurb,
        'rating', p.rating,
        'stateId', s.id,
        'stateName', s.name,
        'districtId', d.id,
        'districtName', d.name,
        'placeCount', null,
        'districtCount', null,
        'photoUrl', p.photo_url,
        'photoTitle', p.photo_title,
        'photoSet', p.photo_set
      )
      from public.places p
      join public.districts d on d.id = p.district_id
      join public.states s on s.id = d.state_id
      where k.key like 'place:%' and p.id = split_part(k.key, ':', 2)
    ) r on true
  ) t;
$$;

grant execute on function
  public.atlas_index(),
  public.state_atlas(text),
  public.place_detail(text),
  public.search_places(text, int),
  public.festivals_index(),
  public.timeline_index(int),
  public.entities(text[]),
  public.month_index(text)
  to anon, authenticated;
