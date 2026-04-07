'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { RetroGrid } from '@/components/magicui/retro-grid';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && user) {
      console.log('User already logged in, but staying on landing page');
    }
  }, [user, loading, mounted, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Retro Grid Background */}
      <RetroGrid 
        angle={45}
        cellSize={50}
        opacity={0.15}
        lightLineColor="#ffde22"
        darkLineColor="#ff8928"
        className="z-0"
      />
      
      {/* Content - ensure it's above the grid */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}