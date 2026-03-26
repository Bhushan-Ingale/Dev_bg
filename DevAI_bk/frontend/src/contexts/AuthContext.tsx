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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: We ONLY check if there's a user, but we DON'T auto-login
    // The landing page should show FIRST, then user must explicitly login
    const checkStoredUser = () => {
      try {
        const savedUser = localStorage.getItem('devai_user');
        if (savedUser) {
          // We parse it but don't set it automatically
          // This ensures landing page shows first
          console.log('Found stored user, but waiting for manual login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        // Always finish loading after checking
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const login = (email: string, role: string): boolean => {
    // Validate credentials
    if ((email === 'guide@123' && role === 'guide') || 
        (email === 'student@123' && role === 'student')) {
      
      const userData: User = { 
        email, 
        role, 
        name: role === 'guide' ? 'Guide' : 'Student',
        loggedInAt: new Date().toISOString()
      };
      
      // Set user in state
      setUser(userData);
      
      // Save to localStorage for persistence across refreshes
      localStorage.setItem('devai_user', JSON.stringify(userData));
      
      console.log('Login successful:', userData);
      return true;
    }
    
    console.log('Login failed: invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devai_user');
    // Force hard refresh to clear any lingering state
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
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};