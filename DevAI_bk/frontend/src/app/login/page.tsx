'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded Differentiator Logic
    if (password !== 'anything123') {
      return setError("Access Denied: Invalid Security Pass");
    }

    if (email === 'guide@123') {
      // 1. Update Global State First
      login(email, 'guide'); 
      // 2. Redirect to the EXACT folder path
      router.replace('/dashboard/guide'); 
    } else if (email === 'student@123') {
      login(email, 'student');
      router.replace('/dashboard/student');
    } else {
      setError("Unauthorized Squad ID");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.form 
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffde22] text-black mb-6 shadow-[0_0_20px_rgba(255,222,34,0.3)]">
            <Terminal size={28} />
          </div>
          <h2 className="font-satoshi text-4xl font-black italic text-white uppercase tracking-tighter">DevAI LOGIN</h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-white/20 italic">Repository Access Protocol</p>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 rounded-xl bg-[#ff414e]/10 p-3 text-[10px] font-black text-[#ff414e] uppercase border border-[#ff414e]/20">
              <ShieldAlert size={14} /> {error}
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-white/40">Squad ID</label>
            <input 
              type="text" placeholder="e.g. guide@123" 
              className="w-full rounded-2xl bg-white/5 p-4 border border-white/5 focus:border-[#ffde22] outline-none transition-all text-white font-general"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-white/40">Security Pass</label>
            <input 
              type="password" placeholder="••••••••" 
              className="w-full rounded-2xl bg-white/5 p-4 border border-white/5 focus:border-[#ffde22] outline-none transition-all text-white font-general"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <MagneticButton className="w-full">
          <button type="submit" className="w-full rounded-2xl bg-[#ffde22] py-5 font-satoshi font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,222,34,0.4)] hover:brightness-110 active:scale-95 transition-all">
            INITIALIZE SESSION
          </button>
        </MagneticButton>
      </motion.form>
    </div>
  );
}