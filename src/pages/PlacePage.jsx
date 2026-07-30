import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import PlaceMotif from '../components/PlaceMotif';

function formatYear(y) { return y < 1000 ? `~${y} CE` : y; }

export default function PlacePage() {
  const { stateId, districtId, placeId } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved, setPendingAsk, setChatContext } = useApp();
  const [shareLabel, setShareLabel] = useState('↗ Share');
  const s = DATA.states.find((x) => x.id === stateId);
  const d = s?.districts.find((x) => x.id === districtId);
  const p = d?.places.find((x) => x.id === placeId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (s && p) setChatContext((c) => ({ ...c, lastStateId: s.id, lastPlaceId: p.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  if (!s || !d || !p) return <Navigate to="/" replace />;
  const saveKey = `place:${p.id}`;
  const others = d.places.filter((x) => x.id !== p.id);

  return (
    <div>
      <div className="relative mx-[clamp(18px,4vw,48px)] mt-[18px] min-h-[380px] overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(31,58,95,0.16)]">
        <PlaceMotif media={p.media} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(15,20,28,.84), rgba(15,20,28,.1))' }} />
        <div className="relative w-full px-[clamp(18px,4vw,44px)] py-[34px] text-white">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold">{p.type} · {d.name}, {s.name}</div>
          <h1 className="my-1.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] text-white">{p.name}</h1>
          <p className="max-w-[560px] text-white/90">{p.blurb}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">📷 Best shot: {p.bestPhoto}</span>
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">💰 Budget: {p.budget}</span>
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">🥾 {p.difficulty}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button onClick={() => toggleSaved(saveKey)} className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5">
              {saved.has(saveKey) ? '★ Saved' : '☆ Save place'}
            </button>
            <button onClick={() => setPendingAsk(`Tell me the story of ${p.name}`)} className="rounded-full border border-white/50 bg-white/15 px-5 py-2.5 text-[0.86rem] font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5">
              Ask Saathi
            </button>
            <button
              onClick={() => { setShareLabel('✓ Link copied'); setTimeout(() => setShareLabel('↗ Share'), 1600); }}
              className="rounded-full border border-white/50 bg-white/15 px-5 py-2.5 text-[0.86rem] font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              {shareLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] flex -translate-y-[26px] flex-wrap overflow-hidden rounded-[18px] border border-black/10 bg-sand shadow-[0_2px_8px_rgba(31,58,95,0.1)] dark:border-white/10">
        {[['★ ' + p.rating, 'Traveler rating'], [p.entry, 'Entry'], [p.open, 'Hours'], [p.bestSeason, 'Best season']].map(([val, label], i) => (
          <div key={label} className={`flex-1 basis-[140px] px-5 py-[18px] ${i < 3 ? 'border-r border-black/10 dark:border-white/10' : ''}`}>
            <b className="block font-serif text-[1.5rem] text-indigo dark:text-charcoal">{val}</b>
            <span className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">{label}</span>
          </div>
        ))}
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] mb-2.5 flex items-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-black/15 px-[18px] py-4 text-[0.82rem] opacity-70 dark:border-white/15">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
        360° tour and drone gallery are reserved for the production build once licensed imagery and capture partners are in place.
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-2.5 pt-2">
        <div className="grid gap-9 md:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">The story</h2>
            <p className="mt-2.5">{p.history}</p>
            <h2 className="mt-6 font-serif text-[1.5rem] text-indigo dark:text-charcoal">Architecture &amp; craft</h2>
            <p className="mt-2.5">{p.architecture}</p>
            <h2 className="mt-6 font-serif text-[1.5rem] text-indigo dark:text-charcoal">Historical timeline</h2>
            <div className="mt-3.5 ml-2 border-l-2 border-black/10 pl-[22px] dark:border-white/10">
              {p.timeline.map((t, i) => (
                <div key={i} className="relative pb-[22px]">
                  <span className="absolute -left-[28px] top-1 h-[11px] w-[11px] rounded-full border-2 border-ivory bg-saffron dark:border-[#131A24]" />
                  <b className="block font-serif text-[0.95rem] text-teal">{formatYear(t.y)}</b>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Hidden facts</h2>
            <ul className="list-none">
              {p.facts.map((f, i) => <li key={i} className="border-b border-black/10 py-2.5 text-[0.88rem] dark:border-white/10">{f}</li>)}
            </ul>
            <h2 className="mt-6 font-serif text-[1.5rem] text-indigo dark:text-charcoal">Getting there</h2>
            <ul className="list-none">
              {[['Nearest railway', p.travel.railway], ['Nearest airport', p.travel.airport], ['Parking', p.travel.parking]].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3 border-b border-black/10 py-2.5 text-[0.88rem] dark:border-white/10">
                  <span>{k}</span><b className="text-right text-indigo dark:text-charcoal">{v}</b>
                </li>
              ))}
            </ul>
            <p className="mt-3 italic">💡 {p.travel.tip}</p>
          </div>
        </div>
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Hidden gems nearby</h2>
      </div>
      <div className="thin-scroll flex gap-4 overflow-x-auto px-[clamp(18px,4vw,48px)] pb-3 pt-4" style={{ scrollSnapType: 'x proximity' }}>
        {p.hiddenGems.map((g, i) => (
          <div key={i} className="w-[220px] flex-none rounded-2xl border border-black/10 bg-surface p-[18px] shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10" style={{ scrollSnapAlign: 'start' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-2.5 text-saffron"><path d="M12 2 L14.5 9 L22 9.5 L16 14.3 L18 22 L12 17.8 L6 22 L8 14.3 L2 9.5 L9.5 9 Z" /></svg>
            <h4 className="mb-1 font-serif text-[1rem] text-indigo dark:text-charcoal">{g.split(',')[0]}</h4>
            <p className="text-[0.82rem]">{g}</p>
          </div>
        ))}
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Local food to try</h2>
      </div>
      <div className="grid gap-3 px-[clamp(18px,4vw,48px)] pb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
        {p.food.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-surface p-4 text-[0.88rem] font-bold text-indigo shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 dark:text-charcoal">
            <span className="font-serif text-[1.1rem] text-saffron">{String(i + 1).padStart(2, '0')}</span>{f}
          </div>
        ))}
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Experiences here</h2>
      </div>
      <div className="grid gap-3 px-[clamp(18px,4vw,48px)] pb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))' }}>
        {p.experiences.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-surface p-4 text-[0.88rem] font-bold text-indigo shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 dark:text-charcoal">
            <span className="font-serif text-[1.1rem] text-saffron">{String(i + 1).padStart(2, '0')}</span>{f}
          </div>
        ))}
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-10">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Nearby &amp; related</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => navigate(`/state/${s.id}/${d.id}`)} className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold hover:bg-teal hover:text-white">← Back to {d.name}</button>
          <Link to={`/state/${s.id}`} className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold hover:bg-teal hover:text-white">All of {s.name}</Link>
          {others.map((x) => (
            <Link key={x.id} to={`/state/${s.id}/${d.id}/${x.id}`} className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold hover:bg-teal hover:text-white">{x.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
