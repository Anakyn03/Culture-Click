import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * The sign-in form itself — every mode, every notice, every credential path.
 *
 * Rendered in two places: inside the quick dialog in the header, and as the body of the /login
 * page. The dialog and the page differ only in their chrome, so the form lives here once;
 * before this they would have been two copies of the same nine fields drifting apart.
 *
 * @param {(mode: string) => void} [onDone]  called after a successful action
 * @param {string} [next]  path to return to after an OAuth hop or an emailed link
 */
export default function AuthForm({ onDone, next = '/' }) {
  const {
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    sendPasswordReset,
    resendConfirmation,
    isAuthEnabled,
    configIssue,
    authError,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState('choose'); // choose | email | signup | magic | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pending, setPending] = useState(null); // null | action key
  const [notice, setNotice] = useState('');

  const busy = pending !== null;

  function switchMode(next) {
    setMode(next);
    setNotice('');
    clearError();
  }

  /** Shared submit path: guard against double submits, then run and surface the outcome. */
  async function run(kind, action) {
    if (busy) return null;
    setPending(kind);
    setNotice('');
    clearError();
    const result = await action();
    setPending(null);
    return result;
  }

  async function finish(kind, action) {
    const result = await run(kind, action);
    if (result && !result.error) {
      setNotice('');
      clearError();
      setEmail('');
      setPassword('');
      setName('');
      onDone?.(kind);
    }
  }

  const headings = {
    choose: ['Welcome back', 'Pick your preferred way to sign in'],
    email: ['Sign in with email', 'Enter your email and password'],
    signup: ['Create account', 'Join the Culture Click community'],
    magic: ['Magic link', "We'll email you a sign-in link"],
    forgot: ['Reset password', "We'll email you a link to set a new one"],
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-serif text-[1.2rem] text-indigo dark:text-charcoal">{headings[mode][0]}</h2>
        <p className="mt-0.5 text-[0.75rem] opacity-60">{headings[mode][1]}</p>
      </div>

      {!isAuthEnabled && (
        <div className="mb-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-[0.8rem] leading-relaxed">
          <p className="font-bold text-indigo dark:text-charcoal">Sign-in is not connected yet</p>
          <p className="mt-1 opacity-80">{configIssue}</p>
          <p className="mt-1.5 opacity-80">
            Paste both values into <code className="rounded bg-black/10 px-1 dark:bg-white/10">.env.local</code> and
            restart the dev server.
          </p>
        </div>
      )}

      {authError && (
        <div role="alert" className="mb-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-[0.82rem] text-danger">
          <p>{authError.message}</p>

          {/* An unconfirmed account is a dead end without this: the confirmation email is the
              only thing that can activate it, and the first one is often lost to a spam folder. */}
          {authError.code === 'email_not_confirmed' && email.trim() && (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const result = await run('resend', () => resendConfirmation(email.trim(), next));
                if (!result?.error) setNotice(`A fresh confirmation link is on its way to ${email.trim()}.`);
              }}
              className="mt-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[0.78rem] font-bold text-danger disabled:opacity-60 dark:bg-black/20"
            >
              {pending === 'resend' ? 'Sending…' : 'Send a new confirmation link'}
            </button>
          )}
        </div>
      )}

      {notice && (
        <div role="status" className="mb-4 rounded-xl border border-forest/25 bg-forest/5 px-4 py-3 text-[0.82rem] text-forest">
          {notice}
        </div>
      )}

      {mode === 'choose' && (
        <div className="space-y-2.5">
          <OAuthButton
            onClick={() => run('google', () => signInWithGoogle(next))}
            disabled={busy}
            pending={pending === 'google'}
            pendingLabel="Opening Google…"
            icon={<GoogleMark />}
            label="Continue with Google"
          />
          <OAuthButton
            onClick={() => run('github', () => signInWithGitHub(next))}
            disabled={busy}
            pending={pending === 'github'}
            pendingLabel="Opening GitHub…"
            icon={<GitHubMark />}
            label="Continue with GitHub"
          />

          <Divider />

          <button type="button" onClick={() => switchMode('email')} className={BUTTON_BASE}>
            <MailMark />
            Sign in with email
          </button>
          <button type="button" onClick={() => switchMode('magic')} className={BUTTON_BASE}>
            <LinkMark />
            Sign in with magic link
          </button>

          <p className="pt-2 text-center text-[0.75rem] opacity-50">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => switchMode('signup')} className="font-bold text-teal hover:underline">
              Sign up
            </button>
          </p>
        </div>
      )}

      {mode === 'email' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish('email', () => signInWithEmail(email.trim(), password));
          }}
          className="space-y-3"
        >
          <InputField
            autoFocus
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={busy}
            autoComplete="email"
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            disabled={busy}
            autoComplete="current-password"
            required
            minLength={6}
          />
          <SubmitButton pending={pending === 'email'} pendingLabel="Signing in…" label="Sign in" disabled={busy} />
          <p className="text-center text-[0.75rem] opacity-50">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              disabled={busy}
              className="font-bold text-teal hover:underline"
            >
              Forgot your password?
            </button>
          </p>
          <BackLink onClick={() => switchMode('choose')} disabled={busy} />
        </form>
      )}

      {mode === 'signup' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await run('signup', () => signUpWithEmail(email.trim(), password, name.trim()));
            if (!result?.error) {
              setNotice(
                'Account created. If a confirmation email arrives, open the link to activate it — if not, you are already signed in.'
              );
            }
          }}
          className="space-y-3"
        >
          <InputField
            autoFocus
            label="Name"
            type="text"
            value={name}
            onChange={setName}
            disabled={busy}
            autoComplete="name"
            required
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={busy}
            autoComplete="email"
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            disabled={busy}
            autoComplete="new-password"
            required
            minLength={6}
          />
          <SubmitButton
            pending={pending === 'signup'}
            pendingLabel="Creating account…"
            label="Create account"
            disabled={busy}
          />
          <BackLink onClick={() => switchMode('choose')} disabled={busy} />
        </form>
      )}

      {mode === 'magic' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await run('magic', () => signInWithMagicLink(email.trim(), next));
            if (!result?.error) setNotice(`Magic link sent to ${email.trim()} — check your inbox.`);
          }}
          className="space-y-3"
        >
          <InputField
            autoFocus
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={busy}
            autoComplete="email"
            required
          />
          <SubmitButton pending={pending === 'magic'} pendingLabel="Sending…" label="Send magic link" disabled={busy} />
          <BackLink onClick={() => switchMode('choose')} disabled={busy} />
        </form>
      )}

      {mode === 'forgot' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await run('forgot', () => sendPasswordReset(email.trim()));
            if (!result?.error) setNotice(`Reset link sent to ${email.trim()} — check your inbox.`);
          }}
          className="space-y-3"
        >
          <InputField
            autoFocus
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={busy}
            autoComplete="email"
            required
          />
          <SubmitButton pending={pending === 'forgot'} pendingLabel="Sending…" label="Send reset link" disabled={busy} />
          <BackLink onClick={() => switchMode('email')} disabled={busy} />
        </form>
      )}
    </div>
  );
}

