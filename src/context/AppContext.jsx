import { createContext, useContext } from 'react';

/**
 * App-wide UI state: theme, the wishlist, map filters and recent searches.
 *
 * The provider lives in `AppProvider.jsx`. Keeping the context object and its hook in a
 * module that exports no components means edits here hot-reload cleanly during
 * development, and every consumer keeps importing from one stable path.
 */
export const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
