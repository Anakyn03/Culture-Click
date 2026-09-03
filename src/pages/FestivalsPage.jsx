import { DATA } from '../data/statesData';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FestivalsPage() {
  const byMonth = {};
  MONTHS.forEach((m) => (byMonth[m] = []));
  DATA.states.forEach((s) => s.culture.festivals.forEach((f) => {
    f.month.split('/').forEach((m) => { if (byMonth[m]) byMonth[m].push({ name: f.name, state: s.name }); });
  }));

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Festival calendar</h2>
        <p className="mt-1">A month-by-month look at when India's states and Union Territories are at their most celebratory.</p>
      </div>
      <div className="grid gap-[18px] px-[clamp(18px,4vw,48px)] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))' }}>
        {MONTHS.map((m) => (
          <div key={m} className={`min-h-[110px] rounded-2xl border border-black/10 bg-surface p-[18px] shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 ${byMonth[m].length ? '' : 'opacity-40'}`}>
            <h3 className="mb-2.5 font-serif text-[1rem] text-saffron">{m}</h3>
            <ul className="flex flex-col gap-1.5">
              {byMonth[m].length ? byMonth[m].map((f, i) => (
                <li key={i} className="flex justify-between gap-2 text-[0.82rem]">
                  {f.name} <span className="text-[0.72rem] opacity-55">{f.state}</span>
                </li>
              )) : <li className="text-[0.82rem]">No catalogued festivals yet</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
