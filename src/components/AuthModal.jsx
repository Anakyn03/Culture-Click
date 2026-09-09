import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, signInWithMagicLink, authError, clearError } = useAuth();
  const [mode, setMode] = useState('choose'); // choose | email | magic | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    setSuccess('');
    await signInWithEmail(email, password);
    setSubmitting(false);
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    setSuccess('');
    const result = await signUpWithEmail(email, password, name);
    if (!result.error) {
      setSuccess('Check your email for a confirmation link!');
    }
    setSubmitting(false);
  }

  async function handleMagicSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    setSuccess('');
    const result = await signInWithMagicLink(email);
    if (!result.error) {
      setSuccess('Magic link sent! Check your email inbox.');
    }
    setSubmitting(false);
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Culture Click"
    >
      <div className="w-full max-w-[400px] overflow-hidden rounded-[20px] border border-black/10 bg-surface shadow-[0_30px_80px_rgba(31,58,95,0.3)] dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
          <div>
            <h2 className="font-serif text-[1.2rem] text-indigo dark:text-charcoal">
              {mode === 'choose' && 'Welcome back'}
              {mode === 'email' && 'Sign in with email'}
              {mode === 'signup' && 'Create account'}
              {mode === 'magic' && 'Magic link'}
            </h2>
            <p className="mt-0.5 text-[0.75rem] opacity-60">
              {mode === 'choose' && 'Pick your preferred way to sign in'}
              {mode === 'email' && 'Enter your email and password'}
              {mode === 'signup' && 'Join the Culture Click community'}
              {mode === 'magic' && 'We\'ll email you a sign-in link'}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-sand" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Error */}
          {authError && (
            <div className="mb-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-[0.82rem] text-danger">
              {authError}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-xl border border-forest/20 bg-forest/5 px-4 py-3 text-[0.82rem] text-forest">
              {success}
            </div>
          )}

          {/* Choose mode */}
          {mode === 'choose' && (
            <div className="space-y-2.5">
              <OAuthButton
                onClick={signInWithGoogle}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                }
                label="Continue with Google"
              />
              <OAuthButton
                onClick={signInWithGitHub}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                }
                label="Continue with GitHub"
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10 dark:border-white/10" /></div>
                <div className="relative flex justify-center"><span className="bg-surface px-3 text-[0.72rem] uppercase tracking-wide opacity-50">or</span></div>
              </div>
              <button
                type="button"
                onClick={() => { setMode('email'); clearError(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-surface px-4 py-3 text-[0.88rem] font-bold text-indigo transition-colors hover:border-indigo/30 dark:border-white/10 dark:text-charcoal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" /></svg>
                Sign in with email
              </button>
              <button
                type="button"
                onClick={() => { setMode('magic'); clearError(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-surface px-4 py-3 text-[0.88rem] font-bold text-indigo transition-colors hover:border-indigo/30 dark:border-white/10 dark:text-charcoal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" /></svg>
                Sign in with magic link
              </button>
              <p className="pt-2 text-center text-[0.75rem] opacity-50">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setMode('signup'); clearError(); }} className="font-bold text-teal hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* Email sign-in */}
          {mode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <InputField label="Email" type="email" value={email} onChange={setEmail} required />
              <InputField label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo py-3 text-[0.9rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:opacity-50 dark:bg-gold dark:text-indigo"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
              <BackLink onClick={() => { setMode('choose'); clearError(); }} />
            </form>
          )}

          {/* Sign up */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <InputField label="Name" type="text" value={name} onChange={setName} required />
              <InputField label="Email" type="email" value={email} onChange={setEmail} required />
              <InputField label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo py-3 text-[0.9rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:opacity-50 dark:bg-gold dark:text-indigo"
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
              <BackLink onClick={() => { setMode('choose'); clearError(); }} />
            </form>
          )}

          {/* Magic link */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicSubmit} className="space-y-3">
              <InputField label="Email" type="email" value={email} onChange={setEmail} required />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo py-3 text-[0.9rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:opacity-50 dark:bg-gold dark:text-indigo"
              >
                {submitting ? 'Sending…' : 'Send magic link'}
              </button>
              <BackLink onClick={() => { setMode('choose'); clearError(); }} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small helpers ────────────────────────────────────────── */

function OAuthButton({ onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-surface px-4 py-3 text-[0.88rem] font-bold text-indigo transition-colors hover:border-indigo/30 dark:border-white/10 dark:text-charcoal"
    >
      {icon}
      {label}
    </button>
  );
}

function InputField({ label, type, value, onChange, required, minLength }) {
  return (
    <div>
      <label className="mb-1 block text-[0.75rem] font-bold uppercase tracking-wide opacity-60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 text-[0.88rem] text-indigo outline-none transition-colors focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal"
      />
    </div>
  );
}

function BackLink({ onClick }) {
  return (
    <p className="pt-1 text-center text-[0.75rem] opacity-50">
      <button type="button" onClick={onClick} className="font-bold text-teal hover:underline">
        ← Back to sign-in options
      </button>
    </p>
  );
}
