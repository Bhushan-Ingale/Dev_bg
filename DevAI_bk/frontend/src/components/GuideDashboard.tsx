'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, LayoutGrid, List, BarChart3, Brain, 
  LogOut, Trash2, GitBranch, Search, Filter,
  Crown, Target, Award, GitCommit, UserCircle,
  TrendingUp, Activity, Bell, Github, CheckCircle, 
  MessageSquare, ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnalyticsChart from './AnalyticsChart';
import AddGroupModal from './AddGroupModal';
import MagneticButton from './MagneticButton';

// Live activity feed component
const LiveActivityFeed = () => {
  const [activities] = useState([
    { id: 1, team: 'Team Quantum', action: 'pushed 3 commits', time: 'just now', icon: GitCommit, color: '#ffde22' },
    { id: 2, team: 'Team Nebula', action: 'opened PR #42', time: '2m ago', icon: GitBranch, color: '#ff8928' },
  ]);

  return (
    <div className="flex flex-col gap-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${activity.color}20` }}>
            <activity.icon size={14} style={{ color: activity.color }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-white/80">
              <span className="text-white">{activity.team}</span> {activity.action}
            </p>
            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function GuideDashboard() {
  const { logout } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // FIXED: Explicit initial state to prevent Parsing Ecmascript errors
  const [teams, setTeams] = useState([
    { id: '1', name: 'Team Quantum', members: ['Alice', 'Bob'], leader: 'Alice', progress: 85, commits: 132, lastActive: '2h ago', activityScore: 98 },
    { id: '2', name: 'Team Nebula', members: ['Diana', 'Frank'], leader: 'Diana', progress: 72, commits: 89, lastActive: '5h ago', activityScore: 76 }
  ]);
  
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
    if (selectedTeam?.id === id) setSelectedTeam(null);
  };

  const handleAddGroup = (newGroup: any) => {
    const newTeam = {
      id: `team_${Date.now()}`,
      name: newGroup.name,
      members: newGroup.members,
      leader: newGroup.leader || newGroup.members[0],
      progress: 0,
      commits: 0,
      lastActive: 'Just now',
      activityScore: 0,
      repoUrl: newGroup.repoUrl || ''
    };
    setTeams([...teams, newTeam]);
    setShowAddModal(false);
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-white font-general p-4 md:p-8 selection:bg-[#ffde22] selection:text-black">
      {/* Header Bento Tile */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-2xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#ffde22] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,222,34,0.3)]">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h1 className="font-satoshi text-3xl font-black italic tracking-tighter uppercase text-white leading-none">Guide Control</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffde22] mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffde22] animate-pulse"/> Tracking {teams.length} clusters
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 outline-none focus:border-[#ffde22] transition-all text-sm"
              placeholder="Search squads..."
            />
          </div>
          <MagneticButton onClick={() => setShowAddModal(true)} className="rounded-2xl bg-[#ffde22] px-8 py-4 font-satoshi font-black text-black hover:scale-105 transition-all">
            <Plus className="inline-block mr-2" size={20} /> New Team
          </MagneticButton>
          <button onClick={logout} className="rounded-2xl border border-white/10 p-4 hover:bg-[#ff414e] hover:text-white text-[#ff414e] transition-all"><LogOut size={20}/></button>
        </div>
      </header>

      {/* Main Grid System */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Team Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-satoshi text-lg font-bold uppercase tracking-widest text-white/40 italic">Active Rosters</h2>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#ffde22] text-black shadow-lg shadow-[#ffde22]/20' : 'text-white/40'}`}><LayoutGrid size={14}/></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#ffde22] text-black shadow-lg shadow-[#ffde22]/20' : 'text-white/40'}`}><List size={14}/></button>
            </div>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredTeams.map((team) => (
                <motion.div 
                  layout key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedTeam(team)}
                  className={`group relative cursor-pointer rounded-[2rem] border p-6 transition-all duration-500 ${
                    selectedTeam?.id === team.id 
                      ? 'border-[#ffde22]/50 bg-[#ffde22]/10 shadow-[0_0_30px_rgba(255,222,34,0.1)]' 
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffde22] border border-white/5"><GitBranch size={20}/></div>
                      <div>
                        <h3 className="font-satoshi text-xl font-bold italic tracking-tighter">{team.name}</h3>
                        <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.2em]">{team.lastActive}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTeam(team.id); }} className="opacity-0 group-hover:opacity-100 text-[#ff414e] transition-opacity p-2 hover:bg-[#ff414e]/10 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                  
                  <div className="mt-6 flex items-end justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-white/40 italic">
                        <span>Sprint Completion</span>
                        <span className="text-[#ffde22]">{team.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${team.progress}%` }} className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928]" />
                      </div>
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-500 ${selectedTeam?.id === team.id ? 'translate-x-1 text-[#ffde22]' : 'text-white/10'}`} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Intelligence Suite */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedTeam ? (
              <motion.div key={selectedTeam.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                {/* Analytics Chart Tile */}
                <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><TrendingUp size={120}/></div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="font-satoshi text-4xl font-black italic uppercase tracking-tighter mb-2">{selectedTeam.name} Deep-Dive</h2>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full"><Crown size={12} className="text-[#ffde22]"/> {selectedTeam.leader}</span>
                        <span className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full"><GitCommit size={12} className="text-[#ff8928]"/> {selectedTeam.commits} Total Commits</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <AnalyticsChart data={null} />
                  </div>
                </div>
                
                {/* Secondary Row: AI + Live Stream */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Stream */}
                  <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8">
                    <h3 className="font-satoshi text-xs font-black uppercase tracking-[0.2em] text-[#ffde22] mb-6 flex items-center gap-2 italic">
                      <Activity size={14} className="animate-pulse"/> Live Surveillance
                    </h3>
                    <LiveActivityFeed />
                  </div>

                  {/* AI Insights Bento */}
                  <div className="space-y-6">
                    <div className="rounded-[2rem] border border-[#ffde22]/20 bg-[#ffde22]/5 p-8 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500 pointer-events-none"><Brain size={80}/></div>
                       <h4 className="font-satoshi font-black uppercase tracking-tighter text-[#ffde22] mb-4 flex items-center gap-2 italic"><Brain size={18}/> Intelligence AI</h4>
                       <p className="text-sm leading-relaxed text-white/70 italic font-medium">
                         "Squad velocity is increasing. Consider moving <span className="text-[#ffde22] font-bold">Bob</span> to the API cluster to assist with the pending PR reviews."
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center">
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1 italic">Code Quality</p>
                          <p className="text-2xl font-satoshi font-black text-[#ffde22]">92%</p>
                       </div>
                       <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center">
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1 italic">Tech Stack</p>
                          <p className="text-xs font-black text-white/60">REACT / NODE</p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center bg-white/[0.01]">
                <Brain className="text-white/5 mb-6 animate-pulse" size={80} />
                <h3 className="font-satoshi text-xl font-bold text-white/20 uppercase tracking-widest italic">Awaiting Squad Selection</h3>
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mt-2 italic">Initialize intelligence deep-dive protocol</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Manual Team Creation Modal */}
      {showAddModal && (
        <AddGroupModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddGroup} 
        />
      )}
    </div>
  );
}