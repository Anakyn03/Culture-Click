import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  const [isDark, setIsDark] = useState(loadTheme);
  const [saved, setSaved] = useState(loadWishlist);
  const [currentRegion, setCurrentRegion] = useState('All');
  const [activeLayer, setActiveLayer] = useState(null);
  // Chat "memory" — lets Saathi answer follow-ups like "what about food there" using the
  // last state/place the visitor looked at, without a real backend session.
  const [chatContext, setChatContext] = useState({ lastStateId: null, lastPlaceId: null });
  const [recentSearches, setRecentSearches] = useState([]);
  // Set by "Ask Saathi" buttons scattered across pages; the Chatbot component watches this
  // and opens itself with the question pre-sent, then clears it.
  const [pendingAsk, setPendingAsk] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('cc-theme', isDark ? 'dark' : 'light');
    } catch {
      /* private browsing / storage disabled — theme just won't persist, non-fatal */
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('cc-wishlist', JSON.stringify([...saved]));
    } catch {
      /* non-fatal */
    }
  }, [saved]);

  const toggleSaved = useCallback((key) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const addRecentSearch = useCallback((q) => {
    setRecentSearches((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 4));
  }, []);

  const value = {
    isDark, setIsDark,
    saved, toggleSaved,
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
