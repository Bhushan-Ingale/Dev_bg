'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function CalendarPage() {
  const [date] = useState(new Date());
  // Generating a range for the current month view
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 font-general">
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-2xl font-black italic uppercase tracking-tighter text-white">Team Timeline</h2>
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/5 backdrop-blur-md">
          <button className="p-2 hover:text-[#ffde22] transition-colors"><ChevronLeft size={18}/></button>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">February 2026</span>
          <button className="p-2 hover:text-[#ffde22] transition-colors"><ChevronRight size={18}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {/* FIXED: Using unique keys to prevent Console Errors */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
          <div key={`day-header-${d}-${index}`} className="text-center text-[10px] font-black text-white/20 mb-2">{d}</div>
        ))}
        {days.map((day) => (
          <button 
            key={`calendar-day-${day}`} 
            className={`aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
              day === 17 
                ? 'bg-[#ffde22] border-[#ffde22] text-black shadow-[0_0_15px_rgba(255,222,34,0.4)] scale-105' 
                : 'bg-white/5 border-white/5 text-white/40 hover:border-[#ffde22]/50 hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-[#ffde22]/5 border border-[#ffde22]/20 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-[#ffde22]/20 flex items-center justify-center text-[#ffde22]">
          <Zap size={20} fill="currentColor"/>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-[#ffde22] tracking-widest">Upcoming Deadline</h4>
          <p className="text-sm font-bold text-white/80">Final Squad Presentation • Feb 24th</p>
        </div>
      </div>
    </div>
  );
}