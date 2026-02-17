'use client';

import { Crown, Users, GitCommit, Calendar } from 'lucide-react';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    members: string[];
    leader?: string;
    progress: number;
    commits: number;
    lastActive: string;
    activityScore: number;
  };
  onClick: () => void;
  isSelected: boolean;
}

export default function GroupCard({ group, onClick, isSelected }: GroupCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(255,222,34,0.1)' : 'transparent',
        border: `1px solid ${isSelected ? '#ffde2230' : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontWeight: 'bold', margin: 0 }}>{group.name}</h3>
            {group.leader && (
              <span style={{
                padding: '0.125rem 0.5rem',
                backgroundColor: 'rgba(255,222,34,0.2)',
                color: '#ffde22',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Crown style={{ width: '0.75rem', height: '0.75rem' }} />
                {group.leader.split(' ')[0]}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>{group.members.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <GitCommit style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>{group.commits}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>{group.lastActive}</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ffde22' }}>{group.progress}%</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>progress</p>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Activity Score</span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 'bold',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            backgroundColor: group.activityScore >= 80 ? 'rgba(255,222,34,0.2)' : 'rgba(255,65,78,0.2)',
            color: group.activityScore >= 80 ? '#ffde22' : '#ff414e'
          }}>
            {group.activityScore}
          </span>
        </div>
        <div style={{ height: '0.375rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{
            width: `${group.progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ffde22, #ff8928)',
            borderRadius: '1rem'
          }} />
        </div>
      </div>
    </div>
  );
}