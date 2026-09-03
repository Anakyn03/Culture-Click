<<<<<<< HEAD
# Culture Click

**An interactive React + Tailwind app for exploring India's cultural and heritage travel destinations — now with a real database, Google sign-in, and live weather.**

Culture Click is a living atlas of India: all **28 states and 8 Union Territories** are on an
interactive, geographically accurate map, each drilling down into a district and at least one
fully-detailed heritage place. It also includes a client-side "Saathi" chatbot, a heritage
timeline, a festival calendar, a state comparison tool, live weather per place, and a wishlist
that syncs across devices once you sign in.

> Photography is still an illustrated placeholder (`PlaceMotif.jsx`) pending licensed, curated
> photos — see the "Adding real photography" section below for the plan already wired into the
> code for that.

---

## Stack

- **React 19** + **React Router 7** (`HashRouter` — works on any static host, no server rewrites needed)
- **Tailwind CSS v4** (CSS-first `@theme` tokens, no `tailwind.config.js`)
- **Vite 8** for dev/build tooling, deployed on **Vercel**
- **Supabase** (Postgres + Auth + Storage) for the wishlist and curated photo records
- **Open-Meteo** for live weather — free, no API key required

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL + anon key (see below)
npm run dev
```

The app works even without `.env.local` filled in — login and cloud wishlist sync just won't be
available, and it falls back to the local-only wishlist behavior. Nothing crashes.

## One-time setup: Supabase (database + login)

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project's **SQL Editor**, paste and run everything in [`supabase/schema.sql`](supabase/schema.sql) — this creates the `wishlist_items` and `photos` tables with the correct Row Level Security policies.
3. In **Authentication → Providers**, enable **Google**. You'll need a Google OAuth client:
   - In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth 2.0 Client ID (type: Web application).
   - Add Supabase's callback URL (shown on the Supabase Google provider settings page, looks like `https://<project-ref>.supabase.co/auth/v1/callback`) as an authorized redirect URI.
   - Paste the resulting Client ID and Client Secret into Supabase's Google provider settings.
4. In **Project Settings → API**, copy your **Project URL** and **anon public key** into `.env.local` (see `.env.example`).

## One-time setup: Vercel + the "nothing deploys without approval" guardrail

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Import Project** from that GitHub repo — Vercel
   auto-detects the Vite setup, no config needed.
3. In Vercel's project settings, add the same two env vars from `.env.local`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) under **Environment Variables**.
4. On GitHub, go to **Settings → Branches** and add a protection rule for `main`: require a pull
   request before merging, require your approval, **and require the `CI / lint-and-build` check
   to pass** (already wired up in `.github/workflows/ci.yml` — it runs lint + build on every PR).
   Combined with Vercel's default behavior (only `main` deploys to the production URL; every
   other branch/PR gets an isolated preview URL), this means any change — from you, from an AI
   coding tool, from anyone — only reaches the live site after it passes CI *and* you personally
   review and merge it into `main`.

`vercel.json` is already in the repo with long-cache headers for the hashed build assets — Vercel
picks it up automatically, no extra setup needed.

## Project structure

```
culture-click/
├── vite.config.js              # Vercel-friendly base path + dataset code-splitting
├── supabase/
│   └── schema.sql                # run once in Supabase's SQL editor
├── src/
│   ├── App.jsx                     # AuthProvider → AppProvider → routes
│   ├── lib/
│   │   ├── supabaseClient.js         # gracefully no-ops if env vars aren't set
│   │   └── weather.js                  # Open-Meteo fetch helper, no API key needed
│   ├── context/
│   │   ├── AuthContext.jsx               # Google sign-in via Supabase Auth
│   │   └── AppContext.jsx                  # theme, wishlist (local + cloud sync), filters, chat memory
│   ├── data/
│   │   ├── statesData.js                    # all 36 states/UTs (now with lat/lng per place)
│   │   └── indiaPaths.js                      # real state-boundary SVG path data — untouched, still the map
│   ├── components/
│   │   ├── AuthButton.jsx, WeatherWidget.jsx
│   │   ├── Header.jsx, SubNav.jsx, Breadcrumbs.jsx, MapHero.jsx, SearchPanel.jsx
│   │   ├── Card.jsx, PlaceMotif.jsx, Chatbot.jsx
│   └── pages/
│       ├── HomePage.jsx, StatePage.jsx, DistrictPage.jsx
│       ├── PlacePage.jsx                        # now tabbed: Overview / History & Architecture / Food & Experiences / Travel Info / Gallery
│       └── WishlistPage.jsx, ComparePage.jsx, TimelinePage.jsx, FestivalsPage.jsx
├── LICENSE
└── README.md
```

