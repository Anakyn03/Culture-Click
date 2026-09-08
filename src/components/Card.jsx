import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePlaceImage } from '../hooks/usePlaceImage';
import { getResponsiveSize } from '../lib/unsplash';

/**
 * A single visual card used across Home/State/District pages.
 * `to` is the route to navigate to on click. `saveKey`, if given, shows a heart toggle.
 * 
 * Responsive design:
 * - Mobile: Full-width cards, larger touch targets
 * - Desktop: Grid layout, hover effects
 */
export default function Card({ to, media, tag, title, blurb, footLeft, footRight, saveKey }) {
  const navigate = useNavigate();
  const { saved, toggleSaved } = useApp();
  const isSaved = saveKey ? saved.has(saveKey) : false;
  const { urls, color, loading } = usePlaceImage(media, title);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [responsiveSize, setResponsiveSize] = useState(() => getResponsiveSize('card'));

  // Update responsive size on window resize
  useEffect(() => {
    const handleResize = () => {
      setResponsiveSize(getResponsiveSize('card'));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get card-sized URL
  const imageUrl = urls?.[responsiveSize] || urls?.card || urls?.hero || urls?.full;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-black/10 bg-surface shadow-[0_2px_8px_rgba(31,58,95,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo/25 hover:shadow-[0_20px_50px_rgba(31,58,95,0.18)] active:scale-[0.98] dark:border-white/10"
    >
      <div className="relative h-[180px] sm:h-[150px] overflow-hidden bg-sand">
        {/* Placeholder with dominant color */}
        {!imageLoaded && color && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: color }}
          />
        )}
        
        {/* Loading skeleton */}
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sand to-sand/50" />
        )}
        
        {/* Image with smooth fade-in and hover zoom */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        
        {/* Fallback gradient if no image */}
        {!loading && !imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo/20 to-saffron/20" />
        )}
        {tag && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-indigo/85 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white">
            {tag}
          </span>
        )}
        {saveKey && (
          <button
            type="button"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(saveKey);
            }}
            className={`absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full text-saffron transition-colors ${
              isSaved ? 'bg-saffron text-white' : 'bg-white/85'
            }`}
          >
            ♡
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col px-[18px] pb-5 pt-4">
        <h3 className="font-serif text-[1.15rem] text-indigo dark:text-charcoal">{title}</h3>
        <p className="mt-1.5 text-[0.86rem] text-charcoal/85">{blurb}</p>
        <div className="mt-3 flex items-center justify-between text-[0.76rem] font-bold uppercase tracking-wide text-charcoal/65">
          <span>{footLeft}</span>
          <span>{footRight}</span>
        </div>
      </div>
    </div>
  );
}
