import PlaceImage from './PlaceImage';

/**
 * The full-bleed image banner at the top of the state, district and place pages.
 *
 * Those three pages carried near-identical copies of this markup, which drifted apart as
 * each one was edited. It lives here once, and every hero loads its image eagerly because
 * it is above the fold.
 *
 * The entity's own photo fields are passed straight through, so the hero never has to be told
 * the entity's name, type or state to search for an image with.
 */
export default function PageHero({
  photo,
  imageName,
  eyebrow,
  title,
  blurb,
  chips = [],
  actions = null,
  minHeight = 320,
}) {
  return (
    <div
      className="relative mx-[clamp(18px,4vw,48px)] mt-[18px] overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(31,58,95,0.16)]"
      style={{ minHeight }}
    >
      <PlaceImage
        photo={photo}
        name={imageName}
        size="hero"
        eager
        showCredit
        className="absolute inset-0 h-full w-full"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[110px]"
        style={{ background: 'linear-gradient(0deg, rgba(15,20,28,.84), rgba(15,20,28,0))' }}
      />

      <div className="relative w-full px-[clamp(18px,4vw,44px)] py-[34px] text-white">
        {eyebrow && (
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold">{eyebrow}</div>
        )}
        <h1 className="my-1.5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] text-white">{title}</h1>
        {blurb && <p className="max-w-[560px] text-white/90">{blurb}</p>}

        {chips.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {actions && <div className="mt-4 flex flex-wrap gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
