'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Clock, User, MessageSquare, X, Edit2, Trash2,
  LayoutGrid, Users, ChevronDown, Filter, Search,
  GitCommit, AlertCircle, CheckCircle, BarChart3,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status   = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  teamId: string;
  dueDate?: string;
  comments: number;
  tags?: string[];
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  members: string[];
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const TEAMS: Team[] = [
  { id: 'all',     name: 'All Teams',   color: '#ffde22', members: [] },
  { id: 'quantum', name: 'Team Quantum', color: '#ffde22', members: ['Hrishi', 'Sahil', 'Rohan'] },
  { id: 'nebula',  name: 'Team Nebula',  color: '#ff8928', members: ['Diya', 'Anubhav', 'Vedant'] },
  { id: 'phoenix', name: 'Team Phoenix', color: '#ff414e', members: ['Sanika', 'Prajakta', 'Neha'] },
];

const SEED_TASKS: Task[] = [
  { id:'1', title:'Design auth flow',         description:'Login & signup pages with validation', status:'todo',        priority:'high',   assignee:'Hrishi',  teamId:'quantum', dueDate:'2024-04-10', comments:3, tags:['frontend','auth'],   createdAt: new Date().toISOString() },
  { id:'2', title:'Implement API endpoints',   description:'REST endpoints for user management',  status:'in-progress', priority:'high',   assignee:'Sahil',    teamId:'quantum', dueDate:'2024-04-12', comments:5, tags:['backend','api'],    createdAt: new Date().toISOString() },
  { id:'3', title:'Code review PR #42',        description:'Review auth middleware',               status:'review',      priority:'medium', assignee:'Rohan',teamId:'quantum', dueDate:'2024-04-08', comments:2, tags:['review'],           createdAt: new Date().toISOString() },
  { id:'4', title:'Update README',             description:'Add setup instructions',               status:'done',        priority:'low',    assignee:'Hrishi',  teamId:'quantum', dueDate:'2024-04-05', comments:1, tags:['docs'],             createdAt: new Date().toISOString() },
  { id:'5', title:'Database schema design',    description:'ER diagram for user tables',           status:'todo',        priority:'high',   assignee:'Diya',  teamId:'nebula',  dueDate:'2024-04-11', comments:4, tags:['database'],         createdAt: new Date().toISOString() },
  { id:'6', title:'WebSocket integration',     description:'Real-time commit notifications',       status:'in-progress', priority:'medium', assignee:'Anubhav',    teamId:'nebula',  dueDate:'2024-04-14', comments:2, tags:['backend','ws'],     createdAt: new Date().toISOString() },
  { id:'7', title:'UI component library',      description:'Shared Tailwind components',           status:'todo',        priority:'medium', assignee:'Sanika',  teamId:'phoenix', dueDate:'2024-04-13', comments:0, tags:['frontend','design'],createdAt: new Date().toISOString() },
  { id:'8', title:'CI/CD pipeline',            description:'GitHub Actions for auto-deploy',       status:'done',        priority:'high',   assignee:'Prajakta',  teamId:'phoenix', dueDate:'2024-04-07', comments:6, tags:['devops'],           createdAt: new Date().toISOString() },
  { id:'9', title:'Analytics dashboard',       description:'Recharts integration for metrics',     status:'in-progress', priority:'medium', assignee:'Neha',    teamId:'phoenix', dueDate:'2024-04-16', comments:3, tags:['frontend'],         createdAt: new Date().toISOString() },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'todo'       as Status, title: 'To Do',      color: '#ffde22', bg: 'rgba(255,222,34,0.08)'  },
  { id: 'in-progress'as Status, title: 'In Progress', color: '#ff8928', bg: 'rgba(255,137,40,0.08)' },
  { id: 'review'     as Status, title: 'Review',      color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
  { id: 'done'       as Status, title: 'Done',        color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

const PRIORITY_CFG: Record<Priority, { color: string; label: string }> = {
  high:   { color: '#ff414e', label: 'High'   },
  medium: { color: '#ff8928', label: 'Medium' },
  low:    { color: '#ffde22', label: 'Low'    },
};

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task, teamColor, onEdit, onDelete, onDragStart,
}: {
  task: Task; teamColor: string;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const pCfg = PRIORITY_CFG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      className="bg-[#161616] rounded-xl border border-white/8 p-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all group"
      style={{ borderLeft: `3px solid ${pCfg.color}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ backgroundColor: `${pCfg.color}18`, color: pCfg.color }}>
            {pCfg.label}
          </span>
          {task.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-xs text-white/30 bg-white/5">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <Edit2 size={13} className="text-white/50" />
          </button>
          <button onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-[#ff414e]/15 rounded-md transition-colors">
            <Trash2 size={13} className="text-[#ff414e]/60" />
          </button>
        </div>
      </div>

      <h4 className="font-semibold text-white text-sm mb-1 leading-snug">{task.title}</h4>
      <p className="text-xs text-white/40 mb-3 leading-relaxed line-clamp-2">{task.description}</p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-black"
                style={{ backgroundColor: teamColor }}>
                {task.assignee[0]}
              </div>
              <span className="text-xs text-white/40">{task.assignee}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-[#ff414e]' : 'text-white/30'}`}>
              <Clock size={10} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-0.5 text-white/25">
            <MessageSquare size={10} />{task.comments}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Student Progress Panel ───────────────────────────────────────────────────

function StudentProgressPanel({ tasks, team }: { tasks: Task[]; team: Team }) {
  const members = team.id === 'all'
    ? TEAMS.filter(t => t.id !== 'all').flatMap(t => t.members)
    : team.members;

  const stats = members.map(member => {
    const myTasks  = tasks.filter(t => t.assignee === member);
    const done     = myTasks.filter(t => t.status === 'done').length;
    const inProg   = myTasks.filter(t => t.status === 'in-progress').length;
    const review   = myTasks.filter(t => t.status === 'review').length;
    const todo     = myTasks.filter(t => t.status === 'todo').length;
    const total    = myTasks.length;
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
    const overdue  = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
    return { member, done, inProg, review, todo, total, pct, overdue };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 size={16} className="text-[#ffde22]" />
        <h3 className="font-semibold text-white">Individual Student Progress</h3>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-8">Select a specific team to view student progress</p>
      ) : (
        <div className="grid gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.member}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/4 rounded-xl p-4 border border-white/8 hover:border-[#ffde22]/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-black"
                    style={{ background: `linear-gradient(135deg, ${team.color}, ${team.color}80)` }}>
                    {s.member[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{s.member}</p>
                    <p className="text-xs text-white/35">{s.total} tasks assigned</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: team.color }}>{s.pct}%</p>
                  {s.overdue > 0 && (
                    <p className="text-xs text-[#ff414e] flex items-center gap-1 justify-end">
                      <AlertCircle size={10} />{s.overdue} overdue
                    </p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/6 rounded-full overflow-hidden mb-3">
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${team.color}, ${team.color}80)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                />
              </div>

              {/* Status breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'To Do',    value: s.todo,   color: '#ffde22' },
                  { label: 'Active',   value: s.inProg, color: '#ff8928' },
                  { label: 'Review',   value: s.review, color: '#a855f7' },
                  { label: 'Done',     value: s.done,   color: '#10b981' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/4 rounded-lg py-1.5">
                    <p className="text-xs font-bold" style={{ color }}>{value}</p>
                    <p className="text-[10px] text-white/30">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────

function TaskModal({
  task, teams, selectedTeamId, onClose, onSave,
}: {
  task: Partial<Task> | null;
  teams: Team[];
  selectedTeamId: string;
  onClose: () => void;
  onSave: (t: Task) => void;
}) {
  const isNew = !task?.id;
  const activeTeam = teams.find(t => t.id === selectedTeamId && t.id !== 'all') ?? teams[1];

  const [form, setForm] = useState<Omit<Task,'id'|'createdAt'|'comments'>>({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    status:      task?.status      ?? 'todo',
    priority:    task?.priority    ?? 'medium',
    assignee:    task?.assignee    ?? '',
    teamId:      task?.teamId      ?? (activeTeam?.id ?? 'quantum'),
    dueDate:     task?.dueDate     ?? '',
    tags:        task?.tags        ?? [],
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id:        task?.id ?? `t${Date.now()}`,
      comments:  task?.comments ?? 0,
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });
    onClose();
  };

  const currentTeam = TEAMS.find(t => t.id === form.teamId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#141414] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
          <h3 className="font-bold text-white">{isNew ? 'New Task' : 'Edit Task'}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/8 rounded-lg transition-colors">
            <X size={16} className="text-white/50" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
            placeholder="Task title *"
            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors" />

          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
            placeholder="Description..." rows={2}
            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors resize-none" />

          <div className="grid grid-cols-2 gap-3">
            {/* Team */}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Team</label>
              <select value={form.teamId} onChange={e => setForm(f => ({...f, teamId: e.target.value, assignee: ''}))}
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors">
                {TEAMS.filter(t => t.id !== 'all').map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Assignee</label>
              <select value={form.assignee} onChange={e => setForm(f => ({...f, assignee: e.target.value}))}
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors">
                <option value="">Unassigned</option>
                {(currentTeam?.members ?? []).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value as Priority}))}
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due date */}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate: e.target.value}))}
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors" />
            </div>
          </div>

          {/* Status (edit only) */}
          {!isNew && (
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Status</label>
              <div className="flex gap-2">
                {COLUMNS.map(col => (
                  <button key={col.id} type="button" onClick={() => setForm(f => ({...f, status: col.id}))}
                    className="flex-1 py-2 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      backgroundColor: form.status === col.id ? `${col.color}18` : 'rgba(255,255,255,0.03)',
                      borderColor: form.status === col.id ? `${col.color}50` : 'rgba(255,255,255,0.08)',
                      color: form.status === col.id ? col.color : 'rgba(255,255,255,0.3)',
                    }}>
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#ffde22] text-black text-sm font-black hover:brightness-110 transition-all">
              {isNew ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Kanban ──────────────────────────────────────────────────────────────

interface KanbanProps {
  teamId?: string; // if provided from outside (student view), locks to that team
}

export default function Kanban({ teamId: lockedTeamId }: KanbanProps) {
  const [tasks, setTasks]           = useState<Task[]>(SEED_TASKS);
  const [selectedTeamId, setTeamId] = useState(lockedTeamId ?? 'all');
  const [view, setView]             = useState<'board' | 'progress'>('board');
  const [search, setSearch]         = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [editTask, setEditTask]     = useState<Task | null>(null);
  const [addingNew, setAddingNew]   = useState(false);
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);

  const currentTeam = TEAMS.find(t => t.id === selectedTeamId) ?? TEAMS[0];

  // Filtered tasks
  const visibleTasks = useMemo(() => tasks.filter(t => {
    const teamMatch     = selectedTeamId === 'all' || t.teamId === selectedTeamId;
    const searchMatch   = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.assignee?.toLowerCase().includes(search.toLowerCase());
    const priorityMatch = filterPriority === 'all' || t.priority === filterPriority;
    return teamMatch && searchMatch && priorityMatch;
  }), [tasks, selectedTeamId, search, filterPriority]);

  // Stats
  const stats = useMemo(() => ({
    total:   visibleTasks.length,
    done:    visibleTasks.filter(t => t.status === 'done').length,
    active:  visibleTasks.filter(t => t.status === 'in-progress').length,
    overdue: visibleTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  }), [visibleTasks]);

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('taskId', id);
  const handleDragOver  = (e: React.DragEvent, col: Status) => { e.preventDefault(); setDragOverCol(col); };
  const handleDrop      = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setDragOverCol(null);
  };

  const saveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      return exists ? prev.map(t => t.id === task.id ? task : t) : [...prev, task];
    });
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="space-y-5">
      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Team selector (hidden if locked) */}
          {!lockedTeamId && (
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
              {TEAMS.map(t => (
                <button key={t.id} onClick={() => setTeamId(t.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: selectedTeamId === t.id ? `${t.color}18` : 'transparent',
                    color: selectedTeamId === t.id ? t.color : 'rgba(255,255,255,0.4)',
                    border: selectedTeamId === t.id ? `1px solid ${t.color}40` : '1px solid transparent',
                  }}>
                  {t.name}
                </button>
              ))}
            </div>
          )}

          {/* View toggle */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
            <button onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === 'board' ? 'bg-[#ffde22]/15 text-[#ffde22] border border-[#ffde22]/30' : 'text-white/40'
              }`}>
              <LayoutGrid size={13} /> Board
            </button>
            <button onClick={() => setView('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === 'progress' ? 'bg-[#ffde22]/15 text-[#ffde22] border border-[#ffde22]/30' : 'text-white/40'
              }`}>
              <Users size={13} /> Progress
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#ffde22]/40 w-44 transition-colors" />
          </div>

          {/* Priority filter */}
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)}
            className="bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none">
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Add task */}
          <button onClick={() => setAddingNew(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl text-xs font-black hover:scale-105 transition-all">
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',   value: stats.total,   color: '#ffffff' },
          { label: 'Active',  value: stats.active,  color: '#ff8928' },
          { label: 'Done',    value: stats.done,    color: '#10b981' },
          { label: 'Overdue', value: stats.overdue, color: '#ff414e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/4 rounded-xl p-3 text-center border border-white/6">
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-white/35">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Board or Progress view ── */}
      {view === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = visibleTasks.filter(t => t.status === col.id);
            const isDragTarget = dragOverCol === col.id;

            return (
              <div key={col.id}
                onDragOver={e => handleDragOver(e, col.id)}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={e => handleDrop(e, col.id)}
                className="rounded-2xl border transition-all min-h-[300px]"
                style={{
                  backgroundColor: isDragTarget ? `${col.color}10` : 'rgba(255,255,255,0.025)',
                  borderColor: isDragTarget ? `${col.color}50` : 'rgba(255,255,255,0.07)',
                }}
              >
                {/* Column header */}
                <div className="p-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-sm font-bold" style={{ color: col.color }}>{col.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/8 text-white/50">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="p-3 pt-1 space-y-2">
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        teamColor={TEAMS.find(t => t.id === task.teamId)?.color ?? '#ffde22'}
                        onEdit={t => setEditTask(t)}
                        onDelete={deleteTask}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-white/15 text-xs">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/4 rounded-2xl border border-white/8 p-6">
          <StudentProgressPanel tasks={visibleTasks} team={currentTeam} />
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {(editTask || addingNew) && (
          <TaskModal
            task={editTask ?? {}}
            teams={TEAMS}
            selectedTeamId={selectedTeamId}
            onClose={() => { setEditTask(null); setAddingNew(false); }}
            onSave={saveTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}