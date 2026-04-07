'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users } from 'lucide-react';

export default function CTA() {
  const router = useRouter();
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-[#ffde22]/20 bg-gradient-to-br from-[#ffde22]/8 via-[#ff8928]/5 to-transparent p-12 md:p-16 text-center"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 blur-3xl bg-[#ffde22]/15 rounded-full" />
        </div>

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ffde22]/60 mb-4">
            Academic project tool — completely free
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to see DevAI<br />
            <span className="text-[#ffde22]">in action?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
            Log in as a Guide or Student and explore the dashboards with live data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-bold text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,222,34,0.3)]"
            >
              <GraduationCap size={18} />
              Login as Guide
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="group flex items-center justify-center gap-2 px-8 py-4 border border-[#ffde22]/25 text-white rounded-xl font-semibold text-base hover:bg-white/5 transition-all"
            >
              <Users size={18} />
              Login as Student
            </button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-8 inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-white/4 border border-white/8 text-xs text-white/40">
            <span>Guide: <code className="text-[#ffde22]">guide@123</code></span>
            <span className="w-px h-3 bg-white/15" />
            <span>Student: <code className="text-[#ff8928]">student@123</code></span>
            <span className="w-px h-3 bg-white/15" />
            <span>Password: <code className="text-white/60">anything123</code></span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}