import { Link, useParams, useLocation } from 'react-router-dom';
import { DATA } from '../data/statesData';

function stateById(id) { return DATA.states.find((s) => s.id === id); }
function distById(state, id) { return state?.districts.find((d) => d.id === id); }
function placeById(dist, id) { return dist?.places.find((p) => p.id === id); }

const STATIC_LABELS = {
  wishlist: 'Wishlist',
  compare: 'Compare States',
  timeline: 'Heritage Timeline',
  festivals: 'Festival Calendar',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { stateId, districtId, placeId } = useParams();

  let crumbs = [{ label: 'India', to: '/' }];

  const topSegment = pathname.split('/').filter(Boolean)[0];
  if (topSegment && STATIC_LABELS[topSegment]) {
    crumbs.push({ label: STATIC_LABELS[topSegment] });
  } else if (stateId) {
    const s = stateById(stateId);
    if (s) {
      crumbs.push({ label: s.name, to: `/state/${s.id}` });
      if (districtId) {
        const d = distById(s, districtId);
        if (d) {
          crumbs.push({ label: d.name, to: `/state/${s.id}/${d.id}` });
          if (placeId) {
            const p = placeById(d, placeId);
            if (p) crumbs.push({ label: p.name });
          }
        }
      }
    }
  }

  if (crumbs.length === 1) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2 px-[clamp(18px,4vw,48px)] pt-3.5 text-[0.82rem] text-charcoal/70">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="opacity-40">›</span>}
            {c.to && !isLast ? (
              <Link to={c.to} className="font-bold text-teal">{c.label}</Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-bold text-indigo dark:text-charcoal' : ''}>{c.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
