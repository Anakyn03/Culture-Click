# Culture Click

**An interactive React + Tailwind atlas of India's cultural and heritage travel destinations —
a real content database, email/Google/GitHub sign-in, reviews, check-ins and live weather.**

All **36 states and UTs** sit on an interactive, geographically accurate map, each drilling
down into districts and fully-detailed heritage places. It also includes client-side search,
a heritage timeline, a festival calendar, a state comparison tool, live weather per place, a
cross-device wishlist, and — per place — **reviews with a rating summary, private check-ins,
and a "continue your journey" flow** that remembers where you left off.

**Current coverage: 36 states/UTs · 45 districts · 78 places · 69 festivals.** Rajasthan is
seeded deepest (5 districts, 25 places) as the template the rest grow into.

---

## Stack

- **React 19** + **React Router 7** (`BrowserRouter` — `vercel.json` ships the SPA rewrite)
- **Tailwind CSS v4** (CSS-first `@theme` tokens, no `tailwind.config.js`)
- **Vite 8** for dev/build, deployed on **Vercel**; `oxlint` for linting
- **Supabase** (Postgres + Auth + RLS) for content, reviews, check-ins, wishlists and profiles
- **Open-Meteo** for live weather — free, no API key required
- **Wikimedia Commons** for imagery — verified photographs collected at build time, served
  with standard-width `srcSet`
