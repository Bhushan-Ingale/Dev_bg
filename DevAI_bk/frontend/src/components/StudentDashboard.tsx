'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit, Users, Code, Award,
  Star, Activity, Brain, ArrowRight,
  Target, Crown, LogOut,
  Wifi, WifiOff, Bell, X, CheckCircle,
  GitBranch, MessageSquare, GitMerge,
  TrendingUp, Calendar,
} from 'lucide-react';
import Kanban from './Kanban';
import CalendarPage from './CalendarPage';
import {
  AnimatedTimeline, ContributorActivity,
  ContributorPieChart, SquadHealthRadar,
  CommitHeatmap,
} from './AnimatedTimeline';
import { fetchTeams, fetchTeamAnalytics, checkBackendHealth, type Team, type Analytics } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Commit { message: string; repo: string; time: string; hash: string; author: string; }
interface Notif  { id: number; message: string; time: string; read: boolean; type: 'commit'|'pr'|'review'|'merge'; }

// ─── Achievement card ─────────────────────────────────────────────────────────

const AchievementCard = ({ name, description, icon, progress, unlocked }: {
  name: string; description: string; icon: string; progress: number; unlocked: boolean;
}) => (
  <div className={`p-4 rounded-xl border transition-all ${
    unlocked ? 'bg-[#ffde22]/10 border-[#ffde22]/30' : 'bg-white/5 border-white/10 opacity-60'
  }`}>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-white text-sm">{name}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      {unlocked && <Star className="w-4 h-4 text-[#ffde22] ml-auto" />}
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }} />
    </div>
    <p className="text-xs text-white/40 mt-1 text-right">{progress}%</p>
  </div>
);

// ─── Backend status badge ─────────────────────────────────────────────────────

