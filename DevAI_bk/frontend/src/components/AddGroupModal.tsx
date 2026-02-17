'use client';

import { useState } from 'react';
import { X, Github, User, Users, Link as LinkIcon } from 'lucide-react';

export default function AddGroupModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    repoUrl: '',
    leader: '',
    members: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation check for required squad fields
    if (!formData.name || !formData.leader || !formData.members) {
      alert("Validation Error: Please provide Team Name, Leader, and Members.");
      return;
    }

    const squadData = {
      ...formData,
      members: formData.members.split(',').map(m => m.trim()).filter(m => m !== '')
    };

    onSubmit(squadData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#111] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Users size={20} />
            </div>
            <h2 className="font-satoshi text-2xl font-black italic uppercase text-white">Initialize Squad</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#ffde22]">Squad Identifier</label>
            <input 
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Team Quantum"
              className="w-full rounded-xl border border-white/5 bg-white/5 p-4 font-general text-sm text-white outline-none focus:border-[#ffde22] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#ffde22]">Repository URL</label>
            <div className="relative">
              <Github className="absolute left-4 top-4 text-white/20" size={18} />
              <input 
                onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                placeholder="https://github.com/org/repo"
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 pl-12 font-general text-sm text-white outline-none focus:border-[#ffde22] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#ffde22]">Squad Leader</label>
              <input 
                required
                onChange={(e) => setFormData({...formData, leader: e.target.value})}
                placeholder="Full Name"
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 font-general text-sm text-white outline-none focus:border-[#ffde22] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#ffde22]">Member Count</label>
              <div className="flex h-[54px] items-center rounded-xl border border-white/5 bg-white/5 px-4 text-sm text-white/40">
                Auto-calculated
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#ffde22]">Squad Members</label>
            <textarea 
              required
              onChange={(e) => setFormData({...formData, members: e.target.value})}
              placeholder="Alice Chen, Bob Smith, Charlie Brown..."
              className="h-24 w-full rounded-xl border border-white/5 bg-white/5 p-4 font-general text-sm text-white outline-none focus:border-[#ffde22] transition-all resize-none"
            />
            <p className="text-[10px] text-white/20 italic italic">Separate names with commas. Leader is added automatically.</p>
          </div>

          <button 
            type="submit"
            className="w-full rounded-2xl bg-[#ffde22] p-5 font-satoshi font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(255,222,34,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            Deploy Squad
          </button>
        </form>
      </div>
    </div>
  );
}