'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'CS Professor, Stanford',
    content: 'DevAI has transformed how I monitor student projects. The insights are invaluable.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Team Leader, Quantum',
    content: 'My team\'s productivity increased by 40% after using DevAI. The AI coach is amazing!',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Student Developer',
    content: 'I love seeing my progress visualized. It keeps me motivated to code more.',
    rating: 5
  }
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl md:text-5xl font-black font-['Satoshi'] text-center mb-4">
        What Our <span className="text-[#ffde22]">Users Say</span>
      </h2>
      <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
        Trusted by educators and students worldwide
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <AnimatedCard key={index} delay={index * 0.1} className="p-8">
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#ffde22] text-[#ffde22]" />
              ))}
            </div>
            <p className="text-white/80 mb-6">"{testimonial.content}"</p>
            <div>
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="text-sm text-white/60">{testimonial.role}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}