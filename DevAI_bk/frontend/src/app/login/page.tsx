'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth();
  const router = useRouter();

  // Only redirect if we already have a user (from previous session)
  useEffect(() => {
    if (!loading && user) {
      console.log('Already logged in, redirecting to:', user.role);
      router.push(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student');
    }
  }, [user, loading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check password first
    if (password !== 'anything123') {
      setError("Access Denied: Invalid Security Pass");
      return;
    }

    // Determine role based on email
    let role = '';
    if (email === 'guide@123') {
      role = 'guide';
    } else if (email === 'student@123') {
      role = 'student';
    } else {
      setError("Unauthorized Squad ID");
      return;
    }

    // Attempt login
    const success = login(email, role);
    
    if (success) {
      // Redirect after successful login
      setTimeout(() => {
        router.push(role === 'guide' ? '/dashboard/guide' : '/dashboard/student');
      }, 100);
    } else {
      setError("Login failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.form 
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 rounded-[2.5rem] border-2 border-[#ffde22]/30 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black mb-6 shadow-[0_0_30px_rgba(255,222,34,0.5)]">
            <Terminal size={32} />
          </div>
          <h2 className="font-satoshi text-4xl font-black italic text-white uppercase tracking-tighter">DevAI LOGIN</h2>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-[#ffde22] italic">Repository Access Protocol</p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 flex items-center gap-2 rounded-xl bg-[#ff414e]/20 p-3 text-sm font-bold text-[#ff414e] uppercase border-2 border-[#ff414e]/50"
            >
              <ShieldAlert size={18} /> {error}
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="ml-2 text-sm font-bold uppercase tracking-widest text-[#ffde22]">Squad ID</label>
            <input 
              type="text" 
              placeholder="guide@123 or student@123" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/10 p-4 border-2 border-[#ffde22]/30 focus:border-[#ffde22] outline-none transition-all text-white font-general text-lg"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="ml-2 text-sm font-bold uppercase tracking-widest text-[#ffde22]">Security Pass</label>
            <input 
              type="password" 
              placeholder="anything123" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/10 p-4 border-2 border-[#ffde22]/30 focus:border-[#ffde22] outline-none transition-all text-white font-general text-lg"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full rounded-xl bg-gradient-to-r from-[#ffde22] to-[#ff8928] py-5 font-satoshi font-black uppercase tracking-widest text-black text-xl shadow-[0_0_30px_rgba(255,222,34,0.4)] hover:scale-105 transition-all"
        >
          INITIALIZE SESSION
        </button>

        <p className="text-center text-sm text-white/40">
          Use <span className="text-[#ffde22] font-bold">guide@123</span> or <span className="text-[#ffde22] font-bold">student@123</span> with password <span className="text-[#ffde22] font-bold">anything123</span>
        </p>
      </motion.form>
    </div>
  );
}