import { usePlaceImage } from '../hooks/usePlaceImage';

/**
 * PlaceImage — fetches and displays a photo for a place or state.
 * 
 * Features:
 * - Fetches from Unsplash API with caching
 * - Shows loading skeleton while fetching
 * - Falls back to gradient if no image found
 * - Displays photographer credit
 * 
 * Usage:
 *   <PlaceImage id="hawa-mahal" name="Hawa Mahal" type="Palace" stateName="Rajasthan" />
 */
export default function PlaceImage({ id, name, type, stateName, className = '' }) {
  const { url, credit, alt, loading } = usePlaceImage(id, name, type, stateName);

  // Loading state
  if (loading) {
    return (
      <div 
        className={`animate-pulse bg-gradient-to-br from-sand to-sand/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  // No image found — show gradient fallback
  if (!url) {
    return (
      <div 
        className={`bg-gradient-to-br from-indigo/20 to-saffron/20 ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Image found — render it
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {credit && (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[0.68rem] text-white/80">
          📷 {credit}
        </figcaption>
      )}
    </figure>
  );
}
