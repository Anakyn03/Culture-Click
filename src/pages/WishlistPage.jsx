import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useResource } from '../hooks/useResource';
import { entitiesKey, fetchEntities } from '../lib/atlasApi';
import { routeFor } from '../data/atlas';
import { photoOf } from '../lib/photo';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

/**
 * Everything the visitor has saved, resolved back into cards.
 *
 * Saved keys keep the `type:id` shape the database stores (`place:taj-mahal`,
 * `state:rajasthan`, `dist:jaipur`), so the same key works in localStorage and in the cloud
 * without a migration. Resolution is one `entities` call for the whole list rather than a
 * request per saved item.
 */
export default function WishlistPage() {
  const navigate = useNavigate();
  const { saved } = useApp();

  const keys = useMemo(() => [...saved].sort(), [saved]);
  const { status, data, error, reload } = useResource(
    keys.length ? entitiesKey(keys) : null,
    () => fetchEntities(keys)
  );

  if (saved.size === 0) {
    return (
      <EmptyState
        icon={
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mx-auto mb-3.5 text-saffron/70" aria-hidden="true">
            <path d="M20 21l-8-5-8 5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
        }
        title="Your wishlist is empty"
        action={
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo"
          >
            Start exploring the map
          </button>
        }
      >
        Tap the ♡ on any card, or ☆ Save on a state, district or place page, and it will live here
        for planning later.
      </EmptyState>
    );
  }

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="Your wishlist could not load" />;

  const items = data ?? [];

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Your wishlist</h2>
        <p className="mt-1">
          {saved.size} saved for your next trip.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Nothing to show yet">
          This list is kept in this browser until you sign in, when it syncs to your account.
        </EmptyState>
      ) : (
        <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
          {items.map((item) => (
            <Card
              key={item.key}
              to={routeFor(item)}
              photo={photoOf(item)}
              tag={item.type}
              title={item.name}
              blurb={`${(item.blurb ?? '').slice(0, 90)}…`}
              footLeft={item.kind === 'state' ? `${item.districtCount} districts` : `${item.districtName}, ${item.stateName}`}
              footRight={item.rating ? `★ ${item.rating}` : 'Saved →'}
              saveKey={item.key}
            />
          ))}
        </div>
      )}
    </div>
  );
}
