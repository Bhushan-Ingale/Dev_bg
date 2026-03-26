'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  GitCommit, Users, TrendingUp, Code, Award,
  Calendar, ChevronRight, Star, Activity,
  BookOpen, Github, Clock, Brain, ArrowRight,
  Target, Zap, Crown, BarChart3, UserCheck,
  MessageSquare, Plus, Filter, Download, LogOut,
  PieChart, TrendingDown
} from 'lucide-react';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';

interface Commit {
  message: string;
  repo: string;
  time: string;
  hash: string;
  author: string;
}

interface Member {
  name: string;
  commits: number;
  additions: number;
  deletions: number;
  activity_score: number;
  role?: 'leader' | 'member';
  avatar?: string;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [teamData] = useState({
    name: 'Team Quantum',
    leader: 'Alice Chen',
    members: [
      { name: 'Alice Chen', commits: 65, additions: 1240, deletions: 320, activity_score: 98, role: 'leader' },
      { name: 'Bob Smith', commits: 42, additions: 890, deletions: 210, activity_score: 76, role: 'member' },
      { name: 'Charlie Brown', commits: 25, additions: 450, deletions: 120, activity_score: 52, role: 'member' },
    ] as Member[],
    progress: 78,
    sprint: 'Sprint 4/6',
    repo: 'github.com/team-quantum',
    velocity: 24,
    coverage: 82,
    openPRs: 3
  });

  const [commits] = useState<Commit[]>([
    { message: 'Fix navigation bug in dashboard', repo: 'frontend', time: '2h ago', hash: 'a1b2c3d', author: 'Alice' },
    { message: 'Add user authentication flow', repo: 'api', time: '5h ago', hash: 'e4f5g6h', author: 'Bob' },
    { message: 'Update API endpoints', repo: 'backend', time: '1d ago', hash: 'i7j8k9l', author: 'Charlie' },
    { message: 'Refactor chart components', repo: 'frontend', time: '2d ago', hash: 'm0n1o2p', author: 'Alice' },
  ]);

  const [weeklyData] = useState([
    { day: 'Mon', commits: 12 },
    { day: 'Tue', commits: 8 },
    { day: 'Wed', commits: 15 },
    { day: 'Thu', commits: 10 },
    { day: 'Fri', commits: 7 },
    { day: 'Sat', commits: 3 },
    { day: 'Sun', commits: 5 },
  ]);

  const stats = [
    { label: 'Total Commits', value: 143, icon: GitCommit, change: '+12', color: '#ffde22' },
    { label: 'Team Progress', value: '78%', icon: Target, change: '+8%', color: '#ff8928' },
    { label: 'Code Quality', value: '92%', icon: Award, change: '+5%', color: '#ff414e' },
    { label: 'Contributions', value: '1,240', icon: Code, change: '+342', color: '#ffde22' },
  ];

  const activities = [
    { user: 'Alice', action: 'pushed 3 commits', time: '10m ago', repo: 'frontend', type: 'commit' },
    { user: 'Bob', action: 'opened PR #42', time: '25m ago', repo: 'api', type: 'pr' },
    { user: 'Charlie', action: 'commented on PR #41', time: '1h ago', repo: 'backend', type: 'comment' },
    { user: 'Alice', action: 'merged PR #40', time: '2h ago', repo: 'frontend', type: 'merge' },
  ];

  const achievements = [
    { name: 'Early Bird', description: '10 commits before 9am', icon: '🌅', progress: 80, unlocked: true },
    { name: 'Bug Hunter', description: '5 bugs fixed', icon: '🐛', progress: 100, unlocked: true },
    { name: 'Team Player', description: '10 PR reviews', icon: '🤝', progress: 60, unlocked: false },
    { name: 'Code Master', description: '500 lines added', icon: '👨‍💻', progress: 45, unlocked: false },
  ];

