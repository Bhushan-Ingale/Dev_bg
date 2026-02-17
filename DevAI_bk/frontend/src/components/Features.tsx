'use client';

import { motion } from 'framer-motion';
import { Github, BarChart3, Brain, Users, Award, Zap } from 'lucide-react';

const features = [
  { icon: Github, title: 'Repository Ingestion', desc: 'Semantic code parsing using Tree Sitter and RAG pipelines.', size: 'lg' },
  { icon: Brain, title: 'Context Assistant', desc: 'Personal AI coaches that understand every commit history.', size: 'md' },
  { icon: BarChart3, title: 'Analytic Deep-Dives', desc: 'High-fidelity visualizations of squad velocity and code quality.', size: 'md' },
  { icon: Award, title: 'Merit System', desc: 'Achievement-based tracking to motivate elite development.', size: 'lg' }
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-12">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className={`rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl ${
              f.size === 'lg' ? 'md:col-span-2 lg:col-span-7' : 'md:col-span-2 lg:col-span-5'
            }`}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <f.icon size={28} />
            </div>
            <h3 className="mb-4 font-satoshi text-3xl font-black tracking-tight">{f.title}</h3>
            <p className="font-general text-sm leading-relaxed text-white/40">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}