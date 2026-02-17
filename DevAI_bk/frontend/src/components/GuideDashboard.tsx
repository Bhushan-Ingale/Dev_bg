'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, LayoutGrid, List, BarChart3, Brain, 
  LogOut, Trash2, GitBranch, Search, Filter,
  Crown, Target, Award, GitCommit, UserCircle,
  TrendingUp, Activity, Bell, Github
} from 'lucide-react';
import AnalyticsChart from './AnalyticsChart';
import AddGroupModal from './AddGroupModal';
import MagneticButton from './MagneticButton';

interface Team {
  id: string;
  name: string;
  members: string[];
  leader: string;
  progress: number;
  commits: number;
  lastActive: string;
  repoUrl: string;
}

export default function GuideDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teams, setTeams] = useState<Team[]>([
    { id: '1', name: 'Team Quantum', members: ['Alice', 'Bob'], leader: 'Alice', progress: 85, commits: 65, lastActive: '2h ago', repoUrl: '' },
    { id: '2', name: 'Team Nebula', members: ['Diana', 'Frank'], leader: 'Diana', progress: 72, commits: 42, lastActive: '5h ago', repoUrl: '' }
  ]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
    if (selectedTeam?.id === id) setSelectedTeam(null);
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-general p-4 md:p-8">
      {/* Premium Header Bento */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-2xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#ffde22] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,222,34,0.3)]">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h1 className="font-satoshi text-3xl font-black italic tracking-tighter uppercase text-white">Guide Control</h1>
            <p className="text-sm text-white/40 font-medium">Monitoring {teams.length} active squads</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 outline-none focus:border-[#ffde22] transition-all"
              placeholder="Search squads..."
            />
          </div>
          <MagneticButton onClick={() => setShowAddModal(true)} className="rounded-2xl bg-[#ffde22] px-8 py-4 font-satoshi font-black text-black hover:scale-105 transition-all">
            <Plus className="inline-block mr-2" size={20} /> New Team
          </MagneticButton>
          <button className="rounded-2xl border border-white/10 p-4 hover:bg-white/5 transition-colors"><Bell size={20}/></button>
          <button className="rounded-2xl border border-white/10 p-4 hover:bg-white/5 text-[#ff414e] transition-colors"><LogOut size={20}/></button>
        </div>
      </header>

      {/* Main Grid System */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Team List (4 Units) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="font-satoshi text-lg font-bold uppercase tracking-widest text-[#ffde22]">Squad Rosters</h2>
            <div className="flex bg-white/5 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#ffde22] text-black' : 'text-white/40'}`}><LayoutGrid size={16}/></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#ffde22] text-black' : 'text-white/40'}`}><List size={16}/></button>
            </div>
          </div>

          <AnimatePresence>
            {filteredTeams.map((team) => (
              <motion.div 
                layout key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`group relative cursor-pointer rounded-[2rem] border p-6 transition-all duration-500 ${selectedTeam?.id === team.id ? 'border-[#ffde22]/50 bg-[#ffde22]/10 shadow-[0_0_30px_rgba(255,222,34,0.1)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffde22]"><GitBranch size={20}/></div>
                    <div>
                      <h3 className="font-satoshi text-xl font-bold">{team.name}</h3>
                      <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Active {team.lastActive}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTeam(team.id); }} className="opacity-0 group-hover:opacity-100 text-[#ff414e] transition-opacity p-2 hover:bg-[#ff414e]/10 rounded-lg"><Trash2 size={16}/></button>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                    <span className="text-white/40">Sprint Health</span>
                    <span className="text-[#ffde22]">{team.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${team.progress}%` }} className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Analytics & Assistant (8 Units) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedTeam ? (
              <motion.div key={selectedTeam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Brain size={120}/></div>
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="font-satoshi text-4xl font-black italic uppercase italic mb-2">{selectedTeam.name} Deep-Dive</h2>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest"><Crown size={14} className="text-[#ffde22]"/> {selectedTeam.leader}</span>
                        <span className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest"><GitCommit size={14}/> {selectedTeam.commits} Commits</span>
                      </div>
                    </div>
                  </div>
                  <AnalyticsChart data={null} />
                </div>
                
                {/* Contextual Assistant Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-[#ffde22]/20 bg-[#ffde22]/5 p-8">
                    <h4 className="font-satoshi font-black uppercase tracking-tighter text-[#ffde22] mb-4 flex items-center gap-2"><Brain size={18}/> AI Insight</h4>
                    <p className="text-sm leading-relaxed text-white/70 italic font-medium">"Velocity has peaked. Consider moving {selectedTeam.members[1]} to the backend cluster to resolve the current bottleneck."</p>
                  </div>
                  <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Code Quality</p>
                      <p className="text-4xl font-satoshi font-black text-white italic">92%</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center text-[#ffde22] bg-white/5 shadow-[0_0_20px_rgba(255,222,34,0.1)]"><Award size={32}/></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center">
                <Brain className="text-white/10 mb-6" size={80} />
                <h3 className="font-satoshi text-xl font-bold text-white/20 uppercase tracking-widest italic">Initialize Squad Analysis</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && <AddGroupModal onClose={() => setShowAddModal(false)} onSubmit={(nt) => setTeams([...teams, { ...nt, id: Date.now().toString(), progress: 0, commits: 0, lastActive: 'Just now' }])} />}
      </AnimatePresence>
    </div>
  );
}