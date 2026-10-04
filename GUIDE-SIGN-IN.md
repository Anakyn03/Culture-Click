# Culture Click — Sign-in setup guide

Everything on this page takes about 10 minutes and lives in the Supabase dashboard.
You only do it once per environment (localhost, then again for your Vercel domain).

**Already have a Supabase project with the atlas content seeded?** Skip to step 3.

---

## 1. Create the Supabase project (if you haven't)

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name, a region close to your users, and a strong database password.
3. When it's ready, go to **Project Settings → API** and note down:
   - **Project URL** — you'll paste this as `VITE_SUPABASE_URL`
   - **anon public key** — this becomes `VITE_SUPABASE_ANON_KEY`

Put both into `.env.local` (never commit it), then restart `npm run dev`.

## 2. Create the tables (once)

In the Supabase dashboard, open **SQL Editor**, paste the entire contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates every table
(`states`, `districts`, `places`, `festivals`, `reviews`, `visits`, `wishlist_items`,
`profiles`), the RPCs the app calls, and all Row Level Security policies.

Then load the content from the repo:

```bash
# .env.local needs the service-role key (no VITE_ prefix — Node only):
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret

npm run seed        # upserts every state, district, place and festival
npm run seed:dry    # report what would change, write nothing — safe to run any time
```

The service-role key is at **Project Settings → API → service_role secret**. It bypasses
RLS, so it must never get a `VITE_` prefix or be committed.

## 3. Configure Auth URLs (the step people miss)

Open **Authentication → URL Configuration** and set:

| Setting | Value |
| --- | --- |
| **Site URL** | `http://localhost:5173` (localhost for now; your Vercel URL later) |
| **Redirect URLs** | `http://localhost:5173/**` |

The redirect allowlist is why a fresh project can't sign in yet: Supabase **refuses to
redirect to any URL not on this list**, including `http://localhost:5173/reset-password`.
The app sends users back to exactly the page they came from (that's the `?next=` flow),
so the wildcard `/**` covers the whole site.

When you deploy to Vercel, come back here and add your production URL the same way:

```
https://your-app.vercel.app/**
```

(Keep the localhost entry too if you'll keep developing locally.)

## 4. Enable the Email provider

**Authentication → Sign In / Providers → Email**:

- Leave **Email enabled**.
- Find the **Confirm email** toggle under **Authentication → Providers → Email →
  "Confirm email"**:
  - **Off (easiest for local development):** anyone can sign up and is signed in
    immediately. Do this first — it makes everything else testable today.
  - **On (recommended for production):** Supabase sends a confirmation link; the user
    must click it before their first sign-in. For this to actually deliver, configure
    SMTP under **Project Settings → Auth → SMTP** (Supabase's built-in sender is heavily
    rate-limited and meant for testing only).

The app handles both cases: if a sign-in fails because the address isn't confirmed,
the login form shows a **"Send a new confirmation link"** button automatically.

## 5. Enable Google sign-in (optional but nice)

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. **Create credentials → OAuth client ID → Web application.**
3. Under **Authorized redirect URIs**, add exactly what Supabase shows you on its Google
   provider page — it looks like:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client Secret** into **Authentication → Sign In /
   Providers → Google** in Supabase and toggle it on.

GitHub sign-in works the same way: create an OAuth App at
[github.com/settings/developers](https://github.com/settings/developers), use the same
`https://<ref>.supabase.co/auth/v1/callback` as the **Authorization callback URL**, and
paste the client ID/secret into Supabase's GitHub provider.

If a provider isn't enabled, the app detects it and shows a clear message pointing back
to this guide instead of an opaque error.

## 6. Test it

1. `npm run dev` → open `http://localhost:5173/login`.
2. Sign up with an email + password.
   - Confirm email **off** → you're signed in straight away.
   - Confirm email **on** → click the link in your inbox (or the resend button on the form).
3. Try Google/GitHub buttons if you enabled them.
4. Check the round-trip: go to any place page → **Save** to wishlist while signed out →
   you're sent to `/login?next=/state/…` → sign in → you land back on the place page and
   your guest wishlist has merged into your account.

## Deploying later (Vercel)

1. Import the repo on Vercel and add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and
   `VITE_GOOGLE_MAPS_API_KEY` as Environment Variables.
2. Add your Vercel URL to Supabase's **Redirect URLs** (step 3) and set **Site URL** to it.
3. No other changes — `vercel.json` already has the SPA rewrite so `/login` and
   `/reset-password` work on a hard refresh.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Redirect not allowed" / bounces to no-where after OAuth | URL wasn't added to **Authentication → URL Configuration → Redirect URLs** |
| Signed up but "Email not confirmed" on sign-in | Click the email link, or use the resend button on the login form, or turn Confirm email off for dev |
| Confirmation email never arrives | Configure SMTP (Project Settings → Auth → SMTP); the built-in sender is rate-limited |
| "Provider not enabled" | Toggle the provider on in **Authentication → Sign In / Providers** |
| Password reset link does nothing | `/reset-password` must be covered by the redirect allowlist (`http://localhost:5173/**`) |
| Sign-in works but wishlist/reviews vanish | RLS is on and you're anonymous — sign in, then check **Authentication → Users** shows your account |
