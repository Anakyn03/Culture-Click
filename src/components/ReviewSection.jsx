import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Tabs, { TabPanel } from './Tabs'
import { deleteReview, deleteVisit, fetchPlaceReviews, fetchVisit, saveReview, saveVisit } from '../lib/personal'

const TAB_PREFIX = 'review-tab'

const SORTS = [
  { id: 'recent', label: 'Newest first' },
  { id: 'high', label: 'Highest rated' },
  { id: 'low', label: 'Lowest rated' },
]

/** Newest first by default; the two rating sorts break ties by recency. */
function sortReviews(reviews, sort) {
  const byDate = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  const copy = [...reviews]
  if (sort === 'high') return copy.sort((a, b) => b.rating - a.rating || byDate(a, b))
  if (sort === 'low') return copy.sort((a, b) => a.rating - b.rating || byDate(a, b))
  return copy.sort(byDate)
}

/**
 * Traveller reviews and private check-ins for one place.
 *
 * Three things a visitor can do here, so they are three tabs rather than one long column:
 * read what others found, write (or edit) their own public review, and keep a private,
 * dated check-in. Previously all three stacked up and the write form sat below the entire
 * review list, which is a long scroll from "I want to say something" to the box for saying it.
 *
 * A review is public and attributed; a check-in is private and dated. Both are the visitor's
 * own to edit or delete, and both load in one pass so the section never shows half of itself
 * ready. Signed-out visitors read every review — the list is public — and get one sentence
 * pointing at the sign-in page, carrying this page back with them as `?next=`.
 *
 * `tab`/`onTabChange` let the place page's mobile action bar open the write tab directly.
 * Left uncontrolled the component manages its own tab, so it stays usable on its own.
 */
