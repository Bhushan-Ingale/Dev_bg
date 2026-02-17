'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount to persist session across refreshes
    const savedUser = localStorage.getItem('devai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: string) => {
    const userData = { email, role, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('devai_user', JSON.stringify(userData));
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
  // Protection: returns a safe fallback if accessed incorrectly
  if (context === undefined || context === null) {
    return { 
      user: null, 
      login: () => {}, 
      logout: () => {}, 
      loading: true 
    };
  }
  return context;
};