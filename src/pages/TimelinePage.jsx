import { useNavigate } from 'react-router-dom';
import { DATA } from '../data/statesData';

function formatYear(y) { return y < 1000 ? `~${y} CE` : y; }

export default function TimelinePage() {
  const navigate = useNavigate();
  const events = [];
  DATA.states.forEach((s) => s.districts.forEach((d) => d.places.forEach((p) => p.timeline.forEach((t) => events.push({ ...t, p, d, s })))));
  events.sort((a, b) => a.y - b.y);

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Heritage timeline</h2>
        <p className="mt-1">Every dated event catalogued across all 36 states and Union Territories, laid out chronologically.</p>
      </div>
      <div className="mx-[clamp(18px,4vw,48px)] mb-[50px] border-l-2 border-black/10 pl-[26px] dark:border-white/10">
        {events.map((e, i) => (
          <div key={i} className="relative pb-7">
            <span className="absolute -left-[33px] top-1 h-3 w-3 rounded-full border-2 border-ivory bg-gold dark:border-[#131A24]" />
            <div className="font-serif text-[1.2rem] text-saffron">{formatYear(e.y)}</div>
            <button onClick={() => navigate(`/state/${e.s.id}/${e.d.id}/${e.p.id}`)} className="font-bold text-indigo underline decoration-black/15 hover:decoration-teal dark:text-charcoal">
              {e.p.name}
            </button>
            <div className="text-[0.76rem] font-bold uppercase tracking-wide opacity-60">{e.d.name}, {e.s.name}</div>
            <p className="mt-1">{e.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
