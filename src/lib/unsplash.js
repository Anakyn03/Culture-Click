/**
 * Unsplash API helper with localStorage caching.
 * 
 * - Fetches real photos of Indian heritage sites from Unsplash
 * - Caches results in localStorage for instant subsequent loads
 * - Falls back gracefully if API fails
 * 
 * Unsplash provides free, high-quality photos with proper licensing.
 * API key is stored in .env.local (VITE_UNSPLASH_ACCESS_KEY).
 */

const CACHE_KEY = 'cultureclick_unsplash_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get cached image URL for a query.
 */
function getCached(query) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entry = cache[query];
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.url;
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Cache an image URL for a query.
 */
function setCache(query, url) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[query] = { url, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

/**
 * Fetch an image from Unsplash API.
 * Returns { url, credit, alt } or null.
 */
export async function fetchUnsplashImage(query) {
  // Check cache first
  const cached = getCached(query);
  if (cached) {
    return { url: cached, credit: 'Unsplash', alt: query };
  }

  // Check if API key is available
  const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!apiKey) {
    console.warn('[Unsplash] No API key set. Add VITE_UNSPLASH_ACCESS_KEY to .env.local');
    return null;
  }

  try {
    const params = new URLSearchParams({
      query: query,
      per_page: '1',
      orientation: 'landscape',
      content_filter: 'high',
    });

    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
      },
    });

    if (!res.ok) {
      console.error('[Unsplash] API error:', res.status);
      return null;
    }

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      return null;
    }

    const result = {
      url: photo.urls.regular, // 1080w, good for most screens
      credit: `${photo.user.name} on Unsplash`,
      alt: photo.alt_description || query,
    };

    // Cache the result
    setCache(query, result.url);

    return result;
  } catch (err) {
    console.error('[Unsplash] Fetch error:', err);
    return null;
  }
}

/**
 * Build a search query for a place.
 * Returns an array of queries to try, ranked by relevance.
 */
export function buildPlaceQuery(placeName, stateName, type) {
  const base = placeName.replace(/\s*\(.*\)/, '').trim();
  return [
    `${base} ${stateName} India`,
    `${base} ${type} India`,
    `${base} India`,
  ];
}

/**
 * Build a search query for a state.
 */
export function buildStateQuery(stateName) {
  return [
    `${stateName} India landscape`,
    `${stateName} India heritage`,
    `${stateName} India`,
  ];
}

/**
 * Try multiple queries until we get a result.
 */
export async function fetchWithFallback(queries) {
  for (const query of queries) {
    const result = await fetchUnsplashImage(query);
    if (result) return result;
  }
  return null;
}
