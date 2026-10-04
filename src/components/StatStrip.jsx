/**
 * The strip of key figures that overlaps the bottom of a hero — area/districts/language on
 * a state page, rating/entry/hours/season on a place page. Shared so the two stay in step.
 *
 * @param {Array<[string, string]>} rows - [value, label] pairs
 */
export default function StatStrip({ rows = [] }) {
  if (!rows.length) return null;

  return (
    <div className="relative mx-[clamp(18px,4vw,48px)] -mt-[26px] flex flex-wrap overflow-hidden rounded-[18px] border border-black/10 bg-sand shadow-[0_2px_8px_rgba(31,58,95,0.1)] dark:border-white/10">
      {rows.map(([value, label], i) => (
        <div
          key={label}
          className={`flex-1 basis-[140px] px-5 py-[18px] ${
            i < rows.length - 1 ? 'border-r border-black/10 dark:border-white/10' : ''
          }`}
        >
          <b className="block font-serif text-[1.5rem] leading-tight text-indigo dark:text-charcoal">{value}</b>
          <span className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">{label}</span>
        </div>
      ))}
    </div>
  );
}
