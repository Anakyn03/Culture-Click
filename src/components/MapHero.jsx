import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INDIA_VIEWBOX, INDIA_STATE_PATHS, REGION_ID_TO_PATH_NAMES } from '../data/indiaPaths';
import { DATA, REGIONS, LAYERS, FLAGSHIP_IDS } from '../data/statesData';
import { useApp } from '../context/AppContext';

function stateById(id) {
  return DATA.states.find((s) => s.id === id);
}

export default function MapHero() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const stageRef = useRef(null);
  const { currentRegion, setCurrentRegion, activeLayer, setActiveLayer } = useApp();
  const [hover, setHover] = useState(null); // { state, x, y }
  const [routeD, setRouteD] = useState('');

  // Build the decorative dashed "journey" line through the 8 flagship states, using real
  // bounding-box centers of the rendered paths rather than hand-picked coordinates.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      const pts = FLAGSHIP_IDS.map((id) => {
        const el = svg.querySelector(`[data-state="${id}"]`);
        if (!el) return null;
        const b = el.getBBox();
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      }).filter(Boolean);
      if (pts.length > 1) {
        setRouteD('M' + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L '));
      }
    } catch {
      /* getBBox can throw if not yet laid out — harmless, route just stays empty */
    }
  }, []);

  const layerTest = LAYERS.find((l) => l.id === activeLayer)?.test;

  function handleEnter(regionId, evt) {
    const state = stateById(regionId);
    if (!state || !stageRef.current) return;
    const box = evt.currentTarget.getBoundingClientRect();
    const stageBox = stageRef.current.getBoundingClientRect();
    let left = box.left - stageBox.left + 24;
    const top = box.top - stageBox.top - 10;
    if (left + 220 > stageBox.width) left = box.left - stageBox.left - 240;
    setHover({ state, left, top });
  }

  return (
    <section className="relative overflow-hidden px-[clamp(18px,4vw,48px)] pb-2.5 pt-[52px] text-center">
      <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-saffron">A living atlas</div>
      <h1 className="mx-auto mt-1 max-w-[820px] font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] text-indigo dark:text-sand">
        Journey through India, one story at a time.
      </h1>
      <p className="mx-auto mb-6 max-w-[560px] text-[1.02rem] text-charcoal/85">
        All 28 states and 8 Union Territories are now on the map. Trace the marigold trail through our most deeply
        catalogued states, switch on a layer, or tap anywhere to start exploring.
      </p>

      <div ref={stageRef} className="relative mx-auto max-w-[640px]" style={{ aspectRatio: '1000/1136' }}>
        <svg ref={svgRef} viewBox={INDIA_VIEWBOX} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive map of India" className="h-full w-full overflow-visible">
          <g transform="translate(910,90)">
            <g className="compass-spin" opacity=".35">
              <circle r="20" fill="none" stroke="var(--color-indigo)" strokeWidth="1.4" />
              <path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill="var(--color-saffron)" />
            </g>
          </g>
          {routeD && <path className="atlas-route" d={routeD} />}
          <g>
            {DATA.states.map((s) => {
              const pathNames = REGION_ID_TO_PATH_NAMES[s.id] || [];
              const matches = layerTest ? layerTest(s) : null;
              const dimmed = layerTest ? !matches : false;
              return pathNames.map((name) => (
                <path
                  key={`${s.id}-${name}`}
                  d={INDIA_STATE_PATHS[name]}
                  data-state={s.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${s.name}`}
                  onClick={() => navigate(`/state/${s.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/state/${s.id}`)}
                  onMouseEnter={(e) => handleEnter(s.id, e)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={(e) => handleEnter(s.id, e)}
                  onBlur={() => setHover(null)}
                  className={[
                    'cursor-pointer stroke-indigo dark:stroke-sand transition-colors duration-150 ease-out',
                    '[transform-box:fill-box] [transform-origin:50%_50%]',
                    matches ? 'fill-teal' : 'fill-sand hover:fill-saffron focus-visible:fill-saffron',
                    dimmed ? 'opacity-30' : 'opacity-100',
                  ].join(' ')}
                  style={{ strokeWidth: 1.6 }}
                />
              ));
            })}
          </g>
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-40 w-[220px] rounded-[14px] border border-black/10 bg-ivory p-3.5 shadow-[0_20px_50px_rgba(31,58,95,0.16)] dark:border-white/10 dark:bg-[#1B2432]"
            style={{ left: hover.left, top: hover.top }}
          >
            <h4 className="font-serif text-[0.95rem] text-indigo dark:text-sand">{hover.state.name}</h4>
            <p className="mt-1 text-[0.78rem] text-charcoal/80">{hover.state.tagline}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {hover.state.culture.cuisine.slice(0, 2).map((c) => (
                <span key={c} className="rounded-full bg-sand px-1.5 py-0.5 text-[0.62rem] font-bold">{c}</span>
              ))}
              {hover.state.unesco && <span className="rounded-full bg-sand px-1.5 py-0.5 text-[0.62rem] font-bold">UNESCO</span>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 px-2">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveLayer(activeLayer === l.id ? null : l.id)}
            className={`rounded-full px-3.5 py-1.5 text-[0.76rem] font-bold transition-colors ${
              activeLayer === l.id ? 'bg-teal text-white' : 'bg-sand text-charcoal hover:bg-teal/20'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5 px-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setCurrentRegion(r)}
            className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
              currentRegion === r ? 'border-indigo bg-indigo text-ivory' : 'border-transparent bg-sand text-charcoal hover:border-indigo/40'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-5 text-[0.78rem] text-charcoal/65">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full bg-saffron" /> Tap or hover a state to preview it
        </span>
        <span>{DATA.states.length} states &amp; UTs fully on the map</span>
      </div>
    </section>
  );
}
