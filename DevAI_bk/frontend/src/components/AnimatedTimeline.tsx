'use client';

/**
 * AnimatedTimeline.tsx — DevAI Chart Components
 *
 * ROOT CAUSE FIX: Recharts v3 + Next.js SSR requires:
 *  1. 'use client' directive (already present)
 *  2. ResponsiveContainer must live inside a div with an EXPLICIT pixel height
 *  3. No double-height wrapping from parent — charts own their own height
 *
 * All charts self-contain their height. Parents should NOT add style={{ height }}.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── Design tokens ────────────────────────────────────────────────────────────

export const VIZ_COLORS = {
  yellow: '#ffde22',
  orange: '#ff8928',
  red:    '#ff414e',
  green:  '#10b981',
  purple: '#a855f7',
  blue:   '#3b82f6',
};

const PIE_PALETTE = [
  VIZ_COLORS.yellow,
  VIZ_COLORS.orange,
  VIZ_COLORS.red,
  VIZ_COLORS.green,
  VIZ_COLORS.purple,
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataPoint {
  date: string;
  commits: number;
  [key: string]: string | number;
}

export interface ContributorData {
  name: string;
  commits?: number;
  value?: number;
  additions?: number;
  deletions?: number;
  activity_score?: number;
}

// ─── Default / fallback data ──────────────────────────────────────────────────

const DEFAULT_TIMELINE: DataPoint[] = [
  { date: 'Mon', commits: 12 }, { date: 'Tue', commits: 8 },
  { date: 'Wed', commits: 15 }, { date: 'Thu', commits: 10 },
  { date: 'Fri', commits: 7  }, { date: 'Sat', commits: 3 },
  { date: 'Sun', commits: 5  },
];

const DEFAULT_CONTRIBUTORS: ContributorData[] = [
  { name: 'Alice Chen',    commits: 65, additions: 1240, deletions: 320, activity_score: 98 },
  { name: 'Bob Smith',     commits: 42, additions: 890,  deletions: 210, activity_score: 76 },
  { name: 'Charlie Brown', commits: 25, additions: 450,  deletions: 120, activity_score: 52 },
];

// ─── Shared tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(12,12,12,0.96)',
      border: '1px solid rgba(255,222,34,0.5)',
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, marginBottom: 4,
        textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color || VIZ_COLORS.yellow, fontWeight: 700,
          fontSize: 15, margin: 0 }}>
          {Number(e.value).toLocaleString()}
          <span style={{ fontWeight: 400, fontSize: 11,
            color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>{e.name}</span>
        </p>
      ))}
    </div>
  );
};

// ─── AnimatedTimeline ─────────────────────────────────────────────────────────

interface TimelineProps {
  data?: DataPoint[];
  type?: 'bar' | 'area' | 'line';
  color?: string;
  dataKey?: string;
  chartHeight?: number; // in px — parent must NOT add extra height wrapper
}

export const AnimatedTimeline = ({
  data,
  type = 'area',
  color = VIZ_COLORS.yellow,
  dataKey = 'commits',
  chartHeight = 260,
}: TimelineProps) => {
  // Trim date strings for display
  const raw = (data && data.length > 0 ? data : DEFAULT_TIMELINE);
  const chartData = raw.map(d => ({
    ...d,
    date: typeof d.date === 'string' && d.date.length > 5 ? d.date.slice(5) : d.date,
  }));

  const gradId = `g${color.replace('#', '')}`;

  const commonProps = {
    data: chartData,
    margin: { top: 8, right: 12, left: -14, bottom: 0 },
  };

  const axes = (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
      <XAxis dataKey="date"
        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
        axisLine={false} tickLine={false} interval="preserveStartEnd" />
      <YAxis
        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
        axisLine={false} tickLine={false} width={30} />
      <Tooltip content={<ChartTooltip />}
        cursor={{ stroke: 'rgba(255,222,34,0.2)', strokeWidth: 1 }} />
    </>
  );

  // KEY FIX: height is set directly on the wrapper div (explicit px), not via %
  return (
    <div style={{ width: '100%', height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart {...commonProps}>
            {axes}
            <Bar dataKey={dataKey} name="commits" fill={color}
              radius={[4, 4, 0, 0]}
              isAnimationActive animationDuration={900} animationEasing="ease-out" />
          </BarChart>
        ) : type === 'line' ? (
          <LineChart {...commonProps}>
            {axes}
            <Line type="monotone" dataKey={dataKey} name="commits"
              stroke={color} strokeWidth={2.5}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: color, stroke: `${color}50`, strokeWidth: 4 }}
              isAnimationActive animationDuration={900} />
          </LineChart>
        ) : (
          <AreaChart {...commonProps}>
            {axes}
            <Area type="monotone" dataKey={dataKey} name="commits"
              stroke={color} strokeWidth={2.5}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 6, fill: color, stroke: `${color}50`, strokeWidth: 4 }}
              isAnimationActive animationDuration={1000} animationEasing="ease-out" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// ─── Donut pie chart ──────────────────────────────────────────────────────────

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div style={{
      background: 'rgba(12,12,12,0.96)',
      border: `1px solid ${p.fill}80`,
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(16px)',
    }}>
      <p style={{ color: p.fill, fontWeight: 700, fontSize: 14, margin: 0 }}>{name}</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '2px 0 0' }}>
        {value} commits
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderPctLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="rgba(0,0,0,0.9)" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={800}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ContributorPieChart = ({ data }: { data?: ContributorData[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const raw = data && data.length > 0 ? data : DEFAULT_CONTRIBUTORS;
  const chartData = raw.map((item, i) => ({
    name: item.name ?? `Dev ${i + 1}`,
    value: item.commits ?? item.value ?? 0,
    fill: PIE_PALETTE[i % PIE_PALETTE.length],
  }));

  // KEY FIX: self-contained height, no parent height wrapper needed
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={65} outerRadius={105}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderPctLabel}
            isAnimationActive animationBegin={80} animationDuration={1000} animationEasing="ease-out"
            onMouseEnter={(_, i) => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={`c-${i}`}
                fill={entry.fill}
                stroke="transparent"
                opacity={hovered === null || hovered === i ? 1 : 0.45}
                style={{
                  filter: hovered === i ? `drop-shadow(0 0 10px ${entry.fill}90)` : 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, filter 0.2s',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend
            iconType="circle" iconSize={8}
            formatter={v => (
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Contributor activity bars (custom animated) ──────────────────────────────

export const ContributorActivity = ({ contributors }: { contributors?: ContributorData[] }) => {
  const data = contributors && contributors.length > 0 ? contributors : DEFAULT_CONTRIBUTORS;
  const maxCommits = Math.max(...data.map(c => c.commits ?? 0), 1);

  return (
    <div className="space-y-5">
      {data.map((c, i) => {
        const commits = c.commits ?? 0;
        const score   = c.activity_score ?? 0;
        const color   = PIE_PALETTE[i % PIE_PALETTE.length];
        const pct     = Math.round((commits / maxCommits) * 100);

        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                  {(c.name ?? '?')[0]}
                </div>
                <span className="text-sm font-semibold text-white">{c.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white/40">{commits.toLocaleString()} commits</span>
                {c.additions !== undefined && (
                  <span className="text-emerald-400 font-medium">+{c.additions.toLocaleString()}</span>
                )}
                {c.deletions !== undefined && (
                  <span style={{ color: VIZ_COLORS.red }} className="font-medium">-{c.deletions.toLocaleString()}</span>
                )}
                <span className="font-bold text-sm tabular-nums" style={{ color }}>{score}</span>
              </div>
            </div>
            {/* Commits bar */}
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}70)` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }} />
            </div>
            {/* Score sub-bar */}
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
              <motion.div className="absolute inset-y-0 left-0 rounded-full opacity-40"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score, 100)}%` }}
                transition={{ duration: 1, delay: i * 0.12 + 0.1 }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Squad Health Radar (custom SVG) ─────────────────────────────────────────

export const SquadHealthRadar = ({ contributors }: { contributors?: ContributorData[] }) => {
  const data = contributors && contributors.length > 0 ? contributors : DEFAULT_CONTRIBUTORS;

  const avgScore   = Math.round(data.reduce((a, c) => a + (c.activity_score ?? 0), 0) / data.length);
  const totalCom   = data.reduce((a, c) => a + (c.commits ?? 0), 0);
  const totalAdd   = data.reduce((a, c) => a + (c.additions ?? 0), 0);
  const top        = data[0]?.commits ?? 1;
  const second     = data[1]?.commits ?? 0;
  const balanceVal = Math.max(0, 100 - Math.abs(top - second) * 1.5);

  const metrics = [
    { label: 'Commits',  value: Math.min(100, (totalCom / (data.length * 80)) * 100), color: VIZ_COLORS.yellow  },
    { label: 'Quality',  value: avgScore,                                               color: VIZ_COLORS.orange  },
    { label: 'Velocity', value: Math.min(100, (totalAdd / (data.length * 1000)) * 100),color: VIZ_COLORS.green   },
    { label: 'Balance',  value: Math.min(100, balanceVal),                              color: VIZ_COLORS.blue    },
    { label: 'Activity', value: Math.min(100, avgScore * 0.9),                          color: VIZ_COLORS.purple  },
  ];

  const cx = 120, cy = 120, r = 85;
  const n  = metrics.length;
  const step = (2 * Math.PI) / n;
  const pt = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(i * step - Math.PI / 2),
    y: cy + radius * Math.sin(i * step - Math.PI / 2),
  });

  const webPath = metrics.map((m, i) => {
    const p = pt(i, (m.value / 100) * r);
    return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={240} height={240} viewBox="0 0 240 240">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ring, ri) => {
          const pts = metrics.map((_, i) => pt(i, r * ring));
          const d   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
          return <path key={ri} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
        })}
        {/* Axis spokes */}
        {metrics.map((_, i) => {
          const e = pt(i, r);
          return <line key={i} x1={cx} y1={cy} x2={e.x.toFixed(2)} y2={e.y.toFixed(2)}
            stroke="rgba(255,255,255,0.09)" strokeWidth={1} />;
        })}
        {/* Filled polygon */}
        <motion.path d={webPath}
          fill="rgba(255,222,34,0.13)" stroke={VIZ_COLORS.yellow} strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'backOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }} />
        {/* Data dots */}
        {metrics.map((m, i) => {
          const p = pt(i, (m.value / 100) * r);
          return (
            <motion.circle key={i} cx={p.x} cy={p.y} r={4} fill={m.color}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.55 + i * 0.07 }} />
          );
        })}
        {/* Axis labels */}
        {metrics.map((m, i) => {
          const p = pt(i, r + 18);
          return (
            <text key={i} x={p.x} y={p.y}
              textAnchor="middle" dominantBaseline="central"
              fill={m.color} fontSize={10} fontWeight={700}>{m.label}</text>
          );
        })}
      </svg>
      {/* Metric legend */}
      <div className="grid grid-cols-3 gap-2 w-full mt-1">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
            <span className="text-xs text-white/40">{m.label}</span>
            <span className="text-xs font-bold ml-auto tabular-nums" style={{ color: m.color }}>
              {Math.round(m.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Weekly bar comparison (compact) ─────────────────────────────────────────

export const WeeklyComparisonChart = ({ data }: { data?: DataPoint[] }) => {
  const chartData = data && data.length > 0 ? data : DEFAULT_TIMELINE;
  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 6, right: 10, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} width={26} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,222,34,0.06)' }} />
          <Bar dataKey="commits" name="commits" fill={VIZ_COLORS.yellow}
            radius={[3, 3, 0, 0]} isAnimationActive animationDuration={700} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Heatmap-style commit activity (GitHub-style) ────────────────────────────

export const CommitHeatmap = ({ data }: { data?: DataPoint[] }) => {
  const raw = data && data.length > 0 ? data : DEFAULT_TIMELINE;
  const max = Math.max(...raw.map(d => d.commits), 1);
  const intensity = (v: number) => Math.round((v / max) * 4); // 0–4

  const colorFor = (i: number) => {
    const map = ['rgba(255,255,255,0.04)', 'rgba(255,222,34,0.2)', 'rgba(255,222,34,0.45)',
      'rgba(255,137,40,0.7)', '#ffde22'];
    return map[Math.min(i, 4)];
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-1 flex-wrap">
        {raw.map((d, i) => (
          <motion.div key={i}
            title={`${d.date}: ${d.commits} commits`}
            className="w-7 h-7 rounded-md flex items-center justify-center cursor-default"
            style={{ backgroundColor: colorFor(intensity(d.commits)) }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.02 }}>
            <span style={{ fontSize: 8, color: intensity(d.commits) >= 3 ? '#000' : 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              {d.commits > 0 ? d.commits : ''}
            </span>
          </motion.div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs text-white/30">Less</span>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: colorFor(i) }} />
        ))}
        <span className="text-xs text-white/30">More</span>
      </div>
    </div>
  );
};