export default function ReviewSection({ placeId, placeName, tab, onTabChange }) {
  const { user, isAuthEnabled } = useAuth()
  const location = useLocation()

  const [ownTab, setOwnTab] = useState('read')
  const activeTab = tab ?? ownTab
  const setTab = onTabChange ?? setOwnTab

  const [sort, setSort] = useState('recent')
  const [entry, setEntry] = useState({ key: null, status: 'loading', reviews: [], visit: null, error: null })
  const [refreshAt, setRefreshAt] = useState(0)
  const [draft, setDraft] = useState({ placeId: null, rating: 0, body: '' })
  const [visitDraft, setVisitDraft] = useState({ placeId: null, visitedOn: '', note: '' })
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState('')
  const [failure, setFailure] = useState('')

  // The key carries the user too: signing in or out must reload, because the check-in half of
  // the payload belongs to whoever is signed in.
  const key = `${placeId}|${user?.id ?? 'guest'}`

  useEffect(() => {
    let live = true
    Promise.all([fetchPlaceReviews(placeId), user ? fetchVisit(user.id, placeId) : Promise.resolve(null)])
      .then(([reviews, visit]) => {
        if (live) setEntry({ key, status: 'ready', reviews, visit, error: null })
      })
      .catch((error) => {
        if (live) setEntry({ key, status: 'error', reviews: [], visit: null, error: error.message })
      })
    return () => {
      live = false
    }
  }, [key, placeId, user, refreshAt])

  // While the loaded entry belongs to a different key, report loading rather than the previous
  // place's reviews.
  const view = entry.key === key ? entry : { status: 'loading', reviews: [], visit: null, error: null }

  const mine = user ? (view.reviews.find((r) => r.userId === user.id) ?? null) : null

  // The editor's fields are seeded from the saved review the first time it is shown, then the
  // visitor owns them — no effect copying one piece of state into another.
  const form = draft.placeId === placeId ? draft : { placeId, rating: mine?.rating ?? 0, body: mine?.body ?? '' }
  const setForm = (patch) => setDraft({ ...form, ...patch })

  const visitForm =
    visitDraft.placeId === placeId
      ? visitDraft
      : {
          placeId,
          visitedOn: view.visit?.visitedOn ?? new Date().toISOString().slice(0, 10),
          note: view.visit?.note ?? '',
        }
  const setVisitForm = (patch) => setVisitDraft({ ...visitForm, ...patch })

  const { average, distribution } = useMemo(() => {
    const counts = [1, 2, 3, 4, 5].map((star) => view.reviews.filter((r) => r.rating === star).length)
    const total = view.reviews.length
    return {
      average: total ? (view.reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : null,
      distribution: total ? counts : [],
    }
  }, [view.reviews])

  const ordered = useMemo(() => sortReviews(view.reviews, sort), [view.reviews, sort])

  async function submit(kind, action, message) {
    setBusy(kind)
    setNotice('')
    setFailure('')
    try {
      await action()
      setNotice(message)
      setRefreshAt((n) => n + 1)
    } catch (error) {
      setFailure(error.message)
    } finally {
      setBusy(null)
    }
  }

  const signInHref = `/login?next=${encodeURIComponent(`${location.pathname}#reviews`)}`

  const tabs = [
    { id: 'read', label: 'Reviews', count: view.reviews.length },
    { id: 'write', label: mine ? 'Your review' : 'Write a review' },
    { id: 'checkin', label: view.visit ? 'Your check-in' : 'Check-in' },
  ]

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-[76px] px-[clamp(18px,4vw,48px)] pb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="reviews-heading" className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">
          Traveller reviews
        </h2>
        {average && (
          <p className="text-[0.82rem] opacity-70">
            ★ {average} from {view.reviews.length} {view.reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        )}
      </div>

      {view.status === 'error' && (
        <p role="alert" className="mt-3 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-[0.82rem] text-danger">
          {view.error}
        </p>
      )}

      {view.status === 'loading' && (
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
        </div>
      )}

      {view.status === 'ready' && (
        <>
          <Tabs
            className="mt-3.5 pb-1"
            tabs={tabs}
            value={activeTab}
            onChange={setTab}
            idPrefix={TAB_PREFIX}
            label={`${placeName} reviews and check-ins`}
          />

          <div className="mt-4">
            <TabPanel id="read" idPrefix={TAB_PREFIX}>
              {view.reviews.length > 0 ? (
                <>
                  <div className="grid gap-5 rounded-2xl border border-black/10 bg-surface p-5 sm:grid-cols-[auto_1fr] sm:items-center dark:border-white/10">
                    <div className="text-center">
                      <div className="font-serif text-[2.6rem] leading-none text-indigo dark:text-charcoal">{average}</div>
                      <div className="mt-1 text-[0.9rem] text-saffron" aria-hidden="true">
                        {'★'.repeat(Math.round(Number(average)))}
                        <span className="opacity-25">{'★'.repeat(5 - Math.round(Number(average)))}</span>
                      </div>
                      <div className="mt-0.5 text-[0.74rem] opacity-60">{view.reviews.length} total</div>
                    </div>

                    <ul className="list-none space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = distribution[star - 1]
                        const share = Math.round((count / view.reviews.length) * 100)
                        return (
                          <li key={star} className="flex items-center gap-2.5 text-[0.76rem]">
                            <span className="w-8 shrink-0 opacity-70">{star}★</span>
                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                              <span className="block h-full rounded-full bg-gold" style={{ width: `${share}%` }} />
                            </span>
                            <span className="w-6 shrink-0 text-right tabular-nums opacity-60">{count}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="review-sort" className="text-[0.76rem] font-bold uppercase tracking-wide opacity-60">
                      Sort
                    </label>
                    <select
                      id="review-sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-full border border-black/10 bg-sand px-3.5 py-2 text-[0.8rem] font-bold dark:border-white/10"
                    >
                      {SORTS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ul className="mt-3 grid list-none gap-3">
                    {ordered.map((review) => (
                      <li
                        key={review.userId}
                        className="rounded-2xl border border-black/10 bg-surface p-4 shadow-[0_2px_8px_rgba(31,58,95,0.05)] dark:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar author={review.author} />
                          <div className="min-w-0">
                            <div className="truncate text-[0.86rem] font-bold text-indigo dark:text-charcoal">
                              {review.author.name}
                              {review.userId === user?.id && (
                                <span className="ml-2 text-[0.7rem] font-semibold text-teal">you</span>
                              )}
                            </div>
                            <div className="text-[0.74rem] text-saffron" aria-label={`${review.rating} out of 5`}>
                              {'★'.repeat(review.rating)}
                              <span className="opacity-30">{'★'.repeat(5 - review.rating)}</span>
                            </div>
                          </div>
                          <time className="ml-auto shrink-0 text-[0.72rem] opacity-50" dateTime={review.updatedAt}>
                            {new Date(review.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          </time>
                        </div>
                        {review.body && <p className="mt-3 whitespace-pre-line text-[0.86rem]">{review.body}</p>}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center dark:border-white/15">
                  <p className="font-serif text-[1.1rem] text-indigo dark:text-charcoal">No reviews yet</p>
                  <p className="mx-auto mt-1.5 max-w-[420px] text-[0.86rem]">
                    Be the first to describe {placeName} — what surprised you, what you would tell a friend
                    going next.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className="mt-4 rounded-full bg-gold px-5 py-2.5 text-[0.84rem] font-bold text-indigo"
                  >
                    Write the first review
                  </button>
                </div>
              )}
            </TabPanel>

            <TabPanel id="write" idPrefix={TAB_PREFIX}>
              {user ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    submit('review', () => saveReview(user.id, placeId, form.rating, form.body), 'Review saved.')
                  }}
                  className="rounded-2xl border border-black/10 bg-surface p-5 dark:border-white/10"
                >
                  <h3 className="text-[0.95rem] font-bold text-indigo dark:text-charcoal">
                    {mine ? 'Your review of ' + placeName : 'Write about ' + placeName}
                  </h3>
                  <p className="mt-0.5 text-[0.75rem] opacity-60">
                    Public, with your display name on it. {mine ? 'Editing replaces what you wrote before.' : 'You can edit it later.'}
                  </p>

                  <StarPicker value={form.rating} onChange={(rating) => setForm({ rating })} />

                  <label htmlFor="review-body" className="mt-4 block text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
                    Your review
                  </label>
                  <textarea
                    id="review-body"
                    value={form.body}
                    onChange={(e) => setForm({ body: e.target.value })}
                    rows={5}
                    maxLength={1200}
                    placeholder={`What stood out at ${placeName}?`}
                    className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-ivory px-3.5 py-2.5 text-[0.88rem] text-indigo outline-none focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal"
                  />
                  <div className="mt-1 text-right text-[0.72rem] opacity-50">{form.body.length}/1200</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={busy !== null || form.rating < 1}
                      className="rounded-full bg-indigo px-5 py-2.5 text-[0.84rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-indigo"
                    >
                      {busy === 'review' ? 'Saving…' : mine ? 'Update review' : 'Publish review'}
                    </button>
                    {mine && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => submit('delete-review', () => deleteReview(user.id, placeId), 'Review removed.')}
                        className="rounded-full bg-sand px-5 py-2.5 text-[0.84rem] font-bold text-charcoal/80 hover:text-danger disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <SignInPrompt href={signInHref} isAuthEnabled={isAuthEnabled}>
                  write a public review and have your name on it
                </SignInPrompt>
              )}
            </TabPanel>

            <TabPanel id="checkin" idPrefix={TAB_PREFIX}>
              {user ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    submit('visit', () => saveVisit(user.id, placeId, visitForm.visitedOn, visitForm.note), 'Check-in saved.')
                  }}
                  className="rounded-2xl border border-black/10 bg-surface p-5 dark:border-white/10"
                >
                  <h3 className="text-[0.95rem] font-bold text-indigo dark:text-charcoal">
                    {view.visit ? 'Your check-in' : `Been to ${placeName}?`}
                  </h3>
                  <p className="mt-0.5 text-[0.75rem] opacity-60">
                    Private to you — dates and notes, nothing public. This is what builds your own travel ledger.
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="visit-date" className="mb-1 block text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
                        When you went
                      </label>
                      <input
                        id="visit-date"
                        type="date"
                        value={visitForm.visitedOn}
                        onChange={(e) => setVisitForm({ visitedOn: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-ivory px-3.5 py-2.5 text-[0.88rem] text-indigo outline-none focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal"
                      />
                    </div>
                    <div>
                      <label htmlFor="visit-note" className="mb-1 block text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
                        Trip note
                      </label>
                      <input
                        id="visit-note"
                        value={visitForm.note}
                        onChange={(e) => setVisitForm({ note: e.target.value })}
                        maxLength={600}
                        placeholder="What you spent, what you ate, what to skip…"
                        className="w-full rounded-xl border border-black/10 bg-ivory px-3.5 py-2.5 text-[0.88rem] text-indigo outline-none focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={busy !== null}
                      className="rounded-full bg-forest px-5 py-2.5 text-[0.84rem] font-bold text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
                    >
                      {busy === 'visit' ? 'Saving…' : view.visit ? 'Update check-in' : 'Mark as visited'}
                    </button>
                    {view.visit && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => submit('delete-visit', () => deleteVisit(user.id, placeId), 'Check-in removed.')}
                        className="rounded-full bg-sand px-5 py-2.5 text-[0.84rem] font-bold text-charcoal/80 hover:text-danger disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <SignInPrompt href={signInHref} isAuthEnabled={isAuthEnabled}>
                  keep a private, dated record of the places you have seen
                </SignInPrompt>
              )}
            </TabPanel>
          </div>

          {(notice || failure) && (
            <p
              role={failure ? 'alert' : 'status'}
              className={`mt-4 rounded-xl border px-4 py-2.5 text-[0.8rem] ${
                failure ? 'border-danger/25 bg-danger/5 text-danger' : 'border-forest/25 bg-forest/5 text-forest'
              }`}
            >
              {failure || notice}
            </p>
          )}
        </>
      )}
    </section>
  )
}

/** One sentence and a way in, wherever the visitor hits a signed-in-only action. */
function SignInPrompt({ href, isAuthEnabled, children }) {
  return (
    <p className="rounded-2xl border border-dashed border-black/15 px-5 py-6 text-[0.88rem] dark:border-white/15">
      {isAuthEnabled ? (
        <>
          <Link to={href} className="font-bold text-teal hover:underline">
            Sign in
          </Link>{' '}
          to {children}.
        </>
      ) : (
        'Sign-in is not connected to a database yet, so reviews are read-only for now.'
      )}
    </p>
  )
}

function StarPicker({ value, onChange }) {
  return (
    <div className="mt-3 flex items-center gap-1.5" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          className={`text-[1.5rem] leading-none transition-transform hover:-translate-y-0.5 ${
            star <= value ? 'text-saffron' : 'text-charcoal/25'
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-1.5 text-[0.76rem] opacity-60">{value ? `${value} of 5` : 'Not rated'}</span>
    </div>
  )
}

function Avatar({ author }) {
  const [failed, setFailed] = useState(false)
  const initial = (author.name || '?').charAt(0).toUpperCase()

  if (!author.avatarUrl || failed) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo text-[0.8rem] font-bold text-white">
        {initial}
      </span>
    )
  }

  return (
    <img
      src={author.avatarUrl}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-9 w-9 shrink-0 rounded-full object-cover"
    />
  )
}
