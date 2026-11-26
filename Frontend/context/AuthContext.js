import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import api from '../services/api';
import { setToken, setUnauthorizedHandler } from '../services/http';
import { saveSession, loadSession, clearSession } from '../services/session';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// status: 'loading' (checking saved login) | 'out' | 'in'
// The login is stored on the device and stays until the user taps Logout.
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null });
  const tokenRef = useRef(null);

  const clearLocal = useCallback(async () => {
    await clearSession();
    tokenRef.current = null;
    setToken(null);
    setState({ status: 'out', user: null });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearLocal); // server says token expired -> back to login
    (async () => {
      const s = await loadSession();
      if (s && s.token) {
        tokenRef.current = s.token;
        setToken(s.token);
        setState({ status: 'in', user: s.user });
      } else {
        setState({ status: 'out', user: null });
      }
    })();
  }, [clearLocal]);

  const signIn = useCallback(async ({ username, password, company_code }) => {
    const { token, user } = await api.login({ username: username.trim(), password, company_code });
    tokenRef.current = token;
    setToken(token);
    await saveSession({ token, user });
    setState({ status: 'in', user });
  }, []);

  const signOut = useCallback(async () => {
    try { await api.logout(); } catch (e) { /* offline is fine */ }
    await clearLocal();
  }, [clearLocal]);

  const updateUser = useCallback((patch) => {
    setState((s) => {
      const user = { ...s.user, ...patch };
      saveSession({ token: tokenRef.current, user });
      return { ...s, user };
    });
  }, []);

  return <AuthContext.Provider value={{ ...state, signIn, signOut, updateUser }}>{children}</AuthContext.Provider>;
}
