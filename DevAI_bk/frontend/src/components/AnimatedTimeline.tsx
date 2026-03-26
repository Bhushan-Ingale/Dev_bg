'use client';

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, TooltipProps
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DataPoint {
  date: string;
  commits: number;
  [key: string]: string | number;
}

interface TimelineProps {
  data?: DataPoint[];
  type?: 'bar' | 'area' | 'line';
  height?: number;
  color?: string;
  dataKey?: string;
  label?: string;
}

interface ContributorData {
  name: string;
  commits?: number;
  value?: number;
}

interface ContributorActivityData {
  name: string;
  commits: number;
  activity_score: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_TIMELINE_DATA: DataPoint[] = [
  { date: 'Mon', commits: 12 },
  { date: 'Tue', commits: 8 },
  { date: 'Wed', commits: 15 },
  { date: 'Thu', commits: 10 },
  { date: 'Fri', commits: 7 },
  { date: 'Sat', commits: 3 },
  { date: 'Sun', commits: 5 },
];

const DEFAULT_CONTRIBUTOR_DATA: ContributorData[] = [
  { name: 'Alice', value: 65 },
  { name: 'Bob', value: 42 },
  { name: 'Charlie', value: 25 },
];

const DEFAULT_ACTIVITY_DATA: ContributorActivityData[] = [
  { name: 'Alice Chen', commits: 65, activity_score: 98 },
  { name: 'Bob Smith', commits: 42, activity_score: 76 },
  { name: 'Charlie Brown', commits: 25, activity_score: 52 },
];

const PIE_COLORS = ['#ffde22', '#ff8928', '#ff414e', '#10b981'];

// ─── Shared Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
  valueLabel = 'commits',
}: TooltipProps<ValueType, NameType> & { valueLabel?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #ffde22',
        borderRadius: 8,
        padding: '8px 12px',
      }}
    >
      <p style={{ color: '#fff', fontSize: 13, margin: 0 }}>{label}</p>
      <p style={{ color: '#ffde22', fontSize: 13, fontWeight: 700, margin: '4px 0 0' }}>
        {payload[0].value} {valueLabel}
      </p>
    </div>
  );
};

// ─── AnimatedTimeline ─────────────────────────────────────────────────────────

export const AnimatedTimeline = ({
  data,
  type = 'area',
  height = 300,
  color = '#ffde22',
  dataKey = 'commits',
  label = 'commits',
}: TimelineProps) => {
  const chartData = data && data.length > 0 ? data : DEFAULT_TIMELINE_DATA;



  const sharedAxisTooltip = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#fff' }} />
      <YAxis stroke="#666" tick={{ fill: '#fff' }} />
      <Tooltip content={<CustomTooltip valueLabel={label} />} />
    </>
  );

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {sharedAxisTooltip}
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            {sharedAxisTooltip}
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            {sharedAxisTooltip}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill="url(#colorGrad)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// ─── ContributorPieChart ──────────────────────────────────────────────────────

export const ContributorPieChart = ({ data }: { data?: ContributorData[] }) => {
  const chartData = (data && data.length > 0 ? data : DEFAULT_CONTRIBUTOR_DATA).map((item, i) => ({
    name: item.name ?? `Contributor ${i + 1}`,
    value: item.commits ?? item.value ?? 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={{ stroke: '#666' }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: ValueType, name: NameType) => [value, name]}
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #ffde22',
              borderRadius: 8,
            }}
            itemStyle={{ color: '#ffde22' }}
            labelStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── ContributorActivity ──────────────────────────────────────────────────────

export const ContributorActivity = ({
  contributors,
}: {
  contributors?: ContributorActivityData[];
}) => {
  const data = contributors && contributors.length > 0 ? contributors : DEFAULT_ACTIVITY_DATA;

  return (
    <div className="space-y-4">
      {data.map((c, i) => (
        <div
          key={i}
          className="p-4 bg-white/10 rounded-lg border border-white/20 transition-colors hover:border-[#ffde22]/50"
        >
          <div className="flex justify-between mb-2">
            <span className="font-bold text-white">{c.name}</span>
            <span className="text-[#ffde22] font-bold tabular-nums">{c.activity_score}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffde22] to-[#ff8928] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(Math.max(c.activity_score, 0), 100)}%` }}
            />
          </div>
          <p className="text-sm text-white/60 mt-2">
            {c.commits.toLocaleString()} commit{c.commits !== 1 ? 's' : ''}
          </p>
        </div>
      ))}
    </div>
  );
};