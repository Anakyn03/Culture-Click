import { Link, useLocation } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';
import { useResource } from '../hooks/useResource';
import { fetchPlace, fetchState, placeKey, stateKey } from '../lib/atlasApi';

const STATIC_LABELS = {
  wishlist: 'Wishlist',
  compare: 'Compare States',
  timeline: 'Heritage Timeline',
  festivals: 'Festival Calendar',
  login: 'Sign in',
  account: 'Account',
};

/**
 * Breadcrumbs for the current route.
 *
 * This component sits outside `<Routes>`, so `useParams()` returns an empty object here —
 * which is why the trail used to appear on the static pages and nowhere else. The route
 * segments are read straight from the pathname instead.
 *
 * Names come from the same fetches the page itself makes, through the same cache, so a deep
 * link resolves its real breadcrumb (`… › Jaipur › Hawa Mahal`) without a second request:
 * the in-flight de-duplication in lib/atlasApi.js means whichever component asks first, the
 * other one shares it.
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { states } = useAtlas();

  const segments = pathname.split('/').filter(Boolean);
  const isAtlasRoute = segments[0] === 'state';
  const stateId = isAtlasRoute ? segments[1] : null;
  const districtId = isAtlasRoute ? segments[2] : null;
  const placeId = isAtlasRoute ? segments[3] : null;

  const { data: stateAtlas } = useResource(
    stateId ? stateKey(stateId) : null,
    () => fetchState(stateId)
  );
  const { data: detail } = useResource(
    placeId ? placeKey(placeId) : null,
    () => fetchPlace(placeId)
  );

  const crumbs = [{ label: 'India', to: '/' }];
  const staticLabel = STATIC_LABELS[segments[0]];

  if (staticLabel) {
    crumbs.push({ label: staticLabel });
  } else if (isAtlasRoute && stateId) {
    const stateName = states.find((s) => s.id === stateId)?.name ?? stateAtlas?.state?.name;
    if (stateName) {
      crumbs.push({ label: stateName, to: `/state/${stateId}` });

      const districtName = stateAtlas?.districts?.find((d) => d.id === districtId)?.name;
      if (districtId && districtName) {
        crumbs.push({ label: districtName, to: `/state/${stateId}/${districtId}` });

        if (placeId && detail?.place?.name) crumbs.push({ label: detail.place.name });
      }
    }
  }

  if (crumbs.length === 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 px-[clamp(18px,4vw,48px)] pt-3.5 text-[0.82rem] text-charcoal/70"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-40">
                ›
              </span>
            )}
            {crumb.to && !isLast ? (
              <Link to={crumb.to} className="font-bold text-teal hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className={isLast ? 'font-bold text-indigo dark:text-charcoal' : ''}
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
