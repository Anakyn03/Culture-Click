import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useAtlas } from '../context/AtlasContext';
import { deleteVisit, fetchMyReviews, fetchMyVisits } from '../lib/personal';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

/**
 * The signed-in visitor's account: their profile, and everything they have contributed.
 *
 * Reviews and check-ins are shown with the place they belong to and a link back into the atlas,
 * because a list of titles is not useful — the point of the page is to see the atlas through
 * your own footprint. Editing a review happens on the place page, where the place is in front
 * of you; this page is for reviewing and pruning what you have already written.
 */
export default function AccountPage() {
  const { user, profile, loading, isAuthEnabled, configIssue, updateProfile, signOut } = useAuth();
  const { states } = useAtlas();
  const { saved } = useApp();

  const [draft, setDraft] = useState(null);
  const [profileNotice, setProfileNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activity, setActivity] = useState({ status: 'loading', reviews: [], visits: [], error: null });
  const [refreshAt, setRefreshAt] = useState(0);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return undefined;

    let live = true;
    Promise.all([fetchMyReviews(userId), fetchMyVisits(userId)])
      .then(([reviews, visits]) => {
        if (live) setActivity({ status: 'ready', reviews, visits, error: null });
      })
      .catch((error) => {
        if (live) setActivity((prev) => ({ ...prev, status: 'error', error: error.message }));
      });
    return () => {
      live = false;
    };
  }, [userId, refreshAt]);

  if (!isAuthEnabled) {
    return (
      <div className="px-[clamp(18px,4vw,48px)] py-16 text-center">
        <h2 className="font-serif text-[1.4rem] text-indigo dark:text-charcoal">Accounts need a database</h2>
        <p className="mx-auto mt-2 max-w-[420px] text-[0.9rem]">{configIssue}</p>
      </div>
    );
  }

  if (loading) return <PageSkeleton rows={1} />;
  if (!user) return <Navigate to="/login?next=/account" replace />;

  // Derived until the visitor edits something, then theirs — no effect copying one into the other.
  const form =
    draft ?? {
      displayName: profile?.display_name ?? '',
      bio: profile?.bio ?? '',
      homeStateId: profile?.home_state_id ?? '',
    };

  const avatarUrl = user.user_metadata?.avatar_url ?? profile?.avatar_url ?? null;

  async function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    setProfileNotice(null);
    const { error } = await updateProfile({
      display_name: form.displayName.trim() || null,
      bio: form.bio.trim() || null,
      home_state_id: form.homeStateId || null,
    });
    setSaving(false);
    setProfileNotice({ ok: !error, message: error ?? 'Profile saved.' });
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-[clamp(18px,4vw,48px)] py-10">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" referrerPolicy="no-referrer" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo text-[1.2rem] font-bold text-white">
            {(form.displayName || user.email || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate font-serif text-[1.5rem] text-indigo dark:text-charcoal">
            {form.displayName || 'Your account'}
          </h2>
          <p className="truncate text-[0.84rem] opacity-60">{user.email}</p>
        </div>
      </div>

      {/*
        The journey, in the order it happens: save it, go there, write it up. Three loose
        counters would read as a scoreboard; three steps that each link on read as a route, and
        the arrows make the intended order obvious.
      */}
      <ol className="mt-6 grid list-none gap-2 sm:grid-cols-3">
        <JourneyStep
          to="/wishlist"
          step="1"
          label="Saved"
          value={saved.size}
          hint="Build a shortlist"
        />
        <JourneyStep
          to="#checkins"
          step="2"
          label="Visited"
          value={activity.visits.length}
          hint="Mark where you have been"
        />
        <JourneyStep
          to="#reviews"
          step="3"
          label="Reviewed"
          value={activity.reviews.length}
          hint="Tell the next traveller"
        />
      </ol>

      {profileNotice && (
        <p
          role={profileNotice.ok ? 'status' : 'alert'}
          className={`mt-4 rounded-xl border px-4 py-2.5 text-[0.82rem] ${
            profileNotice.ok ? 'border-forest/25 bg-forest/5 text-forest' : 'border-danger/25 bg-danger/5 text-danger'
          }`}
        >
          {profileNotice.message}
        </p>
      )}

      {activity.status === 'error' && <LoadError error={activity.error} onRetry={() => setRefreshAt((n) => n + 1)} title="Your activity could not load" />}

      <form onSubmit={handleProfileSave} className="mt-8 rounded-2xl border border-black/10 bg-surface p-5 dark:border-white/10">
        <h3 className="font-serif text-[1.15rem] text-indigo dark:text-charcoal">Profile</h3>
        <p className="mt-0.5 text-[0.78rem] opacity-60">
          Your display name appears on every review you write; nothing else here is public.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Display name" id="display-name">
            <input
              id="display-name"
              value={form.displayName}
              onChange={(e) => setDraft({ ...form, displayName: e.target.value })}
              maxLength={60}
              className={INPUT}
            />
          </Field>

          <Field label="Home state" id="home-state">
            <select
              id="home-state"
              value={form.homeStateId}
              onChange={(e) => setDraft({ ...form, homeStateId: e.target.value })}
              className={INPUT}
            >
              <option value="">Not set</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="About you" id="bio">
            <textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setDraft({ ...form, bio: e.target.value })}
              rows={3}
              maxLength={400}
              placeholder="What you travel for, what you keep coming back to…"
              className={`${INPUT} resize-y`}
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-indigo px-5 py-2.5 text-[0.84rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:opacity-60 dark:bg-gold dark:text-indigo"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full bg-sand px-5 py-2.5 text-[0.84rem] font-bold text-charcoal/80 hover:text-danger"
          >
            Sign out
          </button>
        </div>
      </form>

      <h3 id="reviews" className="mt-10 scroll-mt-[90px] font-serif text-[1.25rem] text-indigo dark:text-charcoal">
        Your reviews
      </h3>
      {activity.status === 'loading' ? (
        <div className="mt-3 h-24 animate-pulse rounded-2xl bg-sand/50" aria-hidden="true" />
      ) : activity.reviews.length === 0 ? (
        <p className="mt-2 text-[0.88rem]">
          Nothing yet — open any place and tell the next traveller what you found. The reviews tab
          on a place page is where you write yours.
        </p>
      ) : (
        <ul className="mt-3 grid list-none gap-3">
          {activity.reviews.map((review) => (
            <li key={review.placeId} className="rounded-2xl border border-black/10 bg-surface p-4 dark:border-white/10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link to={placeHref(review)} className="font-bold text-indigo hover:text-teal dark:text-charcoal">
                  {review.name}
                </Link>
                <span className="text-[0.76rem] opacity-60">
                  {[review.districtName, review.stateName].filter(Boolean).join(', ')}
                </span>
              </div>
              <div className="mt-1 text-[0.78rem] text-saffron" aria-label={`${review.rating} out of 5`}>
                {'★'.repeat(review.rating)}
                <span className="opacity-30">{'★'.repeat(5 - review.rating)}</span>
              </div>
              {review.body && <p className="mt-2 whitespace-pre-line text-[0.86rem]">{review.body}</p>}
              <Link to={placeHref(review)} className="mt-2 inline-block text-[0.78rem] font-bold text-teal hover:underline">
                Edit on the place page →
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h3 id="checkins" className="mt-10 scroll-mt-[90px] font-serif text-[1.25rem] text-indigo dark:text-charcoal">
        Your check-ins
      </h3>
      {activity.status === 'loading' ? (
        <div className="mt-3 h-20 animate-pulse rounded-2xl bg-sand/40" aria-hidden="true" />
      ) : activity.visits.length === 0 ? (
        <p className="mt-2 text-[0.88rem]">
          Mark a place as visited and keep your own dates and notes here — private, never public.
        </p>
      ) : (
        <ul className="mt-3 grid list-none gap-3">
          {activity.visits.map((visit) => (
            <li
              key={visit.placeId}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-black/10 bg-surface p-4 dark:border-white/10"
            >
              <Link to={placeHref(visit)} className="font-bold text-indigo hover:text-teal dark:text-charcoal">
                {visit.name}
              </Link>
              <span className="text-[0.76rem] opacity-60">
                {visit.visitedOn
                  ? new Date(`${visit.visitedOn}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'No date'}
              </span>
              {visit.note && <p className="w-full text-[0.86rem]">{visit.note}</p>}
              <button
                type="button"
                onClick={async () => {
                  await deleteVisit(userId, visit.placeId);
                  setRefreshAt((n) => n + 1);
                }}
                className="ml-auto text-[0.76rem] font-bold text-charcoal/60 hover:text-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const INPUT =
  'w-full rounded-xl border border-black/10 bg-ivory px-3.5 py-2.5 text-[0.88rem] text-indigo outline-none focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal';

/** One step of the visitor's own journey: a number, what it counts, and where it leads. */
function JourneyStep({ to, step, label, value, hint }) {
  return (
    <li>
      <a
        href={to}
        className="flex h-full items-center gap-3 rounded-2xl border border-black/10 bg-surface px-4 py-3.5 transition-colors hover:border-teal dark:border-white/10"
      >
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand font-serif text-[0.85rem] text-saffron"
        >
          {step}
        </span>
        <span className="min-w-0">
          <span className="flex items-baseline gap-1.5">
            <b className="font-serif text-[1.35rem] leading-none text-indigo dark:text-charcoal">{value}</b>
            <span className="text-[0.8rem] font-bold">{label}</span>
          </span>
          <span className="mt-0.5 block truncate text-[0.74rem] opacity-60">{hint}</span>
        </span>
        <span aria-hidden="true" className="ml-auto text-[0.9rem] opacity-40">
          →
        </span>
      </a>
    </li>
  );
}

/** A place is reached by its state, district and id — the ids travel with every list row. */
function placeHref({ stateId, districtId, placeId }) {
  return `/state/${stateId}/${districtId}/${placeId}`;
}

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
        {label}
      </label>
      {children}
    </div>
  );
}
