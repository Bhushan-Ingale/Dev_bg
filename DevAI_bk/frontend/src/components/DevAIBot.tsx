'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Terminal, ArrowRight } from 'lucide-react';

export default function DevAIBot() {
  const suggestions = [
    "Analyze auth.js for bottlenecks",
    "Explain PR #42 changes",
    "Check sprint velocity trends"
  ];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-black">
          <Brain size={20} />
        </div>
        <div>
          <h3 className="font-satoshi font-black leading-tight">DevAI INSIGHTS</h3>
          <p className="font-general text-[10px] uppercase tracking-widest text-white/40">Context-Aware RAG Engine</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <div className="rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/70">
          Hello! I've analyzed your latest commits to the <span className="text-primary font-bold">frontend</span> repo. 
          Your team is ahead of schedule, but code coverage in the 
          <code className="mx-1 rounded bg-black/40 px-1 text-accent">/api</code> folder dropped by 12%.
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <p className="px-2 text-[10px] font-bold uppercase tracking-tighter text-white/30">Quick Actions</p>
        {suggestions.map((text, i) => (
          <button key={i} className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-left text-xs transition-all hover:border-primary/50 hover:bg-primary/5">
            <span className="text-white/60 group-hover:text-primary">{text}</span>
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
      
      <div className="relative mt-4">
        <input 
          placeholder="Ask about your code..." 
          className="w-full rounded-2xl bg-black/40 p-4 pl-12 text-sm font-general outline-none border border-white/5 focus:border-primary"
        />
        <Terminal className="absolute left-4 top-4 text-white/20" size={18} />
      </div>
    </div>
  );
}