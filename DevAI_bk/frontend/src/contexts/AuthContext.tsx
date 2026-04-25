'use client';

/**
 * AuthContext.tsx — DevAI Authentication Provider
 *
 * Drop at:  frontend/src/contexts/AuthContext.tsx
 *
 * What changed from the old version:
 *   OLD: hardcoded credential check, stored only user object, no token
 *   NEW: calls apiLogin() which:
 *          1. Hits POST /api/auth/login → gets real JWT from FastAPI
 *          2. Falls back to demo credentials if backend is offline
 *        Stores JWT in localStorage (TOKEN_KEY) — api.ts reads it automatically
 *        Stores user object in localStorage (USER_KEY) — restored on page refresh
 *        logout() clears both and redirects to /login
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  apiLogin,
  clearAuth,
  getToken,
  USER_KEY,
  type User,
  type LoginResponse,
} from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user:    User | null;
  token:   string | null;
  loading: boolean;
  login:   (email: string, password: string, role: 'guide' | 'student') => Promise<boolean>;
  logout:  () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on page refresh ──────────────────────────────────────
  useEffect(() => {
    try {
      const savedUser  = localStorage.getItem(USER_KEY);
      const savedToken = getToken();

      if (savedUser && savedToken) {
        const parsed: User = JSON.parse(savedUser);
        if (parsed?.email && parsed?.role) {
          setUser(parsed);
          setTokenState(savedToken);
        }
      }
    } catch {
      // Corrupted storage — wipe and start fresh
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (
    email:    string,
    password: string,
    role:     'guide' | 'student',
  ): Promise<boolean> => {
    try {
      const response: LoginResponse = await apiLogin(email, password, role);

      // apiLogin() already called setToken() internally — just sync state
      setUser(response.user);
      setTokenState(response.access_token);

      // Persist user so it survives a page refresh
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      return true;
    } catch (err) {
      console.error('[AuthContext] login failed:', err);
      return false;
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setTokenState(null);
    clearAuth(); // removes TOKEN_KEY + USER_KEY from localStorage
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};