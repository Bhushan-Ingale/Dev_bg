'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { logout, user } = useAuth();

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8">
        <p className="font-satoshi font-black text-xl italic text-white">DevAI</p>
        
        <div className="flex gap-8 items-center">
          {user && (
            <button onClick={logout} className="text-[10px] font-black uppercase text-[#ff414e] tracking-widest hover:brightness-125 transition-all">
              Terminate Session
            </button>
          )}
          <span className="text-[10px] font-bold text-white/10 uppercase italic">
            © 2026 Intelligent Systems
          </span>
        </div>
      </div>
    </footer>
  );
}