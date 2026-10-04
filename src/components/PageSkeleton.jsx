import EmptyState from './EmptyState';

/**
 * Loading and failure presentation for anything that comes from the database.
 *
 * Both live here because they are two halves of one state — a page is either still loading or
 * it has failed — and every data-driven page needs exactly this pair. The failure case is not
 * optional: with content in Postgres, an unreachable database used to mean an empty page with
 * no explanation.
 */

/** Placeholder in the shape of the page that is coming, so the layout doesn't jump. */
export function PageSkeleton({ rows = 3 }) {
  return (
    <div className="px-[clamp(18px,4vw,48px)] pt-[18px]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton h-[320px] w-full rounded-[24px]" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows * 2 }, (_, i) => (
          <div key={i} className="skeleton h-[280px] rounded-[20px]" />
        ))}
      </div>
    </div>
  );
}

/** A failed request, with the reason and a way out. */
export function LoadError({ error, onRetry, title = 'This page could not load' }) {
  return (
    <EmptyState
      title={title}
      action={
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo"
          >
            Try again
          </button>
        )
      }
    >
      {error}
    </EmptyState>
  );
}

export default PageSkeleton;
