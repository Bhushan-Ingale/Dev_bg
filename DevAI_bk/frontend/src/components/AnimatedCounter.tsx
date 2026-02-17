'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export default function AnimatedCounter({ value, label, prefix = '', suffix = '', delay = 0 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="group relative p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md overflow-hidden">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
      <p className="text-4xl font-satoshi font-black text-white">
        {prefix}
        {inView ? <CountUp end={value} duration={2} delay={delay} /> : '0'}
        {suffix}
      </p>
      
      {/* Visual Shortcut: Interaction highlight */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffde22] to-[#ff414e] transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}