/* ── Small controls, shared by every mode ─────────────────── */

const BUTTON_BASE =
  'flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-surface px-4 py-3 text-[0.88rem] font-bold text-indigo transition-colors hover:border-indigo/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-charcoal';

function Spinner() {
  return (
    <span
      className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

function Divider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-black/10 dark:border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-3 text-[0.72rem] uppercase tracking-wide opacity-50">or</span>
      </div>
    </div>
  );
}

function OAuthButton({ onClick, icon, label, disabled, pending, pendingLabel }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={BUTTON_BASE}>
      {pending ? <Spinner /> : icon}
      {pending ? pendingLabel : label}
    </button>
  );
}

function SubmitButton({ label, pending, pendingLabel, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo py-3 text-[0.9rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gold dark:text-indigo"
    >
      {pending && <Spinner />}
      {pending ? pendingLabel : label}
    </button>
  );
}

function InputField({ label, type, value, onChange, disabled, required, minLength, autoComplete, autoFocus }) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="mb-1 block text-[0.75rem] font-bold uppercase tracking-wide opacity-60">{label}</label>
      <div className="relative">
        <input
          type={isPassword && revealed ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={`w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 text-[0.88rem] text-indigo outline-none transition-colors focus:border-teal disabled:opacity-60 dark:border-white/10 dark:bg-sand dark:text-charcoal ${
            isPassword ? 'pr-12' : ''
          }`}
        />

        {/* Typing a password blind on a phone keyboard is the most common reason a first
            sign-in attempt fails, so the field can always be read back. */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            disabled={disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-bold text-teal hover:bg-sand disabled:opacity-60"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}

function BackLink({ onClick, disabled }) {
  return (
    <p className="pt-1 text-center text-[0.75rem] opacity-50">
      <button type="button" onClick={onClick} disabled={disabled} className="font-bold text-teal hover:underline">
        ← Back to sign-in options
      </button>
    </p>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function MailMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

function LinkMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
    </svg>
  );
}
