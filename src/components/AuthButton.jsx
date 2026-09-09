import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const { user, loading, isAuthEnabled, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.id]);

  if (!isAuthEnabled) return null;

  if (loading) {
    return <div className="h-[38px] w-[38px] animate-pulse rounded-full bg-sand" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-[38px] items-center gap-2 rounded-full bg-sand px-3.5 text-[0.8rem] font-bold text-indigo transition-transform hover:-translate-y-0.5 hover:bg-gold dark:text-charcoal"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </button>
        {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
      </>
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
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
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
