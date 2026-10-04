import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useResource } from '../hooks/useResource';
import { fetchState, stateKey } from '../lib/atlasApi';
import { districtIn } from '../data/atlas';
import { photoOf } from '../lib/photo';
import Card from '../components/Card';
import PageHero from '../components/PageHero';
import NumberedGrid from '../components/NumberedGrid';
import EmptyState from '../components/EmptyState';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

const EXPERIENCES = [
  'Village Walk',
  'Local Cuisine Trail',
  'Handicraft Workshop',
  'Heritage Photography',
  'Market Visit',
  'Storytelling Evening',
];

export default function DistrictPage() {
  const { stateId, districtId } = useParams();
  const { saved, toggleSaved } = useApp();

  const { status, data, error, reload } = useResource(stateKey(stateId), () => fetchState(stateId));

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="This district could not load" />;

  const s = data?.state;
  const d = s ? districtIn(data, districtId) : null;
  if (!s || !d) return <Navigate to="/" replace />;

  const saveKey = `dist:${d.id}`;
  const siblingDistricts = data.districts.filter((x) => x.id !== d.id);

  return (
    <div>
      <PageHero
        photo={photoOf(d)}
        imageName={d.name}
        eyebrow={`${s.name} District`}
        title={d.name}
        blurb={d.blurb}
        chips={[`${d.places.length} place${d.places.length !== 1 ? 's' : ''} catalogued`, s.region + ' India']}
        minHeight={320}
        actions={
          <button
            type="button"
            onClick={() => toggleSaved(saveKey)}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5"
          >
            {saved.has(saveKey) ? '★ Saved' : '☆ Save district'}
          </button>
        }
      />

      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Famous places</h2>
      </div>

      {d.places.length ? (
        <div className="card-grid px-[clamp(16px,4vw,48px)] py-[16px] pb-[30px]">
          {d.places.map((p) => (
            <Card
              key={p.id}
              to={`/state/${s.id}/${d.id}/${p.id}`}
              photo={photoOf(p)}
              tag={p.type}
              title={p.name}
              blurb={`${(p.blurb ?? '').slice(0, 90)}…`}
              footLeft={s.name}
              footRight={`★ ${p.rating}`}
              saveKey={`place:${p.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Still charting this district">
          More places for {d.name} are being catalogued for the atlas.
        </EmptyState>
      )}

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Local experiences</h2>
      </div>
      <NumberedGrid items={EXPERIENCES} className="px-[clamp(18px,4vw,48px)] pb-10" />

      {siblingDistricts.length > 0 && (
        <div className="px-[clamp(18px,4vw,48px)] pb-10">
          <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">
            Other districts in {s.name}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/state/${s.id}`}
              className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
            >
              All of {s.name}
            </Link>
            {siblingDistricts.map((x) => (
              <Link
                key={x.id}
                to={`/state/${s.id}/${x.id}`}
                className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
              >
                {x.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
