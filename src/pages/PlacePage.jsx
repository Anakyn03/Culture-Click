import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useResource } from '../hooks/useResource';
import { fetchPlace, placeKey } from '../lib/atlasApi';
import { formatYear, wikipediaUrl } from '../data/atlas';
import { photoOf } from '../lib/photo';
import PageHero from '../components/PageHero';
import StatStrip from '../components/StatStrip';
import NumberedGrid from '../components/NumberedGrid';
import Tabs, { TabPanel } from '../components/Tabs';
import ReviewSection from '../components/ReviewSection';
import PlaceActionBar from '../components/PlaceActionBar';
import WeatherWidget from '../components/WeatherWidget';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import PageSkeleton, { LoadError } from '../components/PageSkeleton';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History & Architecture' },
  { id: 'food', label: 'Food & Experiences' },
  { id: 'travel', label: 'Travel Info' },
  { id: 'gallery', label: 'Gallery' },
];

/** Copy helper — the share button used to claim success without copying anything. */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export default function PlacePage() {
  const { placeId } = useParams();
  const { saved, toggleSaved, rememberPlace } = useApp();

  const { status, data, error, reload } = useResource(placeKey(placeId), () => fetchPlace(placeId));

  // Both pieces of local UI state are keyed by the place they belong to, so navigating to a
  // different place resets the tab and the share label during render — no reset effect, and
  // no frame where the new place briefly shows the previous one's tab.
  const [tabState, setTabState] = useState({ placeId: null, tab: 'overview' });
  const [reviewTab, setReviewTab] = useState({ placeId: null, tab: 'read' });
  const [shareState, setShareState] = useState({ placeId: null, label: '↗ Share' });

  // The trail behind the visitor: the place is remembered as soon as its detail arrives, so the
  // home page can offer it back. The owner ids come along because a place URL is built from
  // state, district and place — never from the place alone.
  useEffect(() => {
    const place = data?.place;
    if (!place || !data.state || !data.district) return;
    rememberPlace({
      id: place.id,
      name: place.name,
      type: place.type,
      blurb: place.blurb,
      photoUrl: place.photoUrl,
      photoTitle: place.photoTitle,
      stateId: data.state.id,
      districtId: data.district.id,
      stateName: data.state.name,
      districtName: data.district.name,
    });
  }, [data, rememberPlace]);

  const activeTab = tabState.placeId === placeId ? tabState.tab : 'overview';
  const setActiveTab = (tab) => setTabState({ placeId, tab });

  const shareLabel = shareState.placeId === placeId ? shareState.label : '↗ Share';
  const setShareLabel = (label) => setShareState({ placeId, label });

  if (status === 'loading') return <PageSkeleton rows={2} />;
  if (status === 'error') return <LoadError error={error} onRetry={reload} title="This place could not load" />;
  if (!data?.place) return <Navigate to="/" replace />;

  const p = data.place;
  const s = data.state;
  const d = data.district;
  const saveKey = `place:${p.id}`;

  /** Prefer the article the content was written from; fall back to a name search. */
  const referenceUrl = p.sourceUrl || wikipediaUrl(p.name);

  async function handleShare() {
    const ok = await copyToClipboard(window.location.href);
    setShareLabel(ok ? '✓ Link copied' : '↗ Copy failed');
    setTimeout(() => setShareLabel('↗ Share'), 1800);
  }

  return (
    <div>
      <PageHero
        photo={photoOf(p)}
        imageName={p.name}
        eyebrow={`${p.type} · ${d.name}, ${s.name}`}
        title={p.name}
        blurb={p.blurb}
        chips={[`📷 ${p.bestPhoto}`, `💰 ${p.budget}`, `🥾 ${p.difficulty}`]}
        minHeight={380}
        actions={
          <>
            <button
              type="button"
              onClick={() => toggleSaved(saveKey)}
              className="rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo transition-transform hover:-translate-y-0.5"
            >
              {saved.has(saveKey) ? '★ Saved' : '☆ Save place'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full border border-white/50 bg-white/15 px-5 py-2.5 text-[0.86rem] font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              {shareLabel}
            </button>
          </>
        }
      />

      <StatStrip
        rows={[
          [`★ ${p.rating}`, 'Traveler rating'],
          [p.entry, 'Entry'],
          [p.open, 'Hours'],
          [p.bestSeason, 'Best season'],
        ]}
      />

      <Tabs
        className="px-[clamp(18px,4vw,48px)] pb-4 pt-4"
        tabs={TABS}
        value={activeTab}
        onChange={setActiveTab}
        idPrefix="tab"
        label={`${p.name} sections`}
      />

      {activeTab === 'overview' && (
        <TabPanel id="overview" idPrefix="tab">
          <div className="mx-[clamp(18px,4vw,48px)] mb-8">
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">At a glance</h2>
            <div className="mt-3 grid gap-0 overflow-hidden rounded-2xl border border-black/10 bg-surface dark:border-white/10">
              {[
                ['Category', p.type],
                ['Entry', p.entry],
                ['Open hours', p.open],
                ['Best season', p.bestSeason],
                ['Budget', p.budget],
                ['Nearest railway', p.travel.railway],
                ['Nearest airport', p.travel.airport],
              ].map(([key, value], i, arr) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 text-[0.88rem] ${
                    i < arr.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''
                  } ${i % 2 === 0 ? 'bg-sand/40' : ''}`}
                >
                  <span className="text-charcoal/60">{key}</span>
                  <b className="text-right text-indigo dark:text-charcoal">{value}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="px-[clamp(18px,4vw,48px)] pb-1.5">
            <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Stories &amp; legends</h2>
            <div className="mt-3 rounded-2xl border border-black/10 bg-surface p-[18px] shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10">
              <ul className="list-none space-y-3">
                {[p.history.split('.')[0], p.architecture.split('.')[0], p.facts[0]]
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i} className="flex gap-2.5 text-[0.88rem]">
                      <span aria-hidden="true" className="flex-none text-saffron">
                        ✦
                      </span>
                      {line}.
                    </li>
                  ))}
              </ul>
              <a
                href={referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sand px-4 py-2 text-[0.78rem] font-bold text-teal transition-colors hover:bg-teal hover:text-white"
              >
                Read more on Wikipedia ↗
              </a>
            </div>
          </div>

          {data.related.length > 0 && (
            <>
              <SectionHeading title="More like this across India" />
              <div
                className="thin-scroll flex gap-4 overflow-x-auto px-[clamp(18px,4vw,48px)] pb-4"
                style={{ scrollSnapType: 'x proximity' }}
              >
                {data.related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/state/${rel.stateId}/${rel.districtId}/${rel.id}`}
                    className="w-[200px] flex-none rounded-2xl border border-black/10 bg-surface p-4 shadow-[0_2px_8px_rgba(31,58,95,0.06)] transition-colors hover:border-teal dark:border-white/10"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <span className="block text-[0.68rem] font-bold uppercase tracking-wide text-saffron">
                      {rel.stateName}
                    </span>
                    <h4 className="mt-1 font-serif text-[0.95rem] text-indigo dark:text-charcoal">{rel.name}</h4>
                    <p className="mt-1 line-clamp-2 text-[0.78rem] opacity-70">{rel.blurb}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          <SectionHeading title="Hidden gems nearby" />
          <div
            className="thin-scroll flex gap-4 overflow-x-auto px-[clamp(18px,4vw,48px)] pb-8 pt-4"
            style={{ scrollSnapType: 'x proximity' }}
          >
            {p.hiddenGems.map((gem, i) => (
              <div
                key={i}
                className="w-[220px] flex-none rounded-2xl border border-black/10 bg-surface p-[18px] shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10"
                style={{ scrollSnapAlign: 'start' }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-2.5 text-saffron" aria-hidden="true">
                  <path d="M12 2 L14.5 9 L22 9.5 L16 14.3 L18 22 L12 17.8 L6 22 L8 14.3 L2 9.5 L9.5 9 Z" />
                </svg>
                <h4 className="mb-1 font-serif text-[1rem] text-indigo dark:text-charcoal">{gem.split(',')[0]}</h4>
                <p className="text-[0.82rem]">{gem}</p>
              </div>
            ))}
          </div>
        </TabPanel>
      )}

      {activeTab === 'history' && (
        <TabPanel id="history" idPrefix="tab" className="px-[clamp(18px,4vw,48px)] pb-10">
          <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">The story</h2>
          <p className="mt-2.5">{p.history}</p>

          <h2 className="mt-6 font-serif text-[1.5rem] text-indigo dark:text-charcoal">Architecture &amp; craft</h2>
          <p className="mt-2.5">{p.architecture}</p>

          <h2 className="mt-6 font-serif text-[1.5rem] text-indigo dark:text-charcoal">Historical timeline</h2>
          <div className="ml-2 mt-3.5 border-l-2 border-black/10 pl-[22px] dark:border-white/10">
            {p.timeline.map((t, i) => (
              <div key={i} className="relative pb-[22px]">
                <span className="absolute -left-[28px] top-1 h-[11px] w-[11px] rounded-full border-2 border-ivory bg-saffron dark:border-[#12181F]" />
                <b className="block font-serif text-[0.95rem] text-teal">{formatYear(t.y)}</b>
                {t.label}
              </div>
            ))}
          </div>
        </TabPanel>
      )}

      {activeTab === 'food' && (
        <TabPanel id="food" idPrefix="tab">
          <SectionHeading title="Local food to try" compact />
          <NumberedGrid items={p.food} className="px-[clamp(18px,4vw,48px)] pb-3" />
          <SectionHeading title="Experiences here" compact />
          <NumberedGrid items={p.experiences} className="px-[clamp(18px,4vw,48px)] pb-10" />
        </TabPanel>
      )}

      {activeTab === 'travel' && (
        <TabPanel id="travel" idPrefix="tab" className="px-[clamp(18px,4vw,48px)] pb-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <WeatherWidget lat={p.lat} lng={p.lng} placeName={p.name} />
              <GoogleMapEmbed lat={p.lat} lng={p.lng} placeName={p.name} />
            </div>
            <div>
              <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Getting there</h2>
              <ul className="list-none">
                {[
                  ['Nearest railway', p.travel.railway],
                  ['Nearest airport', p.travel.airport],
                  ['Parking', p.travel.parking],
                ].map(([key, value]) => (
                  <li key={key} className="flex justify-between gap-3 border-b border-black/10 py-2.5 text-[0.88rem] dark:border-white/10">
                    <span>{key}</span>
                    <b className="text-right text-indigo dark:text-charcoal">{value}</b>
                  </li>
                ))}
              </ul>
              <p className="mt-3 italic">💡 {p.travel.tip}</p>
            </div>
          </div>
        </TabPanel>
      )}

      {activeTab === 'gallery' && (
        <TabPanel id="gallery" idPrefix="tab" className="px-[clamp(18px,4vw,48px)] pb-10">
          <div className="flex items-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-black/15 px-[18px] py-4 text-[0.82rem] opacity-70 dark:border-white/15">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            A full photo gallery is being curated for each place. Every image across the atlas is
            a Wikimedia Commons lead image, credited in its caption.
          </div>
        </TabPanel>
      )}

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />

      <ReviewSection
        placeId={p.id}
        placeName={p.name}
        tab={reviewTab.placeId === placeId ? reviewTab.tab : 'read'}
        onTabChange={(tab) => setReviewTab({ placeId, tab })}
      />

      <div className="mx-[clamp(18px,4vw,48px)] my-8 h-px bg-black/10 dark:bg-white/10" />
      <div className="px-[clamp(18px,4vw,48px)] pb-10">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Keep going</h2>

        {/*
          One obvious next step. A page that ends in a cloud of equal-weight links asks the
          visitor to do the work of choosing; the nearest sibling is almost always the right
          answer, so it gets a card of its own and the rest stay as chips beneath it.
        */}
        {data.siblings[0] && (
          <Link
            to={`/state/${s.id}/${d.id}/${data.siblings[0].id}`}
            className="group mt-4 flex items-center justify-between gap-4 rounded-2xl bg-indigo p-5 text-white shadow-[0_20px_50px_rgba(31,58,95,0.18)] transition-transform hover:-translate-y-0.5 dark:bg-sand dark:text-charcoal"
          >
            <span className="min-w-0">
              <span className="block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold">
                Next stop in {d.name}
              </span>
              <span className="mt-1 block font-serif text-[1.3rem]">{data.siblings[0].name}</span>
              <span className="mt-1 line-clamp-2 block text-[0.84rem] opacity-80">{data.siblings[0].blurb}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 text-[1.5rem] transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}

        <h3 className="mt-6 font-serif text-[1.05rem] text-indigo dark:text-charcoal">Nearby &amp; related</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to={`/state/${s.id}/${d.id}`}
            className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
          >
            ← Back to {d.name}
          </Link>
          <Link
            to={`/state/${s.id}`}
            className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
          >
            All of {s.name}
          </Link>
          {data.siblings.map((x) => (
            <Link
              key={x.id}
              to={`/state/${s.id}/${d.id}/${x.id}`}
              className="rounded-full bg-sand px-4 py-2.5 text-[0.82rem] font-bold transition-colors hover:bg-teal hover:text-white"
            >
              {x.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Clears the fixed action bar on narrow screens so the last row is never covered. */}
      <div className="h-[76px] lg:hidden" aria-hidden="true" />

      <PlaceActionBar
        placeId={p.id}
        placeName={p.name}
        onWriteReview={() => {
          setReviewTab({ placeId, tab: 'write' });
          document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}

function SectionHeading({ title, compact = false }) {
  return (
    <div className={`px-[clamp(18px,4vw,48px)] pb-1.5 ${compact ? '' : 'pt-8'}`}>
      <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">{title}</h2>
    </div>
  );
}
