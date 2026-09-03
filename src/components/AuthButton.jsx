import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthButton() {
  const { user, loading, isAuthEnabled, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Reset the "avatar failed to load" flag if the user (and therefore their avatar URL) changes,
  // e.g. switching Google accounts — otherwise a stale failure would hide a perfectly good new avatar.
  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.id]);

  if (!isAuthEnabled) {
    // Supabase isn't configured yet (e.g. local dev before setup, or a preview deploy without
    // secrets) — the rest of the app still works fine without login, so just hide this control
    // rather than showing a broken/disabled button.
    return null;
  }

  if (loading) {
    return <div className="skeleton h-[38px] w-[38px] rounded-full" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={signInWithGoogle}
        className="flex h-[38px] items-center gap-2 rounded-full bg-sand px-3.5 text-[0.8rem] font-bold text-indigo transition-transform hover:-translate-y-0.5 hover:bg-gold dark:text-charcoal"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in
      </button>
    );
  }

  const initial = (user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;
  const showAvatar = Boolean(avatarUrl) && !avatarFailed;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="Account menu"
        className="flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-indigo text-[0.85rem] font-bold text-white transition-transform hover:-translate-y-0.5"
      >
        {showAvatar ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setAvatarFailed(true)}
          />
        ) : initial}
      </button>
      {menuOpen && (
        <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[220px] overflow-hidden rounded-[14px] border border-black/10 bg-surface shadow-[0_20px_50px_rgba(31,58,95,0.22)] dark:border-white/10">
          <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
            <div className="truncate text-[0.86rem] font-bold text-indigo dark:text-charcoal">{user.user_metadata?.full_name || 'Signed in'}</div>
            <div className="truncate text-[0.74rem] opacity-60">{user.email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setMenuOpen(false); signOut(); }}
            className="w-full px-4 py-3 text-left text-[0.86rem] font-semibold hover:bg-sand"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
