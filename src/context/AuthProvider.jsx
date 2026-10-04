import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, supabaseConfigIssue } from '../lib/supabaseClient';
import { friendlyAuthError } from '../lib/authMessages';
import { AuthContext } from './AuthContext';

/**
 * Authentication state and actions (Supabase Auth).
 *
 * Every credential path funnels through `runAuthAction`, which translates any failure through
 * `friendlyAuthError` (raw Supabase messages are precise and useless to a visitor), records it
 * for the UI to display, and returns `{ error, code }` so the caller can keep its form open and
 * react to *which* failure it was — an unconfirmed email offers to send a new link, a wrong
 * password offers the reset flow. When Supabase is not configured it returns the *specific*
 * configuration problem instead of a generic message — that is what turns a silent dead button
 * into an actionable notice.
 *
 * The profile row is loaded alongside the session because the account page and review
 * attribution both need it, and Supabase creates it with a database trigger on signup — so a
 * user who arrives through Google still has one.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Keyed by its owner so signing out (or switching accounts) can never show the previous
  // person's profile for a frame — the same reason the place page keys its tab state.
  const [loadedProfile, setLoadedProfile] = useState({ userId: null, data: null });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setAuthError(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const profile = loadedProfile.userId === user?.id ? loadedProfile.data : null;

  // The profile follows whoever is signed in.
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return undefined;

    let cancelled = false;

    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, home_state_id')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setLoadedProfile({ userId: user.id, data: data ?? null });
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const clearError = useCallback(() => setAuthError(null), []);

  const runAuthAction = useCallback(async (action) => {
    if (!isSupabaseConfigured) {
      setAuthError({ message: supabaseConfigIssue, code: null });
      return { error: supabaseConfigIssue, code: null };
    }

    setAuthError(null);
    const { error } = await action();
    if (error) {
      const friendly = friendlyAuthError(error.message, error.code);
      setAuthError(friendly);
      return { error: friendly.message, code: friendly.code };
    }
    return { error: null, code: null };
  }, []);

  const origin = typeof window === 'undefined' ? '' : window.location.origin;

  /**
   * Where Supabase should hand the visitor back after an OAuth hop or an emailed link.
   *
   * A bare origin used to lose the page they were on, so someone who clicked "Sign in to write
   * a review" landed back on the home page with no way to tell that the review was still
   * waiting. The path is carried through instead — but only when it is a path inside this app,
   * never an absolute URL, so `?next=` can never turn into an open redirect.
   */
  const redirectTo = useCallback(
    (next) => {
      const path = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
      return `${origin}${path}` || undefined;
    },
    [origin]
  );

  const signInWithGoogle = useCallback(
    (next) => runAuthAction(() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo(next) } })),
    [runAuthAction, redirectTo]
  );

  const signInWithGitHub = useCallback(
    (next) => runAuthAction(() => supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: redirectTo(next) } })),
    [runAuthAction, redirectTo]
  );

  const signInWithEmail = useCallback(
    (email, password) => runAuthAction(() => supabase.auth.signInWithPassword({ email, password })),
    [runAuthAction]
  );

  const signUpWithEmail = useCallback(
    (email, password, name) =>
      runAuthAction(() => supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })),
    [runAuthAction]
  );

  const signInWithMagicLink = useCallback(
    (email, next) =>
      runAuthAction(() => supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo(next) } })),
    [runAuthAction, redirectTo]
  );

  /**
   * Re-send the signup confirmation email.
   *
   * Without this, a visitor whose confirmation email went missing was stuck: signing up again
   * answers "user already registered" and signing in answers "email not confirmed", so the
   * account existed but there was no way to activate it from inside the app.
   */
  const resendConfirmation = useCallback(
    (email, next) =>
      runAuthAction(() =>
        supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirectTo(next) } })
      ),
    [runAuthAction, redirectTo]
  );

  /**
   * Password recovery. The link lands on /reset-password, which is a route the app owns —
   * possible only because the client uses the PKCE flow, so the token arrives as a `?code=`
   * query parameter instead of a fragment the router would swallow.
   */
  const sendPasswordReset = useCallback(
    (email) =>
      runAuthAction(() =>
        supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` })
      ),
    [runAuthAction, origin]
  );

  const updatePassword = useCallback(
    (password) => runAuthAction(() => supabase.auth.updateUser({ password })),
    [runAuthAction]
  );

  const updateProfile = useCallback(async (patch) => {
    if (!isSupabaseConfigured || !user) return { error: 'Not signed in.' };
    setAuthError(null);

    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
      .select('id, display_name, avatar_url, bio, home_state_id')
      .maybeSingle();

    if (error) {
      const friendly = friendlyAuthError(error.message, error.code);
      setAuthError(friendly);
      return { error: friendly.message };
    }

    setLoadedProfile({ userId: user.id, data: data ?? null });
    return { error: null };
  }, [user]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthEnabled: isSupabaseConfigured,
        configIssue: supabaseConfigIssue,
        authError,
        clearError,
        signInWithGoogle,
        signInWithGitHub,
        signInWithEmail,
        signUpWithEmail,
        signInWithMagicLink,
        sendPasswordReset,
        resendConfirmation,
        updatePassword,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
