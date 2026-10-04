/**
 * The "nothing here yet" block — the wishlist when it's empty, a district still being
 * catalogued. Replaces two hand-rolled versions that had drifted apart in padding and copy.
 */
export default function EmptyState({ icon, title, children, action }) {
  return (
    <div className="px-6 py-24 text-center opacity-80">
      {icon}
      <h3 className="font-serif text-[1.2rem] text-indigo dark:text-charcoal">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-[360px]">{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
