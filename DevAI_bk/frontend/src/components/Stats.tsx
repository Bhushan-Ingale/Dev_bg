'use client';

import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import CountUp from 'react-countup';
import { GitCommit, Users, GraduationCap, Clock } from 'lucide-react';

const stats = [
  { value: 50,    suffix: '+',  label: 'Universities',      sub: 'across India',          icon: GraduationCap, color: '#ffde22' },
  { value: 10000, suffix: '+',  label: 'Commits Analyzed',  sub: 'and growing daily',     icon: GitCommit,     color: '#ff8928' },
  { value: 500,   suffix: '+',  label: 'Student Teams',     sub: 'actively tracked',      icon: Users,         color: '#ff414e' },
  { value: 100,   suffix: '%',  label: 'Free for Educators',sub: 'no credit card needed', icon: Clock,         color: '#10b981' },
];

export default function Stats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-6 md:p-8 rounded-2xl border border-white/6 bg-white/[0.025] overflow-hidden group hover:border-white/12 transition-all"
            >
              {/* Subtle glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 100%, ${stat.color}12, transparent 70%)` }} />

              <div className="relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${stat.color}18` }}>
                  <Icon size={17} style={{ color: stat.color }} />
                </div>

                <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: stat.color }}>
                  {inView
                    ? <CountUp end={stat.value} duration={2.2} suffix={stat.suffix} separator="," />
                    : '0'}
                </p>
                <p className="font-semibold text-white text-sm md:text-base">{stat.label}</p>
                <p className="text-xs text-white/35 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}