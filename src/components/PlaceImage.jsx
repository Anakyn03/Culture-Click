import { useEffect, useState } from 'react';
import { fetchWikimediaImage } from '../lib/wikimedia';
import PlaceMotif from './PlaceMotif';

/**
 * PlaceImage — fetches a freely-licensed photograph from Wikimedia Commons
 * and renders it with photographer attribution. Falls back to a PlaceMotif
 * illustration when no suitable image is found.
 *
 * Usage:
 *   <PlaceImage placeName="Hawa Mahal" stateName="Rajasthan" type="Palace" media={p.media} />
 */
export default function PlaceImage({ placeName, stateName, type, media, className = '' }) {
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImg(null);

    fetchWikimediaImage(placeName, stateName, type).then((result) => {
      if (!cancelled) {
        setImg(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [placeName, stateName, type]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`skeleton h-full w-full ${className}`} aria-hidden="true" />
    );
  }

  // No image found — show the SVG illustration
  if (!img) {
    return <PlaceMotif media={media} className={className} />;
  }

  return (
    <figure className={`relative h-full w-full overflow-hidden ${className}`}>
      <img
        src={img.thumbSrc}
        alt={`${placeName}, ${stateName}`}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2.5 text-[0.68rem] text-white/80">
        📷 {img.credit}
      </figcaption>
    </figure>
  );
}
