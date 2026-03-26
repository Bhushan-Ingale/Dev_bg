'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Users, GitCommit, Activity, TrendingUp, 
  Search, Filter, ChevronRight,
  Code, GitBranch, BarChart3, MessageSquare,
  Grid, List, Download, Calendar,
  ChevronDown, Bell, UserCircle, ArrowRight,
  Zap, AlertCircle, CheckCircle, Github,
  Target, Award, Brain, Crown,
  LogOut, Settings, Star, Clock,
  PieChart, TrendingDown, Eye, EyeOff,
  MoreVertical, Edit, Trash2, Copy, EyeIcon
} from 'lucide-react';
import GroupCard from './GroupCard';
import AnalyticsChart from './AnalyticsChart';
import AddGroupModal from './AddGroupModal';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';
import { ContributorActivity, ContributorPieChart, AnimatedTimeline } from './AnimatedTimeline';

// Define Team interface
interface Team {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  progress: number;
  commits: number;
  additions: number;
  deletions: number;
  lastActive: string;
  repoUrl: string;
  tech: string[];
  activityScore: number;
  sprintVelocity?: number;
  coverage?: number;
  openPRs?: number;
  issues?: number;
}

interface Activity {
  id: number;
  team: string;
  action: string;
  time: string;
  icon: any;
  color: string;
  member?: string;
}

// GitMerge Icon Component
const GitMerge = (props: any) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  );
};

// Live activity feed component
const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, team: 'Team Quantum', action: 'pushed 3 commits', time: 'just now', icon: GitCommit, color: '#ffde22', member: 'Alice' },
    { id: 2, team: 'Team Nebula', action: 'opened PR #42', time: '2m ago', icon: GitBranch, color: '#ff8928', member: 'Diana' },
    { id: 3, team: 'Team Phoenix', action: 'completed review', time: '5m ago', icon: CheckCircle, color: '#ff414e', member: 'Grace' },
    { id: 4, team: 'Team Quantum', action: 'merged branch', time: '8m ago', icon: GitMerge, color: '#10b981', member: 'Bob' },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        team: ['Team Quantum', 'Team Nebula', 'Team Phoenix'][Math.floor(Math.random() * 3)],
        action: ['pushed commits', 'opened PR', 'merged branch', 'added comment', 'completed review'][Math.floor(Math.random() * 5)],
        time: 'just now',
        icon: [GitCommit, GitBranch, CheckCircle, MessageSquare, GitMerge][Math.floor(Math.random() * 5)],
        color: ['#ffde22', '#ff8928', '#ff414e', '#ffde22', '#10b981'][Math.floor(Math.random() * 5)],
        member: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'][Math.floor(Math.random() * 7)]
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${activity.color}20` }}
            >
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

// Quick stat card with animation
const StatCard = ({ label, value, change, icon: Icon, color, trend = 'up' }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffde22]/20 transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-white/60">{label}</span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <div className="flex items-center gap-1">
      {trend === 'up' ? (
        <TrendingUp className="w-3 h-3 text-emerald-500" />
      ) : (
        <TrendingDown className="w-3 h-3 text-[#ff414e]" />
      )}
      <span className={`text-xs ${trend === 'up' ? 'text-emerald-500' : 'text-[#ff414e]'}`}>
        {change}
      </span>
    </div>
  </motion.div>
);

// Team analytics preview
const TeamAnalyticsPreview = ({ team }: { team: Team }) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{team.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${
          team.activityScore >= 80 ? 'bg-emerald-500/20 text-emerald-500' :
          team.activityScore >= 60 ? 'bg-[#ff8928]/20 text-[#ff8928]' :
          'bg-[#ff414e]/20 text-[#ff414e]'
        }`}>
          Score {team.activityScore}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-xs text-white/40">Commits</p>
          <p className="text-sm font-medium text-white">{team.commits}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">PRs</p>
          <p className="text-sm font-medium text-white">{team.openPRs}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">Issues</p>
          <p className="text-sm font-medium text-white">{team.issues || 0}</p>
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
          style={{ width: `${team.progress}%` }}
        />
      </div>
    </div>
  );
};

