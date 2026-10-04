/**
 * A responsive grid of numbered items — the pattern used for "local food to try",
 * "experiences here" and the district activity list. Previously copy-pasted four times,
 * each with its own inline gridTemplateColumns.
 */
export default function NumberedGrid({ items = [], className = '' }) {
  if (!items.length) return null;

  return (
    <div
      className={`grid gap-3 ${className}`}
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
    >
      {items.map((item, i) => (
        <div
          key={item}
          className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-surface p-4 text-[0.88rem] font-bold text-indigo shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10 dark:text-charcoal"
        >
          <span aria-hidden="true" className="font-serif text-[1.1rem] text-saffron">
            {String(i + 1).padStart(2, '0')}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}
