import { useState } from 'react';
import { resolvePhoto } from '../lib/photo';

/**
 * PlaceImage — the single image renderer for the whole atlas (cards, heroes, search thumbs).
 *
 * The entity's own `photo` fields are passed in ({ url, title }) and resolved synchronously, so
 * there is no skeleton and the first frame is already correct. No photo renders the themed
 * gradient below rather than showing something unrelated.
 *
 * Positioning belongs to the caller: this renders a `<figure>` with no position of its own, so
 * `absolute inset-0` from a hero actually wins. Hardcoding `relative` here once meant the hero
 * photo laid out in flow while its text stretched the container, and the title spilled onto
 * the page background.
 *
 * Do not gate the image on a `load` event or a fade animation — doing that has hidden these
 * photos three separate times. A synchronously resolved photo has nothing to fade *from*.
 */

const SIZES_ATTR = {
  thumbnail: '40px',
  card: '(max-width: 640px) 100vw, 320px',
  hero: '100vw',
};

const FALLBACK = 'bg-gradient-to-br from-indigo/20 to-saffron/20';

export default function PlaceImage({
  photo,
  name,
  size = 'card',
  showCredit = false,
  eager = false,
  className = '',
  alt: altOverride,
}) {
  const resolved = resolvePhoto(photo, size);

  // A URL that 404s (a Commons file renamed since the catalog was generated) falls back to the
  // same gradient, rather than sitting there as a broken frame.
  const [failedUrl, setFailedUrl] = useState(null);

  if (!resolved || failedUrl === resolved.url) {
    return <div className={`${FALLBACK} ${className}`} aria-hidden="true" />;
  }

  return (
    <figure className={`overflow-hidden bg-sand ${className}`}>
      <img
        src={resolved.url}
        srcSet={resolved.srcSet}
        sizes={SIZES_ATTR[size] || SIZES_ATTR.card}
        alt={altOverride ?? name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailedUrl(resolved.url)}
        className="h-full w-full object-cover"
      />

      {showCredit && (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[0.68rem] text-white/80">
          📷 {resolved.credit}
        </figcaption>
      )}
    </figure>
  );
}
