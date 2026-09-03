import { useNavigate } from 'react-router-dom';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';

function allPlaces() {
  const out = [];
  DATA.states.forEach((s) => s.districts.forEach((d) => d.places.forEach((p) => out.push({ s, d, p }))));
  return out;
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const { saved } = useApp();
  const places = allPlaces();

  if (saved.size === 0) {
    return (
      <div className="px-6 py-24 text-center opacity-80">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mx-auto mb-3.5 text-saffron/70"><path d="M20 21l-8-5-8 5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" /></svg>
        <h3 className="font-serif text-[1.2rem] text-indigo dark:text-charcoal">Your wishlist is empty</h3>
        <p className="mx-auto mt-1.5 max-w-[360px]">Tap the ♡ on any card, or ☆ Save on a state/district/place page, and it'll live here for planning later.</p>
        <button onClick={() => navigate('/')} className="mt-4 rounded-full bg-gold px-5 py-2.5 text-[0.86rem] font-bold text-indigo">Start exploring the map</button>
      </div>
    );
  }

  const cards = [...saved].map((key) => {
    const [type, id] = key.split(':');
    if (type === 'state') {
      const s = DATA.states.find((x) => x.id === id);
      if (!s) return null;
      return <Card key={key} to={`/state/${s.id}`} media={s.media} tag={s.region} title={s.name} blurb={s.tagline} footLeft={`${s.districts.length} districts`} footRight="Explore →" saveKey={key} />;
    }
    if (type === 'place') {
      const hit = places.find((x) => x.p.id === id);
      if (!hit) return null;
      return <Card key={key} to={`/state/${hit.s.id}/${hit.d.id}/${hit.p.id}`} media={hit.p.media} tag={hit.p.type} title={hit.p.name} blurb={hit.p.blurb.slice(0, 90) + '…'} footLeft={hit.s.name} footRight={`★ ${hit.p.rating}`} saveKey={key} />;
    }
    if (type === 'dist') {
      for (const s of DATA.states) {
        const d = s.districts.find((x) => x.id === id);
        if (d) return <Card key={key} to={`/state/${s.id}/${d.id}`} media={d.media} tag="District" title={d.name} blurb={d.blurb} footLeft={s.name} footRight="Explore →" saveKey={key} />;
      }
    }
    return null;
  }).filter(Boolean);

  return (
    <div>
      <div className="px-[clamp(18px,4vw,48px)] pb-1.5 pt-8">
        <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Your wishlist</h2>
        <p className="mt-1">{saved.size} saved for your next trip.</p>
      </div>
      <div className="grid gap-[22px] px-[clamp(18px,4vw,48px)] py-[18px] pb-[50px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))' }}>
        {cards}
      </div>
    </div>
  );
}
