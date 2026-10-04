import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { deleteVisit, fetchVisit, saveVisit } from '../lib/personal'

/** Today, in the shape a date input and Postgres both want. */
const today = () => new Date().toISOString().slice(0, 10)

/**
 * The thumb-reachable action bar on a place page, shown on narrow screens only.
 *
 * On a phone the three things a visitor actually wants to do — keep it, admit they went, and
 * write it up — were spread across a hero at the top of the page and a review section at the
 * very bottom, which is a lot of scrolling between a decision and the button for it. The bar
 * puts all three within reach of the thumb at all times; on wide screens the hero actions
 * already sit in view, so it hides itself entirely.
 *
 * The middle button is a one-tap check-in rather than a link to a form: "I have been here" is
 * a single fact, and the date and note can be filled in later on the Check-in tab if the
 * visitor cares. Tapping it again undoes it, so the tap is never destructive.
 */
export default function PlaceActionBar({ placeId, placeName, onWriteReview }) {
  const { user, isAuthEnabled } = useAuth()
  const { saved, toggleSaved } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const saveKey = `place:${placeId}`
  const isSaved = saved.has(saveKey)

  // Keyed by place *and* user: signing in changes whether a check-in exists, and moving to
  // another place must not briefly report the previous place's state.
  const key = `${placeId}|${user?.id ?? 'guest'}`
  const [entry, setEntry] = useState({ key: null, visitedOn: null, busy: false })
  const ready = entry.key === key
  const visitedOn = ready ? entry.visitedOn : null

  useEffect(() => {
    // Signed out there is nothing to fetch: the key above already stops reporting the previous
    // owner's check-in, so no state has to be reset from inside an effect.
    if (!user) return undefined

    let live = true
    fetchVisit(user.id, placeId)
      .then((visit) => {
        if (live) setEntry({ key, visitedOn: visit?.visitedOn ?? null, busy: false })
      })
      .catch(() => {
        if (live) setEntry({ key, visitedOn: null, busy: false })
      })

    return () => {
      live = false
    }
  }, [key, placeId, user])

  async function toggleVisited() {
    if (!isAuthEnabled) return
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`)
      return
    }
    if (!ready || entry.busy) return

    setEntry((prev) => ({ ...prev, busy: true }))
    try {
      if (visitedOn) {
        await deleteVisit(user.id, placeId)
        setEntry({ key, visitedOn: null, busy: false })
      } else {
        await saveVisit(user.id, placeId, today(), '')
        setEntry({ key, visitedOn: today(), busy: false })
      }
    } catch {
      setEntry((prev) => ({ ...prev, busy: false }))
    }
  }

  function writeReview() {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`)
      return
    }
    onWriteReview?.()
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-surface/95 pb-[max(0.625rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-2.5 backdrop-blur-md lg:hidden dark:border-white/10">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => toggleSaved(saveKey)}
          aria-pressed={isSaved}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[0.7rem] font-bold transition-colors ${
            isSaved ? 'bg-gold text-indigo' : 'bg-sand text-charcoal/80'
          }`}
        >
          <span aria-hidden="true" className="text-[1.05rem] leading-none">
            {isSaved ? '★' : '☆'}
          </span>
          {isSaved ? 'Saved' : 'Save'}
        </button>

        <button
          type="button"
          onClick={toggleVisited}
          aria-pressed={Boolean(visitedOn)}
          title={isAuthEnabled ? undefined : 'Sign-in is not connected yet'}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[0.7rem] font-bold transition-colors ${
            visitedOn ? 'bg-forest text-white' : 'bg-sand text-charcoal/80'
          }`}
        >
          <span aria-hidden="true" className="text-[1.05rem] leading-none">
            {visitedOn ? '✓' : '○'}
          </span>
          {visitedOn ? 'Visited' : 'Been here'}
        </button>

        <button
          type="button"
          onClick={writeReview}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-xl bg-indigo px-2 py-2 text-[0.7rem] font-bold text-white transition-colors dark:bg-gold dark:text-indigo"
        >
          <span aria-hidden="true" className="text-[1.05rem] leading-none">
            ★
          </span>
          Review
        </button>
      </div>

      <span className="sr-only">{placeName}</span>
    </div>
  )
}
