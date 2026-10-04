import { useMemo } from 'react';
import { INDEX_KEY, fetchIndex } from '../lib/atlasApi';
import { useResource } from '../hooks/useResource';
import { AtlasContext } from './AtlasContext';

/**
 * Supplies the atlas index to every page.
 *
 * The index is states with their counts, culture and photographs — a few kilobytes — and it is
 * the only thing fetched before a page can render. Districts and places are fetched per state
 * (see lib/atlasApi.js), because holding the whole atlas in the browser stopped being an option
 * once it could hold nine hundred places.
 *
 * `status` is part of the contract, not an afterthought: with content in Postgres there is no
 * bundled fallback, so pages must be able to say "still loading" and "this failed".
 */
export function AtlasProvider({ children }) {
  const { status, data, error, reload } = useResource(INDEX_KEY, fetchIndex);

  const value = useMemo(
    () => ({
      status,
      error,
      reload,
      index: data ?? null,
      states: data?.states ?? [],
      stateCount: data?.stateCount ?? 0,
      districtCount: data?.districtCount ?? 0,
      placeCount: data?.placeCount ?? 0,
    }),
    [status, data, error, reload]
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export default AtlasProvider;
