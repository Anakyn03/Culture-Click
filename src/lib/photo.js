/**
 * Image resolution — the single place that knows how a photograph is sized.
 *
 * The photo itself travels with its row: every state, district and place in the database
 * carries `photoUrl` (a Wikimedia Commons thumbnail), `photoTitle` (the article whose lead
 * image it is) and, where Wikipedia's article offered more, `photoSet` — a handful of
 * verified photographs rotated on a five-day clock. Resolution is therefore synchronous
 * and needs no request, no key and no loading state.
 *
 * Width is the one real constraint. Wikimedia serves thumbnails only at a fixed set of standard
 * steps (mediawiki.org/wiki/Common_thumbnail_sizes) and answers any other width with a 400, so
 * every width below is drawn from that set, and nothing is scaled up past the stored width.
 */

/** Wikimedia's standard thumbnail steps. Arbitrary widths are rejected when hotlinked. */
const STANDARD_STEPS = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840];

/** The width to actually render at, per context. Wikimedia scales server-side, so this is free. */
const RENDER_WIDTH = { thumbnail: 250, card: 960, hero: 1920 };

/**
 * The width in a thumbnail's last path segment, optionally after a render option
 * (`.../800px-File.jpg` or `.../lossy-page1-800px-File.TIF.jpg`) — reading the segment rather
 * than the whole URL handles both shapes, and `\d+px-` also anchors the replace below.
 */
const WIDTH_IN_SEGMENT = /(\d+)px-/;

/**
 * Split a thumbnail URL into the parts a width rewrite needs, or `null` when it carries no
 * width at all (a file page rather than a thumbnail, for instance).
 */
function readThumb(url) {
  const cut = url.lastIndexOf('/') + 1;
  const segment = url.slice(cut);
  const match = WIDTH_IN_SEGMENT.exec(segment);
  return match ? { head: url.slice(0, cut), segment, width: Number(match[1]) } : null;
}

/**
 * Point a thumbnail at the largest standard step that fits `width`. `width` is always one of
 * the steps above (every render size and every `srcSet` candidate is), so this never rounds.
 */
function atWidth(thumb, width) {
  const step = STANDARD_STEPS.filter((s) => s <= width).pop();
  return thumb.head + thumb.segment.replace(WIDTH_IN_SEGMENT, `${step}px-`);
}

/**
 * The rotation clock. A five-day bucket — the same number for every visitor and every
 * photo on the site, so the imagery changes together, like an exhibition re-hung weekly
 * but slower. `Date.now()` keeps this a pure read; no timers, no re-renders.
 */
const BUCKET_DAYS = 5;

export function photoBucket(now = Date.now()) {
  return Math.floor(now / 86_400_000 / BUCKET_DAYS);
}

/**
 * The photo fields off an API entity, in the shape the renderer wants. Entities carry
 * `photoUrl` / `photoTitle` (the lead photograph) and may carry `photoSet` — up to three
 * verified photographs collected at build time, rotated by the five-day bucket above.
 * A set with one entry, and entities without a set, fall through to the lead photo.
 */
export function photoOf(entity) {
  const set = Array.isArray(entity?.photoSet) ? entity.photoSet.filter(Boolean) : [];
  const url = set.length > 1 ? set[photoBucket() % set.length] : entity?.photoUrl;
  return url ? { url, title: entity.photoTitle } : null;
}

/**
 * Resolve one entity's photograph, or `null` when it has none — a missing photo is rendered as
 * a themed gradient rather than a guess at something similar.
 *
 * @param {{ url?: string, title?: string } | null | undefined} photo  the entity's photo fields
 * @param {'thumbnail'|'card'|'hero'} [size]
 * @returns {{ url: string, srcSet?: string, credit: string } | null}
 */
export function resolvePhoto(photo, size = 'card') {
  if (!photo?.url) return null;

  const thumb = readThumb(photo.url);
  const target = RENDER_WIDTH[size] ?? RENDER_WIDTH.card;

  // Candidate widths for `srcSet`: the steps between the smallest useful thumbnail and what
  // the file actually holds. Fewer than two candidates is not worth an attribute.
  const candidates =
    thumb && STANDARD_STEPS.filter((w) => w >= RENDER_WIDTH.thumbnail && w <= thumb.width);

  return {
    url: thumb && thumb.width > target ? atWidth(thumb, target) : photo.url,
    srcSet:
      candidates?.length > 1
        ? candidates.map((w) => `${atWidth(thumb, w)} ${w}w`).join(', ')
        : undefined,
    // Attribution names the article whose lead image this is — the subject of the photo.
    credit: photo.title ? `Wikimedia Commons · ${photo.title}` : 'Wikimedia Commons',
  };
}
