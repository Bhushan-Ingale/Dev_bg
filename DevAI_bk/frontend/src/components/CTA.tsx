'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

export default function CTA() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedCard className="relative overflow-hidden p-12 text-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffde22]/10 to-[#ff414e]/10" />
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black font-['Satoshi'] mb-4">
            Ready to Transform Your
            <span className="block text-[#ffde22]">Coding Projects?</span>
          </h2>
          
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students already using DevAI
          </p>

          <button
            onClick={() => router.push('/login')}
            className="btn-primary text-lg px-8 py-4 group"
          >
            <span className="flex items-center gap-3">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <Sparkles className="w-5 h-5 text-black/50" />
            </span>
          </button>

          <p className="text-sm text-white/40 mt-4">
            No credit card required • Free for educators
          </p>
        </div>
      </AnimatedCard>
    </section>
  );
}