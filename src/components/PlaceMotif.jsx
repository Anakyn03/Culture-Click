// Every state/district/place carries a `media` key. Ten flagship places (the ones with the
// deepest content) get a bespoke hand-drawn illustration; everything else falls back to a
// simpler category icon so the whole atlas still looks intentional rather than placeholder-y.

const BESPOKE_SVG = {
  'm-taj': `<svg viewBox="0 0 300 160"><ellipse cx="150" cy="150" rx="140" ry="10" fill="#3a5570" opacity=".3"/><rect x="100" y="90" width="100" height="55" fill="#eef3f6" opacity=".9"/><circle cx="150" cy="80" r="42" fill="#f4f7f9"/><path d="M150 20 L158 45 L142 45 Z" fill="#f4f7f9"/><rect x="72" y="60" width="12" height="85" fill="#e3e9ee"/><rect x="216" y="60" width="12" height="85" fill="#e3e9ee"/><circle cx="78" cy="55" r="9" fill="#f4f7f9"/><circle cx="222" cy="55" r="9" fill="#f4f7f9"/></svg>`,
  'm-hawa': `<svg viewBox="0 0 300 160"><rect x="40" y="30" width="220" height="120" fill="#c9713b" opacity=".55"/>${Array.from({ length: 40 }).map((_, i) => `<rect x="${48 + (i % 10) * 22}" y="${40 + Math.floor(i / 10) * 26}" width="14" height="18" rx="7" fill="#f6dcc4" opacity=".8"/>`).join('')}</svg>`,
  'm-amer': `<svg viewBox="0 0 300 160"><rect x="0" y="110" width="300" height="50" fill="#8a5a22" opacity=".4"/><path d="M20 110 L20 70 L60 40 L100 70 L100 110 Z" fill="#d9b06a"/><path d="M110 110 L110 55 L160 20 L210 55 L210 110 Z" fill="#e5c07f"/><path d="M220 110 L220 70 L260 40 L280 70 L280 110 Z" fill="#d9b06a"/></svg>`,
  'm-kerala': `<svg viewBox="0 0 300 160"><rect x="0" y="100" width="300" height="60" fill="#3f8f6c" opacity=".5"/><path d="M20 100 C90 80 210 120 280 95" stroke="#1f5c40" stroke-width="4" fill="none" opacity=".6"/><rect x="120" y="70" width="60" height="26" rx="4" fill="#2b6b4d"/><path d="M60 100 C60 60 40 40 25 30" stroke="#1f5c40" stroke-width="5" fill="none"/><path d="M60 100 C60 60 80 40 95 30" stroke="#1f5c40" stroke-width="5" fill="none"/></svg>`,
  'm-varanasi': `<svg viewBox="0 0 300 160"><rect x="0" y="115" width="300" height="45" fill="#7c4a12" opacity=".4"/>${Array.from({ length: 6 }).map((_, i) => `<rect x="${10 + i * 50}" y="${70 - (i % 2) * 10}" width="42" height="${60 + (i % 2) * 10}" fill="#e0ac52" opacity=".85"/>`).join('')}<rect x="0" y="135" width="300" height="25" fill="#c8912f" opacity=".6"/></svg>`,
  'm-meghalaya': `<svg viewBox="0 0 300 160"><rect x="0" y="0" width="300" height="160" fill="#5fae8d" opacity=".25"/><path d="M40 130 C90 40 210 40 260 130" stroke="#245c46" stroke-width="6" fill="none"/><path d="M40 130 C90 170 210 170 260 130" stroke="#245c46" stroke-width="6" fill="none" opacity=".5"/></svg>`,
  'm-ladakh': `<svg viewBox="0 0 300 160"><rect x="0" y="90" width="300" height="70" fill="#7fa8cc" opacity=".5"/><path d="M0 100 L60 40 L110 90 L170 30 L230 90 L300 60 L300 100 Z" fill="#2c4c6e" opacity=".7"/><path d="M60 40 L70 55 L50 55 Z" fill="#fff"/><path d="M170 30 L180 48 L160 48 Z" fill="#fff"/></svg>`,
  'm-hampi': `<svg viewBox="0 0 300 160"><rect x="0" y="120" width="300" height="40" fill="#c98a4a" opacity=".4"/><circle cx="60" cy="110" r="28" fill="#b97a3a"/><circle cx="120" cy="125" r="20" fill="#a8692c"/><rect x="160" y="60" width="26" height="90" fill="#c98a4a"/><path d="M155 60 L173 30 L191 60 Z" fill="#b97a3a"/><circle cx="240" cy="115" r="22" fill="#b97a3a"/></svg>`,
  'm-mahabs': `<svg viewBox="0 0 300 160"><rect x="0" y="110" width="300" height="50" fill="#d98955" opacity=".4"/><path d="M110 110 L110 60 L140 30 L170 60 L170 110 Z" fill="#c1723f"/><path d="M60 110 L60 80 L80 60 L100 80 L100 110 Z" fill="#b8683a"/><path d="M180 110 L180 80 L200 60 L220 80 L220 110 Z" fill="#b8683a"/></svg>`,
  'm-goa': `<svg viewBox="0 0 300 160"><rect x="0" y="120" width="300" height="40" fill="#f2a65a" opacity=".4"/><rect x="110" y="55" width="80" height="70" fill="#fdf6e8"/><path d="M110 55 L150 20 L190 55 Z" fill="#f4e4bf"/><rect x="140" y="20" width="18" height="35" fill="#fdf6e8"/></svg>`,
};

