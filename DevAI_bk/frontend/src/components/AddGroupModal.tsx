'use client';

import { useState } from 'react';
import { X, Github, Users } from 'lucide-react';

export default function AddGroupModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: '', repoUrl: '', leader: '', members: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leader || !formData.members) {
      alert("Please fill in Team Name, Leader, and Members.");
      return;
    }
    const squadData = { ...formData, members: formData.members.split(',').map(m => m.trim()) };
    onSubmit(squadData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#111] p-10 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-satoshi text-2xl font-black italic uppercase text-white">Initialize Squad</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#ffde22]">Team Name</label>
            <input required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-[#ffde22]" placeholder="e.g. Team Quantum" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#ffde22]">GitHub Repository URL</label>
            <input onChange={e => setFormData({...formData, repoUrl: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-[#ffde22]" placeholder="https://github.com/..." />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#ffde22]">Team Leader</label>
            <input required onChange={e => setFormData({...formData, leader: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-[#ffde22]" placeholder="Full Name" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#ffde22]">Members (Comma Separated)</label>
            <textarea required onChange={e => setFormData({...formData, members: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-[#ffde22] h-24" placeholder="Alice Chen, Bob Smith..." />
          </div>

          <button type="submit" className="w-full rounded-2xl bg-[#ffde22] p-5 font-satoshi font-black uppercase text-black shadow-[0_0_20px_rgba(255,222,34,0.3)]">DEPLOY SQUAD</button>
        </form>
      </div>
    </div>
  );
}