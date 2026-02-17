'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] selection:bg-[#ffde22] selection:text-black">
      {/* Visual Layer: Premium Texture */}
      <div className="fixed inset-0 z-[5] pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
      
      <Navbar />
      <div className="space-y-24 pb-24">
        <Hero />
        <Features />
      </div>
      <Footer />
    </main>
  );
}