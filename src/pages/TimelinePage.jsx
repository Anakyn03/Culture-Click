import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { TIMELINE_KEY, fetchTimeline } from '../lib/atlasApi';
import { formatYear } from '../data/atlas';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

/**
 * Label a year's era so a long list reads as chapters rather than a wall.
 * Deliberately uses "1200s" rather than "13th century" — the ordinal form is a classic
 * off-by-one trap (1200 CE is in the 1200s, not the 13th century).
 */
function eraOf(year) {
  if (year < 1000) return 'Early India · pre-1000 CE';
  return `${Math.floor(year / 100) * 100}s`;
}

export default function TimelinePage() {
  const { status, data, error, reload } = useResource(TIMELINE_KEY, fetchTimeline);

  // Events arrive flattened and sorted from Postgres. Anything without a usable year is
  // dropped here rather than rendered as "null" — the DB allows an event with a missing year
  // because a legacy row might have one, and a broken timeline row is worse than a shorter one.
  const events = useMemo(
    () => (data?.events ?? []).filter((event) => typeof event.y === 'number'),
    [data]
  );

  if (status === 'loading') return <PageSkeleton rows={3} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="The timeline could not load" />;

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Heritage timeline</h2>
        <p className="mt-1">
          {data?.total ?? events.length} dated events catalogued across all states and Union
          Territories, laid out chronologically.
        </p>
      </div>

      <div className="mx-[clamp(18px,4vw,48px)] mb-[50px] border-l-2 border-black/10 pl-[26px] dark:border-white/10">
        {events.map((event, i) => {
          const era = eraOf(event.y);
          const previousEra = i > 0 ? eraOf(events[i - 1].y) : null;
          const startsEra = era !== previousEra;

          return (
            <Fragment key={`${event.placeId}-${event.y}-${i}`}>
              {startsEra && (
                <h3 className="relative -left-[26px] mb-4 mt-8 font-serif text-[1.05rem] uppercase tracking-[0.12em] text-indigo first:mt-0 dark:text-charcoal">
                  {era}
                </h3>
              )}
              <div className="relative pb-7">
                <span className="absolute -left-[33px] top-1 h-3 w-3 rounded-full border-2 border-ivory bg-gold dark:border-[#12181F]" />
                <div className="font-serif text-[1.2rem] text-saffron">{formatYear(event.y)}</div>
                <Link
                  to={`/state/${event.stateId}/${event.districtId}/${event.placeId}`}
                  className="font-bold text-indigo underline decoration-black/15 hover:decoration-teal dark:text-charcoal"
                >
                  {event.placeName}
                </Link>
                <div className="text-[0.76rem] font-bold uppercase tracking-wide opacity-60">
                  {event.districtName}, {event.stateName}
                </div>
                <p className="mt-1">{event.label}</p>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
