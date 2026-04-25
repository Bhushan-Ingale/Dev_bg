'use client';

/**
 * login/page.tsx — DevAI Login Page
 * Drop at:  frontend/src/app/login/page.tsx
 *
 * Key change from old version:
 *   OLD: login(email, role)           ← local-only, no password
 *   NEW: login(email, password, role) ← hits real backend, falls back to demo
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DevAILogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="black" />
    <path d="M8 10L4 14L8 18" stroke="#ffde22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 10L24 14L20 18" stroke="#ff8928" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8L12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DEMO_PILLS = [
  { label: 'Demo Guide',   email: 'guide@123',   password: 'anything123', role: 'guide'   as const },
  { label: 'Demo Student', email: 'student@123', password: 'anything123', role: 'student' as const },
];

export default function LoginPage() {
  const router     = useRouter();
  const { login }  = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<'guide' | 'student'>('student');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const fillDemo = (pill: typeof DEMO_PILLS[number]) => {
    setEmail(pill.email);
    setPassword(pill.password);
    setRole(pill.role);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ← password is now the second argument
    const ok = await login(email.trim(), password, role);

    setLoading(false);
    if (ok) {
      router.push(role === 'guide' ? '/dashboard/guide' : '/dashboard/student');
    } else {
      setError('Invalid credentials. Use the demo pills above, or check the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* ← Back bar */}
      <div className="border-b border-white/5 px-6 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <DevAILogo />
            <div>
              <h1 className="text-2xl font-bold text-white">DevAI</h1>
              <p className="text-sm text-white/40">Academic project analytics</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
            <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
            <p className="text-sm text-white/40 mb-6">Use demo pills or your own credentials</p>

            {/* Quick-fill pills */}
            <div className="flex gap-2 mb-6">
              {DEMO_PILLS.map(pill => (
                <button
                  key={pill.role}
                  type="button"
                  onClick={() => fillDemo(pill)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    role === pill.role && email === pill.email
                      ? 'bg-[#ffde22] text-black border-[#ffde22]'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-[#ffde22]/40 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Role</label>
                <div className="flex gap-2">
                  {(['guide', 'student'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                        role === r
                          ? 'bg-[#ffde22]/20 text-[#ffde22] border-[#ffde22]/40'
                          : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="guide@123"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/25 outline-none focus:border-[#ffde22]/50 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="anything123"
                    required
                    className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/25 outline-none focus:border-[#ffde22]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-[#ff414e] bg-[#ff414e]/10 border border-[#ff414e]/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                  : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-6">
              No account?{' '}
              <Link href="/signup" className="text-[#ffde22] hover:underline">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}