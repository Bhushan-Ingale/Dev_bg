'use client';

import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, GitCommit, Code, Activity, Eye } from 'lucide-react';
import { AnimatedTimeline, ContributorPieChart, ContributorActivity } from './AnimatedTimeline';

export default function AnalyticsChart({ data }: { data: any }) {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  // Ensure we have data to display
  const displayData = data || {
    summary: {
      total_commits: 142,
      total_contributors: 4,
      total_additions: 2580,
      active_days: 22
    },
    contributors: [
      { name: 'Alice Chen', commits: 65, additions: 1240, deletions: 320, activity_score: 98 },
      { name: 'Bob Smith', commits: 42, additions: 890, deletions: 210, activity_score: 76 },
      { name: 'Charlie Brown', commits: 25, additions: 450, deletions: 120, activity_score: 52 },
    ]
  };

  return (
    <div className="space-y-8">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-white/60 mr-2">Chart Style:</span>
        <button
          onClick={() => setChartType('area')}
          className={`p-2 rounded-lg transition-all border ${
            chartType === 'area' 
              ? 'bg-[#ffde22] text-black border-[#ffde22]' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }`}
          title="Area Chart"
        >
          <Activity className="w-5 h-5" />
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`p-2 rounded-lg transition-all border ${
            chartType === 'bar' 
              ? 'bg-[#ffde22] text-black border-[#ffde22]' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }`}
          title="Bar Chart"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`p-2 rounded-lg transition-all border ${
            chartType === 'line' 
              ? 'bg-[#ffde22] text-black border-[#ffde22]' 
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }`}
          title="Line Chart"
        >
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>

      {/* Timeline Chart - Enhanced visibility */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border-2 border-[#ffde22]/30 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#ffde22]" />
          <span className="bg-[#ffde22] text-black px-3 py-1 rounded-full text-sm">LIVE</span>
          Commit Activity Timeline
        </h4>
        <div style={{ width: '100%', height: '350px' }}>
          <AnimatedTimeline 
            data={displayData.timeline} 
            type={chartType}
            color="#ffde22"
          />
        </div>
      </div>

      {/* Summary Cards - Enhanced colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#ffde22]/20 to-[#ffde22]/5 rounded-xl p-6 border-2 border-[#ffde22]/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#ffde22] rounded-lg flex items-center justify-center">
              <GitCommit className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">Commits</span>
          </div>
          <p className="text-4xl font-bold text-white">{displayData.summary.total_commits}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#ff8928]/20 to-[#ff8928]/5 rounded-xl p-6 border-2 border-[#ff8928]/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#ff8928] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">Contributors</span>
          </div>
          <p className="text-4xl font-bold text-white">{displayData.summary.total_contributors}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 rounded-xl p-6 border-2 border-[#10b981]/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">Additions</span>
          </div>
          <p className="text-4xl font-bold text-white">{displayData.summary.total_additions}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#ff414e]/20 to-[#ff414e]/5 rounded-xl p-6 border-2 border-[#ff414e]/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#ff414e] rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-black" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">Active Days</span>
          </div>
          <p className="text-4xl font-bold text-white">{displayData.summary.active_days}</p>
        </div>
      </div>

      {/* Contributor Activity - Enhanced */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border-2 border-[#ffde22]/30 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#ffde22]" />
          Team Activity Breakdown
        </h4>
        <ContributorActivity contributors={displayData.contributors} />
      </div>

      {/* Distribution Chart - Enhanced */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border-2 border-[#ffde22]/30 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#ffde22]" />
          Contribution Distribution
        </h4>
        <ContributorPieChart data={displayData.contributors} />
      </div>
    </div>
  );
}