'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Code, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0a]/95 border-b border-[#ffde22]/10' : 'bg-[#0a0a0a]/80'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-3 cursor-pointer bg-transparent border-none"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#ffde22] via-[#ff8928] to-[#ff414e] bg-clip-text text-transparent">
              DevAI
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <button
              onClick={() => handleNavigation('/')}
              className="text-white/80 hover:text-[#ffde22] bg-transparent border-none cursor-pointer text-sm transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white/80 hover:text-[#ffde22] bg-transparent border-none cursor-pointer text-sm transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-white/80 hover:text-[#ffde22] bg-transparent border-none cursor-pointer text-sm transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-white/80 hover:text-[#ffde22] bg-transparent border-none cursor-pointer text-sm transition-colors"
            >
              Pricing
            </button>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-white/80 hover:text-[#ffde22] bg-transparent border-none cursor-pointer text-sm transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-5 py-2 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-semibold border-none cursor-pointer text-sm hover:scale-105 transition-all"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student')}
                className="px-5 py-2 bg-[#ffde22]/10 text-[#ffde22] rounded-xl font-semibold border border-[#ffde22]/30 cursor-pointer text-sm"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white bg-transparent border-none cursor-pointer"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            <div className="fixed top-0 right-0 w-[300px] h-screen bg-[#0a0a0a] border-l border-[#ffde22]/20 z-50 p-8 overflow-y-auto md:hidden">
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white bg-transparent border-none cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-white text-left py-3 border-b border-[#ffde22]/10 bg-transparent border-none cursor-pointer text-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }}
                  className="text-white text-left py-3 border-b border-[#ffde22]/10 bg-transparent border-none cursor-pointer text-lg"
                >
                  Features
                </button>
                <button
                  onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }}
                  className="text-white text-left py-3 border-b border-[#ffde22]/10 bg-transparent border-none cursor-pointer text-lg"
                >
                  How It Works
                </button>
                <button
                  onClick={() => { scrollToSection('pricing'); setIsMenuOpen(false); }}
                  className="text-white text-left py-3 border-b border-[#ffde22]/10 bg-transparent border-none cursor-pointer text-lg"
                >
                  Pricing
                </button>
                
                <div className="mt-8 flex flex-col gap-4">
                  {!user ? (
                    <>
                      <button
                        onClick={() => handleNavigation('/login')}
                        className="py-3 text-center border border-[#ffde22]/30 rounded-xl bg-transparent text-white cursor-pointer"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => handleNavigation('/login')}
                        className="py-3 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-semibold border-none cursor-pointer"
                      >
                        Get Started
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student')}
                      className="py-3 bg-[#ffde22]/10 text-[#ffde22] rounded-xl border border-[#ffde22]/30 cursor-pointer"
                    >
                      Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}