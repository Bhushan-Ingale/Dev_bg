'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Terminal, AlertCircle } from 'lucide-react';
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
      return setError("Invalid Security Pass");
    }

    if (email === 'guide@123') {
      login(email, 'guide');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffde22] text-black mb-4 shadow-[0_0_20px_rgba(255,222,34,0.3)]">
            <Terminal size={24} />
          </div>
          <h2 className="font-satoshi text-4xl font-black italic text-white uppercase tracking-tighter">DevAI LOGIN</h2>
          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-[#ff414e] uppercase bg-[#ff414e]/10 p-3 rounded-xl border border-[#ff414e]/20">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <input 
            type="text" placeholder="Squad ID (e.g., guide@123)" 
            className="w-full rounded-2xl bg-white/5 p-4 border border-white/5 focus:border-[#ffde22] outline-none transition-all text-white"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" placeholder="Security Pass" 
            className="w-full rounded-2xl bg-white/5 p-4 border border-white/5 focus:border-[#ffde22] outline-none transition-all text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <MagneticButton className="w-full">
          <button type="submit" className="w-full rounded-2xl bg-[#ffde22] py-4 font-satoshi font-black uppercase text-black shadow-[0_0_25px_rgba(255,222,34,0.4)] hover:brightness-110 active:scale-95 transition-all">
            INITIALIZE SESSION
          </button>
        </MagneticButton>
      </motion.form>
    </div>
  );
}