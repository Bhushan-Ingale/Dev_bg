'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import CountUp from 'react-countup';
import AnimatedCard from './AnimatedCard';

const stats = [
  { value: 50, label: 'Universities', suffix: '+' },
  { value: 10000, label: 'Commits Analyzed', suffix: '+' },
  { value: 500, label: 'Student Teams', suffix: '+' },
  { value: 24, label: 'Hour Support', suffix: '/7' },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <AnimatedCard key={index} delay={index * 0.1} className="text-center p-8">
            <p className="text-4xl md:text-5xl font-black font-['Satoshi'] text-[#ffde22] mb-2">
              {inView ? <CountUp end={stat.value} duration={2} suffix={stat.suffix} /> : '0'}
            </p>
            <p className="text-white/60">{stat.label}</p>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}