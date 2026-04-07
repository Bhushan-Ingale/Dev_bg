'use client';

/**
 * Replaced generic "testimonials" with a real "Who It's For" section —
 * two role cards (Guide vs Student) that map directly to what DevAI does.
 * Each section gets its own anchor ID for navbar scrolling.
 */

import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import {
  BookOpen, GitCommit, BarChart3, Users, Brain,
  Target, Award, GitBranch, Zap, CheckCircle,
} from 'lucide-react';

const GUIDE_FEATURES = [
  { icon: Users,     text: 'Create and manage multiple student teams' },
  { icon: BarChart3, text: 'Real-time commit analytics per team and member' },
  { icon: Brain,     text: 'AI-generated insights — no manual review needed' },
  { icon: GitBranch, text: 'Monitor GitHub repos across all groups at once' },
  { icon: Target,    text: 'Track sprint milestones and project deadlines' },
  { icon: Zap,       text: 'Kanban board with student progress view' },
];

const STUDENT_FEATURES = [
  { icon: GitCommit, text: 'See your personal commit history and streaks' },
  { icon: Award,     text: 'Earn achievement badges for consistent work' },
  { icon: Brain,     text: 'DevAI Coach gives you personalised feedback' },
  { icon: BarChart3, text: 'Visualise your contribution vs teammates' },
  { icon: BookOpen,  text: 'Access team Kanban and sprint calendar' },
  { icon: Target,    text: 'Know exactly where you stand in the team' },
];

function RoleCard({
  id, tag, title, sub, features, color, accent, delay,
}: {
  id: string; tag: string; title: string; sub: string;
  features: { icon: React.ElementType; text: string }[];
  color: string; accent: string; delay: number;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55 }}
      className="relative p-8 md:p-10 rounded-3xl border overflow-hidden"
      style={{ borderColor: `${color}25`, backgroundColor: `${color}06` }}
    >
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}18, transparent 70%)` }} />

      <div className="relative">
        {/* Tag */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-5"
          style={{ backgroundColor: `${color}18`, color }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          {tag}
        </span>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/50 text-sm mb-8 max-w-md">{sub}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: delay + 0.1 + i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.035] border border-white/6 hover:border-white/12 transition-all"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}20` }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <p className="text-sm text-white/70 leading-snug">{f.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhoItsFor() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ffde22]/60 mb-3">Built for everyone in the classroom</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Designed for <span className="text-[#ffde22]">both sides</span> of the project
        </h2>
        <p className="text-white/50 mt-4 max-w-xl mx-auto">
          Whether you're evaluating five teams or trying to stand out in yours — DevAI works for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RoleCard
          id="for-guides"
          tag="For Guides / Professors"
          title="Stop reviewing commits manually."
          sub="DevAI gives you a live view of every team's work — who's contributing, who's falling behind, and what the AI recommends."
          features={GUIDE_FEATURES}
          color="#ffde22"
          accent="#ff8928"
          delay={0}
        />
        <RoleCard
          id="for-students"
          tag="For Students"
          title="Know exactly where you stand."
          sub="Track your own progress, see how you compare to your teammates, and get an AI coach that actually understands your code history."
          features={STUDENT_FEATURES}
          color="#ff8928"
          accent="#ff414e"
          delay={0.1}
        />
      </div>
    </section>
  );
}