  const maxCommits = Math.max(...weeklyData.map(d => d.commits));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#ffde22]/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
                <p className="text-sm text-white/60">Welcome back, {user?.name || 'Student'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ffde22]/10 rounded-full border border-[#ffde22]/20">
                <div className="w-2 h-2 bg-[#ffde22] rounded-full animate-pulse" />
                <span className="text-sm text-[#ffde22] font-medium">{teamData.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-2">
            {['overview', 'activity', 'team', 'kanban', 'calendar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-[#ffde22] text-black' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#ffde22]/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-white/60">{stat.label}</span>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm" style={{ color: stat.color }}>{stat.change} this week</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Activity Chart */}
              <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#ffde22]" />
                  Activity Velocity
                </h3>
                <div className="h-64">
                  <div className="flex items-end justify-between h-48 gap-2">
                    {weeklyData.map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-[#ffde22] to-[#ff8928] rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${(day.commits / maxCommits) * 100}%`, minHeight: '4px' }}
                        />
                        <span className="text-xs text-white/40 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Squad Health */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ffde22]" />
                  Squad Health
                </h3>
                <div className="space-y-4">
                  {teamData.members.map((member, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/80">{member.name}</span>
                        <span className="text-sm font-medium text-[#ffde22]">{member.activity_score}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
                          style={{ width: `${member.activity_score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-[#ffde22]" />
                  Real-time Commits
                </h3>
                <div className="space-y-4">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'commit' ? 'bg-[#ffde22]/20' :
                        activity.type === 'pr' ? 'bg-[#ff8928]/20' :
                        'bg-[#ff414e]/20'
                      }`}>
                        {activity.type === 'commit' ? <GitCommit className="w-4 h-4 text-[#ffde22]" /> :
                         activity.type === 'pr' ? <GitCommit className="w-4 h-4 text-[#ff8928]" /> :
                         <MessageSquare className="w-4 h-4 text-[#ff414e]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-white">{activity.user}</span>
                          <span className="text-white/60"> {activity.action}</span>
                        </p>
                        <p className="text-xs text-white/40 mt-1">{activity.repo} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#ffde22]" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{achievement.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{achievement.name}</p>
                            <p className="text-xs text-white/40">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <span className="text-xs px-2 py-1 bg-[#ffde22]/20 text-[#ffde22] rounded-full">
                            ✓ Unlocked
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-8">
            {/* Animated Commit Timeline */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border-2 border-[#ffde22]/30 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#ffde22] animate-pulse" />
                <span className="bg-[#ffde22] text-black px-4 py-1 rounded-full text-sm font-bold">LIVE</span>
                Commit Activity (Last 7 Days)
              </h3>
              <div className="h-80">
                <div className="flex items-end justify-between h-64 gap-3 px-4">
                  {weeklyData.map((day, i) => {
                    const maxCommits = 15;
                    const height = (day.commits / maxCommits) * 100;
                    return (
                      <motion.div 
                        key={i} 
                        className="flex-1 flex flex-col items-center group"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <div className="relative w-full flex flex-col items-center">
                          <motion.div 
                            className="w-full bg-gradient-to-t from-[#ffde22] via-[#ff8928] to-[#ff414e] rounded-t-lg shadow-lg cursor-pointer"
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ minHeight: '8px' }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border-2 border-[#ffde22] rounded-lg px-3 py-1 text-sm font-bold text-[#ffde22] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10">
                              {day.commits} commits
                            </div>
                          </motion.div>
                          <motion.span 
                            className="text-sm font-bold text-white/80 mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            {day.day}
                          </motion.span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Commits List - Enhanced */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border-2 border-[#ffde22]/30 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <GitCommit className="w-6 h-6 text-[#ffde22]" />
                Recent Commits
              </h3>
              <div className="space-y-4">
                {commits.map((commit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border-2 border-white/20 hover:border-[#ffde22]/50 transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <GitCommit className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white">{commit.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-[#ffde22] font-medium">{commit.repo}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80">{commit.author}</span>
                        <span className="text-white/40">•</span>
                        <span className="font-mono text-[#ff8928]">{commit.hash}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#ffde22] bg-[#ffde22]/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {commit.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Stats - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="bg-gradient-to-br from-[#ffde22]/20 to-[#ffde22]/5 rounded-xl p-6 border-2 border-[#ffde22]/50 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-[#ffde22] font-bold mb-2">MOST ACTIVE DAY</p>
                <p className="text-3xl font-bold text-white">Wednesday</p>
                <p className="text-lg text-[#ffde22] mt-2">15 commits</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-[#ff8928]/20 to-[#ff8928]/5 rounded-xl p-6 border-2 border-[#ff8928]/50 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-[#ff8928] font-bold mb-2">PEAK HOUR</p>
                <p className="text-3xl font-bold text-white">2-4 PM</p>
                <p className="text-lg text-[#ff8928] mt-2">Most productive</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-[#ff414e]/20 to-[#ff414e]/5 rounded-xl p-6 border-2 border-[#ff414e]/50 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-[#ff414e] font-bold mb-2">TOTAL COMMITS</p>
                <p className="text-3xl font-bold text-white">143</p>
                <p className="text-lg text-emerald-500 mt-2">↑ 12 this week</p>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Team Members</h2>
            <div className="grid gap-4">
              {teamData.members.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      member.role === 'leader' ? 'bg-[#ffde22]' : 'bg-[#ffde22]/20'
                    }`}>
                      <span className={`text-lg font-bold ${member.role === 'leader' ? 'text-black' : 'text-[#ffde22]'}`}>
                        {member.name[0]}
                      </span>
                      {member.role === 'leader' && (
                        <Crown className="w-4 h-4 text-black absolute -top-1 -right-1" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{member.name}</p>
                        {member.role === 'leader' && (
                          <span className="text-xs px-2 py-1 bg-[#ffde22]/20 text-[#ffde22] rounded-full">
                            Team Leader
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mt-1">
                        {member.commits} commits • +{member.additions}/-{member.deletions}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#ffde22]">{member.activity_score}%</p>
                    <p className="text-xs text-white/40">activity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kanban' && <Kanban />}
        {activeTab === 'calendar' && <CalendarPage />}
      </div>
    </div>
  );
}