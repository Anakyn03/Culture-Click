import PlaceMotif from './PlaceMotif';

/**
 * PlaceSlideshow — lightweight wrapper that renders the SVG illustration.
 * 
 * Previously fetched images from Wikimedia Commons (slow, unreliable).
 * Now simply shows the static PlaceMotif illustration.
 * Photo database integration is planned for the future.
 *
 * Usage:
 *   <PlaceSlideshow media={p.media} className="absolute inset-0" />
 */
export default function PlaceSlideshow({ media, className = '' }) {
  return <PlaceMotif media={media} className={className} />;
}
