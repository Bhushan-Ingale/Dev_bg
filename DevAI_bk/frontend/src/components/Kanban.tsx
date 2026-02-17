'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Kanban() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Integrate RAG Pipeline', status: 'todo', priority: 'high' },
    { id: 2, title: 'Optimize UI/UX Bento', status: 'in-progress', priority: 'medium' }
  ]);

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Squad Objective',
      status: 'todo',
      priority: 'low'
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="space-y-8 font-general">
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-2xl font-black italic uppercase tracking-tighter">Squad Kanban</h2>
        <button 
          onClick={addTask}
          className="flex items-center gap-2 rounded-xl bg-[#ffde22] px-6 py-2.5 text-[10px] font-black text-black uppercase hover:scale-105 transition-transform"
        >
          <Plus size={14}/> Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map((status) => (
          <div key={status} className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{status}</h3>
              <span className="text-[10px] font-bold text-[#ffde22] bg-[#ffde22]/10 px-2 py-1 rounded-md">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {tasks.filter(t => t.status === status).map((task) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    key={task.id} 
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#ffde22]/30 cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{task.title}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white/20">
                        {status === 'done' ? <CheckCircle2 size={12} className="text-[#ffde22]"/> : <AlertCircle size={12}/>}
                        {task.priority}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}