## What's new in this version

- **Google sign-in** (Supabase Auth) — the header shows a "Sign in" button when logged out, an
  avatar + account menu when logged in.
- **Wishlist now syncs to the cloud** when signed in (`wishlist_items` table), while still
  working entirely locally (localStorage) when signed out — nothing is lost either way; signing
  in merges local and cloud saves rather than overwriting one with the other.
- **Live weather** on every place page (Travel Info tab), via Open-Meteo — current conditions +
  a 5-day outlook, using real coordinates now stored per place in `statesData.js`.
- **Place pages are now tabbed** (Overview / History & Architecture / Food & Experiences / Travel
  Info / Gallery) instead of one long scroll.
- **`photos` table** ready in Supabase for curated, credited photography — see below.
- Production JS is now split into two chunks (app code vs. the large dataset) instead of one
  ~600KB bundle.
- **CI on every pull request** (`.github/workflows/ci.yml`) — lint + build must pass before a
  merge is even possible, on top of the manual review requirement.
- Place page tabs support full keyboard navigation (arrow keys / Home / End), per the standard
  ARIA tabs pattern.

## Adding real photography (the plan, ready for photos)

The `photos` table in `supabase/schema.sql` is designed for this: each row is one curated image
tied to a state/district/place `id`, with `photographer_name`, `photographer_url`, and
`source_url` for proper attribution. The plan:

1. Source images from the Unsplash or Pexels API (both free, both require/appreciate credit).
2. Insert the chosen photo + credit into the `photos` table (via the Supabase dashboard or a
   small curation script — not from the browser; the table is read-only to the client by design).
3. Swap `PlaceMotif.jsx` for a `PlaceImage` component that queries `primary_photos` (the view
   already defined in the schema) and falls back to the current illustration if no photo exists
   yet for that entity — so nothing breaks while photos are still being curated state by state.
4. Serve images lazily (`loading="lazy"`), sized per context (thumbnail vs. hero), with
   Unsplash's `blur_hash` for a placeholder — this is what keeps real HD photography from making
   the site feel slow.

This is scoped as its own follow-up pass rather than bundled into this one, since sourcing 36+
correctly-matched, real, licensed photos is a curation task, not just a code change.

## Honest limitations

- **Saathi** is keyword-matching logic against local data — not a connected AI model.
- **Coverage depth is uneven by design** — every state/UT has one fully-written place; only the
  8 flagship states go two districts deep.
- **India state-boundary path data** is from a community-maintained open-source SVG map, not an
  authoritative GIS source — fine for a cultural/travel app, not for anything needing
  survey-grade precision.
- **Weather** calls Open-Meteo directly from the browser (no API key needed, so no server-side
  proxy required) — if this ever needs caching or rate-limit protection at scale, that's a
  Vercel serverless function away.
- **Photos aren't live yet** — see above; the database and component contract are ready, the
  curated content isn't in yet.

## Attribution

- India state-boundary SVG path data adapted from the open-source [`map-india-svg`](https://github.com/atharvvvg/map-india-svg) project.
- Weather data from [Open-Meteo](https://open-meteo.com).
- Fonts: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), and [Manrope](https://fonts.google.com/specimen/Manrope) via Google Fonts.

## License

Code in this repository is available under the [MIT License](LICENSE). The India state-boundary
path data (`src/data/indiaPaths.js`) is adapted from a third-party open-source source noted
above — verify its upstream licensing terms before reuse beyond this project.
=======
# Culture Click **Culture Click** is a full-stack platform for exploring India's cultural heritage through a **State → City → Place** journey. Discover famous destinations with their history, culture, cuisine, and travel information. Built to provide an authentic, organized, and engaging cultural travel experience.
>>>>>>> c3b824270e73b9b3fcd52cc4f2892e2cfca70ee1
