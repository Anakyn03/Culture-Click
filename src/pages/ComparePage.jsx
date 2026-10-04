import { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

/**
 * Side-by-side state comparison.
 *
 * The previous version required picking two states from dropdowns and then pressing a
 * "Compare" button, so the table below could disagree with the controls above it. The
 * selection now drives the table directly, and the swap button flips the two columns
 * instead of making the visitor re-pick both.
 *
 * Every row comes from the index, which already carries each state's counts, culture and
 * best season — so comparing never fetches a place.
 */
export default function ComparePage() {
  const { status, error, reload, states } = useAtlas();

  const [pickedA, setPickedA] = useState(states[0]?.id ?? '');
  const [pickedB, setPickedB] = useState(states[1]?.id ?? '');

  // If the atlas changes underneath us a stored id may no longer exist. Fall back rather than
  // rendering an empty table with a blank dropdown.
  const has = (id) => states.some((s) => s.id === id);
  const aId = has(pickedA) ? pickedA : (states[0]?.id ?? '');
  const bId = has(pickedB) ? pickedB : (states[1]?.id ?? states[0]?.id ?? '');

  const a = states.find((s) => s.id === aId);
  const b = states.find((s) => s.id === bId);

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="The comparison could not load" />;

  if (states.length < 2) {
    return (
      <p className="px-6 py-24 text-center opacity-70">
        Comparison needs at least two states — the atlas currently holds {states.length}.
      </p>
    );
  }

  const rows =
    a && b
      ? [
          ['Tagline', a.tagline, b.tagline],
          ['Region', a.region, b.region],
          ['Area', a.stats.area, b.stats.area],
          ['Districts', a.stats.districts, b.stats.districts],
          ['Language', a.stats.language, b.stats.language],
          ['UNESCO sites', a.unesco ? 'Yes' : 'None catalogued', b.unesco ? 'Yes' : 'None catalogued'],
          ['Signature dish', a.culture.cuisine[0], b.culture.cuisine[0]],
          ['Signature festival', a.culture.festivals[0]?.name, b.culture.festivals[0]?.name],
          ['Districts featured', a.districtCount, b.districtCount],
          ['Places catalogued', a.placeCount, b.placeCount],
          ['Best season', a.bestSeason, b.bestSeason],
        ]
      : [];

  function swap() {
    setPickedA(bId);
    setPickedB(aId);
  }

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Compare two states</h2>
        <p className="mt-1">
          Pick two states to see how they stack up before you commit an itinerary to one.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-[clamp(18px,4vw,48px)] py-5">
        <select
          value={aId}
          onChange={(e) => setPickedA(e.target.value)}
          aria-label="First state to compare"
          className="rounded-full border border-black/10 bg-sand px-4 py-2.5 text-[0.88rem] font-bold dark:border-white/10"
        >
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap the two states"
          className="rounded-full bg-sand px-3.5 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
        >
          ⇄ Swap
        </button>

        <select
          value={bId}
          onChange={(e) => setPickedB(e.target.value)}
          aria-label="Second state to compare"
          className="rounded-full border border-black/10 bg-sand px-4 py-2.5 text-[0.88rem] font-bold dark:border-white/10"
        >
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {!a || !b ? (
        <p className="px-6 py-10 text-center opacity-70">Pick two states above.</p>
      ) : (
        <div className="mx-[clamp(18px,4vw,48px)] mb-10 overflow-hidden rounded-[18px] border border-black/10 shadow-[0_2px_8px_rgba(31,58,95,0.08)] dark:border-white/10">
          <table className="w-full border-collapse bg-surface">
            <thead>
              <tr>
                <th className="bg-sand px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-charcoal">
                  Aspect
                </th>
                <th className="bg-sand px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-charcoal">
                  {a.name}
                </th>
                <th className="bg-sand px-[18px] py-3.5 text-left font-serif text-[1.05rem] text-indigo dark:text-charcoal">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, left, right]) => (
                <tr key={label} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-[18px] py-3.5 text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
                    {label}
                  </td>
                  <td className="px-[18px] py-3.5 text-[0.88rem]">{left}</td>
                  <td className="px-[18px] py-3.5 text-[0.88rem]">{right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
