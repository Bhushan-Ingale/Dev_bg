'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface TimelineProps {
    data: any[];
    type?: 'bar' | 'area' | 'line';
    height?: number;
    color?: string;
}

export const AnimatedTimeline = ({ data, type = 'area', height = 200, color = '#ffde22' }: TimelineProps) => {
    const [animatedData, setAnimatedData] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedData(data || []);
        }, 100);
        return () => clearTimeout(timer);
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${height}px`,
                background: 'rgba(255,222,34,0.05)',
                borderRadius: '0.75rem'
            }}>
                <p style={{ color: '#ffde22' }}>No commit data available</p>
            </div>
        );
    }

    const gradientColors = {
        start: color,
        end: color + '80'
    };

    const axisStyle = {
        fontSize: 12,
        fill: '#ffffff',
        opacity: 0.6
    };

    const tooltipStyle = {
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,222,34,0.2)',
        borderRadius: '0.75rem',
        padding: '0.75rem',
        color: '#ffffff'
    };

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={animatedData.length ? animatedData : data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        tick={axisStyle}
                        tickFormatter={(value) => {
                            try {
                                const date = new Date(value);
                                return `${date.getDate()}/${date.getMonth() + 1}`;
                            } catch {
                                return value;
                            }
                        }}
                    />
                    <YAxis tick={axisStyle} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: '#ffde22' }}
                        labelStyle={{ color: '#ffffff', opacity: 0.8 }}
                    />
                    <Bar
                        dataKey="commits"
                        fill={color}
                        radius={[4, 4, 0, 0]}
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        {(animatedData.length ? animatedData : data).map((entry: any, index: number) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#barGradient-${index})`}
                            />
                        ))}
                    </Bar>
                    <defs>
                        {(animatedData.length ? animatedData : data).map((_: any, index: number) => (
                            <linearGradient key={`grad-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradientColors.start} stopOpacity={1} />
                                <stop offset="100%" stopColor={gradientColors.end} stopOpacity={0.6} />
                            </linearGradient>
                        ))}
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (type === 'line') {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={animatedData.length ? animatedData : data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        tick={axisStyle}
                        tickFormatter={(value) => {
                            try {
                                const date = new Date(value);
                                return `${date.getDate()}/${date.getMonth() + 1}`;
                            } catch {
                                return value;
                            }
                        }}
                    />
                    <YAxis tick={axisStyle} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: '#ffde22' }}
                        labelStyle={{ color: '#ffffff', opacity: 0.8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="commits"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ fill: color, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: color }}
                        animationBegin={0}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    // Default: Area chart
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={animatedData.length ? animatedData : data}>
                <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="date"
                    tick={axisStyle}
                    tickFormatter={(value) => {
                        try {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        } catch {
                            return value;
                        }
                    }}
                />
                <YAxis tick={axisStyle} />
                <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: '#ffde22' }}
                    labelStyle={{ color: '#ffffff', opacity: 0.8 }}
                />
                <Area
                    type="monotone"
                    dataKey="commits"
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#colorCommits)"
                    animationBegin={0}
                    animationDuration={1500}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Contributor Pie Chart
export const ContributorPieChart = ({ data }: { data: any[] }) => {
    const COLORS = ['#ffde22', '#ff8928', '#ff414e', '#ffde22', '#ff8928'];

    if (!data || data.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '250px',
                background: 'rgba(255,222,34,0.05)',
                borderRadius: '0.75rem'
            }}>
                <p style={{ color: '#ffde22' }}>No contributor data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#ffde22"
                    dataKey="commits"
                    animationBegin={0}
                    animationDuration={1500}
                >
                    {data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,222,34,0.2)',
                        borderRadius: '0.75rem',
                        color: '#ffffff'
                    }}
                />
                <Legend
                    wrapperStyle={{ color: '#ffffff' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Contributor Activity Bar
export const ContributorActivity = ({ contributors }: { contributors: any[] }) => {
    if (!contributors || contributors.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                background: 'rgba(255,222,34,0.05)',
                borderRadius: '0.75rem'
            }}>
                <p style={{ color: '#ffde22' }}>No contributor activity</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contributors.map((contributor, index) => (
                <motion.div
                    key={contributor.name || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,222,34,0.1)',
                        borderRadius: '0.75rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(135deg, #ffde22, #ff8928)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000',
                            fontWeight: 'bold'
                        }}>
                            {contributor.name ? contributor.name[0] : '?'}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, margin: 0, color: '#ffffff' }}>
                                {contributor.name || 'Unknown'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                <span style={{
                                    fontSize: '0.875rem',
                                    padding: '0.125rem 0.5rem',
                                    background: 'rgba(255,222,34,0.1)',
                                    color: '#ffde22',
                                    borderRadius: '1rem'
                                }}>
                                    {contributor.commits || 0} commits
                                </span>
                                <span style={{ fontSize: '0.875rem', color: '#ffde22' }}>
                                    +{contributor.additions || 0}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: '#ff414e' }}>
                                    -{contributor.deletions || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: '#ffde22' }}>
                                {contributor.activity_score || 0}%
                            </p>
                            <p style={{ fontSize: '0.75rem', margin: 0, color: 'rgba(255,255,255,0.4)' }}>
                                activity
                            </p>
                        </div>
                        <div style={{
                            width: '5rem',
                            height: '0.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${contributor.activity_score || 0}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #ffde22, #ff8928)',
                                    borderRadius: '1rem'
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};