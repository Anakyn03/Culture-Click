import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import MapHero from '../components/MapHero';
import Card from '../components/Card';

function allPlaces() {
  const out = [];
  DATA.states.forEach((s) => s.districts.forEach((d) => d.places.forEach((p) => out.push({ s, d, p }))));
  return out;
}

export default function HomePage() {
  const { currentRegion } = useApp();
  const filtered = DATA.states.filter((s) => currentRegion === 'All' || s.region === currentRegion);
  const recent = allPlaces().slice(0, 4);

  return (
    <div>
      <MapHero />

      <div className="flex flex-wrap items-baseline justify-between gap-3 px-[clamp(18px,4vw,48px)] pb-1.5 pt-10">
        <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-sand">Explore by state</h2>
        <span className="text-[0.85rem] opacity-60">{filtered.length} of {DATA.states.length} states &amp; UTs</span>
      </div>
      <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
        {filtered.map((s) => (
          <Card
            key={s.id}
            to={`/state/${s.id}`}
            media={s.media}
            tag={s.region}
            title={s.name}
            blurb={`${s.tagline} — ${s.blurb.slice(0, 86)}…`}
            footLeft={`${s.districts.length} district${s.districts.length > 1 ? 's' : ''} featured`}
            footRight="Explore →"
            saveKey={`state:${s.id}`}
          />
        ))}
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-2.5">
        <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-sand">Recently added heritage sites</h2>
      </div>
      <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
        {recent.map(({ s, d, p }) => (
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
        ))}
      </div>
    </div>
  );
}
