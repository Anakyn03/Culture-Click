import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { AppContext } from './AppContext';

const WISHLIST_KEY = 'cc-wishlist';
const THEME_KEY = 'cc-theme';
const RECENT_KEY = 'cc-recent-searches';
const MAX_RECENT = 4;
const RECENT_PLACES_KEY = 'cc-recent-places';
const MAX_RECENT_PLACES = 6;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private browsing or storage disabled — nothing bad happens, it just won't persist */
  }
}

function loadWishlist() {
  const raw = readJson(WISHLIST_KEY, []);
  return new Set(Array.isArray(raw) ? raw : []);
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark';
  } catch {
    return false;
  }
}

function loadRecentSearches() {
  const raw = readJson(RECENT_KEY, []);
  return Array.isArray(raw) ? raw.slice(0, MAX_RECENT) : [];
}

function loadRecentPlaces() {
  const raw = readJson(RECENT_PLACES_KEY, []);
  return Array.isArray(raw) ? raw.slice(0, MAX_RECENT_PLACES) : [];
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(loadTheme);
  const [saved, setSaved] = useState(loadWishlist);
  const [wishlistSyncing, setWishlistSyncing] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('All');
  const [activeLayer, setActiveLayer] = useState(null);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [recentPlaces, setRecentPlaces] = useState(loadRecentPlaces);

  // Tracks which user we've already merged local + cloud wishlists for, so the one-time
  // merge doesn't re-run on every render or unrelated auth tick.
  const mergedForUser = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* non-fatal */
    }
  }, [isDark]);

  // Always mirror the wishlist locally — it's the source of truth when signed out and an
  // offline-friendly cache when signed in.
  useEffect(() => {
    writeJson(WISHLIST_KEY, [...saved]);
  }, [saved]);

  useEffect(() => {
    writeJson(RECENT_KEY, recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    writeJson(RECENT_PLACES_KEY, recentPlaces);
  }, [recentPlaces]);

  // On login: read the cloud wishlist, union it with whatever is saved locally (so a guest
  // who saved places before signing in loses nothing), then push the merged set back up so
  // both sides agree. Runs once per login; the guard is cleared on sign-out (inside this
  // effect, never during render) so signing into a different account merges correctly.
  useEffect(() => {
    if (!user) {
      mergedForUser.current = null;
      return;
    }
    if (!isSupabaseConfigured || mergedForUser.current === user.id) return;
    mergedForUser.current = user.id;

    let cancelled = false;

    (async () => {
      setWishlistSyncing(true);
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('item_key')
          .eq('user_id', user.id);
        if (error) throw error;
        if (cancelled) return;

        const cloudKeys = new Set((data ?? []).map((row) => row.item_key));
        const merged = new Set([...cloudKeys, ...saved]);
        const missingInCloud = [...merged].filter((key) => !cloudKeys.has(key));

        if (missingInCloud.length) {
          await supabase
            .from('wishlist_items')
            .upsert(
              missingInCloud.map((item_key) => ({ user_id: user.id, item_key })),
              { onConflict: 'user_id,item_key' }
            );
        }

        if (!cancelled) setSaved(merged);
      } catch (err) {
        console.error('[Culture Click] Wishlist sync failed, staying local-only this session:', err.message);
      } finally {
        if (!cancelled) setWishlistSyncing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, saved]);

  const toggleSaved = useCallback(
    (key) => {
      const wasSaved = saved.has(key);
      const next = new Set(saved);
      if (wasSaved) next.delete(key);
      else next.add(key);
      setSaved(next);

      if (isSupabaseConfigured && user) {
        const query = wasSaved
          ? supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('item_key', key)
          : supabase
              .from('wishlist_items')
              .upsert({ user_id: user.id, item_key: key }, { onConflict: 'user_id,item_key' });

        query.then(({ error }) => {
          if (error) console.error('[Culture Click] Could not sync wishlist change to the cloud:', error.message);
        });
      }
    },
    [user, saved]
  );

  const addRecentSearch = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, MAX_RECENT));
  }, []);

  /**
   * The trail a visitor leaves behind: the last few places they actually opened. It is the
   * cheapest form of "come back" the app has — no account, no server, no consent banner — and
   * it is what turns a browse into a route.
   */
  const rememberPlace = useCallback((place) => {
    if (!place?.id) return;
    setRecentPlaces((prev) => [place, ...prev.filter((x) => x.id !== place.id)].slice(0, MAX_RECENT_PLACES));
  }, []);

  const forgetPlaces = useCallback(() => setRecentPlaces([]), []);

  return (
    <AppContext.Provider
      value={{
        isDark,
        setIsDark,
        saved,
        toggleSaved,
        wishlistSyncing,
        currentRegion,
        setCurrentRegion,
        activeLayer,
        setActiveLayer,
        recentSearches,
        addRecentSearch,
        recentPlaces,
        rememberPlace,
        forgetPlaces,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
