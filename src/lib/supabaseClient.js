import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Both env vars are required for auth/database features. If they're missing (e.g. running
// locally before Supabase is set up, or a preview deploy without secrets configured), we log
// once and export `null` rather than throwing — the app should still work in "local only"
// mode (wishlist via localStorage, no login) instead of hard-crashing on load.
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Culture Click] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — running in local-only mode ' +
    '(no login, wishlist stays in this browser only). See .env.example.'
  );
}

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
