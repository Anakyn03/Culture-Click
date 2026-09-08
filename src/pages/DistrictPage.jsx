import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import PlaceImage from '../components/PlaceImage';

const EXPERIENCES = ['Village Walk', 'Local Cuisine Trail', 'Handicraft Workshop', 'Heritage Photography', 'Market Visit', 'Storytelling Evening'];

export default function DistrictPage() {
  const { stateId, districtId } = useParams();
  const { saved, toggleSaved } = useApp();
  const s = DATA.states.find((x) => x.id === stateId);
  const d = s?.districts.find((x) => x.id === districtId);

  useEffect(() => { window.scrollTo(0, 0); }, [districtId]);

  if (!s || !d) return <Navigate to="/" replace />;
  const saveKey = `dist:${d.id}`;

  return (
    <div>
      <div className="relative mx-[clamp(18px,4vw,48px)] mt-[18px] min-h-[320px] overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(31,58,95,0.16)]">
        <PlaceImage
          id={d.id}
          name={d.name}
          size="hero"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(15,20,28,.84), rgba(15,20,28,.1))' }} />
        <div className="relative w-full px-[clamp(18px,4vw,44px)] py-[34px] text-white">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold">{s.name} District</div>
          <h1 className="my-1.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] text-white">{d.name}</h1>
          <p className="max-w-[560px] text-white/90">{d.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button onClick={() => toggleSaved(saveKey)} className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5">
              {saved.has(saveKey) ? '★ Saved' : '☆ Save district'}
            </button>

          </div>
        </div>
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Famous places</h2>
      </div>
      <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[30px]">
        {d.places.length ? (
          d.places.map((p) => (
            <Card
              key={p.id}
              to={`/state/${s.id}/${d.id}/${p.id}`}
              media={p.media}
              tag={p.type}
              title={p.name}
              blurb={`${p.blurb.slice(0, 90)}…`}
              footLeft={s.name}
              footRight={`★ ${p.rating}`}
              saveKey={`place:${p.id}`}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center opacity-80">
            <h3 className="font-serif text-[1.2rem] text-indigo dark:text-charcoal">Still charting this district</h3>
            <p className="mx-auto mt-1.5 max-w-[360px]">More places for {d.name} are being catalogued for the atlas.</p>

          </div>
        )}
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Local experiences</h2>
      </div>
      <div className="grid gap-3 px-[clamp(18px,4vw,48px)] pb-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
        {EXPERIENCES.map((e, i) => (
          <div key={e} className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-surface p-4 text-[0.88rem] font-bold text-indigo shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 dark:text-charcoal">
            <span className="font-serif text-[1.1rem] text-saffron">{String(i + 1).padStart(2, '0')}</span>{e}
          </div>
        ))}
      </div>
    </div>
  );
}
