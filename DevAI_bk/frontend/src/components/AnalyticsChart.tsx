'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', commits: 12 }, { name: 'Tue', commits: 19 },
  { name: 'Wed', commits: 15 }, { name: 'Thu', commits: 22 },
  { name: 'Fri', commits: 30 }, { name: 'Sat', commits: 10 },
  { name: 'Sun', commits: 14 }
];

export default function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full animate-in fade-in zoom-in duration-1000">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffde22" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ffde22" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid #ffde2240', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
            itemStyle={{ color: '#ffde22', fontWeight: 'bold', fontFamily: 'Satoshi' }}
          />
          <Area 
            type="monotone" 
            dataKey="commits" 
            stroke="#ffde22" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#chartGrad)" 
            animationDuration={2500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}