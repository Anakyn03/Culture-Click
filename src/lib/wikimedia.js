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
 * Fetch a Wikimedia Commons image for a place.
 * Returns { thumbSrc, fullSrc, credit, license } or null.
 */
export async function fetchWikimediaImage(placeName, stateName, type) {
  const queries = buildQueries(placeName, stateName, type);

  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: q,
        srnamespace: '6',          // File: namespace
        srlimit: '5',
        format: 'json',
        origin: '*',
      });
      const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
      if (!res.ok) continue;
      const { query } = await res.json();
      const hits = query?.search;
      if (!hits?.length) continue;

      // Get imageinfo for each candidate
      const titles = hits.map((h) => h.title).join('|');
      const infoParams = new URLSearchParams({
        action: 'query',
        titles,
        prop: 'imageinfo',
        iiprop: 'url|extmetadata|size',
        iiurlwidth: '800',
        format: 'json',
        origin: '*',
      });
      const infoRes = await fetch(`${API}?${infoParams}`, { headers: { 'User-Agent': UA } });
      if (!infoRes.ok) continue;
      const infoData = await infoRes.json();
      const pages = infoData?.query?.pages || {};

      for (const page of Object.values(pages)) {
        const img = page.imageinfo?.[0];
        if (!img) continue;
        if (img.width < 200 || img.height < 200) continue;
        if (!isFreelyLicensed(img.extmetadata)) continue;

        const credit = img.extmetadata?.Artist?.value || img.extmetadata?.Credit?.value || 'Wikimedia Commons';
        const licenseName = img.extmetadata?.LicenseShortName?.value || 'CC';
        // Strip HTML tags from credit
        const cleanCredit = credit.replace(/<[^>]+>/g, '').trim();

        return {
          thumbSrc: img.thumburl,
          fullSrc: img.url,
          credit: `${cleanCredit} · ${licenseName}`,
          license: licenseName,
        };
      }
    } catch {
      // Network error — try next query
    }
  }
  return null;
}
