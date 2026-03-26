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

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // CRITICAL FIX: Only redirect on MANUAL login, never automatically
    // We check if user exists AND we have a real user session
    // But we want landing page to ALWAYS show first
    if (mounted && !loading) {
      // We don't auto-redirect even if user exists
      // User must explicitly go to login page
      console.log('Landing page loaded - no auto redirect');
    }
  }, [user, loading, mounted, router]);

  // Show loading while checking auth (brief moment)
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
      </div>
    );
  }

  // ALWAYS show landing page - NO AUTO REDIRECT
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}