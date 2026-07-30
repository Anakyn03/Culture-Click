import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchPanel from './SearchPanel';

export default function Header() {
  const navigate = useNavigate();
  const { setIsDark, saved } = useApp();

  return (
    <header className="sticky top-0 z-[60] flex items-center justify-between border-b border-black/10 bg-ivory/90 px-[clamp(18px,4vw,48px)] py-4 backdrop-blur-md dark:border-white/10">
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate('/')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        className="flex cursor-pointer items-center gap-2.5 font-serif text-[1.35rem] font-bold text-indigo dark:text-charcoal"
      >
        <span className="h-[30px] w-[30px]">
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 3c8 6 14 12 14 20a14 14 0 0 1-28 0C6 15 12 9 20 3Z" fill="#C66A1B" />
            <path d="M20 3c8 6 14 12 14 20a14 14 0 0 1-28 0C6 15 12 9 20 3Z" stroke="#1F3A5F" strokeWidth="1.5" fill="none" opacity=".4" />
            <circle cx="20" cy="23" r="5" fill="#D9A404" />
          </svg>
        </span>
        <span>
          <span className="hidden sm:inline">Culture Click</span>
          <small className="block text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-saffron">India, storied</small>
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <SearchPanel />
        <button
          type="button"
          onClick={() => setIsDark((v) => !v)}
          aria-label="Toggle day and night mode"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-sand text-indigo transition-transform hover:-translate-y-0.5 hover:bg-gold dark:text-charcoal"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
        </button>
        <button
          type="button"
          onClick={() => navigate('/wishlist')}
          aria-label="Open wishlist"
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full bg-sand text-indigo transition-transform hover:-translate-y-0.5 hover:bg-gold dark:text-charcoal"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21l-8-5-8 5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" /></svg>
          {saved.size > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[0.62rem] font-extrabold text-white">
              {saved.size}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
