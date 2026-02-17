'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCommit, Target, Award, Code, Brain, 
  LogOut, Plus, Star, ArrowRight, Github,
  Activity, Zap, MessageSquare, Terminal, Crown, Clock
} from 'lucide-react';
import AnalyticsChart from './AnalyticsChart';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Hardcoded for UI reference from deepseek_tsx
  const teamData = {
    name: 'Team Quantum',
    progress: 78,
    sprint: 'Sprint 4/6',
    members: [
      { name: 'Alice Chen', commits: 65, activity_score: 98, role: 'leader' },
      { name: 'Bob Smith', commits: 42, activity_score: 76, role: 'member' },
      { name: 'Charlie Brown', commits: 25, activity_score: 52, role: 'member' },
    ]
  };

  const activities = [
    { user: 'Alice', action: 'pushed 3 commits', time: '10m ago', repo: 'frontend' },
    { user: 'Bob', action: 'opened PR #42', time: '25m ago', repo: 'api' },
    { user: 'Charlie', action: 'commented on PR #41', time: '1h ago', repo: 'backend' },
  ];

  const stats = [
    { label: 'My Commits', value: 143, icon: GitCommit, color: '#ffde22' },
    { label: 'Sprint Progress', value: '78%', icon: Target, color: '#ff8928' },
    { label: 'Code Quality', value: '92%', icon: Award, color: '#ff414e' },
    { label: 'Rank', value: 'Elite', icon: Zap, color: '#ffde22' }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8 font-general selection:bg-[#ffde22] selection:text-black">
      {/* Dynamic Header */}
      <header className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ffde22] rounded-2xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,222,34,0.3)]">
            <Code size={24}/>
          </div>
          <div>
            <h1 className="font-satoshi text-2xl font-black italic tracking-tighter uppercase leading-none">
              Squad Member: {user?.name || 'Alpha'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#ffde22] font-black uppercase tracking-widest bg-[#ffde22]/10 px-2 py-0.5 rounded-full">
                {teamData.name}
              </span>
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">
                {teamData.sprint}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex bg-black/40 rounded-2xl p-1 gap-1 border border-white/5">
            {['overview', 'activity', 'team', 'kanban', 'calendar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#ffde22] text-black shadow-lg shadow-[#ffde22]/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <button 
            onClick={logout}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff414e]/20 bg-[#ff414e]/5 text-[#ff414e] hover:bg-[#ff414e] hover:text-white transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform"/>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#ffde22] group-hover:bg-[#ffde22]/10 transition-colors">
                      <stat.icon size={20}/>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                    <p className="text-3xl font-satoshi font-black italic">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-satoshi text-xl font-black italic uppercase tracking-tighter">Activity Velocity</h2>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ffde22] animate-pulse"/>
                    <span className="text-[10px] font-black uppercase text-white/40">Real-time commits</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                   <AnalyticsChart data={null} />
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
                <h2 className="font-satoshi text-xl font-black italic uppercase tracking-tighter mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#ffde22]/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#ffde22]/10 flex items-center justify-center text-[#ffde22]">
                          <GitCommit size={18}/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/80">
                            <span className="text-[#ffde22]">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">
                            {activity.repo} • {activity.time}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-white/10"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Coach Card */}
              <div className="rounded-[2.5rem] border border-[#ffde22]/20 bg-[#ffde22]/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <Brain size={100}/>
                </div>
                <h3 className="font-satoshi font-black uppercase tracking-tighter text-[#ffde22] mb-6 flex items-center gap-2">
                  <Brain size={20}/> DevAI Coach
                </h3>
                <p className="text-sm leading-relaxed text-white/70 mb-8 italic font-medium">
                  "Your contribution to the <span className="text-[#ffde22] font-bold">API cluster</span> is rising. Focus on refactoring the RAG pipeline to maintain quality scores."
                </p>
                <button className="flex items-center gap-3 font-satoshi font-black text-[10px] uppercase tracking-[0.2em] text-[#ffde22] hover:gap-5 transition-all">
                  Launch Assistant <ArrowRight size={16}/>
                </button>
              </div>

              {/* Team Progress Card */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
                <h3 className="font-satoshi font-black uppercase tracking-widest text-[10px] text-white/40 mb-6 flex items-center gap-2">
                  <Target size={16} className="text-[#ffde22]"/> Squad Health
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-white/60">Sprint Progress</span>
                      <span className="text-xs font-black text-[#ffde22]">{teamData.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${teamData.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {teamData.members.map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-[#ffde22] border border-white/10 relative">
                             {member.name[0]}
                             {member.role === 'leader' && <Crown size={8} className="absolute -top-1 -right-1 text-[#ffde22]"/>}
                           </div>
                           <span className="text-xs font-bold text-white/80">{member.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-[#ffde22]/60">{member.activity_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievements Card */}
              <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
                <h3 className="font-satoshi font-black uppercase tracking-widest text-[10px] text-white/40 mb-6 flex items-center gap-2">
                  <Star size={16} className="text-[#ffde22]"/> Milestone Badges
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Clean Coder', 'Bug Hunter', 'Early Bird', 'Top Committer'].map(badge => (
                    <div key={badge} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#ffde22]/30 transition-all cursor-default">
                      <div className="w-8 h-8 rounded-lg bg-[#ffde22]/10 text-[#ffde22] flex items-center justify-center">
                        <Award size={16}/>
                      </div>
                      <span className="text-[8px] font-black uppercase text-center text-white/40 tracking-tighter leading-none">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Improved Activity Tab View */}
        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="font-satoshi text-3xl font-black italic uppercase italic tracking-tighter">Full Repository History</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <Clock size={14} className="text-[#ffde22]"/>
                  <span className="text-[10px] font-black uppercase text-white/60">Feb 2026</span>
                </div>
             </div>
             {/* Integrated timeline visualization from deepseek code */}
             <div className="flex items-end gap-2 h-40 mb-12 px-4">
                {[12, 8, 15, 10, 7, 3, 5, 10, 14, 6].map((count, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${count * 6}px` }}
                    className="flex-1 bg-[#ffde22]/20 rounded-t-lg border-t border-[#ffde22]/40 hover:bg-[#ffde22]/40 transition-colors cursor-help"
                  />
                ))}
             </div>
             <div className="space-y-4">
               {/* Activity list here */}
               <p className="text-[10px] font-black uppercase text-white/20 text-center py-10 border border-dashed border-white/5 rounded-3xl">Detailed commit logs loading from repository cluster...</p>
             </div>
          </motion.div>
        )}

        {/* Existing Tab Integrations */}
        {activeTab === 'team' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10">
            <h2 className="font-satoshi text-3xl font-black italic uppercase italic tracking-tighter mb-8 text-center text-[#ffde22]">Squad Intelligence</h2>
            {/* Team details would go here following the sidebar logic above */}
          </motion.div>
        )}

        {activeTab === 'kanban' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8"><Kanban /></motion.div>}
        {activeTab === 'calendar' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8"><CalendarPage /></motion.div>}
      </AnimatePresence>
    </div>
  );
}