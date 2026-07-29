import { useState } from 'react';
import { DATA } from '../data/statesData';

function Rows({ a, b }) {
  if (!a || !b) return <div className="px-6 py-10 text-center opacity-70"><p>Pick two different states above.</p></div>;
  const rows = [
    ['Tagline', a.tagline, b.tagline],
    ['Region', a.region, b.region],
    ['Area', a.stats.area, b.stats.area],
    ['Districts', a.stats.districts, b.stats.districts],
    ['Language', a.stats.language, b.stats.language],
    ['UNESCO sites', a.unesco ? 'Yes' : 'None catalogued', b.unesco ? 'Yes' : 'None catalogued'],
    ['Signature dish', a.culture.cuisine[0], b.culture.cuisine[0]],
    ['Signature festival', a.culture.festivals[0].name, b.culture.festivals[0].name],
    ['Places catalogued', a.districts.reduce((n, d) => n + d.places.length, 0), b.districts.reduce((n, d) => n + d.places.length, 0)],
  ];
  return (
    <div className="mx-[clamp(18px,4vw,48px)] mb-10 overflow-hidden rounded-[18px] shadow-[0_1px_0_rgba(43,43,43,0.10)]">
      <table className="w-full border-collapse bg-sand">
        <thead>
          <tr>
            <th className="bg-sand/70 px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-sand">Aspect</th>
            <th className="bg-sand/70 px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-sand">{a.name}</th>
            <th className="bg-sand/70 px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-sand">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-black/10 dark:border-white/10">
              <td className="px-[18px] py-3.5 text-[0.72rem] font-bold uppercase tracking-wide opacity-60">{r[0]}</td>
              <td className="px-[18px] py-3.5 text-[0.88rem]">{r[1]}</td>
              <td className="px-[18px] py-3.5 text-[0.88rem]">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparePage() {
  const [aId, setAId] = useState(DATA.states[0].id);
  const [bId, setBId] = useState(DATA.states[1].id);
  const [committed, setCommitted] = useState({ a: DATA.states[0].id, b: DATA.states[1].id });

  const a = DATA.states.find((s) => s.id === committed.a);
  const b = DATA.states.find((s) => s.id === committed.b);

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-sand">Compare two states</h2>
        <p className="mt-1">Pick two states to see how they stack up before you commit an itinerary to one.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 px-[clamp(18px,4vw,48px)] py-5">
        <select value={aId} onChange={(e) => setAId(e.target.value)} aria-label="First state to compare" className="rounded-full border border-black/10 bg-sand px-4 py-2.5 text-[0.88rem] font-bold dark:border-white/10">
          {DATA.states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="font-bold opacity-50">vs</span>
        <select value={bId} onChange={(e) => setBId(e.target.value)} aria-label="Second state to compare" className="rounded-full border border-black/10 bg-sand px-4 py-2.5 text-[0.88rem] font-bold dark:border-white/10">
          {DATA.states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={() => setCommitted({ a: aId, b: bId })} className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo">Compare</button>
      </div>
      <Rows a={a} b={b} />
    </div>
  );
}