// category -> [gradient CSS, icon path data drawn on a 0 0 36 36 viewBox, stroked in white]
const CATEGORY = {
  temple: ['linear-gradient(160deg,#f3c6b0,#e08a5b 55%,#a4491f)', 'M18 3 L23 12 L13 12 Z M9 33V15h18v18M6 33h24M12 33V21M24 33V21'],
  monastery: ['linear-gradient(160deg,#dce9f6,#8fa9c4 55%,#2c4c6e)', 'M18 4c3 3 5 6 5 10a5 5 0 0 1-10 0c0-4 2-7 5-10ZM8 33V19h20v14M8 33h20M4 33h28'],
  fort: ['linear-gradient(160deg,#e7d3a1,#c69a4e 55%,#7a541f)', 'M6 33V14h6v-4h4v4h4v-6h4v6h4v-4h4v4h6v19M6 33h24M12 33V22M24 33V22'],
  stepwell: ['linear-gradient(160deg,#cdeef0,#5fb3b8 55%,#0f5b60)', 'M6 8h24v4H10v4h16v4H14v4h12v4H18v4h8'],
  lake: ['linear-gradient(160deg,#c6e3ee,#5f9db8 55%,#1f5670)', 'M4 24c3-3 6-3 9 0s6 3 9 0 6-3 9 0M4 31c3-3 6-3 9 0s6 3 9 0 6-3 9 0M22 6l6 8h-12z'],
  garden: ['linear-gradient(160deg,#cdeee0,#6bb896 55%,#245c46)', 'M18 33V17M18 17c-6 0-9-4-9-9 5 0 9 3 9 9ZM18 17c6 0 9-4 9-9-5 0-9 3-9 9Z'],
  cave: ['linear-gradient(160deg,#f0d9b8,#c98a4a 55%,#7a4a20)', 'M4 33c0-12 6-22 14-22s14 10 14 22'],
  memorial: ['linear-gradient(160deg,#e3e6ea,#a9b3bd 55%,#5d6b7a)', 'M9 33V15M27 33V15M6 15l12-9 12 9M6 33h24M13 33V20M23 33V20'],
  village: ['linear-gradient(160deg,#dde6c8,#a3b06a 55%,#5a6b3a)', 'M6 33V18l12-8 12 8v15M6 33h24M14 33v-9h8v9'],
  monument: ['linear-gradient(160deg,#f6ddc7,#d98955 55%,#7a4620)', 'M6 33V12h4v-4h16v4h4v21M6 33h24M12 12h12M14 33V19M22 33V19'],
  palace: ['linear-gradient(160deg,#ffe8b0,#e0a24f 55%,#8c4a1c)', 'M6 33V16l6-5 6 5v-5l6 5v-5l6 5v17M6 33h24'],
  island: ['linear-gradient(160deg,#b8e8e0,#4fa89e 55%,#0f5b55)', 'M4 26c9-4 19-4 28 0M18 26V8M18 8c-4 0-6 3-6 6 4 0 6-2 6-6Z'],
  colonial: ['linear-gradient(160deg,#f5e6b8,#d9b567 55%,#8c6a1c)', 'M6 33V13h24v20M6 33h24M12 13V8h4v5M20 13V8h4v5M12 33v-8h4v8M20 33v-8h4v8'],
};
const DEFAULT_GRADIENT = 'linear-gradient(160deg,#e9e1d0,#c9bd9f 55%,#8a7a52)';

export default function PlaceMotif({ media, className = '' }) {
  if (media && BESPOKE_SVG[media]) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: BESPOKE_SVG[media] }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    );
  }
  const [gradient, iconPath] = CATEGORY[media] || [DEFAULT_GRADIENT, CATEGORY.temple[1]];
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, background: gradient }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full p-8 opacity-90" fill="none" stroke="#fff" strokeWidth="1.4">
        <path d={iconPath} />
      </svg>
    </div>
  );
}