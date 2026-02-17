'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Code, Terminal, LogOut } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-[60] border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffde22] text-black shadow-[0_0_15px_rgba(255,222,34,0.2)]">
            <Terminal size={22} strokeWidth={3} />
          </div>
          <span className="font-satoshi text-2xl font-black italic tracking-tighter text-white">DevAI</span>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <button onClick={() => router.push('/login')} className="font-general text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">Sign In</button>
              <MagneticButton onClick={() => router.push('/login')} className="rounded-xl bg-[#ffde22] px-6 py-2.5 text-[10px] font-black uppercase text-black">
                Initialize Access
              </MagneticButton>
            </>
          ) : (
            <button onClick={logout} className="flex items-center gap-2 font-black text-[10px] uppercase text-[#ff414e]"><LogOut size={16}/> Terminate</button>
          )}
        </div>
      </div>
    </nav>
  );
}