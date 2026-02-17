'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Github, Sparkles } from 'lucide-react';
import MagneticButton from './MagneticButton';

/**
 * Hero component for DevAI Landing Page
 * Features GSAP-ready layout, Satoshi/General Sans typography, 
 * and functional routing for the login gateway.
 */
export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Visual Layer: Content Container */}
      <div className="text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Version Badge: Using Cyber Yellow palette [#ffde22] */}
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1">
          <Sparkles size={14} className="text-primary" />
          <span className="font-general text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Next-Gen Analytics v2.0
          </span>
        </div>
        
        {/* Primary Heading: Satoshi Black with Cyber-Academic Gradient */}
        <h1 className="font-satoshi text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white mb-8">
          CODE <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent italic">INTELLIGENCE</span><br />
          FOR RESEARCH SQUADS
        </h1>

        {/* Supporting Copy: General Sans for readability */}
        <p className="mx-auto max-w-2xl font-general text-lg leading-relaxed text-white/40 mb-10">
          DevAI unifies repository analysis, student contribution tracking, and context-aware RAG assistance into one high-performance dashboard[cite: 1, 9, 27].
        </p>

        {/* Action Buttons: Functional Routing and Interactive Magnetic Effects */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          
          {/* Main Action: Functional Login Routing */}
          <MagneticButton 
            onClick={() => router.push('/login')} 
            className="rounded-2xl bg-primary px-10 py-5 font-satoshi font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,222,34,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              Start Analyzing <ArrowRight size={20} />
            </span>
          </MagneticButton>
          
          {/* Secondary Action: External Repository Link  */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 font-satoshi font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10 hover:border-white/20"
          >
            <Github size={20} /> Repository
          </a>
        </div>
      </div>

      {/* Background Depth: Subtle Radial Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)] pointer-events-none" />
    </section>
  );
}