export default function GuideDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [notifications] = useState([
    { id: 1, message: 'Team Quantum pushed 12 commits', time: '2m ago', read: false },
    { id: 2, message: 'Team Nebula opened 3 PRs', time: '15m ago', read: false },
    { id: 3, message: 'Code review needed for Team Phoenix', time: '1h ago', read: true },
  ]);

  // ✅ ADD THIS useEffect to force initial data load
  useEffect(() => {
    // Set mock data for analytics immediately
    const mockData = {
      summary: { 
        total_commits: 142, 
        total_contributors: 4,
        total_additions: 2580,
        total_deletions: 650,
        active_days: 22
      },
      contributors: [
        { name: 'Alice Chen', commits: 65, additions: 1240, deletions: 320, activity_score: 98 },
        { name: 'Bob Smith', commits: 42, additions: 890, deletions: 210, activity_score: 76 },
        { name: 'Charlie Brown', commits: 25, additions: 450, deletions: 120, activity_score: 52 },
      ],
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        commits: Math.floor(Math.random() * 15) + 5
      }))
    };
    setAnalytics(mockData);
  }, []);

  // Teams state
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: '1', 
      name: 'Team Quantum', 
      members: ['Alice Chen', 'Bob Smith', 'Charlie Brown'],
      leader: 'Alice Chen',
      progress: 85,
      commits: 65,
      additions: 1240,
      deletions: 320,
      lastActive: '2h ago',
      repoUrl: 'https://github.com/team/quantum',
      tech: ['React', 'Node.js', 'MongoDB'],
      activityScore: 98,
      sprintVelocity: 42,
      coverage: 78,
      openPRs: 3,
      issues: 5
    },
    { 
      id: '2', 
      name: 'Team Nebula', 
      members: ['Diana Prince', 'Eve Torres', 'Frank Castle'],
      leader: 'Diana Prince',
      progress: 72,
      commits: 42,
      additions: 890,
      deletions: 210,
      lastActive: '5h ago',
      repoUrl: 'https://github.com/team/nebula',
      tech: ['Python', 'FastAPI', 'PostgreSQL'],
      activityScore: 76,
      sprintVelocity: 34,
      coverage: 82,
      openPRs: 5,
      issues: 2
    },
    { 
      id: '3', 
      name: 'Team Phoenix', 
      members: ['Grace Hopper', 'Henry Ford', 'Ivy Chen'],
      leader: 'Grace Hopper',
      progress: 45,
      commits: 25,
      additions: 450,
      deletions: 120,
      lastActive: '1d ago',
      repoUrl: 'https://github.com/team/phoenix',
      tech: ['Vue.js', 'Flask', 'SQLite'],
      activityScore: 52,
      sprintVelocity: 18,
      coverage: 45,
      openPRs: 7,
      issues: 8
    }
  ]);

  // Generate AI insights based on selected team
  useEffect(() => {
    if (selectedTeam) {
      const insights = [
        {
          id: 1,
          type: 'warning',
          icon: AlertCircle,
          color: '#ff414e',
          message: `${selectedTeam.members[0]} has 40% more commits than team average. Consider pairing with ${selectedTeam.members[2]} for knowledge sharing.`,
          time: 'Just now',
          actionable: true
        },
        {
          id: 2,
          type: 'success',
          icon: CheckCircle,
          color: '#ffde22',
          message: `Team velocity increased by 15% this sprint. Great progress on the authentication module!`,
          time: '10m ago',
          actionable: false
        },
        {
          id: 3,
          type: 'insight',
          icon: Target,
          color: '#ff8928',
          message: `Code coverage is at ${selectedTeam.coverage}%. Focus on adding tests for the new API endpoints.`,
          time: '1h ago',
          actionable: true
        },
        {
          id: 4,
          type: 'trend',
          icon: TrendingUp,
          color: '#10b981',
          message: `${selectedTeam.leader} is most active between 2-4 PM. Schedule reviews during this window.`,
          time: '2h ago',
          actionable: false
        }
      ];
      setAiInsights(insights);
    }
  }, [selectedTeam]);

  // Fetch analytics for selected team
  const fetchAnalytics = async (teamId: string) => {
    setLoading(true);
    const team = teams.find(t => t.id === teamId);
    
    // Always provide mock data immediately
    const mockData = {
      summary: { 
        total_commits: team?.commits || 65, 
        total_contributors: team?.members.length || 3,
        total_additions: team?.additions || 1240,
        total_deletions: team?.deletions || 320,
        active_days: 22
      },
      contributors: team?.members.map((name, i) => ({
        name,
        commits: i === 0 ? 65 : i === 1 ? 42 : 25,
        additions: i === 0 ? 1240 : i === 1 ? 890 : 450,
        deletions: i === 0 ? 320 : i === 1 ? 210 : 120,
        activity_score: i === 0 ? 98 : i === 1 ? 76 : 52
      })) || [
        { name: 'Alice', commits: 65, additions: 1240, deletions: 320, activity_score: 98 },
        { name: 'Bob', commits: 42, additions: 890, deletions: 210, activity_score: 76 },
        { name: 'Charlie', commits: 25, additions: 450, deletions: 120, activity_score: 52 }
      ],
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        commits: Math.floor(Math.random() * 15) + 5
      }))
    };
    
    setAnalytics(mockData);
    setLoading(false);
  };

  // Handle add new group
  const handleAddGroup = (newGroup: any) => {
    const team: Team = {
      id: `team_${teams.length + 1}`,
      name: newGroup.name,
      members: newGroup.members,
      leader: newGroup.leader,
      progress: 0,
      commits: 0,
      additions: 0,
      deletions: 0,
      lastActive: 'Just now',
      repoUrl: newGroup.repoUrl,
      tech: ['JavaScript', 'React'],
      activityScore: 0,
      sprintVelocity: 0,
      coverage: 0,
      openPRs: 0,
      issues: 0
    };
    setTeams([...teams, team]);
    setShowAddModal(false);
  };

  // Delete team
  const deleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== teamId));
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalStats = {
    groups: teams.length,
    commits: teams.reduce((acc, t) => acc + t.commits, 0),
    avgProgress: Math.round(teams.reduce((acc, t) => acc + t.progress, 0) / teams.length),
    students: new Set(teams.flatMap(t => t.members)).size,
    avgVelocity: Math.round(teams.reduce((acc, t) => acc + (t.sprintVelocity || 0), 0) / teams.length),
    totalPRs: teams.reduce((acc, t) => acc + (t.openPRs || 0), 0),
    totalIssues: teams.reduce((acc, t) => acc + (t.issues || 0), 0)
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              {/* Live Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#ffde22]/10 rounded-full border border-[#ffde22]/20">
                <div className="w-2 h-2 bg-[#ffde22] rounded-full animate-pulse" />
                <span className="text-xs text-[#ffde22] font-medium">LIVE</span>
              </div>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams..."
                  className="w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffde22]/50 transition-all"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-white/60" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff414e] rounded-full" />
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#ffde22]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="font-medium text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-[#ffde22]/5' : ''}`}>
                            <p className="text-sm text-white">{notif.message}</p>
                            <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Add Team Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={18} />
                <span className="hidden md:inline">New Team</span>
              </button>
              
              {/* View Toggle */}
              <div className="hidden md:flex p-1 bg-white/5 rounded-lg border border-white/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-[#ffde22] text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-[#ffde22] text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffde22]/50 transition-all"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-2">
            {['overview', 'activity', 'teams', 'analytics', 'kanban', 'calendar'].map((tab) => (
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <StatCard 
                label="Active Teams" 
                value={totalStats.groups} 
                change="+2 this month" 
                icon={Users} 
                color="#ffde22" 
                trend="up"
              />
              <StatCard 
                label="Total Commits" 
                value={totalStats.commits.toLocaleString()} 
                change="+234" 
                icon={GitCommit} 
                color="#ff8928" 
                trend="up"
              />
              <StatCard 
                label="Avg Progress" 
                value={`${totalStats.avgProgress}%`} 
                change="+12%" 
                icon={Target} 
                color="#ff414e" 
                trend="up"
              />
              <StatCard 
                label="Students" 
                value={totalStats.students} 
                change="+8" 
                icon={UserCircle} 
                color="#10b981" 
                trend="up"
              />
              <StatCard 
                label="Open PRs" 
                value={totalStats.totalPRs} 
                change="-3" 
                icon={GitBranch} 
                color="#ff8928" 
                trend="down"
              />
              <StatCard 
                label="Issues" 
                value={totalStats.totalIssues} 
                change="+5" 
                icon={AlertCircle} 
                color="#ff414e" 
                trend="up"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Teams List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Teams Section */}
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">Active Teams</h2>
                        <p className="text-sm text-white/40 mt-1">Monitor all student teams</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <Filter size={16} className="text-white/60" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <Download size={16} className="text-white/60" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {viewMode === 'grid' ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {filteredTeams.map((team) => (
                          <div key={team.id} className="relative group">
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                fetchAnalytics(team.id);
                                setActiveTab('analytics');
                              }}
                              className="w-full text-left"
                            >
                              <GroupCard
                                group={team}
                                onClick={() => {}}
                                isSelected={selectedTeam?.id === team.id}
                              />
                            </button>
                            <button
                              onClick={() => deleteTeam(team.id)}
                              className="absolute top-2 right-2 p-1.5 bg-[#ff414e]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff414e]/30"
                            >
                              <Trash2 size={14} className="text-[#ff414e]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredTeams.map((team) => (
                          <div key={team.id} className="relative group">
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                fetchAnalytics(team.id);
                                setActiveTab('analytics');
                              }}
                              className="w-full text-left"
                            >
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
                                            <Crown size={10} />
                                            {team.leader.split(' ')[0]}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-white/40">
                                        {team.members.length} members • {team.commits} commits
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-[#ffde22]">{team.progress}%</p>
                                      <p className="text-xs text-white/40">progress</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/20" />
                                  </div>
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => deleteTeam(team.id)}
                              className="absolute top-1/2 -translate-y-1/2 right-12 p-1.5 bg-[#ff414e]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff414e]/30"
                            >
                              <Trash2 size={14} className="text-[#ff414e]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Analytics Preview Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {teams.slice(0, 3).map(team => (
                    <TeamAnalyticsPreview key={team.id} team={team} />
                  ))}
                </div>
              </div>

              {/* Right Column - AI Insights & Live Activity */}
              <div className="space-y-6">
                {/* DevAI Assistant */}
                <div className="bg-gradient-to-br from-[#ffde22]/10 via-[#ff8928]/10 to-[#ff414e]/10 rounded-xl p-6 border border-[#ffde22]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">DevAI Assistant</h3>
                      <p className="text-xs text-white/40">AI-powered insights</p>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-[#ffde22]/20 text-[#ffde22] text-xs rounded-full">
                      Live
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {selectedTeam ? (
                      aiInsights.map((insight) => (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#ffde22]/20 transition-all"
                        >
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
                      <div className="text-center py-12">
                        <Brain className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-sm text-white/40">Select a team to see AI insights</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Ask DevAI anything..." 
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffde22]/50"
                      />
                      <button className="p-2 bg-[#ffde22] text-black rounded-lg hover:scale-105 transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#ffde22]" />
                      Live Activity
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-500">LIVE</span>
                    </div>
                  </div>
                  <LiveActivityFeed />
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 bg-[#ffde22]/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#ffde22]" />
                      </div>
                      <span className="text-sm text-white">Send Announcement</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 bg-[#ff8928]/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-[#ff8928]" />
                      </div>
                      <span className="text-sm text-white">Schedule Review</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 bg-[#ff414e]/20 rounded-lg flex items-center justify-center">
                        <Download className="w-4 h-4 text-[#ff414e]" />
                      </div>
                      <span className="text-sm text-white">Export Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'teams' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">All Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
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
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Edit size={14} className="text-white/60" />
                      </button>
                      <button 
                        onClick={() => deleteTeam(team.id)}
                        className="p-2 hover:bg-[#ff414e]/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-[#ff414e]" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Progress</span>
                        <span className="text-[#ffde22] font-medium">{team.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full" style={{ width: `${team.progress}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-white/40">Commits</p>
                        <p className="text-sm font-medium text-white">{team.commits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">PRs</p>
                        <p className="text-sm font-medium text-white">{team.openPRs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Score</p>
                        <p className={`text-sm font-medium ${
                          team.activityScore >= 80 ? 'text-emerald-500' :
                          team.activityScore >= 60 ? 'text-[#ff8928]' : 'text-[#ff414e]'
                        }`}>
                          {team.activityScore}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        fetchAnalytics(team.id);
                        setActiveTab('analytics');
                      }}
                      className="w-full mt-2 px-4 py-2 bg-[#ffde22]/10 text-[#ffde22] rounded-lg text-sm font-medium hover:bg-[#ffde22]/20 transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Activity Feed</h2>
            <LiveActivityFeed />
          </div>
        )}

        {/* ✅ UPDATED Analytics Section with proper data flow */}
        {activeTab === 'analytics' && selectedTeam && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedTeam.name} Analytics</h2>
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Chart Type Selector */}
                <div className="flex items-center justify-end gap-3">
                  <span className="text-white/60">Chart Style:</span>
                  <button
                    onClick={() => setChartType('area')}
                    className={`p-2 rounded ${chartType === 'area' ? 'bg-[#ffde22] text-black' : 'bg-white/10 text-white'}`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded ${chartType === 'bar' ? 'bg-[#ffde22] text-black' : 'bg-white/10 text-white'}`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded ${chartType === 'line' ? 'bg-[#ffde22] text-black' : 'bg-white/10 text-white'}`}
                  >
                    Line
                  </button>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Commit Activity</h4>
                  <div style={{ height: '300px' }}>
                    <AnimatedTimeline 
                      data={analytics?.timeline} 
                      type={chartType}
                      color="#ffde22"
                    />
                  </div>
                </div>

                {/* Contributor Activity */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Team Activity</h4>
                  <ContributorActivity contributors={analytics?.contributors} />
                </div>

                {/* Distribution Chart */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Contribution Distribution</h4>
                  <div style={{ height: '300px' }}>
                    <ContributorPieChart data={analytics?.contributors} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kanban' && <Kanban />}
        {activeTab === 'calendar' && <CalendarPage />}
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <AddGroupModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGroup}
        />
      )}
    </div>
  );
}