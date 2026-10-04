import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlaceImage from './PlaceImage';

/**
 * A single visual card used across the Home/State/District/Wishlist pages.
 *
 * The whole card is a real `<Link>` stretched over the surface (`absolute inset-0`)
 * rather than a `div` with `role="button"` and an onClick handler. That gives middle-click,
 * right-click → open in new tab, and normal keyboard/focus behaviour for free, while the
 * wishlist heart stays a real button sitting above it on its own layer.
 *
 * @param {string} to        route to open
 * @param {object} [photo]   the entity's { url, title } photo fields
 * @param {string} [saveKey] shows the heart toggle when given
 */
export default function Card({ to, photo, tag, title, blurb, footLeft, footRight, saveKey }) {
  const { saved, toggleSaved } = useApp();
  const isSaved = saveKey ? saved.has(saveKey) : false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[20px] border border-black/10 bg-surface shadow-[0_2px_8px_rgba(31,58,95,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo/25 hover:shadow-[0_20px_50px_rgba(31,58,95,0.18)] active:scale-[0.98] dark:border-white/10">
      <Link
        to={to}
        aria-label={`Open ${title}`}
        className="absolute inset-0 z-10 rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
      />

      <div className="relative h-[180px] overflow-hidden bg-sand sm:h-[150px]">
        <PlaceImage
          photo={photo}
          name={title}
          size="card"
          className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {tag && (
          <span className="absolute left-2.5 top-2.5 z-20 rounded-full bg-indigo/85 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white">
            {tag}
          </span>
        )}

        {saveKey && (
          <button
            type="button"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={isSaved}
            onClick={() => toggleSaved(saveKey)}
            className={`absolute right-2.5 top-2.5 z-20 flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors ${
              isSaved ? 'bg-saffron text-white' : 'bg-white/85 text-saffron hover:bg-white'
            }`}
          >
            <span aria-hidden="true">♡</span>
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
    </article>
  );
}
