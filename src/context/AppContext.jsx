import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

function loadWishlist() {
  try {
    const raw = localStorage.getItem('cc-wishlist');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}
function loadTheme() {
  try {
    return localStorage.getItem('cc-theme') === 'dark';
  } catch {
    return false;
  }
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(loadTheme);
  const [saved, setSaved] = useState(loadWishlist);
  const [wishlistSyncing, setWishlistSyncing] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('All');
  const [activeLayer, setActiveLayer] = useState(null);
  // Chat "memory" — lets Saathi answer follow-ups like "what about food there" using the
  // last state/place the visitor looked at, without a real backend session.
  const [chatContext, setChatContext] = useState({ lastStateId: null, lastPlaceId: null });
  const [recentSearches, setRecentSearches] = useState([]);
  // Set by "Ask Saathi" buttons scattered across pages; the Chatbot component watches this
  // and opens itself with the question pre-sent, then clears it.
  const [pendingAsk, setPendingAsk] = useState(null);

  // Tracks whether we've already merged local + cloud wishlists for the current login, so we
  // don't re-run the (one-time) merge on every render or every unrelated auth state tick.
  const mergedForUser = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('cc-theme', isDark ? 'dark' : 'light');
    } catch {
      /* private browsing / storage disabled — theme just won't persist, non-fatal */
    }
  }, [isDark]);

  // Always mirror the current wishlist to localStorage — this is the source of truth when
  // logged out, and an offline-friendly cache when logged in.
  useEffect(() => {
    try {
      localStorage.setItem('cc-wishlist', JSON.stringify([...saved]));
    } catch {
      /* non-fatal */
    }
  }, [saved]);

  // On login: fetch the cloud wishlist, union it with whatever's already saved locally (so a
  // guest who saved places before signing in doesn't lose them), then push the merged set back
  // up so both sides agree. Runs once per login, not on every render.
  useEffect(() => {
    if (!isSupabaseConfigured || !user || mergedForUser.current === user.id) return;
    mergedForUser.current = user.id;

    (async () => {
      setWishlistSyncing(true);
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('item_key')
          .eq('user_id', user.id);
        if (error) throw error;

        const cloudKeys = new Set((data ?? []).map((r) => r.item_key));
        const merged = new Set([...cloudKeys, ...saved]);

        const missingInCloud = [...merged].filter((k) => !cloudKeys.has(k));
        if (missingInCloud.length) {
          await supabase.from('wishlist_items').upsert(
            missingInCloud.map((item_key) => ({ user_id: user.id, item_key })),
            { onConflict: 'user_id,item_key' }
          );
        }
        setSaved(merged);
      } catch (err) {
        console.error('[Culture Click] Wishlist sync failed, staying in local-only mode for this session:', err.message);
      } finally {
        setWishlistSyncing(false);
      }
    })();
  }, [user, saved]);

  useEffect(() => {
    // Reset the merge guard on logout, so signing into a *different* account re-merges correctly.
    if (!user) mergedForUser.current = null;
  }, [user]);

  const toggleSaved = useCallback((key) => {
    setSaved((prev) => {
      const next = new Set(prev);
      const adding = !next.has(key);
      if (adding) next.add(key); else next.delete(key);
      return next;
    });

    if (isSupabaseConfigured && user) {
      const wasSaved = saved.has(key);
      const op = wasSaved
        ? supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('item_key', key)
        : supabase.from('wishlist_items').upsert({ user_id: user.id, item_key: key }, { onConflict: 'user_id,item_key' });
      op.then(({ error }) => {
        if (error) console.error('[Culture Click] Could not sync wishlist change to the cloud:', error.message);
      });
    }
  }, [user, saved]);

  const addRecentSearch = useCallback((q) => {
    setRecentSearches((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 4));
  }, []);

  const value = {
    isDark, setIsDark,
    saved, toggleSaved, wishlistSyncing,
    currentRegion, setCurrentRegion,
    activeLayer, setActiveLayer,
    chatContext, setChatContext,
    recentSearches, addRecentSearch,
    pendingAsk, setPendingAsk,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
