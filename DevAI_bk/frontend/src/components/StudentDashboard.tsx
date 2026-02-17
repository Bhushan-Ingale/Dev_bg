'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCommit, Target, Award, Code, Brain, 
  LogOut, Plus, Star, ArrowRight, Github,
  Activity, Zap, MessageSquare, Terminal
} from 'lucide-react';
import AnalyticsChart from './AnalyticsChart';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'My Commits', value: 143, icon: GitCommit, color: '#ffde22' },
    { label: 'Sprint Progress', value: '78%', icon: Target, color: '#ff8928' },
    { label: 'Code Quality', value: '92%', icon: Award, color: '#ff414e' },
    { label: 'Rank', value: 'Elite', icon: Zap, color: '#ffde22' }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8 font-general">
      {/* Dynamic Header */}
      <header className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ffde22] rounded-2xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,222,34,0.3)]">
            <Code size={24}/>
          </div>
          <div>
            <h1 className="font-satoshi text-2xl font-black italic tracking-tighter uppercase">Squad Member: {user?.name || 'Alpha'}</h1>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Team Quantum • Sprint 4/6</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex bg-black/40 rounded-2xl p-1 gap-1 border border-white/5">
            {['overview', 'kanban', 'calendar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#ffde22] text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <button 
            onClick={logout}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff414e]/20 bg-[#ff414e]/5 text-[#ff414e] hover:bg-[#ff414e] hover:text-white transition-all"
          >
            <LogOut size={20}/>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Analytics Hub */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#ffde22] group-hover:scale-110 transition-transform"><stat.icon size={20}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                    <p className="text-3xl font-satoshi font-black italic">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-satoshi text-xl font-black italic uppercase tracking-tighter">Activity Velocity</h2>
                  <button className="flex items-center gap-2 rounded-xl bg-[#ffde22] px-4 py-2 text-[10px] font-black text-black uppercase transition-transform hover:scale-105">
                    <Plus size={14}/> New Task
                  </button>
                </div>
                <AnalyticsChart data={null} />
              </div>
            </div>

            {/* AI Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-[2.5rem] border border-[#ffde22]/20 bg-[#ffde22]/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Brain size={100}/></div>
                <h3 className="font-satoshi font-black uppercase tracking-tighter text-[#ffde22] mb-6 flex items-center gap-2"><Brain size={20}/> DevAI Coach</h3>
                <p className="text-sm leading-relaxed text-white/70 mb-8 italic">
                  "Your contribution to the <span className="text-[#ffde22] font-bold">API cluster</span> is rising. Focus on refactoring the RAG pipeline to maintain quality scores."
                </p>
                <button className="flex items-center gap-3 font-satoshi font-black text-[10px] uppercase tracking-[0.2em] text-[#ffde22] hover:gap-5 transition-all">
                  Launch Assistant <ArrowRight size={16}/>
                </button>
              </div>

              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
                <h3 className="font-satoshi font-black uppercase tracking-widest text-[10px] text-white/40 mb-6 flex items-center gap-2"><Star size={16} className="text-[#ffde22]"/> Milestone Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Clean Coder', 'Bug Hunter', 'Early Bird', 'Top Committer'].map(badge => (
                    <div key={badge} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#ffde22]/30 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-[#ffde22]/10 text-[#ffde22] flex items-center justify-center"><Award size={16}/></div>
                      <span className="text-[8px] font-black uppercase text-center text-white/40 tracking-tighter">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'kanban' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8"><Kanban /></motion.div>}
        {activeTab === 'calendar' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8"><CalendarPage /></motion.div>}
      </AnimatePresence>
    </div>
  );
}