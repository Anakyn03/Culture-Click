import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useResource } from '../hooks/useResource';
import { fetchState, stateKey } from '../lib/atlasApi';
import { photoOf } from '../lib/photo';
import Card from '../components/Card';
import PageHero from '../components/PageHero';
import StatStrip from '../components/StatStrip';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

export default function StatePage() {
  const { stateId } = useParams();
  const { saved, toggleSaved } = useApp();

  const { status, data, error, reload } = useResource(stateKey(stateId), () => fetchState(stateId));

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="This state could not load" />;
  if (!data?.state) return <Navigate to="/" replace />;

  const s = data.state;
  const saveKey = `state:${s.id}`;
  const featured = data.districts.flatMap((d) => d.places.map((p) => ({ d, p })));

  return (
    <div>
      <PageHero
        photo={photoOf(s)}
        imageName={s.name}
        eyebrow={`${s.region} India`}
        title={s.name}
        blurb={s.blurb}
        chips={[
          s.unesco && 'UNESCO listed sites',
          `${data.districts.length} district${data.districts.length > 1 ? 's' : ''} featured`,
          `${s.culture.festivals.length} major festivals`,
        ].filter(Boolean)}
        actions={
          <button
            type="button"
            onClick={() => toggleSaved(saveKey)}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5"
          >
            {saved.has(saveKey) ? '★ Saved' : '☆ Save state'}
          </button>
        }
      />

      <StatStrip
        rows={[
          ['area', 'Area'],
          ['districts', 'Districts'],
          ['language', 'Language'],
          ['founded', 'Statehood'],
        ].map(([key, label]) => [s.stats[key], label])}
      />

      <div className="px-[clamp(18px,4vw,48px)] pb-2.5 pt-2">
        <div className="grid gap-9 md:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Culture &amp; identity</h2>
            <p className="mt-2.5">
              {s.blurb} Its rhythm is set as much by festival calendars as by season — a place best
              understood through what its people cook, wear and celebrate.
            </p>

            <h3 className="mt-5 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Festivals</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.festivals.map((f) => (
                <span key={f.name} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">
                  {f.name} · {f.month}
                </span>
              ))}
            </div>

            <h3 className="mt-4 font-serif text-[1.05rem] text-indigo dark:text-charcoal">
              Dance &amp; performance
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.dance.map((dance) => (
                <span key={dance} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">
                  {dance}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">At a glance</h2>
            <ul className="list-none">
              {[
                ['Signature dress', s.culture.dress],
                ['Must-try dish', s.culture.cuisine[0]],
                ['Districts featured', data.districts.length],
                ['Places catalogued', featured.length],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3 border-b border-black/10 py-2.5 text-[0.88rem] dark:border-white/10">
                  <span>{k}</span>
                  <b className="text-right text-indigo dark:text-charcoal">{v}</b>
                </li>
              ))}
            </ul>

            <h3 className="mt-4 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Local cuisine</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {s.culture.cuisine.map((dish) => (
                <span key={dish} className="rounded-full border border-black/10 bg-sand px-3 py-1.5 text-[0.78rem] font-semibold dark:border-white/10">
                  {dish}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionHeading title={`Districts of ${s.name}`} />
      <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[30px]">
        {data.districts.map((d) => (
          <Card
            key={d.id}
            to={`/state/${s.id}/${d.id}`}
            photo={photoOf(d)}
            tag="District"
            title={d.name}
            blurb={d.blurb}
            footLeft={`${d.places.length} place${d.places.length !== 1 ? 's' : ''} catalogued`}
            footRight="Explore →"
          />
        ))}
      </div>

      {featured.length > 0 && (
        <>
          <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
          <SectionHeading title={`Featured heritage in ${s.name}`} />
          <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[50px]">
            {featured.map(({ d, p }) => (
              <Card
                key={p.id}
                to={`/state/${s.id}/${d.id}/${p.id}`}
                photo={photoOf(p)}
                tag={p.type}
                title={p.name}
                blurb={`${(p.blurb ?? '').slice(0, 90)}…`}
                footLeft={d.name}
                footRight={`★ ${p.rating}`}
                saveKey={`place:${p.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
      <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] text-indigo dark:text-charcoal">{title}</h2>
    </div>
  );
}