- **Google Maps Embed** for per-place maps (`VITE_GOOGLE_MAPS_API_KEY`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Full setup — database, auth providers, redirect URLs — is a 10-minute job in the Supabase
dashboard: run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor, then set
**Authentication → URL Configuration** and switch on the providers you want.

## Content pipeline

The dataset in [`data/states/*.json`](data/states) is the **source of truth**. The app calls
Supabase RPCs (`atlas_index`, `state_atlas`, `place_detail`, `search_places`, …) and content
edits in Supabase appear without a redeploy.

```bash
npm run seed                        # upserts every state, district, place and festival; prunes removed rows
npm run seed:dry                    # report what would change, write nothing — safe to run any time
npm run enrich                      # fill coordinates, lead photo and article link per place from Wikipedia
npm run enrich -- --state rajasthan # one state at a time — Wikipedia rate-limits long runs
npm run enrich:report
node scripts/repair-photo-urls.mjs  # re-point stored photos at Commons' current URLs
```

Seeding needs the **service-role key** in `.env.local` (no `VITE_` prefix — Node-only; it
bypasses RLS and must never reach the browser or a commit).

Enrichment asks Wikipedia, for every place, for its article's **coordinates**, **lead
photograph** and a **link to the article itself**, and validates what comes back (the
article must sit inside the state's bounding box, and its title must share a distinctive
word with the place) before anything is written — a flaky network writes nothing rather
than half-blanking the atlas. Districts and states inherit their highest-rated place's
photograph. Because Commons files occasionally move — a re-upload changes the URL's hash
path and the old link 404s — the repair pass re-derives every stored photo URL from
Wikimedia's canonical metadata and rewrites only what changed.

### Photo rotation

Every place stores up to three verified photographs from its Wikipedia article (lead image
first) and the site rotates them on a **five-day clock**: `photoOf()` in `src/lib/photo.js`
picks by `Math.floor(Date.now() / 86_400_000 / 5) % set.length`, so the imagery changes every
five days for everyone at once — with zero runtime requests. A place without a set simply
shows its lead photo. The rotation travels through `photos` in the JSON → `photo_set` in the
database → `photoSet` on every RPC payload. If the database predates the `photo_set` column,
the seeder warns and seeds everything else; re-run `supabase/schema.sql` in the SQL Editor to
switch rotation on. A place whose article's lead image is technically correct but visually
wrong (a satellite view, say) can name a better file with `"preferPhoto"` in its JSON. When an image stops resolving,
`node scripts/repair-photo-urls.mjs` re-points the stored URL at the file's current
location on Commons.

## What's in the app

### Places

Each place page is **tabbed** (Overview / History / Food / Travel / Gallery) via one shared,
accessible `Tabs` component (roving tabindex, arrow-key navigation, count badges) used
everywhere tabs appear. Below the tabs:

- **Reviews section — three tabs**: *Reviews* (average rating + star distribution + sort by
  newest/highest/lowest), *Your review* (star picker, 1,200-char review with live counter,
  edit or delete your own), and *Check-in* (private date + note visit log).
- **Live weather** (Open-Meteo, cached and deduplicated) and a Google Maps embed.
- **"Keep going" next-stop card** suggesting the neighbouring place, plus sibling chips.
- **Mobile action bar** (fixed bottom, phones only): Save · one-tap *Been here* check-in ·
  Review — always reachable with a thumb.

### The journey flow

- **Continue your journey** — the home page greets returning visitors with the places they
  last viewed (stored locally, clearable in one click).
- **Deep links** — sign-in, saving, and reviewing all preserve where you were via a guarded
  `?next=` parameter; you never lose your place by being asked to authenticate.
- **Guest data merges on first sign-in** — a wishlist built while signed out transfers to the
  account.
- **Account page as a journey** — Saved → Visited → Reviewed, each step linked to its list.

### Auth

`/login` supports email + password, magic links, password reset (PKCE, `/reset-password`),
Google and GitHub. Auth errors are translated into plain, actionable sentences
(`src/lib/authMessages.js`), including an automatic "resend confirmation link" affordance and
pointers to the setup guide when a provider or redirect URL isn't configured yet.

## Project structure

```
culture-click/
├── vite.config.js                 # lazy pages + manualChunks: react-vendor / supabase / india-map
├── vercel.json                    # SPA rewrite + long-cache headers for hashed assets
├── scripts/
│   ├── seed-atlas.mjs             # `npm run seed` — loads data/states/*.json into Supabase
│   ├── enrich.mjs                 # `npm run enrich` — coordinates/photos/links from Wikipedia
│   ├── lib/validate.mjs           # dataset validation shared by seed and enrich
│   └── repair-photo-urls.mjs      # re-points stored photos at Commons' current URLs
├── supabase/
│   └── schema.sql                 # tables, RPCs, RLS policies — run once in SQL Editor
├── data/states/*.json             # the canonical dataset (source of truth)
└── src/
    ├── App.jsx                    # providers → routes, idle route prefetch, 1560px shell
    ├── lib/
    │   ├── supabaseClient.js      # validated client, PKCE flow, graceful no-op if unset
    │   ├── atlasApi.js            # RPC helpers with session caching
    │   ├── personal.js            # reviews / check-ins / wishlist queries
    │   ├── photo.js               # Wikimedia sized URLs + srcSet
    │   ├── weather.js             # Open-Meteo helper (no key needed)
    │   └── authMessages.js        # friendly auth error mapping
    ├── context/                   # Auth / Atlas / App providers (Context + Provider split)
    ├── hooks/useResource.js       # cache-first keyed async hook
    ├── components/
    │   ├── Tabs.jsx               # shared accessible tab strip (+ TabPanel)
    │   ├── ReviewSection.jsx      # reviews / your review / check-in tabs
    │   ├── PlaceActionBar.jsx     # mobile bottom action bar
    │   ├── ContinueJourney.jsx    # "pick up where you left off" strip
    │   ├── AuthButton.jsx, AuthForm.jsx, WeatherWidget.jsx, GoogleMapEmbed.jsx
    │   └── Header.jsx, SubNav.jsx, Breadcrumbs.jsx, MapHero.jsx, SearchPanel.jsx, Card.jsx …
    ├── data/
    │   ├── atlas.js               # selectors, search index, timeline, festivals
    │   └── indiaPaths.js          # real state-boundary SVG paths (own lazy chunk)
    └── pages/                     # Home, State, District, Place, Wishlist, Compare,
                                   # Timeline, Festivals, Login, ResetPassword, Account
```

## Performance

- The entry bundle is **~32 kB (11 kB gzip)**; React, Supabase and the India map path data each
  ship as their own cached vendor chunk; every page is lazily loaded and **prefetched on idle**,
  so navigation feels instant without bloating first paint.
- Anchor jumps and scroll restoration respect the sticky header (`scroll-padding-top`).

## One-time setup: Vercel + the "nothing deploys without approval" guardrail

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Import Project** — Vercel auto-detects Vite.
3. Add the env vars from `.env.local` under **Environment Variables**.
4. Add your Vercel URL to Supabase's **Authentication → URL Configuration → Redirect URLs**.
5. On GitHub, protect `main`: require a PR, your approval, and the `CI / lint-and-build`
   check (`.github/workflows/ci.yml`). Vercel deploys only `main`; every PR gets an isolated
   preview, so nothing reaches the live site without passing CI and your review.

## Honest limitations

- **Search is keyword-matching**, not a connected AI model.
- **Coverage depth is uneven** — Rajasthan is the fully-seeded template; most states have one
  district seeded so far.
- **Photos are hotlinked from Wikimedia Commons** (permitted, free, credited on every hero);
  at real scale they should be mirrored to owned storage during the build. Commons
  occasionally moves or re-uploads files, which breaks old URLs — the repair pass above
  re-points them when an image goes dark.
- **India boundary path data** is community-sourced, not survey-grade GIS.
- **Content editing** happens via the seed scripts or Supabase directly — the service-role key
  is deliberately kept out of the browser.

## Attribution

- India state-boundary SVG path data adapted from a community open-source SVG map.
- Photography from [Wikimedia Commons](https://commons.wikimedia.org), credited on every image.
- Weather from [Open-Meteo](https://open-meteo.com).
- Fonts: [Playfair Display](https://fonts.google.com/specimen/Playfair Display),
  [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant Garamond),
  [Manrope](https://fonts.google.com/specimen/Manrope) via Google Fonts.

## License

Code under the [MIT License](LICENSE). Third-party assets keep their own terms — check the
attribution notes above before reuse.
