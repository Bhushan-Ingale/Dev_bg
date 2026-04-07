'use client';

import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';

const DevAILogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <button onClick={() => router.push('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-lg flex items-center justify-center text-black">
            <DevAILogo />
          </div>
          <span className="font-bold text-white">DevAI</span>
          <span className="text-white/25 text-xs">· Academic Project Analytics</span>
        </button>

        {/* Quick links */}
        <div className="flex items-center gap-6 text-xs text-white/35">
          <button onClick={() => router.push('/login')} className="hover:text-white/70 transition-colors">Sign In</button>
          <a href="https://github.com/Bhushan-Ingale/Dev_bg" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
            <Github size={13} />View on GitHub
          </a>
          <span>© 2026 DevAI</span>
        </div>
      </div>
    </footer>
  );
}