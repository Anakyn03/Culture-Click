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
 * Image sizes for different contexts.
 * Using Unsplash's dynamic resizing for optimal performance.
 */
export const IMAGE_SIZES = {
  card: { width: 400, height: 250 },      // Cards: small, fast loading
  hero: { width: 1200, height: 600 },     // Hero sections: large, high quality
  thumbnail: { width: 200, height: 200 }, // Thumbnails: tiny, instant
};

/**
 * Get cached image data for a query.
 */
function getCached(query) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entry = cache[query];
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry;
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Cache image data for a query.
 */
function setCache(query, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[query] = { ...data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

/**
 * Get optimized Unsplash URL for a specific size.
 * Uses Unsplash's image resizing API for optimal performance.
 */
function getOptimizedUrl(originalUrl, size) {
  if (!originalUrl) return null;
  
  // Unsplash image resizing: append ?w=WIDTH&h=HEIGHT&fit=crop
  const baseUrl = originalUrl.split('?')[0];
  const params = new URLSearchParams({
    w: String(size.width),
    h: String(size.height),
    fit: 'crop',
    q: '80', // Quality 80% for good balance
    auto: 'format', // Auto-format for best browser support
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Fetch an image from Unsplash API.
 * Returns { urls, credit, alt } or null.
 * urls contains optimized URLs for different sizes.
 */
export async function fetchUnsplashImage(query) {
  // Check cache first
  const cached = getCached(query);
  if (cached) {
    return cached;
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

    // Generate optimized URLs for different sizes
    const result = {
      urls: {
        card: getOptimizedUrl(photo.urls.regular, IMAGE_SIZES.card),
        hero: getOptimizedUrl(photo.urls.regular, IMAGE_SIZES.hero),
        thumbnail: getOptimizedUrl(photo.urls.regular, IMAGE_SIZES.thumbnail),
        full: photo.urls.regular,
      },
      credit: `${photo.user.name} on Unsplash`,
      alt: photo.alt_description || query,
      color: photo.color || '#f5f5f5', // Dominant color for placeholder
    };

    // Cache the result
    setCache(query, result);

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
