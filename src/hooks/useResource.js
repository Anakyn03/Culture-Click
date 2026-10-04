import { useCallback, useEffect, useRef, useState } from 'react';
import { readCache } from '../lib/atlasApi';

/**
 * Load one cache-keyed resource and report its status.
 *
 * Cache-first: if the key is already in the session cache the value is returned during the
 * first render, so navigating back to a state you have already opened shows content
 * immediately and never flashes a skeleton.
 *
 * The stored result is keyed alongside the key it belongs to, so navigating from one place to
 * another can't briefly render the previous place's content while the new request is in
 * flight — the same reason the place page keys its tab state by place id.
 *
 * @param {string|null} key   cache key, or null to stay idle
 * @param {() => Promise<any>} load
 * @returns {{ status: 'idle'|'loading'|'ready'|'error', data: any, error: string|null, reload: () => void }}
 */
export function useResource(key, load) {
  const [entry, setEntry] = useState(() => ({
    key,
    status: key && readCache(key) !== undefined ? 'ready' : key ? 'loading' : 'idle',
    data: key ? (readCache(key) ?? null) : null,
    error: null,
  }));
  const [nonce, setNonce] = useState(0);

  // The loader is held in a ref so the effect depends only on the key — an inline closure would
  // otherwise restart the request on every render. Written in an effect (declared before the
  // one that reads it) rather than during render, which is what refs are for.
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  // The effect only reports *outcomes*. "Loading" needs no state of its own: while the stored
  // entry still belongs to a different key the render already reports loading (or the new
  // key's cached value), and `reload` sets it directly from the click that caused it — so no
  // render is started synchronously from inside this effect.
  useEffect(() => {
    if (!key) return undefined;

    let current = true;

    loadRef.current()
      .then((data) => {
        if (current) setEntry({ key, status: 'ready', data: data ?? null, error: null });
      })
      .catch((error) => {
        if (current) setEntry({ key, status: 'error', data: null, error: error.message });
      });

    return () => {
      current = false;
    };
  }, [key, nonce]);

  const reload = useCallback(() => {
    setEntry({ key, status: 'loading', data: null, error: null });
    setNonce((n) => n + 1);
  }, [key]);

  // A key change re-renders before the effect runs; report the new key's state rather than
  // the previous resource's data.
  if (entry.key !== key) {
    const cached = key ? readCache(key) : undefined;
    return {
      status: cached !== undefined ? 'ready' : key ? 'loading' : 'idle',
      data: cached ?? null,
      error: null,
      reload,
    };
  }

  return { ...entry, reload };
}

export default useResource;
