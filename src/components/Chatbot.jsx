import { useEffect, useRef, useState } from 'react';
import { DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';

function allPlaces() {
  const out = [];
  DATA.states.forEach((s) => s.districts.forEach((d) => d.places.forEach((p) => out.push({ s, d, p }))));
  return out;
}
const ALL_PLACES = allPlaces();
const SUGGESTIONS = ['Plan a 3-day Rajasthan trip', 'Hidden gems in Kerala', 'Best photography timing for the Taj Mahal', 'Which states are Union Territories?'];
const STRINGS = {
  EN: "Namaste! I'm Saathi, your cultural guide. Ask me about any state, dish, festival, or hidden corner of India — I'll point you in the right direction.",
  HI: 'नमस्ते! मैं साथी हूं, आपका सांस्कृतिक मार्गदर्शक। किसी भी राज्य, व्यंजन, त्योहार या भारत के किसी छुपे हुए कोने के बारे में पूछें।',
};

function craftReply(q, ctx, setCtx) {
  const query = q.toLowerCase();
  const stateHit = DATA.states.find((s) => query.includes(s.name.toLowerCase()))
    || (ctx.lastStateId && /there|more|it\b/.test(query) ? DATA.states.find((s) => s.id === ctx.lastStateId) : null);
  const placeHit = ALL_PLACES.find(({ p }) => query.includes(p.name.toLowerCase()));

  if (stateHit) setCtx((c) => ({ ...c, lastStateId: stateHit.id }));
  if (placeHit) setCtx((c) => ({ ...c, lastPlaceId: placeHit.p.id }));

  if (placeHit) {
    const { s, d, p } = placeHit;
    if (query.includes('photo')) return `Best light at ${p.name}: ${p.bestPhoto}. Rated ${p.rating}★ by travellers.`;
    if (query.includes('budget')) return `${p.name} runs on a ${p.budget.toLowerCase()} budget — entry is ${p.entry}.`;
    return `${p.name} in ${d.name}, ${s.name}: ${p.blurb} Best visited ${p.bestSeason.toLowerCase()}. Want me to open its full page?`;
  }
  if (query.includes('union territor')) {
    const uts = DATA.states.filter((s) => ['andaman-nicobar', 'chandigarh', 'dnh-daman-diu', 'delhi', 'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry'].includes(s.id)).map((s) => s.name);
    return `India's 8 Union Territories, all catalogued here: ${uts.join(', ')}. Toggle the "Union Territories" layer on the map to see them highlighted.`;
  }
  if (query.includes('pack')) {
    if (stateHit?.id === 'ladakh') return 'For Ladakh: layered thermals, a windproof outer shell, sunglasses and high-SPF sunscreen for the altitude glare, a reusable water bottle, and any personal altitude-sickness medication cleared by a doctor.';
    return `For most of ${stateHit ? stateHit.name : 'India'}, pack breathable cottons, a light shawl for evenings, comfortable closed shoes for uneven heritage sites, and modest clothing for temple visits.`;
  }
  if (query.includes('hidden') && stateHit) {
    const gems = stateHit.districts.flatMap((d) => d.places.flatMap((p) => p.hiddenGems)).slice(0, 3);
    return gems.length ? `In ${stateHit.name}, seek out: ${gems.join('; ')}.` : `${stateHit.name} has plenty of untouched corners.`;
  }
  if (query.includes('hidden')) return "Some quiet favourites across the atlas: the Nongriat living root bridge in Meghalaya, Khonoma's terraced fields in Nagaland, and Hemakuta Hill at dawn in Hampi.";
  if ((query.includes('food') || query.includes('eat') || query.includes('dish')) && stateHit) return `${stateHit.name}'s table is built around ${stateHit.culture.cuisine.join(', ')}. Look for these in local thalis rather than hotel menus for the real flavour.`;
  if (query.includes('plan') || query.includes('itinerary') || query.includes('trip')) {
    const target = stateHit || DATA.states[0];
    const d = target.districts[0];
    return `A quick outline for ${target.name}: Day 1 — arrive and settle into ${d?.name || 'the capital region'}, evening market walk. Day 2 — the region's signature heritage sites, unhurried. Day 3 — a hidden-gem detour and a food trail before departing. Want the full page for ${d?.name || target.name}?`;
  }
  if (query.includes('festival')) {
    if (stateHit) return `${stateHit.name}'s calendar centres on ${stateHit.culture.festivals.map((f) => `${f.name} (${f.month})`).join(', ')} — plan around these for the fullest experience.`;
    return 'Wherever you go, try to time it with a local festival — check the Festival Calendar tab for a full month-by-month view across every state.';
  }
  if (query.includes('photo')) return 'For any heritage site, the golden hour right after sunrise almost always beats midday — softer light, fewer crowds, and monuments that haven\'t heated the air into haze yet.';
  if (query.includes('unesco')) {
    const unescoStates = DATA.states.filter((s) => s.unesco).map((s) => s.name);
    return `States with catalogued UNESCO sites: ${unescoStates.join(', ')}. Toggle the UNESCO layer on the home map to see them highlighted.`;
  }
  if (stateHit) return `${stateHit.name} — ${stateHit.tagline}. ${stateHit.blurb} Want me to show you its districts, or jump straight to a place?`;
  return "I can walk you through any of India's 36 states and UTs now — forts in Rajasthan, backwaters in Kerala, living bridges in Meghalaya, or islands in Lakshadweep. Where should we start?";
}

export default function Chatbot() {
  const { chatContext, setChatContext, pendingAsk, setPendingAsk } = useApp();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (!pendingAsk) return;
    setOpen(true);
    setMessages((m) => (m.length === 0 ? [{ role: 'bot', text: STRINGS[lang] }] : m));
    send(pendingAsk);
    setPendingAsk(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAsk]);

  function openChat() {
    setOpen(true);
    if (messages.length === 0) setMessages([{ role: 'bot', text: STRINGS[lang] }]);
  }

  function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      const reply = craftReply(text, chatContext, setChatContext);
      setTyping(false);
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    }, 650 + Math.random() * 450);
  }

  const suggestions = chatContext.lastStateId
    ? [`More hidden gems in ${DATA.states.find((s) => s.id === chatContext.lastStateId)?.name}`, 'Festival calendar for that state', 'Budget tips for that state', SUGGESTIONS[0]]
    : SUGGESTIONS;

  return (
    <>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open Saathi, your AI cultural assistant"
        className="fixed bottom-6 right-6 z-[90] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-indigo text-gold shadow-[0_20px_50px_rgba(31,58,95,0.16)] transition-transform hover:scale-105"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.5 8.5 0 0 1-11.9 7.8L3 21l1.8-6A8.5 8.5 0 1 1 21 11.5Z" /><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
      </button>

      {open && (
        <div role="dialog" aria-modal="false" aria-label="Saathi chat assistant" className="fixed bottom-24 right-6 z-[90] flex h-[min(560px,72vh)] w-[min(380px,88vw)] flex-col overflow-hidden rounded-[20px] border border-black/10 bg-ivory shadow-[0_20px_50px_rgba(31,58,95,0.16)] dark:border-white/10 dark:bg-[#131A24]">
          <div className="flex items-center justify-between bg-indigo px-[18px] py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D9A404" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8 13c1 1.5 2.3 2 4 2s3-.5 4-2" /></svg>
              <div>
                <b className="block font-serif text-[1.05rem]">Saathi</b>
                <span className="text-[0.72rem] opacity-75">Your cultural guide, always nearby</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { const next = lang === 'EN' ? 'HI' : 'EN'; setLang(next); setMessages((m) => [...m, { role: 'bot', text: next === 'HI' ? 'मैं अब हिंदी में भी मदद कर सकता हूं (प्रोटोटाइप में सीमित शब्दावली)।' : 'Switched back to English — I can still recall everything we discussed.' }]); }}
              className="rounded-full bg-white/15 px-2.5 py-1 text-[0.68rem] font-bold"
            >
              {lang}
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed ${m.role === 'bot' ? 'self-start rounded-bl-sm bg-sand' : 'ml-auto self-end rounded-br-sm bg-teal text-white'}`}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="w-fit rounded-2xl rounded-bl-sm bg-sand px-3.5 py-2.5">
                <span className="typing-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-charcoal/40" />
                <span className="typing-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-charcoal/40" style={{ animationDelay: '.2s' }} />
                <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-charcoal/40" style={{ animationDelay: '.4s' }} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full bg-sand px-2.5 py-1.5 text-[0.72rem] font-semibold hover:bg-teal hover:text-white">{s}</button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); setInput(''); }}
            className="flex gap-1.5 border-t border-black/10 p-2.5 dark:border-white/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a place, food or festival…"
              aria-label="Message Saathi"
              className="flex-1 bg-transparent px-2.5 py-2 text-[0.88rem] outline-none"
            />
            <button type="submit" aria-label="Send message" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-saffron text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
