'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, X,
  Zap, GitCommit, Flag, Calendar, Clock,
  CheckCircle, AlertCircle, Star,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'sprint' | 'deadline' | 'review' | 'milestone' | 'meeting';

interface CalEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  type: EventType;
  team?: string;
  time?: string;
  done?: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<EventType, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  sprint:    { color: '#ffde22', bg: 'rgba(255,222,34,0.15)',  icon: Zap,         label: 'Sprint'     },
  deadline:  { color: '#ff414e', bg: 'rgba(255,65,78,0.15)',   icon: Flag,        label: 'Deadline'   },
  review:    { color: '#ff8928', bg: 'rgba(255,137,40,0.15)',  icon: Star,        label: 'Review'     },
  milestone: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: CheckCircle, label: 'Milestone'  },
  meeting:   { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', icon: Calendar,    label: 'Meeting'    },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

// ─── Seed events relative to today ───────────────────────────────────────────

function seedEvents(): CalEvent[] {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  const fmt = (day: number) =>
    `${y}-${String(m + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  return [
    { id:'e1', title:'Sprint 4 Kickoff',        date: fmt(1),      type:'sprint',    team:'All Teams',   time:'10:00 AM' },
    { id:'e2', title:'API Milestone v1',         date: fmt(3),      type:'milestone', team:'Team Nebula',  time:'12:00 PM' },
    { id:'e3', title:'PR Review — Auth Module',  date: fmt(d),      type:'review',    team:'Team Quantum', time:'2:00 PM'  },
    { id:'e4', title:'Final Submission',         date: fmt(d + 5),  type:'deadline',  team:'All Teams',    time:'11:59 PM' },
    { id:'e5', title:'Sprint Retrospective',     date: fmt(d + 7),  type:'meeting',   team:'All Teams',    time:'4:00 PM'  },
    { id:'e6', title:'Database Schema Lock',     date: fmt(d + 10), type:'deadline',  team:'Team Phoenix', time:'6:00 PM'  },
    { id:'e7', title:'Code Freeze',              date: fmt(d + 14), type:'milestone', team:'All Teams',    time:'9:00 AM'  },
    { id:'e8', title:'Demo Day Presentation',    date: fmt(d + 18), type:'milestone', team:'All Teams',    time:'2:00 PM'  },
    { id:'e9', title:'Sprint 5 Planning',        date: fmt(d + 20), type:'sprint',    team:'All Teams',    time:'10:00 AM' },
  ].filter(e => {
    const day = parseInt(e.date.split('-')[2]);
    return day >= 1 && day <= 31;
  });
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

function AddEventModal({ onClose, onAdd, selectedDate }: {
  onClose: () => void;
  onAdd: (e: CalEvent) => void;
  selectedDate: string;
}) {
  const [title, setTitle]   = useState('');
  const [type, setType]     = useState<EventType>('meeting');
  const [time, setTime]     = useState('10:00 AM');
  const [team, setTeam]     = useState('All Teams');

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ id: `ev_${Date.now()}`, title, date: selectedDate, type, time, team });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-md bg-[#111] rounded-2xl border border-white/10 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Event</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} className="text-white/60" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#ffde22] font-bold uppercase tracking-widest mb-1.5 block">Event Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sprint Review"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors" />
          </div>

          <div>
            <label className="text-xs text-[#ffde22] font-bold uppercase tracking-widest mb-1.5 block">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(EVENT_CONFIG) as EventType[]).map(t => {
                const cfg = EVENT_CONFIG[t];
                return (
                  <button key={t} onClick={() => setType(t)}
                    className="py-2 rounded-lg text-xs font-bold transition-all border"
                    style={{
                      backgroundColor: type === t ? cfg.bg : 'rgba(255,255,255,0.03)',
                      borderColor: type === t ? cfg.color + '60' : 'rgba(255,255,255,0.08)',
                      color: type === t ? cfg.color : 'rgba(255,255,255,0.4)',
                    }}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#ffde22] font-bold uppercase tracking-widest mb-1.5 block">Time</label>
              <input value={time} onChange={e => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#ffde22] font-bold uppercase tracking-widest mb-1.5 block">Team</label>
              <input value={team} onChange={e => setTeam(e.target.value)}
                placeholder="Team name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={submit}
            className="flex-1 py-3 rounded-xl bg-[#ffde22] text-black text-sm font-black hover:brightness-110 transition-all">
            Add Event
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const now   = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>(seedEvents);

  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  const fmt = (d: number) =>
    `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // Calendar grid
  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cells     = Array.from({ length: firstDay + daysCount }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const eventsOn = (d: number) => events.filter(e => e.date === fmt(d));
  const selectedEvents = selected
    ? events.filter(e => e.date === selected)
    : [];

  const upcomingEvents = [...events]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const addEvent = (e: CalEvent) => setEvents(prev => [...prev, e]);

  const toggleDone = (id: string) =>
    setEvents(prev => prev.map(e => e.id === id ? { ...e, done: !e.done } : e));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* ── Left: Calendar grid ─────────────────────────────────────── */}
      <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {MONTHS[month]} <span className="text-white/40">{year}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
              className="px-3 py-1.5 text-xs font-bold bg-[#ffde22]/10 text-[#ffde22] rounded-lg border border-[#ffde22]/20 hover:bg-[#ffde22]/20 transition-colors">
              Today
            </button>
            <button onClick={nextMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => { setSelected(todayStr); setShowModal(true); }}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#ffde22] text-black rounded-lg text-xs font-black hover:brightness-110 transition-all">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-white/25 py-2">{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} />;
            const dateStr   = fmt(day);
            const dayEvents = eventsOn(day);
            const isToday   = dateStr === todayStr;
            const isSel     = dateStr === selected;

            return (
              <motion.button
                key={day}
                onClick={() => setSelected(isSel ? null : dateStr)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl min-h-[62px] transition-all"
                style={{
                  backgroundColor: isSel
                    ? 'rgba(255,222,34,0.15)'
                    : isToday
                    ? 'rgba(255,222,34,0.08)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSel ? 'rgba(255,222,34,0.5)' : isToday ? 'rgba(255,222,34,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <span className={`text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-[#ffde22] text-black' : isSel ? 'text-[#ffde22]' : 'text-white/60'
                }`}>
                  {day}
                </span>

                {/* Event dots / pills */}
                <div className="flex flex-col gap-0.5 w-full px-1">
                  {dayEvents.slice(0, 2).map((ev, i) => {
                    const cfg = EVENT_CONFIG[ev.type];
                    return (
                      <div key={i} className="w-full h-1 rounded-full" style={{ backgroundColor: cfg.color + 'cc' }} />
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[8px] text-white/30 text-center">+{dayEvents.length - 2}</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/5">
          {(Object.keys(EVENT_CONFIG) as EventType[]).map(t => {
            const cfg = EVENT_CONFIG[t];
            return (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs text-white/40">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Selected day events */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 rounded-2xl border border-[#ffde22]/20 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-white/40 font-medium">
                    {new Date(selected + 'T00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <h3 className="text-base font-bold text-white">
                    {new Date(selected + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#ffde22]/10 text-[#ffde22] rounded-lg text-xs font-bold hover:bg-[#ffde22]/20 transition-colors border border-[#ffde22]/20">
                  <Plus size={12} /> Add
                </button>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-white/15 mx-auto mb-2" />
                  <p className="text-sm text-white/30">No events. Add one!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(ev => {
                    const cfg = EVENT_CONFIG[ev.type];
                    const Icon = cfg.icon;
                    return (
                      <motion.div key={ev.id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cfg.color + '25' }}>
                          <Icon size={14} style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${ev.done ? 'line-through text-white/30' : 'text-white'}`}>
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ev.time && <span className="text-xs text-white/40">{ev.time}</span>}
                            {ev.team && <span className="text-xs text-white/30">• {ev.team}</span>}
                          </div>
                        </div>
                        <button onClick={() => toggleDone(ev.id)}
                          className="flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center hover:border-[#ffde22] transition-colors"
                          style={{ backgroundColor: ev.done ? '#ffde22' : 'transparent' }}>
                          {ev.done && <CheckCircle size={12} className="text-black" />}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming events */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={14} className="text-[#ffde22]" />
            Upcoming Events
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-4">No upcoming events</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(ev => {
                const cfg = EVENT_CONFIG[ev.type];
                const Icon = cfg.icon;
                const evDate = new Date(ev.date + 'T00:00');
                const isEvToday = ev.date === todayStr;
                const diff = Math.ceil((evDate.getTime() - new Date(todayStr + 'T00:00').getTime()) / 86400000);

                return (
                  <button key={ev.id} onClick={() => setSelected(ev.date)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cfg.bg }}>
                      <Icon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{ev.title}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        {isEvToday ? 'Today' : `In ${diff}d`} {ev.time && `• ${ev.time}`}
                      </p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sprint summary */}
        <div className="bg-gradient-to-br from-[#ffde22]/10 to-[#ff8928]/5 rounded-2xl border border-[#ffde22]/20 p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#ffde22] mb-3">Sprint Progress</h3>
          <div className="space-y-3">
            {[
              { label: 'Tasks Completed', value: 14, total: 20 },
              { label: 'PRs Merged',      value: 8,  total: 12 },
              { label: 'Days Remaining',  value: 5,  total: 14, flip: true },
            ].map(({ label, value, total, flip }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{label}</span>
                  <span className="font-bold text-white">{value}<span className="text-white/30">/{total}</span></span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: flip ? 'rgba(255,65,78,0.7)' : 'linear-gradient(90deg,#ffde22,#ff8928)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add event modal */}
      <AnimatePresence>
        {showModal && selected && (
          <AddEventModal
            onClose={() => setShowModal(false)}
            onAdd={addEvent}
            selectedDate={selected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}