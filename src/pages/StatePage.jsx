import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import PlaceMotif from '../components/PlaceMotif';
import Card from '../components/Card';

export default function StatePage() {
  const { stateId } = useParams();
  const { saved, toggleSaved, setPendingAsk, setChatContext } = useApp();
  const s = DATA.states.find((x) => x.id === stateId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (s) setChatContext((c) => ({ ...c, lastStateId: s.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  if (!s) return <Navigate to="/" replace />;

  const saveKey = `state:${s.id}`;

  return (
    <div>
      <div className="relative mx-[clamp(18px,4vw,48px)] mt-[18px] min-h-[320px] overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(31,58,95,0.16)]">
        <PlaceMotif media={s.media} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(15,20,28,.84), rgba(15,20,28,.1))' }} />
        <div className="relative w-full px-[clamp(18px,4vw,44px)] py-[34px] text-white">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold">{s.region} India</div>
          <h1 className="my-1.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] text-white">{s.name}</h1>
          <p className="max-w-[560px] text-white/90">{s.blurb}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {s.unesco && <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">UNESCO listed sites</span>}
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">{s.districts.length} district{s.districts.length > 1 ? 's' : ''} featured</span>
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur">{s.culture.festivals.length} major festivals</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button onClick={() => toggleSaved(saveKey)} className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5">
              {saved.has(saveKey) ? '★ Saved' : '☆ Save state'}
            </button>
            <button onClick={() => setPendingAsk(`Tell me about ${s.name}`)} className="rounded-full border border-white/50 bg-white/15 px-5 py-2.5 text-[0.86rem] font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5">
              Ask Saathi
            </button>
          </div>
        </div>
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] flex -translate-y-[26px] flex-wrap overflow-hidden rounded-[18px] border border-black/10 bg-sand shadow-[0_2px_8px_rgba(31,58,95,0.1)] dark:border-white/10">
        {[['area', 'Area'], ['districts', 'Districts'], ['language', 'Language'], ['founded', 'Statehood']].map(([key, label], i, arr) => (
          <div key={key} className={`flex-1 basis-[140px] px-5 py-[18px] ${i < arr.length - 1 ? 'border-r border-black/10 dark:border-white/10' : ''}`}>
            <b className="block font-serif text-[1.5rem] text-indigo dark:text-charcoal">{s.stats[key]}</b>
            <span className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">{label}</span>
          </div>
        ))}
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-2.5 pt-2">
        <div className="grid gap-9 md:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Culture &amp; identity</h2>
            <p className="mt-2.5">{s.blurb} Its rhythm is set as much by festival calendars as by season — a place best understood through what its people cook, wear and celebrate.</p>
            <h3 className="mt-5 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Festivals</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.festivals.map((f) => (
                <span key={f.name} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">{f.name} · {f.month}</span>
              ))}
            </div>
            <h3 className="mt-4 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Dance &amp; performance</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.dance.map((f) => <span key={f} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">{f}</span>)}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">At a glance</h2>
            <ul className="list-none">
              {[['Signature dress', s.culture.dress], ['Must-try dish', s.culture.cuisine[0]], ['Districts featured', s.districts.length]].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3 border-b border-black/10 py-2.5 text-[0.88rem] dark:border-white/10">
                  <span>{k}</span><b className="text-right text-indigo dark:text-charcoal">{v}</b>
                </li>
              ))}
            </ul>
            <h3 className="mt-4 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Local cuisine</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.cuisine.map((f) => <span key={f} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">{f}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-10">
        <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-charcoal">Districts of {s.name}</h2>
      </div>
      <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[30px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
        {s.districts.map((d) => (
          <Card
            key={d.id}
            to={`/state/${s.id}/${d.id}`}
            media={d.media}
            tag="District"
            title={d.name}
            blurb={d.blurb}
            footLeft={`${d.places.length} place${d.places.length !== 1 ? 's' : ''} catalogued`}
            footRight="Explore →"
          />
        ))}
      </div>

      {s.districts.some((d) => d.places.length) && (
        <>
          <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
          <div className="px-[clamp(18px,4vw,48px)] pb-1.5">
            <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-charcoal">Featured heritage in {s.name}</h2>
          </div>
          <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
            {s.districts.flatMap((d) => d.places.map((p) => (
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
            )))}
          </div>
        </>
      )}
    </div>
  );
}
