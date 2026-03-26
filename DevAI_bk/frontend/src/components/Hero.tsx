'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Github, GitCommit, Users, Brain } from 'lucide-react';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fadeInLeft">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffde22]/10 rounded-full text-[#ffde22] text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-[#ffde22] rounded-full animate-pulse"></span>
            AI-Powered Academic Project Analytics
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Monitor student{' '}
            <span className="bg-gradient-to-r from-[#ffde22] via-[#ff8928] to-[#ff414e] bg-clip-text text-transparent">
              coding progress
            </span>{' '}
            with AI
          </h1>
          
          <p className="text-xl text-white/60 mb-8 max-w-lg">
            Automatically analyze GitHub repositories, track individual contributions, 
            and provide personalized feedback without manual code reviews.
          </p>
          
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-[#ffde22]/30 rounded-xl text-white hover:border-[#ffde22] transition-all flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-12">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-[#ffde22]/30 to-[#ff8928]/30 rounded-full border-2 border-[#0a0a0a]" />
                ))}
              </div>
              <span className="text-sm text-white/60">10+ universities</span>
            </div>
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-[#ffde22]" />
              <span className="text-sm text-white/60">10k+ commits analyzed</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative animate-fadeInRight">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffde22]/20 to-[#ff414e]/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-white/60 ml-2">Team Quantum · CS 401 Project</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-[#ffde22] mb-1">
                    <GitCommit className="w-4 h-4" />
                    <span className="text-xs font-medium">COMMITS</span>
                  </div>
                  <p className="text-2xl font-bold text-white">142</p>
                  <p className="text-xs text-emerald-500">+23 this week</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-[#ff8928] mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium">CONTRIBUTORS</span>
                  </div>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-white/40">Active members</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white/80">Sprint Completion</span>
                  <span className="text-sm font-bold text-[#ffde22]">78%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full animate-pulse" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#ffde22]/10 to-[#ff414e]/10 rounded-xl border border-[#ffde22]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#ffde22]/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-[#ffde22]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Insight</p>
                    <p className="text-xs text-white/60 mt-1">
                      Alice has the highest commit frequency. Consider pairing her with Charlie for knowledge sharing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}