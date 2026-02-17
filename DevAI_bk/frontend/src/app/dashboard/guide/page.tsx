'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GuideDashboard from '@/components/GuideDashboard';

export default function GuideDashboardPage() {
  const { user, isGuide } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!isGuide) {
      router.push('/dashboard/student');
    }
  }, [user, isGuide, router]);

  if (!user || !isGuide) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,222,34,0.3)',
          borderTopColor: '#ffde22',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return <GuideDashboard />;
}