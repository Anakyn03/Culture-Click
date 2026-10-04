import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPlaces } from '../lib/atlasApi';
import { routeFor } from '../data/atlas';
import { photoOf } from '../lib/photo';
import { useApp } from '../context/AppContext';
import PlaceImage from './PlaceImage';

// Chips are plain search queries, so every one of them is guaranteed to return results — they
// used to include phrases like "Hidden gems" that matched nothing at all.
const TRENDING = ['Taj Mahal', 'Hampi', 'Kerala backwaters', 'Pangong Tso', 'Meenakshi'];
const MOOD_CHIPS = ['UNESCO', 'Temples', 'Monasteries', 'Forts', 'Islands', 'Waterfalls'];

const MAX_HITS = 8;
const DEBOUNCE_MS = 140;

/** Shared empty result, so "no hits" has a stable identity across renders. */
const NO_HITS = [];

// Feature-detect the Web Speech API once. Where it isn't available the mic button is
// hidden rather than faking a result, which is what the previous version did.
const SpeechRecognition =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

function SearchResultThumb({ photo, label }) {
  return (
    <PlaceImage
      photo={photo}
      name={label}
      size="thumbnail"
      className="relative h-[38px] w-[38px] flex-none rounded-[10px]"
      alt=""
    />
  );
}

export default function SearchPanel() {
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch } = useApp();
  const [query, setQuery] = useState('');
  // Results are stored with the query they answer, so a keystroke never has to reset state
  // from inside an effect — the stale answer simply doesn't apply to the new term.
  const [results, setResults] = useState({ term: '', hits: [] });
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  // The highlight is stored alongside the query it belongs to, so a new query starts at the
  // top again with no effect to reset it — the stale highlight simply doesn't apply.
  const [highlight, setHighlight] = useState({ query: '', index: 0 });
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const term = query.trim();
  const settled = results.term === term;
  const hits = settled ? results.hits : NO_HITS;
  const searching = Boolean(term) && !settled;

  /**
   * Search runs in Postgres, debounced. The atlas is far too large to hold in the browser, so
   * this is a real request per settled query — hence the cache in lib/atlasApi.js, which makes
   * backspacing and re-opening the panel free.
   */
  useEffect(() => {
    if (!term) return undefined;

    let current = true;

    const timer = setTimeout(() => {
      searchPlaces(term)
        .then((rows) => {
          if (current) setResults({ term, hits: (rows ?? []).slice(0, MAX_HITS) });
        })
        .catch(() => {
          if (current) setResults({ term, hits: [] });
        });
    }, DEBOUNCE_MS);

    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [term]);

  const active = highlight.query === query ? highlight.index : 0;
  const setActive = (index) => setHighlight({ query, index });

  // Dismiss on an outside press. This replaces an `onBlur` + 150ms setTimeout, which
  // made the panel close before a click on a result could register.
  useEffect(() => {
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  // Stop listening if the component goes away mid-recognition.
  useEffect(() => () => recognitionRef.current?.abort(), []);

  const routes = useMemo(() => hits.map((hit) => routeFor(hit)), [hits]);

  function choose(index) {
    const hit = hits[index];
    if (!hit) return;
    if (term) addRecentSearch(term);
    setQuery('');
    setOpen(false);
    navigate(routes[index]);
  }

  function fill(text) {
    setQuery(text);
    setOpen(true);
    inputRef.current?.focus();
  }

  function startVoice() {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      fill(transcript.replace(/[.?!]$/, ''));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive(Math.min(active + 1, Math.max(hits.length - 1, 0)));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(active - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      if (hits.length) choose(active);
      else if (term) setOpen(true);
    }
  }

  const showEmptyState = !term;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex w-[min(340px,32vw)] items-center gap-2 rounded-full border border-transparent bg-sand px-3.5 py-2.5 focus-within:border-teal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none opacity-55" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={hits.length ? `search-hit-${active}` : undefined}
          placeholder={listening ? 'Listening…' : 'Search a place, dish, mood…'}
          aria-label="Search Culture Click"
          className="w-full bg-transparent text-[0.9rem] text-charcoal outline-none placeholder:text-charcoal/50"
        />

        {SpeechRecognition && (
          <button
            type="button"
            onClick={startVoice}
            aria-label="Search by voice"
            aria-pressed={listening}
            className={`flex-none transition-opacity hover:opacity-100 ${
              listening ? 'animate-pulse text-danger opacity-100' : 'text-teal opacity-70'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div
          id="search-results"
          className="absolute right-0 top-[calc(100%+10px)] z-[80] max-h-[70vh] w-[340px] overflow-auto rounded-[14px] border border-black/10 bg-surface shadow-[0_20px_50px_rgba(31,58,95,0.22)] dark:border-white/10"
        >
          {showEmptyState ? (
            <>
              {recentSearches.length > 0 && (
                <ChipSection title="Recent" items={recentSearches} onPick={fill} />
              )}
              <ChipSection title="Trending" items={TRENDING} onPick={fill} />
              <ChipSection title="Search by mood" items={MOOD_CHIPS} onPick={fill} />
            </>
          ) : hits.length ? (
            <ul role="listbox" aria-label="Search results" className="list-none">
              {hits.map((hit, i) => (
                <li key={`${hit.kind}-${hit.id}`}>
                  <button
                    type="button"
                    id={`search-hit-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    className={`flex w-full cursor-pointer items-center gap-3 border-t border-black/5 px-4 py-2.5 text-left first:border-t-0 dark:border-white/10 ${
                      i === active ? 'bg-sand' : ''
                    }`}
                  >
                    <SearchResultThumb photo={photoOf(hit)} label={hit.name} />
                    <span>
                      <b className="font-serif text-[0.95rem]">{hit.name}</b>
                      <span className="block text-[0.74rem] uppercase tracking-wide opacity-60">
                        {hit.type} · {hit.sub}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-[0.86rem] opacity-65">
              {searching ? 'Searching…' : `No results for “${term}” — try a state, place or dish.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChipSection({ title, items, onPick }) {
  return (
    <div className="px-4 pb-2.5 pt-3">
      <div className="mb-2 text-[0.68rem] font-extrabold uppercase tracking-wide opacity-50">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className="rounded-full bg-sand px-3 py-1.5 text-[0.74rem] font-semibold transition-colors hover:bg-teal hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
