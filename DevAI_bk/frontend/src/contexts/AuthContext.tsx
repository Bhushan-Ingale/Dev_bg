'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: string;
  name: string;
  loggedInAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS: Record<string, { role: string; name: string }> = {
  'guide@123':   { role: 'guide',   name: 'Guide' },
  'student@123': { role: 'student', name: 'Student' },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('devai_user');
      if (saved) {
        const parsed: User = JSON.parse(saved);
        if (parsed?.email && parsed?.role) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem('devai_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, role: string): boolean => {
    const cred = VALID_CREDENTIALS[email];
    if (!cred || cred.role !== role) return false;

    const userData: User = {
      email,
      role: cred.role,
      name: cred.name,
      loggedInAt: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem('devai_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devai_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};