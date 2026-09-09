import { useState, useEffect } from 'react';
import { usePlaceImage } from '../hooks/usePlaceImage';
import { getResponsiveSize } from '../lib/unsplash';

/**
 * PlaceImage — fetches and displays a photo for a place or state.
 * 
 * Features:
 * - Fetches from Unsplash API with caching
 * - Shows loading skeleton while fetching
 * - Smooth fade-in transition when image loads
 * - Falls back to gradient if no image found
 * - Displays photographer credit
 * - Responsive: different image sizes for mobile vs desktop
 * 
 * @param {string} size - 'card' | 'hero' | 'thumbnail' (default: 'hero')
 * 
 * Usage:
 *   <PlaceImage id="hawa-mahal" name="Hawa Mahal" type="Palace" stateName="Rajasthan" size="hero" />
 */
export default function PlaceImage({ id, name, type, stateName, size = 'hero', className = '' }) {
  const { urls, credit, alt, color, loading } = usePlaceImage(id, name, type, stateName);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [responsiveSize, setResponsiveSize] = useState(() => getResponsiveSize(size));

  // Update responsive size on window resize
  useEffect(() => {
    const handleResize = () => {
      setResponsiveSize(getResponsiveSize(size));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  // Get the appropriate URL for the size
  const imageUrl = urls?.[responsiveSize] || urls?.[size] || urls?.hero || urls?.full;

  // Loading state — show dominant color or gradient
  if (loading) {
    return (
      <div 
        className={`animate-pulse ${className}`}
        style={{ backgroundColor: color || undefined }}
        aria-hidden="true"
      />
    );
  }

  // No image found — show gradient fallback
  if (!imageUrl) {
    return (
      <div 
        className={`bg-gradient-to-br from-indigo/20 to-saffron/20 ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Image found — render with smooth fade-in
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      {/* Placeholder with dominant color */}
      {!imageLoaded && color && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: color }}
        />
      )}
      
      {/* Actual image with fade-in */}
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ease-out ${
          imageLoaded ? 'opacity-1' : 'opacity-0'
        }`}
      />
      
      {/* Credit overlay */}
      {credit && imageLoaded && (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[0.68rem] text-white/80 transition-opacity duration-300">
          📷 {credit}
        </figcaption>
      )}
    </figure>
  );
}