const BackendBadge = ({ online }: { online: boolean | null }) => {
  if (online === null) return null;
  return (
    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
      online ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
             : 'bg-[#ff414e]/10 border-[#ff414e]/20 text-[#ff414e]'
    }`}>
      {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {online ? 'Live Data' : 'Mock Data'}
    </div>
  );
};

// ─── Notification panel ───────────────────────────────────────────────────────

const NOTIF_ICONS: Record<Notif['type'], { icon: React.ElementType; color: string }> = {
  commit: { icon: GitCommit,   color: '#ffde22' },
  pr:     { icon: GitBranch,   color: '#ff8928' },
  review: { icon: CheckCircle, color: '#10b981' },
  merge:  { icon: GitBranch,   color: '#a855f7' },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const [team, setTeam]                 = useState<Team | null>(null);
  const [analytics, setAnalytics]       = useState<Analytics | null>(null);
  const [loading, setLoading]           = useState(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showNotifs, setShowNotifs]     = useState(false);

  const [notifs, setNotifs] = useState<Notif[]>([
    { id: 1, message: 'Hrishi pushed 3 commits to frontend',  time: '5m ago',  read: false, type: 'commit' },
    { id: 2, message: 'PR #42 needs your review',            time: '20m ago', read: false, type: 'pr'     },
    { id: 3, message: 'Sahil merged PR #40 — auth module',     time: '1h ago',  read: false, type: 'merge'  },
    { id: 4, message: 'Sprint review scheduled for Friday',  time: '2h ago',  read: true,  type: 'review' },
  ]);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
  }, [user, router]);

  useEffect(() => {
    (async () => {
      const online = await checkBackendHealth();
      setBackendOnline(online);
      const teams = await fetchTeams();
      if (teams.length) {
        const myTeam = teams[0];
        setTeam(myTeam);
        const data = await fetchTeamAnalytics(myTeam.id, teams);
        setAnalytics(data);
      }
      setLoading(false);
    })();
  }, []);

  // Auto-add a simulated live notif every ~30s
  useEffect(() => {
    const msgs: Array<{ message: string; type: Notif['type'] }> = [
      { message: 'New commit pushed to main branch',       type: 'commit' },
      { message: 'PR #43 opened — awaiting review',       type: 'pr'     },
      { message: 'Rohan merged feature branch',         type: 'merge'  },
      { message: 'Code review completed on PR #41',       type: 'review' },
    ];
    const id = setInterval(() => {
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      setNotifs(prev => [
        { id: Date.now(), message: pick.message, time: 'just now', read: false, type: pick.type },
        ...prev.slice(0, 8),
      ]);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const unread     = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const myContributor = analytics?.contributors[0];
  const teamTotal     = analytics?.summary.total_commits ?? 0;
  const myCommits     = myContributor?.commits ?? 0;
  const myShare       = teamTotal > 0 ? Math.round((myCommits / teamTotal) * 100) : 0;

  const stats = [
    { label: 'My Commits',   value: myCommits || 143,                                 icon: GitCommit, change: '+12', color: '#ffde22' },
    { label: 'Team Progress',value: `${team?.progress ?? 78}%`,                       icon: Target,    change: '+8%', color: '#ff8928' },
    { label: 'Activity Score',value: `${myContributor?.activity_score ?? 92}`,        icon: Award,     change: '+5',  color: '#ff414e' },
    { label: 'Lines Added',  value: (myContributor?.additions ?? 1240).toLocaleString(), icon: Code,  change: '+342',color: '#ffde22' },
  ];

  const commits: Commit[] = [
    { message: 'Fix navigation bug in dashboard', repo: 'frontend', time: '2h ago',  hash: 'a1b2c3d', author: 'Hrishi'   },
    { message: 'Add user authentication flow',    repo: 'api',      time: '5h ago',  hash: 'e4f5g6h', author: 'Sahil'     },
    { message: 'Update API endpoints',            repo: 'backend',  time: '1d ago',  hash: 'i7j8k9l', author: 'Rohan' },
    { message: 'Refactor chart components',       repo: 'frontend', time: '2d ago',  hash: 'm0n1o2p', author: 'Hrishi'   },
  ];

  const activities = [
    { user: team?.members[0] ?? 'Hrishi',   action: 'pushed 3 commits',    time: '10m ago', repo: 'frontend' },
    { user: team?.members[1] ?? 'Sahil',     action: 'opened PR #42',        time: '25m ago', repo: 'api'      },
    { user: team?.members[2] ?? 'Rohan', action: 'commented on PR #41',  time: '1h ago',  repo: 'backend'  },
    { user: team?.members[0] ?? 'Hrishi',   action: 'merged PR #40',        time: '2h ago',  repo: 'frontend' },
  ];

  const achievements = [
    { name: 'Early Bird',  description: '10 commits before 9am', icon: '🌅', progress: 80,  unlocked: true  },
    { name: 'Bug Hunter',  description: '5 bugs fixed',          icon: '🐛', progress: 100, unlocked: true  },
    { name: 'Team Player', description: '10 PR reviews',         icon: '🤝', progress: 60,  unlocked: false },
    { name: 'Code Master', description: '500 lines added',       icon: '👨‍💻', progress: 45,  unlocked: false },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
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
              <BackendBadge online={backendOnline} />

              {team && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ffde22]/10 rounded-full border border-[#ffde22]/20">
                  <div className="w-2 h-2 bg-[#ffde22] rounded-full animate-pulse" />
                  <span className="text-sm text-[#ffde22] font-medium">{team.name}</span>
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-white/60" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff414e] rounded-full text-[9px] font-black flex items-center justify-center text-white">
                      {unread}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifs && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        className="absolute right-0 mt-2 w-80 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                          <h3 className="font-semibold text-white text-sm">Notifications</h3>
                          <button onClick={markAllRead}
                            className="text-xs text-[#ffde22] hover:text-[#ffde22]/80 transition-colors font-medium">
                            Mark all read
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifs.map(n => {
                            const cfg = NOTIF_ICONS[n.type];
                            return (
                              <div key={n.id}
                                className={`flex items-start gap-3 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${!n.read ? 'bg-[#ffde22]/3' : ''}`}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: cfg.color + '20' }}>
                                  <cfg.icon size={13} style={{ color: cfg.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-white/80 leading-snug">{n.message}</p>
                                  <p className="text-xs text-white/35 mt-1">{n.time}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-1.5 h-1.5 bg-[#ffde22] rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={logout} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <LogOut size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-2">
            {['overview', 'activity', 'team', 'kanban', 'calendar'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all ${
                  activeTab === tab ? 'bg-[#ffde22] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Overview ──────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#ffde22]/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-white/60">{s.label}</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                          <s.icon className="w-4 h-4" style={{ color: s.color }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                      <p className="text-sm font-medium" style={{ color: s.color }}>{s.change} this week</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {/* Activity Velocity — replaced with heatmap + bar */}
                  <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#ffde22]" />
                        Commit Activity
                      </h3>
                      <span className="text-xs text-white/30">Last 30 days</span>
                    </div>
                    {/* Heatmap */}
                    <CommitHeatmap data={analytics?.timeline} />
                    {/* Mini bar below */}
                    <div className="mt-5 pt-5 border-t border-white/5">
                      <p className="text-xs text-white/30 mb-3">Weekly trend</p>
                      <AnimatedTimeline
                        data={analytics?.timeline?.slice(-7)}
                        type="bar"
                        color="#ffde22"
                        chartHeight={120}
                      />
                    </div>
                  </div>

                  {/* DevAI Coach */}
                  <div className="bg-gradient-to-br from-[#ffde22]/10 to-[#ff8928]/10 rounded-xl p-6 border border-[#ffde22]/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">DevAI Coach</h3>
                        <p className="text-xs text-white/40">Your personal AI guide</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { emoji: '🔥', text: <>You're on fire! <span className="text-[#ffde22] font-bold">{myCommits} commits</span> this sprint — keep the momentum!</> },
                        { emoji: '💡', text: <>Coverage at <span className="text-[#ff8928] font-bold">{team?.coverage ?? 82}%</span>. A few more tests push it over 90%.</> },
                        { emoji: '🎯', text: <>You contribute <span className="text-[#ffde22] font-bold">{myShare}%</span> of team commits. Great work!</> },
                      ].map((m, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-lg text-sm text-white/70">
                          {m.emoji} {m.text}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                      <input placeholder="Ask DevAI..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 outline-none focus:border-[#ffde22]/50" />
                      <button className="p-2 bg-[#ffde22] text-black rounded-lg hover:scale-105 transition-all">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ffde22]" />Achievements
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map(a => <AchievementCard key={a.name} {...a} />)}
                  </div>
                </div>

                {/* Recent commits */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-[#ffde22]" />Recent Commits
                  </h3>
                  <div className="space-y-2">
                    {commits.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-[#ffde22]/20 transition-all">
                        <div className="w-8 h-8 bg-[#ffde22]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GitCommit className="w-4 h-4 text-[#ffde22]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{c.message}</p>
                          <p className="text-xs text-white/40 mt-0.5">{c.repo} • {c.author} • {c.time}</p>
                        </div>
                        <code className="text-xs text-[#ff8928] bg-[#ff8928]/10 px-2 py-1 rounded flex-shrink-0 font-mono">{c.hash}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Activity tab ──────────────────────────────────────────── */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Team feed */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ffde22]" />Team Activity Feed
                  </h3>
                  <div className="space-y-3">
                    {activities.map((a, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-8 h-8 bg-[#ffde22]/15 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#ffde22]">
                          {a.user[0]}
                        </div>
                        <div>
                          <p className="text-sm text-white"><span className="font-medium">{a.user}</span> {a.action}</p>
                          <p className="text-xs text-white/40 mt-1">{a.repo} • {a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commit History — replaced with full interactive chart */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-[#ffde22]" />Commit History
                    </h3>
                    <div className="flex gap-2">
                      {(['area','bar','line'] as const).map(t => (
                        <ChartTypePicker key={t} type={t} analytics={analytics} />
                      ))}
                    </div>
                  </div>
                  <CommitHistoryChart analytics={analytics} />
                </div>

                {/* Heatmap */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#ffde22]" />30-Day Heatmap
                  </h3>
                  <CommitHeatmap data={analytics?.timeline} />
                </div>
              </div>
            )}

            {/* ── Team tab ──────────────────────────────────────────────── */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#ffde22]" />
                      {team?.name ?? 'My Team'} — Work Contributions
                    </h3>
                    <ContributorPieChart data={analytics?.contributors} />
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-base font-semibold mb-4">Squad Health Radar</h3>
                    <SquadHealthRadar contributors={analytics?.contributors} />
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-base font-semibold mb-4">Individual Activity</h3>
                  <ContributorActivity contributors={analytics?.contributors} />
                </div>

                {/* Member cards */}
                {analytics?.contributors && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {analytics.contributors.map((c, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full flex items-center justify-center text-black font-bold">
                            {c.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">{c.name}</p>
                            {i === 0 && (
                              <span className="flex items-center gap-1 text-xs text-[#ffde22]">
                                <Crown size={10} />Team Leader
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div><p className="text-xs text-white/40">Commits</p><p className="font-bold text-white">{c.commits}</p></div>
                          <div><p className="text-xs text-white/40">Score</p><p className="font-bold text-[#ffde22]">{c.activity_score}</p></div>
                          <div><p className="text-xs text-white/40">Added</p><p className="font-bold text-emerald-400">+{c.additions}</p></div>
                          <div><p className="text-xs text-white/40">Removed</p><p className="font-bold text-[#ff414e]">-{c.deletions}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'kanban'   && <Kanban />}
            {activeTab === 'calendar' && <CalendarPage />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Inline sub-components (avoid prop-drilling) ──────────────────────────────

function ChartTypePicker({ type, analytics }: { type: 'area'|'bar'|'line'; analytics: Analytics | null }) {
  // This is a display-only label — actual state lives in CommitHistoryChart
  return null;
}

function CommitHistoryChart({ analytics }: { analytics: Analytics | null }) {
  const [chartType, setChartType] = useState<'area'|'bar'|'line'>('area');
  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['area','bar','line'] as const).map(t => (
          <button key={t} onClick={() => setChartType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartType === t ? 'bg-[#ffde22] text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <AnimatedTimeline data={analytics?.timeline} type={chartType} color="#ffde22" chartHeight={240} />
    </>
  );
}