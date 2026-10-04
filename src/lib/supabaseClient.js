import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client + a *validated* configuration flag.
 *
 * The trap this closes: `.env.local` shipped with placeholder values, and the old check was
 * `Boolean(url && anonKey)` — which is true for `https://your-project.supabase.co` and
 * `your-anon-public-key`. The app therefore believed it was configured, tried to authenticate
 * against a project that does not exist, and every sign-in appeared to do nothing at all.
 *
 * So validation is structural rather than just "is a string present":
 *   - the URL must be a real `https://<ref>.supabase.co` project URL
 *   - the anon key must be a JWT (three dot-separated base64url segments), which is exactly
 *     what the Supabase dashboard issues
 *
 * When validation fails the app cannot show any content, because the atlas lives in Postgres —
 * so `configIssue` is rendered by the pages as an explicit, actionable notice rather than
 * being swallowed.
 */

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const PROJECT_URL = /^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/
const JWT = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/;
const PLACEHOLDER = /your|example|placeholder|xxx|changeme|todo/i;

export const supabaseConfigIssue = (() => {
  if (!url && !anonKey) return 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set.';
  if (!url) return 'VITE_SUPABASE_URL is not set.';
  if (!anonKey) return 'VITE_SUPABASE_ANON_KEY is not set.';
  if (PLACEHOLDER.test(url) || PLACEHOLDER.test(anonKey)) {
    return 'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY still hold the example values from .env.example.';
  }
  if (!PROJECT_URL.test(url)) {
    return 'VITE_SUPABASE_URL is not a Supabase project URL (expected https://<project-ref>.supabase.co).';
  }
  if (!JWT.test(anonKey)) {
    return 'VITE_SUPABASE_ANON_KEY is not a Supabase anon key (expected the "anon public" JWT from Project Settings → API).';
  }
  return null;
})();

export const isSupabaseConfigured = supabaseConfigIssue === null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    `[Culture Click] No content database — ${supabaseConfigIssue}\n` +
      '  The atlas lives in Supabase, so this must be fixed before any page can render content.\n' +
      '  Fix: copy the Project URL and anon public key from Supabase → Project Settings → API\n' +
      '  into .env.local (see .env.example), then restart the dev server.'
  );
}

/**
 * `flowType: 'pkce'` is not a preference — it is what makes password recovery and OAuth work
 * in this app. The default implicit flow returns its tokens in the URL *fragment*
 * (`#access_token=…`), and the router owns the fragment, so a recovery link was parsed as a
 * route instead of a session. PKCE hands back a `?code=` query parameter, which the client
 * exchanges automatically on load.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { flowType: 'pkce' } })
  : null;
