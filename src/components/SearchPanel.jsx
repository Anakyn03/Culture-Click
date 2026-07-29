import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';
import PlaceMotif from './PlaceMotif';

const TRENDING = ['Hidden gems', 'Taj Mahal', 'Kerala backwaters', 'UNESCO sites', 'Union Territories'];
const MOOD_CHIPS = ['Hidden gems', 'UNESCO', 'Temples', 'Northeast', 'Islands', 'Monasteries'];

function buildIndex() {
  const idx = [];
  DATA.states.forEach((s) => {
    idx.push({ type: 'State/UT', label: s.name, sub: s.tagline, media: s.media, to: `/state/${s.id}` });
    s.districts.forEach((d) => {
      idx.push({ type: 'District', label: d.name, sub: s.name, media: d.media, to: `/state/${s.id}/${d.id}` });
      d.places.forEach((p) => {
        idx.push({ type: p.type, label: p.name, sub: `${d.name}, ${s.name}`, media: p.media, to: `/state/${s.id}/${d.id}/${p.id}` });
        [...p.food, ...p.experiences].forEach((extra) =>
          idx.push({ type: 'Mentioned in', label: extra, sub: p.name, media: p.media, to: `/state/${s.id}/${d.id}/${p.id}` })
        );
      });
    });
  });
  return idx;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}
function fuzzyMatch(q, text) {
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  return t.split(/\s+/).some((w) => w.length > 3 && levenshtein(q, w.slice(0, q.length)) <= 1);
}

export default function SearchPanel() {
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const wrapRef = useRef(null);
  const index = useMemo(buildIndex, []);

  const hits = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    let found = index.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q));
    if (!found.length) found = index.filter((i) => fuzzyMatch(q, i.label));
    return found.slice(0, 8);
  }, [query, index]);

  function choose(hit) {
    addRecentSearch(query.trim());
    navigate(hit.to);
    setQuery('');
    setOpen(false);
  }

  function fill(text) {
    setQuery(text);
  }

  function startVoice() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setQuery('hidden gems');
    }, 1400);
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex w-[min(340px,32vw)] items-center gap-2 rounded-full border border-transparent bg-sand px-3.5 py-2.5 focus-within:border-teal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none opacity-55"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={listening ? 'Listening…' : 'Search a place, dish, mood…'}
          aria-label="Search Culture Click"
          className="w-full bg-transparent text-[0.9rem] text-charcoal outline-none placeholder:text-charcoal/50"
        />
        <button
          type="button"
          onClick={startVoice}
          aria-label="Search by voice (prototype)"
          className={`flex-none opacity-70 hover:opacity-100 ${listening ? 'animate-pulse text-danger' : 'text-teal'}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[80] max-h-[70vh] w-[340px] overflow-auto rounded-[14px] border border-black/10 bg-ivory shadow-[0_20px_50px_rgba(31,58,95,0.16)] dark:border-white/10 dark:bg-[#131A24]">
          {!query.trim() ? (
            <>
              {recentSearches.length > 0 && (
                <div className="px-4 pb-2.5 pt-3">
                  <div className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-wide opacity-50">Recent</div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((r) => (
                      <button key={r} onMouseDown={() => fill(r)} className="rounded-full bg-sand px-3 py-1.5 text-[0.74rem] font-semibold hover:bg-teal hover:text-white">{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-4 pb-2.5 pt-3">
                <div className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-wide opacity-50">Trending</div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING.map((r) => (
                    <button key={r} onMouseDown={() => fill(r)} className="rounded-full bg-sand px-3 py-1.5 text-[0.74rem] font-semibold hover:bg-teal hover:text-white">{r}</button>
                  ))}
                </div>
              </div>
              <div className="px-4 pb-3 pt-1">
                <div className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-wide opacity-50">Search by mood</div>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_CHIPS.map((r) => (
                    <button key={r} onMouseDown={() => fill(r)} className="rounded-full bg-sand px-3 py-1.5 text-[0.74rem] font-semibold hover:bg-teal hover:text-white">{r}</button>
                  ))}
                </div>
              </div>
            </>
          ) : hits.length ? (
            hits.map((h, i) => (
              <div
                key={i}
                onMouseDown={() => choose(h)}
                className="flex cursor-pointer items-center gap-3 border-t border-black/5 px-4 py-2.5 first:border-t-0 hover:bg-sand dark:border-white/10"
              >
                <div className="relative h-[38px] w-[38px] flex-none overflow-hidden rounded-[10px]">
                  <PlaceMotif media={h.media} />
                </div>
                <div>
                  <b className="font-serif text-[0.95rem]">{h.label}</b>
                  <span className="block text-[0.74rem] uppercase tracking-wide opacity-60">{h.type} · {h.sub}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-[0.86rem] opacity-65">No results for "{query}" — try a state name or ask Saathi instead.</div>
          )}
        </div>
      )}
    </div>
  );
}
