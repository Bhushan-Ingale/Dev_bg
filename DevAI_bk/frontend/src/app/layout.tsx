'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const loadVanta = async () => {
      try {
        // Dynamic imports to resolve 'three' module error
        const THREE = await import('three');
        (window as any).THREE = THREE;
        const vantaNet = (await import('vanta/dist/vanta.net.min')).default;

        const vantaEffect = vantaNet({
          el: "#vanta-canvas",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xffde22,      // Cyber Yellow
          backgroundColor: 0x0a0a0a,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 16.00,
          showDots: true
        });

        return () => {
          if (vantaEffect) vantaEffect.destroy();
        };
      } catch (err) {
        console.error("Vanta initialization failed:", err);
      }
    };

    loadVanta();
  }, []);

  return (
    <html lang="en">
      <body className="font-general bg-[#0a0a0a] text-white selection:bg-[#ffde22] selection:text-black">
        <AuthProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            {/* 1. Animated Background Layer */}
            <div id="vanta-canvas" className="fixed inset-0 z-0 pointer-events-none opacity-50 transition-opacity duration-1000" />

            {/* 2. Visual Layering: Radial Mask */}
            <div className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_90%)]" />

            {/* 3. Visual Layering: Premium Noise/Grain */}
            <div className="fixed inset-0 z-[2] pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />

            {/* 4. Content Layer */}
            <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-6 md:px-8 lg:py-10">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>

        <style jsx global>{`
          #vanta-canvas canvas { display: block; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #0a0a0a; }
          ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; border: 2px solid #0a0a0a; }
          ::-webkit-scrollbar-thumb:hover { background: #ffde22; }
        `}</style>
      </body>
    </html>
  );
}