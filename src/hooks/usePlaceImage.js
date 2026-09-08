import { useState, useEffect } from 'react';
import { fetchWithFallback, buildPlaceQuery, buildStateQuery } from '../lib/unsplash';

/**
 * Custom hook to fetch an image for a place or state.
 * 
 * @param {string} id - The place or state ID
 * @param {string} name - The display name
 * @param {string} type - The place type (optional, for places)
 * @param {string} stateName - The state name (optional, for places)
 * @returns {{ url: string|null, credit: string|null, loading: boolean }}
 */
export function usePlaceImage(id, name, type, stateName) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      setLoading(true);
      
      const queries = type 
        ? buildPlaceQuery(name, stateName, type)
        : buildStateQuery(name);

      const result = await fetchWithFallback(queries);

      if (!cancelled) {
        setImage(result);
        setLoading(false);
      }
    }

    loadImage();

    return () => { cancelled = true; };
  }, [id, name, type, stateName]);

  return { url: image?.url || null, credit: image?.credit || null, alt: image?.alt || null, loading };
}

export default usePlaceImage;
