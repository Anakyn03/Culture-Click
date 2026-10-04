import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Where a password-recovery email lands.
 *
 * Supabase establishes a session from the link before this renders — which is possible because
 * the client runs the PKCE flow, so the credential arrives as a `?code=` parameter rather than
 * in the URL fragment. Had it stayed implicit, the fragment would be the router's own and this
 * route could never be reached.
 *
 * A `user` therefore means the link was good. No user means it expired, was already used, or
 * the page was opened by hand — all of which deserve the same honest sentence and a way to ask
 * for a new link, not a form that will fail.
 */
export default function ResetPasswordPage() {
  const { user, loading, isAuthEnabled, configIssue, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  if (loading) return null;

  if (!isAuthEnabled) {
    return <Notice title="Not connected yet">{configIssue}</Notice>;
  }

  if (!user) {
    return (
      <Notice title="This reset link has expired">
        Reset links are valid once and for a short time. Request a fresh one and it will arrive in
        your inbox within a minute.{' '}
        <Link to="/login" className="font-bold text-teal hover:underline">
          Back to sign in
        </Link>
      </Notice>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError('');
    const { error: failure } = await updatePassword(password);
    setPending(false);
    if (failure) setError(failure);
    else navigate('/account', { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-[420px] px-[clamp(18px,4vw,48px)] py-12">
      <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">Set a new password</h2>
      <p className="mt-1 text-[0.88rem]">
        Signed in as {user.email}. Choose a password you have not used here before.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-[0.82rem] text-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div>
          <label htmlFor="new-password" className="mb-1 block text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 text-[0.88rem] text-indigo outline-none focus:border-teal dark:border-white/10 dark:bg-sand dark:text-charcoal"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-indigo py-3 text-[0.9rem] font-bold text-white transition-colors hover:bg-indigo/90 disabled:opacity-60 dark:bg-gold dark:text-indigo"
        >
          {pending ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </div>
  );
}

function Notice({ title, children }) {
  return (
    <div className="mx-auto w-full max-w-[420px] px-[clamp(18px,4vw,48px)] py-12">
      <h2 className="font-serif text-[1.5rem] text-indigo dark:text-charcoal">{title}</h2>
      <p className="mt-1 text-[0.88rem]">{children}</p>
    </div>
  );
}
