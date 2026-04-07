'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus, Users, GitCommit, Activity, TrendingUp,
  Search, Filter, ChevronRight,
  Code, GitBranch, BarChart3, MessageSquare,
  Grid, List, Download, Calendar,
  Bell, ArrowRight,
  AlertCircle, CheckCircle,
  Target, Brain, Crown,
  LogOut, Clock,
  TrendingDown,
  MoreVertical, Edit, Trash2,
  Wifi, WifiOff,
} from 'lucide-react';
import GroupCard from './GroupCard';
import AddGroupModal from './AddGroupModal';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';
import TeamProfileModal from './TeamProfileModal';
import { ContributorActivity, ContributorPieChart, AnimatedTimeline, SquadHealthRadar } from './AnimatedTimeline';
import {
  fetchTeams,
  createTeam,
  deleteTeam as apiDeleteTeam,
  fetchTeamAnalytics,
  checkBackendHealth,
  type Team,
  type Analytics,
} from '@/lib/api';

// ─── Local Types ──────────────────────────────────────────────────────────────

interface ActivityItem {
  id: number;
  team: string;
  action: string;
  time: string;
  icon: React.ElementType;
  color: string;
  member?: string;
}

// ─── GitMerge SVG (not in lucide) ────────────────────────────────────────────

const GitMerge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 0 9 9" />
  </svg>
);

// ─── Backend status badge ─────────────────────────────────────────────────────

const BackendBadge = ({ online }: { online: boolean | null }) => {
  if (online === null) return null;
  return (
    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
      online
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-[#ff414e]/10 border-[#ff414e]/20 text-[#ff414e]'
    }`}>
      {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span className="text-xs font-medium">{online ? 'API Connected' : 'Mock Data'}</span>
    </div>
  );
};

// ─── Live Activity Feed (simulated, backed by real team names) ────────────────

const LiveActivityFeed = ({ teams }: { teams: Team[] }) => {
  const teamNames = teams.length ? teams.map(t => t.name) : ['Team Quantum', 'Team Nebula'];
  const allMembers = teams.flatMap(t => t.members);

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 1, team: teamNames[0], action: 'pushed 3 commits', time: 'just now', icon: GitCommit, color: '#ffde22', member: allMembers[0] ?? 'Hrishi' },
    { id: 2, team: teamNames[1] ?? teamNames[0], action: 'opened PR #42', time: '2m ago', icon: GitBranch, color: '#ff8928', member: allMembers[1] ?? 'Sahil' },
    { id: 3, team: teamNames[0], action: 'completed review', time: '5m ago', icon: CheckCircle, color: '#ff414e', member: allMembers[2] ?? 'Rohan' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ['pushed commits', 'opened PR', 'merged branch', 'added comment', 'completed review'];
      const icons = [GitCommit, GitBranch, CheckCircle, MessageSquare];
      const colors = ['#ffde22', '#ff8928', '#ff414e', '#10b981'];
      const rnd = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

      setActivities(prev => [{
        id: Date.now(),
        team: rnd(teamNames),
        action: rnd(actions),
        time: 'just now',
        icon: rnd(icons),
        color: rnd(colors),
        member: rnd(allMembers.length ? allMembers : ['Hrishi', 'Sahil']),
      }, ...prev.slice(0, 7)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [teamNames.join(',')]);

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-[#ffde22]/20 transition-all"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${activity.color}20` }}>
              <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-white">{activity.team}</span>
                <span className="text-white/60"> • {activity.member}</span>
              </p>
              <p className="text-xs text-white/40 mt-0.5">{activity.action} • {activity.time}</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activity.color }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, change, icon: Icon, color, trend = 'up' }: {
  label: string; value: string | number; change: string;
  icon: React.ElementType; color: string; trend?: 'up' | 'down';
}) => (
  <motion.div whileHover={{ y: -2 }} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffde22]/20 transition-all">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-white/60">{label}</span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <div className="flex items-center gap-1">
      {trend === 'up'
        ? <TrendingUp className="w-3 h-3 text-emerald-500" />
        : <TrendingDown className="w-3 h-3 text-[#ff414e]" />}
      <span className={`text-xs ${trend === 'up' ? 'text-emerald-500' : 'text-[#ff414e]'}`}>{change}</span>
    </div>
  </motion.div>
);

// ─── Team analytics mini-card ─────────────────────────────────────────────────

