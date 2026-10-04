import { createContext, useContext } from 'react';

/**
 * The atlas content (states → districts → places) every page reads.
 *
 * The provider lives in `AtlasProvider.jsx`; this module exports no components so it can be
 * edited without breaking hot reload.
 */
export const AtlasContext = createContext(null);

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider');
  return ctx;
}
