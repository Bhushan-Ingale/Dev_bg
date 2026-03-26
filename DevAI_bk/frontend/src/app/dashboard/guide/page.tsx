'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GuideDashboard from '@/components/GuideDashboard';

export default function GuideDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Guide page auth check:', { user, loading });
    
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to login');
        router.push('/login');
      } else if (user.role !== 'guide') {
        console.log('User is not guide, redirecting to student dashboard');
        router.push('/dashboard/student');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ffde22]/30 border-t-[#ffde22] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'guide') {
    return null;
  }

  return <GuideDashboard />;
}