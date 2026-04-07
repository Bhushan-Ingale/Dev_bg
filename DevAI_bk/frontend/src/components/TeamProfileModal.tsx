'use client';

/**
 * TeamProfileModal — Notion-inspired living team profile page
 * Shows: repos (add/edit/delete/swap), tech stack, milestones,
 * sprint velocity chart, PR timeline, guide notes, member drill-down
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Github, ExternalLink, Plus, Trash2, Edit3,
  CheckCircle, AlertCircle, GitBranch, GitCommit,
  Users, Star, Clock, Target, Code2, FileText,
  TrendingUp, BarChart3, Zap, Crown, ChevronDown,
  ChevronUp, RefreshCw, Link2,
} from 'lucide-react';
import { AnimatedTimeline, ContributorActivity, ContributorPieChart } from './AnimatedTimeline';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Repo {
  id: string;
  url: string;
  label: string;
  primary: boolean;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
  epic: string;
}

interface TeamProfile {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  repos: Repo[];
  tech?: string[];
  description?: string;
  progress?: number;
  commits?: number;
  additions?: number;
  deletions?: number;
  activityScore?: number;
  openPRs?: number;
  coverage?: number;
  sprintVelocity?: number;
}

// ─── GitHub URL validation ────────────────────────────────────────────────────

const GH_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\.git)?(\/?)$/;
const validateGH = (url: string) => GH_REGEX.test(url.trim());

// ─── Seed milestones ──────────────────────────────────────────────────────────

function seedMilestones(teamName: string): Milestone[] {
  return [
    { id: 'm1', title: 'MVP — Core Auth Flow',       dueDate: '2024-04-10', done: true,  epic: 'Authentication' },
    { id: 'm2', title: 'API Integration complete',    dueDate: '2024-04-18', done: true,  epic: 'Backend'        },
    { id: 'm3', title: 'Dashboard v1 shipped',        dueDate: '2024-04-25', done: false, epic: 'Frontend'       },
    { id: 'm4', title: 'Analytics module live',       dueDate: '2024-05-02', done: false, epic: 'Analytics'      },
    { id: 'm5', title: 'Final demo presentation',     dueDate: '2024-05-10', done: false, epic: 'Delivery'       },
  ];
}

// ─── Velocity mini-chart data (sprint-over-sprint) ───────────────────────────

function velocityData(baseVelocity = 25) {
  return [
    { date: 'S1', commits: Math.max(5, baseVelocity - 12) },
    { date: 'S2', commits: Math.max(5, baseVelocity - 6)  },
    { date: 'S3', commits: Math.max(5, baseVelocity)      },
    { date: 'S4', commits: Math.max(5, baseVelocity + 4)  },
  ];
}

// ─── Repo management row ──────────────────────────────────────────────────────

function RepoItem({
  repo, total, onUpdate, onDelete, onSetPrimary,
}: {
  repo: Repo; total: number;
  onUpdate: (id: string, field: keyof Repo, val: string) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(repo.url);
  const [touched, setTouched] = useState(false);
  const valid = validateGH(draft);

  const commit = () => {
    if (valid) { onUpdate(repo.id, 'url', draft); setEditing(false); }
    else setTouched(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 group"
    >
      {/* Label badge */}
      <span className="px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0"
        style={{
          backgroundColor: repo.primary ? 'rgba(255,222,34,0.15)' : 'rgba(255,255,255,0.05)',
          color: repo.primary ? '#ffde22' : 'rgba(255,255,255,0.4)',
        }}>
        {repo.label || 'Repo'}
      </span>

      {/* URL / edit inline */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="https://github.com/owner/repo"
                className={`w-full bg-white/5 border rounded-lg px-3 py-1.5 text-xs text-white outline-none transition-colors ${
                  touched && !valid ? 'border-[#ff414e]/50' : 'border-[#ffde22]/40'
                }`}
              />
              {touched && !valid && (
                <p className="text-[10px] text-[#ff414e] mt-0.5">Must be https://github.com/owner/repo</p>
              )}
            </div>
            <button onClick={commit}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                valid ? 'bg-[#ffde22] text-black hover:brightness-110' : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}>Save</button>
            <button onClick={() => { setEditing(false); setDraft(repo.url); setTouched(false); }}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:bg-white/5 transition-colors">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <Github size={12} className="text-white/30 flex-shrink-0" />
            <span className="text-xs text-white/60 truncate font-mono">
              {repo.url ? repo.url.replace('https://github.com/', '') : <span className="text-white/25 italic">No URL set</span>}
            </span>
            {repo.url && (
              <a href={repo.url} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={11} className="text-[#ffde22]/60" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onSetPrimary(repo.id)} title="Set as primary"
          className={`p-1.5 rounded-lg transition-all ${repo.primary ? 'text-[#ffde22]' : 'text-white/25 hover:text-white/50'}`}>
          <Star size={13} fill={repo.primary ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => setEditing(true)} className="p-1.5 hover:bg-white/8 rounded-lg transition-colors">
          <Edit3 size={13} className="text-white/40" />
        </button>
        {total > 1 && (
          <button onClick={() => onDelete(repo.id)} className="p-1.5 hover:bg-[#ff414e]/12 rounded-lg transition-colors">
            <Trash2 size={13} className="text-[#ff414e]/50 hover:text-[#ff414e]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Milestone row ────────────────────────────────────────────────────────────

function MilestoneRow({
  ms, onToggle, onDelete,
}: {
  ms: Milestone;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const today    = new Date();
  const due      = new Date(ms.dueDate);
  const overdue  = !ms.done && due < today;
  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
      ms.done ? 'bg-emerald-500/5 border-emerald-500/15' :
      overdue ? 'bg-[#ff414e]/5 border-[#ff414e]/20' :
      'bg-white/4 border-white/8 hover:border-[#ffde22]/20'
    }`}>
      <button onClick={() => onToggle(ms.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          ms.done ? 'bg-emerald-500 border-emerald-500' :
          overdue ? 'border-[#ff414e]' : 'border-white/30 hover:border-[#ffde22]'
        }`}>
        {ms.done && <CheckCircle size={11} className="text-black" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${ms.done ? 'line-through text-white/30' : 'text-white'}`}>
            {ms.title}
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-white/30">{ms.epic}</span>
        </div>
        <p className={`text-xs mt-0.5 ${overdue ? 'text-[#ff414e]' : ms.done ? 'text-white/30' : 'text-white/40'}`}>
          {ms.done ? 'Completed' : overdue ? `Overdue by ${-daysLeft}d` : `Due in ${daysLeft}d — ${ms.dueDate}`}
        </p>
      </div>

      <button onClick={() => onDelete(ms.id)}
        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#ff414e]/12 rounded-lg transition-all">
        <Trash2 size={12} className="text-[#ff414e]/50" />
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function TeamProfileModal({
  team,
  analytics,
  onClose,
  onUpdate,
}: {
  team: TeamProfile;
  analytics?: any;
  onClose: () => void;
  onUpdate: (updated: TeamProfile) => void;
}) {
  const [activeSection, setActiveSection] = useState<'overview' | 'repos' | 'milestones' | 'students'>('overview');
  const [repos, setRepos] = useState<Repo[]>(
    team.repos?.length
      ? team.repos
      : [{ id: 'r1', url: team.repoUrl ?? '', label: 'Main', primary: true } as any]
  );
  const [milestones, setMilestones] = useState<Milestone[]>(seedMilestones(team.name));
  const [guideNotes, setGuideNotes] = useState('Add notes about this team here...\n\nE.g. team is ahead of schedule, backend needs attention.');
  const [newMilestone, setNewMilestone] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // ── Repo operations ─────────────────────────────────────────────────────

  const addRepo = () =>
    setRepos(r => [...r, { id: `r${Date.now()}`, url: '', label: 'Repo', primary: false }]);

  const updateRepo = (id: string, field: keyof Repo, val: string) =>
    setRepos(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const deleteRepo = (id: string) =>
    setRepos(prev => {
      const next = prev.filter(r => r.id !== id);
      if (!next.some(r => r.primary) && next.length) next[0].primary = true;
      return next;
    });

  const setPrimaryRepo = (id: string) =>
    setRepos(r => r.map(x => ({ ...x, primary: x.id === id })));

  // ── Milestone operations ────────────────────────────────────────────────

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones(prev => [...prev, {
      id: `m${Date.now()}`,
      title: newMilestone.trim(),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      done: false,
      epic: 'General',
    }]);
    setNewMilestone('');
  };

  // ── Save ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    onUpdate({
      ...team,
      repos,
      repoUrl: repos.find(r => r.primary)?.url ?? repos[0]?.url,
    } as any);
    onClose();
  };

  // ── Derived ─────────────────────────────────────────────────────────────

  const contributors = analytics?.contributors ?? [];
  const doneMs  = milestones.filter(m => m.done).length;
  const totalMs = milestones.length;
  const msPct   = totalMs > 0 ? Math.round((doneMs / totalMs) * 100) : 0;
  const TECH_COLORS = ['#ffde22','#ff8928','#ff414e','#10b981','#a855f7','#3b82f6'];

  const SECTIONS = [
    { id: 'overview',   label: 'Overview',   icon: BarChart3 },
    { id: 'repos',      label: 'Repos',      icon: GitBranch },
    { id: 'milestones', label: 'Milestones', icon: Target    },
    { id: 'students',   label: 'Students',   icon: Users     },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full sm:max-w-3xl bg-[#0f0f0f] sm:rounded-2xl border-t sm:border border-white/10 shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-2xl flex items-center justify-center text-black font-black text-xl flex-shrink-0">
              {team.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{team.name}</h2>
                {team.leader && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-[#ffde22]/15 text-[#ffde22] rounded-full">
                    <Crown size={10} />{team.leader.split(' ')[0]}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/40 mt-0.5">
                {team.members.length} members · {repos.filter(r=>r.url).length} repo{repos.filter(r=>r.url).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave}
              className="px-4 py-2 bg-[#ffde22] text-black text-sm font-black rounded-xl hover:brightness-110 transition-all">
              Save
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/8 rounded-xl transition-colors">
              <X size={18} className="text-white/50" />
            </button>
          </div>
        </div>

        {/* ── Section tabs ─────────────────────────────────────────────── */}
        <div className="flex gap-1 px-6 pt-4 pb-0 flex-shrink-0">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
                  activeSection === s.id
                    ? 'text-[#ffde22] border-[#ffde22]'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}>
                <Icon size={13} />{s.label}
              </button>
            );
          })}
        </div>
        <div className="border-b border-white/8 flex-shrink-0" />

        {/* ── Scrollable content ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
          {activeSection === 'overview' && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Commits',  value: team.commits  ?? 0, color: '#ffde22' },
                  { label: 'Progress', value: `${team.progress ?? 0}%`, color: '#ff8928' },
                  { label: 'Open PRs', value: team.openPRs  ?? 0, color: '#a855f7' },
                  { label: 'Score',    value: team.activityScore ?? 0, color: '#10b981' },
                ].map(s => (
                  <div key={s.label} className="bg-white/4 rounded-xl p-4 text-center border border-white/8">
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Sprint velocity chart */}
              <div className="bg-white/4 rounded-xl p-5 border border-white/8">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-[#ffde22]" />
                  Sprint Velocity (commits/sprint)
                </h3>
                <AnimatedTimeline
                  data={velocityData(team.sprintVelocity)}
                  type="bar"
                  color="#ffde22"
                  chartHeight={160}
                />
              </div>

              {/* Milestone progress */}
              <div className="bg-white/4 rounded-xl p-5 border border-white/8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Target size={15} className="text-[#ff8928]" />Project Milestones
                  </h3>
                  <span className="text-sm font-bold text-[#ffde22]">{doneMs}/{totalMs}</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-3">
                  <motion.div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${msPct}%` }} transition={{ duration: 0.8 }} />
                </div>
                <div className="space-y-2">
                  {milestones.slice(0, 3).map(ms => (
                    <div key={ms.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ms.done ? 'bg-emerald-500' : 'bg-white/20'}`} />
                      <span className={ms.done ? 'line-through text-white/30' : 'text-white/70'}>{ms.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              {team.tech && team.tech.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.tech.map((t, i) => (
                      <span key={t} className="px-3 py-1.5 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: `${TECH_COLORS[i % TECH_COLORS.length]}15`,
                          borderColor: `${TECH_COLORS[i % TECH_COLORS.length]}40`,
                          color: TECH_COLORS[i % TECH_COLORS.length],
                        }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Guide notes (Notion-style editable block) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                  <FileText size={12} />Guide Notes
                </h3>
                <textarea
                  value={guideNotes}
                  onChange={e => setGuideNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white/70 outline-none focus:border-[#ffde22]/40 transition-colors resize-none placeholder-white/20"
                  placeholder="Add notes, links, or observations about this team..."
                />
              </div>
            </>
          )}

          {/* ─── REPOS ────────────────────────────────────────────────── */}
          {activeSection === 'repos' && (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">GitHub Repositories</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    Add, remove, or swap repos. ★ marks the primary repo used for analytics.
                  </p>
                </div>
                <button onClick={addRepo}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#ffde22]/10 text-[#ffde22] rounded-xl text-xs font-bold border border-[#ffde22]/20 hover:bg-[#ffde22]/20 transition-colors flex-shrink-0">
                  <Plus size={13} />Add Repo
                </button>
              </div>

              {/* Scenario cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: GitBranch,  title: 'Monorepo',    desc: 'One repo, mark as primary' },
                  { icon: Code2,      title: 'Multi-repo',  desc: 'Frontend + Backend separate' },
                  { icon: RefreshCw,  title: 'Repo change', desc: 'Delete old, add new anytime' },
                ].map(s => (
                  <div key={s.title} className="p-3 rounded-xl bg-white/3 border border-white/8 text-center">
                    <s.icon size={16} className="mx-auto mb-1.5 text-white/30" />
                    <p className="text-xs font-bold text-white/50">{s.title}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {repos.map(repo => (
                    <RepoItem key={repo.id} repo={repo} total={repos.length}
                      onUpdate={updateRepo} onDelete={deleteRepo} onSetPrimary={setPrimaryRepo} />
                  ))}
                </AnimatePresence>
              </div>

              {repos.length === 0 && (
                <div className="text-center py-10">
                  <Github size={32} className="mx-auto mb-3 text-white/15" />
                  <p className="text-sm text-white/30">No repos yet. Add one above.</p>
                </div>
              )}
            </>
          )}

          {/* ─── MILESTONES ───────────────────────────────────────────── */}
          {activeSection === 'milestones' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Project Milestones</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    Jira-style epics mapped to deliverables. Track due dates and mark complete.
                  </p>
                </div>
                <span className="text-sm font-bold text-[#ffde22]">{doneMs}/{totalMs} done</span>
              </div>

              {/* Overall progress */}
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${msPct}%` }} transition={{ duration: 0.8 }} />
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {milestones.map(ms => (
                    <MilestoneRow key={ms.id} ms={ms}
                      onToggle={id => setMilestones(prev => prev.map(m => m.id === id ? {...m, done: !m.done} : m))}
                      onDelete={id => setMilestones(prev => prev.filter(m => m.id !== id))} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Add milestone */}
              <div className="flex gap-2">
                <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMilestone()}
                  placeholder="Add milestone — press Enter..."
                  className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#ffde22]/50 transition-colors" />
                <button onClick={addMilestone}
                  className="px-4 py-2.5 bg-[#ffde22]/10 text-[#ffde22] rounded-xl text-sm font-bold border border-[#ffde22]/20 hover:bg-[#ffde22]/20 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </>
          )}

          {/* ─── STUDENTS ─────────────────────────────────────────────── */}
          {activeSection === 'students' && (
            <>
              <div>
                <h3 className="font-semibold text-white">Individual Student Progress</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Drill into each member's commit history, task completion, and activity score.
                </p>
              </div>

              {contributors.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={32} className="mx-auto mb-3 text-white/15" />
                  <p className="text-sm text-white/30">No contributor data. Load analytics first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contributors.map((c: any, i: number) => {
                    const isOpen  = expandedStudent === c.name;
                    const color   = ['#ffde22','#ff8928','#ff414e','#10b981'][i % 4];
                    const pct     = analytics?.summary?.total_commits > 0
                      ? Math.round((c.commits / analytics.summary.total_commits) * 100)
                      : 0;

                    return (
                      <motion.div key={c.name} layout className="bg-white/4 rounded-xl border border-white/8 overflow-hidden">
                        <button
                          onClick={() => setExpandedStudent(isOpen ? null : c.name)}
                          className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
                            {c.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">{c.name}</p>
                              {i === 0 && <Crown size={12} className="text-[#ffde22]" />}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                              </div>
                              <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{pct}% of commits</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm flex-shrink-0">
                            <div className="text-center">
                              <p className="font-bold text-white">{c.commits}</p>
                              <p className="text-[10px] text-white/35">commits</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold" style={{ color }}>{c.activity_score}</p>
                              <p className="text-[10px] text-white/35">score</p>
                            </div>
                            {isOpen ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/8"
                            >
                              <div className="p-4 grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  {[
                                    { label: 'Lines Added',   value: `+${c.additions?.toLocaleString()}`,  color: '#10b981' },
                                    { label: 'Lines Removed', value: `-${c.deletions?.toLocaleString()}`,  color: '#ff414e' },
                                    { label: 'Activity Score',value: c.activity_score,                     color },
                                  ].map(s => (
                                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                      <span className="text-xs text-white/40">{s.label}</span>
                                      <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-xs text-white/40 mb-2">Commit share</p>
                                  <div className="flex items-center justify-center h-24">
                                    <div className="relative">
                                      <svg viewBox="0 0 80 80" width={80} height={80}>
                                        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                                        <circle cx="40" cy="40" r="30" fill="none"
                                          stroke={color} strokeWidth="10"
                                          strokeDasharray={`${pct * 1.885} 188.5`}
                                          strokeLinecap="round"
                                          transform="rotate(-90 40 40)" />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-black" style={{ color }}>{pct}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}