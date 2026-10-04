import { useMemo } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { useApp } from '../context/AppContext';
import { photoOf } from '../lib/photo';
import MapHero from '../components/MapHero';
import Card from '../components/Card';
import ContinueJourney from '../components/ContinueJourney';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

export default function HomePage() {
  const { status, error, reload, index, states, districtCount, placeCount } = useAtlas();
  const { currentRegion } = useApp();

  const filtered = useMemo(
    () => states.filter((s) => currentRegion === 'All' || s.region === currentRegion),
    [states, currentRegion]
  );

  // The database decides what is "top rated" — it is the only side that can see every place.
  const highlights = index?.highlights ?? [];

  if (status === 'loading') return <PageSkeleton rows={3} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="The atlas could not load" />;

  return (
    <div>
      <MapHero />

      <ContinueJourney />

      <SectionHeading
        title="Explore by state"
        aside={`${filtered.length} of ${states.length} states & UTs`}
      />
      <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[50px]">
        {filtered.map((s) => (
          <Card
            key={s.id}
            to={`/state/${s.id}`}
            photo={photoOf(s)}
            tag={s.region}
            title={s.name}
            blurb={`${s.tagline} — ${(s.blurb ?? '').slice(0, 86)}…`}
            footLeft={`${s.districtCount} district${s.districtCount === 1 ? '' : 's'}`}
            footRight="Explore →"
            saveKey={`state:${s.id}`}
          />
        ))}
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />

      <SectionHeading
        title="Top-rated heritage"
        aside={`${placeCount} places catalogued across ${districtCount} districts`}
      />
      <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[50px]">
        {highlights.slice(0, 4).map((p) => (
          <Card
            key={p.id}
            to={`/state/${p.stateId}/${p.districtId}/${p.id}`}
            photo={photoOf(p)}
            tag={p.type}
            title={p.name}
            blurb={`${(p.blurb ?? '').slice(0, 90)}…`}
            footLeft={`${p.districtName}, ${p.stateName}`}
            footRight={`★ ${p.rating}`}
            saveKey={`place:${p.id}`}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ title, aside }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 px-[clamp(18px,4vw,48px)] pb-1.5 pt-10">
      <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-charcoal">{title}</h2>
      {aside && <span className="text-[0.85rem] opacity-60">{aside}</span>}
    </div>
  );
}
