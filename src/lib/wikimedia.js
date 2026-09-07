/**
 * Wikimedia Commons API helper — keyless read access.
 *
 * Uses the MediaWiki `action=query` endpoint with `prop=imageinfo`
 * to search for freely-licensed images of Indian heritage sites.
 * No API key is needed; we only send a descriptive User-Agent header.
 *
 * Accepted licenses: CC-BY, CC-BY-SA, CC0, PD (public domain).
 */

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'CultureClick/1.0 (https://github.com/Anakyn03/Culture-Click; culture-click@example.com)';

/**
 * Build a list of search queries for a place, ranked by relevance.
 * The first hit that returns a usable image wins.
 */
function buildQueries(placeName, stateName, type) {
  const base = placeName.replace(/\s*\(.*\)/, '').trim();
  return [
    `${base} ${stateName}`,
    `${base} ${type}`,
    base,
  ];
}

/**
 * Accept only freely-licensed images.
 */
function isFreelyLicensed(extmetadata) {
  const lic = (extmetadata?.LicenseShortName?.value || '').toLowerCase();
  return /cc[- ]?by|cc[- ]?by[- ]?sa|cc0|public\s?domain|pd/.test(lic);
}

/**
 * Process raw imageinfo into our standard shape.
 * Only accepts images that are wide enough and have a reasonable aspect ratio
 * for a hero banner (between 4:3 and 16:9 landscape, or taller for portrait).
 */
function processImage(img) {
  if (!img) return null;
  if (img.width < 400 || img.height < 300) return null;
  if (!isFreelyLicensed(img.extmetadata)) return null;
  const credit = img.extmetadata?.Artist?.value || img.extmetadata?.Credit?.value || 'Wikimedia Commons';
  const licenseName = img.extmetadata?.LicenseShortName?.value || 'CC';
  const cleanCredit = credit.replace(/<[^>]+>/g, '').trim();
  return {
    thumbSrc: img.thumburl,
    fullSrc: img.url,
    credit: `${cleanCredit} · ${licenseName}`,
    license: licenseName,
  };
}

/**
 * Fetch a single Wikimedia Commons image for a place.
 * Returns { thumbSrc, fullSrc, credit, license } or null.
 */
export async function fetchWikimediaImage(placeName, stateName, type) {
  const queries = buildQueries(placeName, stateName, type);
  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        action: 'query', list: 'search', srsearch: q,
        srnamespace: '6', srlimit: '5', format: 'json', origin: '*',
      });
      const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
      if (!res.ok) continue;
      const { query } = await res.json();
      const hits = query?.search;
      if (!hits?.length) continue;
      const titles = hits.map((h) => h.title).join('|');
      const infoParams = new URLSearchParams({
        action: 'query', titles, prop: 'imageinfo',
        iiprop: 'url|extmetadata|size', iiurlwidth: '1200', format: 'json', origin: '*',
      });
      const infoRes = await fetch(`${API}?${infoParams}`, { headers: { 'User-Agent': UA } });
      if (!infoRes.ok) continue;
      const pages = (await infoRes.json())?.query?.pages || {};
      for (const page of Object.values(pages)) {
        const result = processImage(page.imageinfo?.[0]);
        if (result) return result;
      }
    } catch { /* try next query */ }
  }
  return null;
}

/**
 * Fetch multiple freely-licensed images for a place (for slideshows).
 * Returns an array of { thumbSrc, fullSrc, credit, license } (max 3 by default).
 */
export async function fetchWikimediaImages(placeName, stateName, type, limit = 3) {
  const base = placeName.replace(/\s*\(.*\)/, '').trim();
  const queries = [
    `${base} ${stateName}`,
    `${base} ${type}`,
    base,
  ];
  const seen = new Set();
  const results = [];

  for (const q of queries) {
    if (results.length >= limit) break;
    try {
      const params = new URLSearchParams({
        action: 'query', list: 'search', srsearch: q,
        srnamespace: '6', srlimit: String(limit + 3), format: 'json', origin: '*',
      });
      const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
      if (!res.ok) continue;
      const { query } = await res.json();
      const hits = query?.search;
      if (!hits?.length) continue;
      const titles = hits.map((h) => h.title).join('|');
      const infoParams = new URLSearchParams({
        action: 'query', titles, prop: 'imageinfo',
        iiprop: 'url|extmetadata|size', iiurlwidth: '1200', format: 'json', origin: '*',
      });
      const infoRes = await fetch(`${API}?${infoParams}`, { headers: { 'User-Agent': UA } });
      if (!infoRes.ok) continue;
      const pages = (await infoRes.json())?.query?.pages || {};
      for (const page of Object.values(pages)) {
        if (results.length >= limit) break;
        const img = page.imageinfo?.[0];
        if (!img || seen.has(img.url)) continue;
        seen.add(img.url);
        const processed = processImage(img);
        if (processed) results.push(processed);
      }
    } catch { /* try next query */ }
  }
  return results;
}
