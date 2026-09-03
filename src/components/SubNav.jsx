import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: '🗺️ Map', end: true },
  { to: '/timeline', label: '📜 Heritage Timeline' },
  { to: '/festivals', label: '🎉 Festival Calendar' },
  { to: '/compare', label: '⚖️ Compare States' },
  { to: '/wishlist', label: '♡ Wishlist' },
];

export default function SubNav() {
  return (
    <nav aria-label="Section navigation" className="flex gap-1.5 overflow-x-auto border-b border-black/10 bg-ivory px-[clamp(18px,4vw,48px)] py-2.5 dark:border-white/10">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8rem] font-bold transition-colors ${
              isActive ? 'bg-indigo text-white dark:bg-gold dark:text-indigo' : 'text-charcoal/65 hover:bg-sand hover:text-charcoal'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
