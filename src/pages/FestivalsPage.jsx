import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { FESTIVALS_KEY, fetchFestivals } from '../lib/atlasApi';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function FestivalsPage() {
  const { status, data, error, reload } = useResource(FESTIVALS_KEY, fetchFestivals);

  // Grouped by month here rather than in SQL: the grid is a rendering concern, and the rows
  // already arrive in calendar order.
  const byMonth = useMemo(() => {
    const groups = Object.fromEntries(MONTHS.map((month) => [month, []]));
    for (const festival of data ?? []) {
      // A festival spanning two months is listed under each, which is how the source writes it.
      for (const month of String(festival.month).split('/')) {
        if (groups[month]) groups[month].push(festival);
      }
    }
    return groups;
  }, [data]);

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="The calendar could not load" />;

  const total = MONTHS.reduce((n, month) => n + byMonth[month].length, 0);

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Festival calendar</h2>
        <p className="mt-1">
          {total} catalogued festivals, month by month — when India's states and Union
          Territories are at their most celebratory.
        </p>
      </div>

      <div
        className="grid gap-[18px] px-[clamp(18px,4vw,48px)] pb-[50px]"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))' }}
      >
        {MONTHS.map((month) => {
          const festivals = byMonth[month];
          return (
            <div
              key={month}
              className={`min-h-[110px] rounded-2xl border border-black/10 bg-surface p-[18px] shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 ${
                festivals.length ? '' : 'opacity-40'
              }`}
            >
              <h3 className="mb-2.5 font-serif text-[1rem] text-saffron">{month}</h3>
              {festivals.length ? (
                <ul className="flex flex-col gap-1.5">
                  {festivals.map((festival) => (
                    <li key={`${festival.name}-${festival.stateId}`} className="text-[0.82rem]">
                      <Link
                        to={`/state/${festival.stateId}`}
                        className="flex justify-between gap-2 hover:text-teal hover:underline"
                      >
                        <span>{festival.name}</span>
                        <span className="text-[0.72rem] opacity-55">{festival.stateName}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[0.82rem]">No catalogued festivals yet</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
