'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, GraduationCap, Users, ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react';

// The same DevAI logo used in the Navbar — a code icon, not a Terminal square
const DevAIBrand = () => (
  <div className="flex flex-col items-center gap-3 mb-8">
    <div className="w-16 h-16 bg-gradient-to-br from-[#ffde22] to-[#ff8928] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,222,34,0.4)]">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M7 8L3 12L7 16" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 8L21 12L17 16" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4L10 20" stroke="black" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="text-center">
      <h1 className="text-3xl font-black text-white tracking-tight">DevAI</h1>
      <p className="text-xs text-[#ffde22]/70 font-medium uppercase tracking-widest mt-0.5">
        Academic Project Analytics
      </p>
    </div>
  </div>
);

// Quick-fill role button
function RolePill({
  icon: Icon, label, email, color, onClick, active,
}: {
  icon: React.ElementType; label: string; email: string; color: string;
  onClick: () => void; active: boolean;
}) {
  return (
    <button type="button" onClick={onClick}
      className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-left"
      style={{
        backgroundColor: active ? `${color}15` : 'rgba(255,255,255,0.03)',
        borderColor: active ? `${color}50` : 'rgba(255,255,255,0.08)',
      }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}22` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold" style={{ color: active ? color : 'rgba(255,255,255,0.6)' }}>{label}</p>
        <p className="text-[10px] text-white/30 font-mono truncate">{email}</p>
      </div>
    </button>
  );
}

export default function LoginPage() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(user.role === 'guide' ? '/dashboard/guide' : '/dashboard/student');
    }
  }, [user, authLoading, router]);

  const fillRole = (role: 'guide' | 'student') => {
    setEmail(role === 'guide' ? 'guide@123' : 'student@123');
    setPassword('anything123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small artificial delay so the spinner shows (feels less instant/fake)
    await new Promise(r => setTimeout(r, 350));

    if (password !== 'anything123') {
      setError('Invalid password. Use: anything123');
      setLoading(false);
      return;
    }

    let role = '';
    if (email === 'guide@123')   role = 'guide';
    else if (email === 'student@123') role = 'student';
    else {
      setError('Unknown Squad ID. Use guide@123 or student@123');
      setLoading(false);
      return;
    }

    const ok = login(email, role);
    if (ok) {
      router.push(role === 'guide' ? '/dashboard/guide' : '/dashboard/student');
    } else {
      setError('Login failed — please try again.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#ffde22]/20 border-t-[#ffde22] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar with back-to-home — always visible */}
      <div className="w-full px-6 py-5 flex items-center justify-between flex-shrink-0">
        <button onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
          <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>
        <span className="text-xs text-white/20 font-medium">Demo Access</span>
      </div>

      {/* Center form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-[#0f0f0f] border border-white/8 rounded-3xl p-8 md:p-10 shadow-2xl">

            <DevAIBrand />

            {/* Role quick-fill */}
            <div className="mb-6">
              <p className="text-xs text-white/35 font-medium mb-3 text-center">Quick fill — select your role</p>
              <div className="flex gap-3">
                <RolePill
                  icon={GraduationCap} label="Guide / Prof" email="guide@123" color="#ffde22"
                  active={email === 'guide@123'} onClick={() => fillRole('guide')} />
                <RolePill
                  icon={Users} label="Student" email="student@123" color="#ff8928"
                  active={email === 'student@123'} onClick={() => fillRole('student')} />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-white/25"></span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Squad ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest block">Squad ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="guide@123  or  student@123"
                  autoComplete="username"
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#ffde22]/50 transition-colors placeholder-white/20"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="anything123"
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 pr-11 text-white text-sm outline-none focus:border-[#ffde22]/50 transition-colors placeholder-white/20"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#ff414e]/10 border border-[#ff414e]/25 text-[#ff414e] text-sm"
                  >
                    <ShieldAlert size={15} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(255,222,34,0.3)] mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Initialize Session <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Hint */}

          </div>
        </motion.div>
      </div>
    </div>
  );
}