const TeamAnalyticsPreview = ({ team }: { team: Team }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-white">{team.name}</h4>
      <span className={`text-xs px-2 py-1 rounded-full ${
        (team.activityScore ?? 0) >= 80 ? 'bg-emerald-500/20 text-emerald-500'
          : (team.activityScore ?? 0) >= 60 ? 'bg-[#ff8928]/20 text-[#ff8928]'
          : 'bg-[#ff414e]/20 text-[#ff414e]'
      }`}>
        Score {team.activityScore ?? 0}
      </span>
    </div>
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[
        { label: 'Commits', value: team.commits ?? 0 },
        { label: 'PRs', value: team.openPRs ?? 0 },
        { label: 'Issues', value: team.issues ?? 0 },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <p className="text-xs text-white/40">{label}</p>
          <p className="text-sm font-medium text-white">{value}</p>
        </div>
      ))}
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full" style={{ width: `${team.progress ?? 0}%` }} />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GuideDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [profileTeam, setProfileTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [notifications] = useState([
    { id: 1, message: 'Team data loaded from backend', time: 'just now', read: false },
    { id: 2, message: 'Analytics ready for review', time: '5m ago', read: false },
    { id: 3, message: 'New PR opened by a student', time: '1h ago', read: true },
  ]);

  // ── Load teams + check backend on mount ──────────────────────────────────

  useEffect(() => {
    (async () => {
      const online = await checkBackendHealth();
      setBackendOnline(online);
      const data = await fetchTeams();
      setTeams(data);
      setTeamsLoading(false);
    })();
  }, []);

  // ── Generate AI insights when team changes ────────────────────────────────

  useEffect(() => {
    if (!selectedTeam) return;
    setAiInsights([
      {
        id: 1, type: 'warning', icon: AlertCircle, color: '#ff414e',
        message: `${selectedTeam.members[0]} has 40% more commits than team average. Consider pairing with ${selectedTeam.members[selectedTeam.members.length - 1]} for knowledge sharing.`,
        time: 'Just now', actionable: true,
      },
      {
        id: 2, type: 'success', icon: CheckCircle, color: '#ffde22',
        message: `Team velocity increased by 15% this sprint. Great progress on the authentication module!`,
        time: '10m ago', actionable: false,
      },
      {
        id: 3, type: 'insight', icon: Target, color: '#ff8928',
        message: `Code coverage is at ${selectedTeam.coverage ?? 'N/A'}%. Focus on adding tests for new API endpoints.`,
        time: '1h ago', actionable: true,
      },
    ]);
  }, [selectedTeam]);

  // ── Fetch analytics (real or mock) ───────────────────────────────────────

  const loadAnalytics = useCallback(async (team: Team) => {
    setSelectedTeam(team);
    setAnalyticsLoading(true);
    setActiveTab('analytics');
    const data = await fetchTeamAnalytics(team.id, teams);
    setAnalytics(data);
    setAnalyticsLoading(false);
  }, [teams]);

  // ── Add team ──────────────────────────────────────────────────────────────

  const handleAddGroup = async (formData: any) => {
    const newTeam = await createTeam({
      name: formData.name,
      members: formData.members,
      leader: formData.leader,
      repoUrl: formData.repoUrl,
    });
    setTeams(prev => [...prev, newTeam]);
    setShowAddModal(false);
  };

  // ── Delete team ───────────────────────────────────────────────────────────

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    await apiDeleteTeam(teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
      setActiveTab('overview');
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.members.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalStats = {
    groups: teams.length,
    commits: teams.reduce((a, t) => a + (t.commits ?? 0), 0),
    avgProgress: teams.length ? Math.round(teams.reduce((a, t) => a + (t.progress ?? 0), 0) / teams.length) : 0,
    students: new Set(teams.flatMap(t => t.members)).size,
    totalPRs: teams.reduce((a, t) => a + (t.openPRs ?? 0), 0),
    totalIssues: teams.reduce((a, t) => a + (t.issues ?? 0), 0),
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Render ────────────────────────────────────────────────────────────────

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
                <h1 className="text-xl font-bold text-white">Guide Dashboard</h1>
                <p className="text-sm text-white/60">Monitor student team performance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BackendBadge online={backendOnline} />

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search teams..."
                  className="w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffde22]/50 transition-all"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-white/60" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff414e] rounded-full" />}
                </button>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#ffde22]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-white/10"><h3 className="font-medium text-white">Notifications</h3></div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors ${!n.read ? 'bg-[#ffde22]/5' : ''}`}>
                            <p className="text-sm text-white">{n.message}</p>
                            <p className="text-xs text-white/40 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Add Team */}
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition-all">
                <Plus size={18} />
                <span className="hidden md:inline">New Team</span>
              </button>

              {/* View toggle */}
              <div className="hidden md:flex p-1 bg-white/5 rounded-lg border border-white/10">
                {(['grid', 'list'] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`p-2 rounded-md transition-all ${viewMode === mode ? 'bg-[#ffde22] text-black' : 'text-white/60 hover:text-white'}`}>
                    {mode === 'grid' ? <Grid size={16} /> : <List size={16} />}
                  </button>
                ))}
              </div>

              <button onClick={logout} className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Logout">
                <LogOut size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-2">
            {['overview', 'activity', 'teams', 'analytics', 'kanban', 'calendar'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all ${
                  activeTab === tab ? 'bg-[#ffde22] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <>
            {teamsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  <StatCard label="Active Teams" value={totalStats.groups} change="+2 this month" icon={Users} color="#ffde22" trend="up" />
                  <StatCard label="Total Commits" value={totalStats.commits.toLocaleString()} change="+234" icon={GitCommit} color="#ff8928" trend="up" />
                  <StatCard label="Avg Progress" value={`${totalStats.avgProgress}%`} change="+12%" icon={Target} color="#ff414e" trend="up" />
                  <StatCard label="Students" value={totalStats.students} change="+8" icon={Users} color="#10b981" trend="up" />
                  <StatCard label="Open PRs" value={totalStats.totalPRs} change="-3" icon={GitBranch} color="#ff8928" trend="down" />
                  <StatCard label="Issues" value={totalStats.totalIssues} change="+5" icon={AlertCircle} color="#ff414e" trend="up" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Teams list */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-white">Active Teams</h2>
                          <p className="text-sm text-white/40 mt-1">Click a team to view analytics</p>
                        </div>
                      </div>
                      <div className="p-6">
                        {viewMode === 'grid' ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {filteredTeams.map(team => (
                            <div key={team.id} className="relative group">
                            <button onClick={() => loadAnalytics(team)} className="w-full text-left">
                              <GroupCard group={team} onClick={() => {}} isSelected={selectedTeam?.id === team.id} />
                            </button>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setProfileTeam(team)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="View Profile">
                                <BarChart3 size={13} className="text-white/70" />
                              </button>
                              <button onClick={() => handleDeleteTeam(team.id)} className="p-1.5 bg-[#ff414e]/20 rounded-lg hover:bg-[#ff414e]/30 transition-colors">
                                <Trash2 size={13} className="text-[#ff414e]" />
                              </button>
                            </div>
                          </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {filteredTeams.map(team => (
                              <div key={team.id} className="relative group">
                                <button onClick={() => loadAnalytics(team)} className="w-full text-left">
                                  <div className={`p-4 rounded-lg border transition-all ${
                                    selectedTeam?.id === team.id
                                      ? 'bg-[#ffde22]/10 border-[#ffde22]/30'
                                      : 'bg-white/5 border-white/10 hover:border-[#ffde22]/20'
                                  }`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#ffde22]/20 rounded-lg flex items-center justify-center">
                                          <GitBranch className="w-5 h-5 text-[#ffde22]" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-white">{team.name}</h3>
                                            {team.leader && (
                                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-[#ffde22]/20 text-[#ffde22] rounded-full">
                                                <Crown size={10} />{team.leader.split(' ')[0]}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm text-white/40">{team.members.length} members • {team.commits ?? 0} commits</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-right">
                                          <p className="text-lg font-bold text-[#ffde22]">{team.progress ?? 0}%</p>
                                          <p className="text-xs text-white/40">progress</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/20" />
                                      </div>
                                    </div>
                                  </div>
                                </button>
                                <button onClick={() => handleDeleteTeam(team.id)} className="absolute top-1/2 -translate-y-1/2 right-12 p-1.5 bg-[#ff414e]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={14} className="text-[#ff414e]" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mini previews */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {teams.slice(0, 3).map(team => <TeamAnalyticsPreview key={team.id} team={team} />)}
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    {/* AI Assistant */}
                    <div className="bg-gradient-to-br from-[#ffde22]/10 via-[#ff8928]/10 to-[#ff414e]/10 rounded-xl p-6 border border-[#ffde22]/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">DevAI Assistant</h3>
                          <p className="text-xs text-white/40">AI-powered insights</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-[#ffde22]/20 text-[#ffde22] text-xs rounded-full">Live</span>
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {selectedTeam ? (
                          aiInsights.map(insight => (
                            <motion.div key={insight.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#ffde22]/20 transition-all">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${insight.color}20` }}>
                                  <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-white/90">{insight.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-white/40">{insight.time}</span>
                                    {insight.actionable && (
                                      <button className="text-xs px-2 py-1 bg-[#ffde22]/20 text-[#ffde22] rounded hover:bg-[#ffde22]/30 transition-colors">
                                        Take Action
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10">
                            <Brain className="w-10 h-10 text-white/20 mx-auto mb-3" />
                            <p className="text-sm text-white/40">Select a team to see AI insights</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                        <input type="text" placeholder="Ask DevAI anything..." className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffde22]/50" />
                        <button className="p-2 bg-[#ffde22] text-black rounded-lg hover:scale-105 transition-all"><ArrowRight size={18} /></button>
                      </div>
                    </div>

                    {/* Live Feed */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#ffde22]" />Live Activity
                        </h3>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-xs text-emerald-500">LIVE</span>
                        </div>
                      </div>
                      <LiveActivityFeed teams={teams} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Activity tab ──────────────────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Live Activity Feed</h2>
            <LiveActivityFeed teams={teams} />
          </div>
        )}

        {/* ── Teams tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'teams' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">All Teams</h2>
            {teamsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => (
                  <div key={team.id} className="bg-white/5 rounded-lg p-5 border border-white/10 hover:border-[#ffde22]/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#ffde22]/20 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#ffde22]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{team.name}</h3>
                          <p className="text-sm text-white/40">{team.members.length} members</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteTeam(team.id)} className="p-2 hover:bg-[#ff414e]/20 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-[#ff414e]" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Progress</span>
                          <span className="text-[#ffde22] font-medium">{team.progress ?? 0}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full" style={{ width: `${team.progress ?? 0}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { label: 'Commits', value: team.commits ?? 0, color: 'text-white' },
                          { label: 'PRs', value: team.openPRs ?? 0, color: 'text-white' },
                          { label: 'Score', value: team.activityScore ?? 0,
                            color: (team.activityScore ?? 0) >= 80 ? 'text-emerald-500' : (team.activityScore ?? 0) >= 60 ? 'text-[#ff8928]' : 'text-[#ff414e]' },
                        ].map(({ label, value, color }) => (
                          <div key={label}>
                            <p className="text-xs text-white/40">{label}</p>
                            <p className={`text-sm font-medium ${color}`}>{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button onClick={() => loadAnalytics(team)} className="flex-1 px-3 py-2 bg-[#ffde22]/10 text-[#ffde22] rounded-lg text-sm font-medium hover:bg-[#ffde22]/20 transition-colors">
                          Analytics
                        </button>
                        <button onClick={() => setProfileTeam(team)} className="flex-1 px-3 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
                          Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Analytics tab ─────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {!selectedTeam ? (
              <div className="text-center py-20">
                <BarChart3 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-lg">Select a team from Overview or Teams tab to view analytics</p>
              </div>
            ) : analyticsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedTeam.name} — Analytics</h2>
                  <div className="flex items-center gap-3">
                    {/* Chart type selector */}
                    {(['area', 'bar', 'line'] as const).map(type => (
                      <button key={type} onClick={() => setChartType(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${chartType === type ? 'bg-[#ffde22] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                    <button onClick={() => { setSelectedTeam(null); setActiveTab('overview'); }}
                      className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                      Close
                    </button>
                  </div>
                </div>

                {/* Summary cards */}
                {analytics && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Commits', value: analytics.summary.total_commits, color: '#ffde22' },
                      { label: 'Contributors', value: analytics.summary.total_contributors, color: '#ff8928' },
                      { label: 'Lines Added', value: analytics.summary.total_additions.toLocaleString(), color: '#10b981' },
                      { label: 'Lines Removed', value: analytics.summary.total_deletions.toLocaleString(), color: '#ff414e' },
                      { label: 'Active Days', value: analytics.summary.active_days, color: '#ffde22' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <p className="text-xs text-white/40 mb-1">{label}</p>
                        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Commit Activity (Last 30 Days)</h4>
                  <AnimatedTimeline data={analytics?.timeline} type={chartType} color="#ffde22" chartHeight={280} />
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Team Activity Breakdown</h4>
                  <ContributorActivity contributors={analytics?.contributors} />
                </div>

                {/* Two-column: Pie + Radar */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-4">Contribution Distribution</h4>
                    <ContributorPieChart data={analytics?.contributors} />
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-4">Squad Health Radar</h4>
                    <SquadHealthRadar contributors={analytics?.contributors} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'kanban' && <Kanban />}
        {activeTab === 'calendar' && <CalendarPage />}
      </div>

      {showAddModal && <AddGroupModal onClose={() => setShowAddModal(false)} onSubmit={handleAddGroup} />}

      {/* Team Profile Modal (Notion-style living doc) */}
      <AnimatePresence>
        {profileTeam && (
          <TeamProfileModal
            team={profileTeam as any}
            analytics={selectedTeam?.id === profileTeam.id ? analytics : undefined}
            onClose={() => setProfileTeam(null)}
            onUpdate={(updated) => {
              setTeams(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
              setProfileTeam(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}