import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      console.warn('[Culture Click] Sign-in unavailable — Supabase is not configured yet.');
      return;
    }
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signInWithGitHub = useCallback(async () => {
    if (!isSupabaseConfigured) {
      console.warn('[Culture Click] Sign-in unavailable — Supabase is not configured yet.');
      return;
    }
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      console.warn('[Culture Click] Sign-in unavailable — Supabase is not configured yet.');
      return { error: 'Supabase not configured' };
    }
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUpWithEmail = useCallback(async (email, password, name) => {
    if (!isSupabaseConfigured) {
      console.warn('[Culture Click] Sign-up unavailable — Supabase is not configured yet.');
      return { error: 'Supabase not configured' };
    }
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    if (!isSupabaseConfigured) {
      console.warn('[Culture Click] Sign-in unavailable — Supabase is not configured yet.');
      return { error: 'Supabase not configured' };
    }
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, isAuthEnabled: isSupabaseConfigured, authError, clearError,
      signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, signInWithMagicLink, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
