'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// The DevAI logo mark — a proper code-branch SVG, not a generic <Code> square
const DevAILogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Relevant nav links for an academic tool — NO Pricing
const NAV_LINKS = [
  { label: 'Features',    id: 'features'     },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'For Guides',  id: 'for-guides'   },
  { label: 'For Students', id: 'for-students' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't show on dashboards
  if (pathname?.startsWith('/dashboard')) return null;

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (pathname !== '/') { router.push(`/#${id}`); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goTo = (path: string) => { setMenuOpen(false); router.push(path); };

  // Show "Back to Home" on login/signup pages
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  if (isAuthPage) {
    return (
      <nav className="w-full px-6 py-5 flex items-center justify-between bg-transparent">
        <button onClick={() => router.push('/')}
          className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-xl flex items-center justify-center text-black">
            <DevAILogo size={18} />
          </div>
          <span className="text-white font-bold text-lg">DevAI</span>
        </button>
        <button onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors group">
          <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>
      </nav>
    );
  }

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0a]/96 border-b border-white/6' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => goTo('/')}
          className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-xl flex items-center justify-center text-black group-hover:scale-105 transition-transform">
            <DevAILogo size={20} />
          </div>
          <span className="text-xl font-bold text-white">DevAI</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)}
              className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button onClick={() => goTo(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student')}
              className="flex items-center gap-2 px-4 py-2 bg-[#ffde22]/10 text-[#ffde22] rounded-xl text-sm font-semibold border border-[#ffde22]/25 hover:bg-[#ffde22]/15 transition-all">
              <LayoutDashboard size={15} />Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => goTo('/login')}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Sign In
              </button>
              <button onClick={() => goTo('/login')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,222,34,0.25)]">
                Get Started →
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-72 h-full bg-[#0d0d0d] border-l border-white/8 z-50 p-7 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-white">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 hover:bg-white/8 rounded-lg transition-colors">
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map(link => (
                  <button key={link.id} onClick={() => scrollTo(link.id)}
                    className="px-4 py-3 rounded-xl text-left text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm">
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-white/8">
                {user ? (
                  <button onClick={() => goTo(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student')}
                    className="py-3 bg-[#ffde22]/10 text-[#ffde22] rounded-xl font-semibold border border-[#ffde22]/25 text-sm">
                    Open Dashboard
                  </button>
                ) : (
                  <>
                    <button onClick={() => goTo('/login')}
                      className="py-3 border border-white/12 rounded-xl text-white/70 text-sm hover:bg-white/5 transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => goTo('/login')}
                      className="py-3 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-bold text-sm">
                      Get Started →
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}