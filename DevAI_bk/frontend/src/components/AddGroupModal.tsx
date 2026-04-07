'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Users, Plus, Trash2, AlertCircle, CheckCircle, ExternalLink, GitBranch, Edit3 } from 'lucide-react';

// ─── GitHub URL validation ────────────────────────────────────────────────────

const GITHUB_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\.git)?(\/?)?$/;

function validateGithubUrl(url: string): { valid: boolean; error: string } {
  if (!url) return { valid: false, error: 'Repository URL is required' };
  if (!url.startsWith('https://github.com/'))
    return { valid: false, error: 'Must be a GitHub URL (https://github.com/...)' };
  if (!GITHUB_REGEX.test(url.trim()))
    return { valid: false, error: 'Format: https://github.com/owner/repo-name' };
  return { valid: true, error: '' };
}

// ─── Repo entry row ───────────────────────────────────────────────────────────

interface Repo {
  id: string;
  url: string;
  label: string;   // e.g. "Frontend", "Backend", "Main"
  primary: boolean;
}

function RepoRow({
  repo, index, total, onChange, onDelete, onSetPrimary,
}: {
  repo: Repo; index: number; total: number;
  onChange: (id: string, field: keyof Repo, val: string) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const validation = validateGithubUrl(repo.url);
  const showError  = touched && !validation.valid;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        {/* Label */}
        <input
          value={repo.label}
          onChange={e => onChange(repo.id, 'label', e.target.value)}
          placeholder="Label (e.g. Frontend)"
          className="w-28 flex-shrink-0 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#ffde22]/60 transition-colors"
        />

        {/* URL */}
        <div className="relative flex-1">
          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={repo.url}
            onChange={e => onChange(repo.id, 'url', e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://github.com/owner/repo"
            className={`w-full rounded-lg border pl-9 pr-9 py-2 text-sm text-white outline-none bg-white/5 transition-colors ${
              showError
                ? 'border-[#ff414e]/60 focus:border-[#ff414e]'
                : validation.valid && repo.url
                ? 'border-emerald-500/40 focus:border-emerald-500/60'
                : 'border-white/8 focus:border-[#ffde22]/60'
            }`}
          />
          {/* Status icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {repo.url && validation.valid && (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            {showError && (
              <AlertCircle className="w-4 h-4 text-[#ff414e]" />
            )}
          </div>
        </div>

        {/* Primary toggle */}
        <button
          type="button"
          onClick={() => onSetPrimary(repo.id)}
          title="Set as primary repo"
          className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            repo.primary
              ? 'bg-[#ffde22]/15 border-[#ffde22]/40 text-[#ffde22]'
              : 'border-white/8 text-white/30 hover:text-white/60 hover:border-white/20'
          }`}
        >
          {repo.primary ? '★ Main' : '☆'}
        </button>

        {/* Delete */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => onDelete(repo.id)}
            className="flex-shrink-0 p-1.5 hover:bg-[#ff414e]/15 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#ff414e]/60 hover:text-[#ff414e]" />
          </button>
        )}
      </div>

      {/* Inline error */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-[#ff414e] pl-1 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {validation.error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Preview link */}
      {validation.valid && repo.url && (
        <a href={repo.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#ffde22]/60 hover:text-[#ffde22] transition-colors pl-1">
          <ExternalLink className="w-3 h-3" /> Preview repo
        </a>
      )}
    </motion.div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  leader: string;
  members: string;
  repos: Repo[];
  description: string;
}

export default function AddGroupModal({
  onClose,
  onSubmit,
  initialData,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<FormData & { id: string }>;
}) {
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<FormData>({
    name:        initialData?.name        ?? '',
    leader:      initialData?.leader      ?? '',
    members:     initialData?.members     ?? '',
    description: initialData?.description ?? '',
    repos: initialData?.repos ?? [
      { id: 'r1', url: '', label: 'Main', primary: true },
    ],
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ── Repo helpers ──────────────────────────────────────────────────────────

  const addRepo = () => {
    setForm(f => ({
      ...f,
      repos: [
        ...f.repos,
        { id: `r${Date.now()}`, url: '', label: '', primary: false },
      ],
    }));
  };

  const updateRepo = (id: string, field: keyof Repo, val: string) => {
    setForm(f => ({
      ...f,
      repos: f.repos.map(r => r.id === id ? { ...r, [field]: val } : r),
    }));
  };

  const deleteRepo = (id: string) => {
    setForm(f => {
      const remaining = f.repos.filter(r => r.id !== id);
      // If we deleted the primary, promote the first remaining
      if (!remaining.some(r => r.primary) && remaining.length > 0) {
        remaining[0].primary = true;
      }
      return { ...f, repos: remaining };
    });
  };

  const setPrimary = (id: string) => {
    setForm(f => ({
      ...f,
      repos: f.repos.map(r => ({ ...r, primary: r.id === id })),
    }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const allReposValid = form.repos.every(r => {
    if (!r.url) return false;
    return validateGithubUrl(r.url).valid;
  });

  const formValid =
    form.name.trim() &&
    form.leader.trim() &&
    form.members.trim() &&
    allReposValid;

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!formValid) return;

    onSubmit({
      id:          initialData?.id,
      name:        form.name.trim(),
      leader:      form.leader.trim(),
      members:     form.members.split(',').map(m => m.trim()).filter(Boolean),
      description: form.description.trim(),
      repos:       form.repos,
      repoUrl:     form.repos.find(r => r.primary)?.url ?? form.repos[0]?.url ?? '',
    });
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#111] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-xl flex items-center justify-center">
              {isEdit ? <Edit3 size={16} className="text-black" /> : <Users size={16} className="text-black" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Team' : 'Create New Team'}</h2>
              <p className="text-xs text-white/40">{isEdit ? 'Update team details and repositories' : 'Set up a new squad with GitHub repos'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/8 rounded-xl transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Team Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#ffde22]">Team Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Team Quantum"
              className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white text-sm outline-none transition-colors ${
                submitAttempted && !form.name ? 'border-[#ff414e]/50' : 'border-white/8 focus:border-[#ffde22]/60'
              }`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description <span className="normal-case text-white/25">(optional)</span></label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Short project description..."
              className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-white text-sm outline-none focus:border-[#ffde22]/60 transition-colors"
            />
          </div>

          {/* Leader + Members row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#ffde22]">Team Leader *</label>
              <input
                value={form.leader}
                onChange={e => setForm(f => ({ ...f, leader: e.target.value }))}
                placeholder="Full name"
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white text-sm outline-none transition-colors ${
                  submitAttempted && !form.leader ? 'border-[#ff414e]/50' : 'border-white/8 focus:border-[#ffde22]/60'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#ffde22]">Members *</label>
              <input
                value={form.members}
                onChange={e => setForm(f => ({ ...f, members: e.target.value }))}
                placeholder="Alice, Bob, Charlie"
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white text-sm outline-none transition-colors ${
                  submitAttempted && !form.members ? 'border-[#ff414e]/50' : 'border-white/8 focus:border-[#ffde22]/60'
                }`}
              />
              <p className="text-xs text-white/25">Comma-separated names</p>
            </div>
          </div>

          {/* GitHub Repositories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#ffde22]">GitHub Repositories *</label>
                <p className="text-xs text-white/30 mt-0.5">Only github.com URLs accepted. Star ★ = primary repo for analytics.</p>
              </div>
              <button
                type="button"
                onClick={addRepo}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffde22]/10 text-[#ffde22] rounded-lg text-xs font-bold border border-[#ffde22]/20 hover:bg-[#ffde22]/20 transition-colors"
              >
                <Plus size={12} /> Add Repo
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {form.repos.map((repo, i) => (
                  <RepoRow
                    key={repo.id}
                    repo={repo}
                    index={i}
                    total={form.repos.length}
                    onChange={updateRepo}
                    onDelete={deleteRepo}
                    onSetPrimary={setPrimary}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Scenario hints */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: 'Monorepo', hint: '1 repo for whole project' },
                { label: 'Multi-repo', hint: 'Frontend + Backend separate' },
                { label: 'New repo', hint: 'Replace with updated link anytime' },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded-lg bg-white/3 border border-white/6 text-center">
                  <p className="text-xs font-bold text-white/50">{s.label}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{s.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit errors */}
          {submitAttempted && !formValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#ff414e]/10 border border-[#ff414e]/20"
            >
              <AlertCircle size={14} className="text-[#ff414e] flex-shrink-0" />
              <p className="text-xs text-[#ff414e]">
                {!allReposValid
                  ? 'All GitHub URLs must be valid (https://github.com/owner/repo)'
                  : 'Please fill in all required fields marked with *'}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                formValid
                  ? 'bg-[#ffde22] text-black hover:brightness-110'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}>
              {isEdit ? 'Save Changes' : 'Deploy Squad'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}