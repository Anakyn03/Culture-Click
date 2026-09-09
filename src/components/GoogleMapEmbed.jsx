import { useState } from 'react';

/**
 * GoogleMapEmbed — shows a place on Google Maps via the Embed API.
 *
 * Uses the free Maps Embed API (iframe-based, no JS SDK needed).
 * Requires VITE_GOOGLE_MAPS_API_KEY in .env.local.
 *
 * Falls back to a "Open in Google Maps" link if no API key is set.
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} placeName - Name of the place (for the marker label)
 * @param {string} [className] - Additional CSS classes
 */
export default function GoogleMapEmbed({ lat, lng, placeName, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // No API key — show a clean fallback link
  if (!apiKey) {
    return (
      <div className={`rounded-2xl border border-black/10 bg-surface p-5 shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 ${className}`}>
        <div className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60 mb-3">Location</div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-black/10 bg-ivory p-4 transition-colors hover:border-teal hover:bg-teal/5 dark:border-white/10 dark:bg-sand"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <div className="text-[0.88rem] font-bold text-indigo dark:text-charcoal">{placeName}</div>
            <div className="text-[0.72rem] opacity-60">Open in Google Maps →</div>
          </div>
        </a>
        <p className="mt-2 text-[0.68rem] italic opacity-40">Add VITE_GOOGLE_MAPS_API_KEY to .env.local for an embedded map</p>
      </div>
    );
  }

  // Has API key — show embedded map
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=14&maptype=roadmap`;

  return (
    <div className={`overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 ${className}`}>
      <div className="px-5 pt-4 pb-2">
        <div className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">Location</div>
      </div>
      <div className="relative mx-3 mb-3 overflow-hidden rounded-xl" style={{ aspectRatio: '16/10' }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo/40">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
        <iframe
          title={`Map of ${placeName}`}
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', inset: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="px-5 pb-4">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[0.72rem] font-bold text-teal transition-colors hover:bg-teal hover:text-white"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
