import { createContext, useContext } from 'react';

/**
 * Authentication state and actions (Supabase Auth).
 *
 * The provider lives in `AuthProvider.jsx`; this module exports no components, so it can
 * be edited without breaking hot reload.
 */
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
