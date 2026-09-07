import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchWikimediaImages } from '../lib/wikimedia';
import PlaceMotif from './PlaceMotif';

/**
 * PlaceSlideshow — fetches multiple freely-licensed photographs from
 * Wikimedia Commons and cycles through them as a hero slideshow.
 * Falls back to a single PlaceImage or PlaceMotif when fewer than 2 images exist.
 *
 * Usage:
 *   <PlaceSlideshow placeName="Hawa Mahal" stateName="Rajasthan" type="Palace" media={p.media} />
 */
export default function PlaceSlideshow({ placeName, stateName, type, media, className = '' }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImages([]);
    setCurrent(0);

    fetchWikimediaImages(placeName, stateName, type, 6).then((result) => {
      if (!cancelled) {
        setImages(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [placeName, stateName, type]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance every 5 seconds (only when multiple images)
  useEffect(() => {
    if (images.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  // Pause on hover
  const pause = () => clearInterval(intervalRef.current);
  const resume = () => {
    if (images.length >= 2) {
      intervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % images.length);
      }, 5000);
    }
  };

  // Loading skeleton
  if (loading) {
    return <div className={`absolute inset-0 skeleton ${className}`} aria-hidden="true" />;
  }

  // No images — fallback to SVG illustration
  if (images.length === 0) {
    return <PlaceMotif media={media} />;
  }

  // Single image — no slideshow needed
  if (images.length === 1) {
    return (
      <figure className={`absolute inset-0 overflow-hidden ${className}`}>
        <img src={images[0].thumbSrc} alt={`${placeName}, ${stateName}`} loading="lazy" className="h-full w-full object-cover" />
        <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2.5 text-[0.68rem]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
          📷 {images[0].credit}
        </figcaption>
      </figure>
    );
  }

  // Multiple images — slideshow
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      role="region"
      aria-label={`Photo slideshow of ${placeName}`}
    >
      {/* Images */}
      {images.map((img, i) => (
        <img
          key={img.thumbSrc}
          src={img.thumbSrc}
          alt={`${placeName}, ${stateName}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          className="absolute inset-0 object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Credit */}
      <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2.5 text-[0.68rem] text-white/80">
        📷 {images[current].credit}
      </figcaption>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="Previous photo"            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.8)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        onClick={next}
        aria-label="Next photo"            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.8)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to photo ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 8,
              backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
