'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Github, BarChart3, Brain, ArrowRight } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

const steps = [
  {
    icon: Github,
    title: 'Connect GitHub',
    description: 'Link your team\'s repository to start tracking commits and contributions.',
    color: '#ffde22'
  },
  {
    icon: BarChart3,
    title: 'Analyze Progress',
    description: 'Get real-time insights on individual contributions and team velocity.',
    color: '#ff8928'
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Receive personalized feedback and recommendations for improvement.',
    color: '#ff414e'
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl md:text-5xl font-black font-['Satoshi'] text-center mb-4">
        How It <span className="text-[#ffde22]">Works</span>
      </h2>
      <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
        Three simple steps to transform your coding projects
      </p>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connection Lines */}
        <div className="hidden md:block absolute top-1/3 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-[#ffde22] to-[#ff414e] opacity-20" />
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <AnimatedCard key={index} delay={index * 0.2} className="relative text-center p-8">
              <div 
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: `${step.color}20` }}
              >
                <Icon className="w-8 h-8" style={{ color: step.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/3 w-8 h-8 text-[#ffde22] opacity-40" />
              )}
            </AnimatedCard>
          );
        })}
      </div>
    </section>
  );
}