import { useApp } from '../context/AppContext'
import { photoOf } from '../lib/photo'
import Card from './Card'

/**
 * "Pick up where you left off" — the places this browser actually opened, newest first.
 *
 * Renders nothing at all for a first-time visitor, which is the point: the home page stays
 * exactly as it was until there is a history worth showing. The list never leaves the device
 * (see AppProvider), so it works signed out and costs no request.
 */
export default function ContinueJourney() {
  const { recentPlaces, forgetPlaces } = useApp()

  if (recentPlaces.length === 0) return null

  return (
    <section aria-labelledby="continue-heading" className="pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-[clamp(18px,4vw,48px)] pb-1.5">
        <div>
          <h2 id="continue-heading" className="font-serif text-[clamp(1.3rem,2.2vw,1.7rem)] text-indigo dark:text-charcoal">
            Pick up where you left off
          </h2>
          <p className="text-[0.82rem] opacity-65">Kept in this browser only — saved places live in your wishlist.</p>
        </div>
        <button
          type="button"
          onClick={forgetPlaces}
          className="rounded-full bg-sand px-3.5 py-1.5 text-[0.76rem] font-bold text-charcoal/70 transition-colors hover:text-danger"
        >
          Clear
        </button>
      </div>

      <div
        className="thin-scroll flex gap-4 overflow-x-auto px-[clamp(18px,4vw,48px)] pb-2 pt-4"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {recentPlaces.map((place) => (
          <div key={place.id} className="w-[260px] flex-none" style={{ scrollSnapAlign: 'start' }}>
            <Card
              to={`/state/${place.stateId}/${place.districtId}/${place.id}`}
              photo={photoOf(place)}
              tag={place.type}
              title={place.name}
              blurb={place.blurb ? `${place.blurb.slice(0, 76)}…` : `${place.districtName ?? ''}${place.stateName ? `, ${place.stateName}` : ''}`}
              footLeft={place.stateName ?? 'Revisit'}
              footRight="Open →"
              saveKey={`place:${place.id}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
