'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { decodeJWT } from '@/features/auth';

/**
 * Dashboard Auto-Router
 * Redirects users to their role-specific dashboard
 */
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const userInfo = decodeJWT(token);
      const role = userInfo.role?.toUpperCase();

      switch (role) {
        case 'SUPER_ADMIN':
          router.replace('/dashboard/super-admin');
          break;
        case 'SCHOOL_ADMIN':
          router.replace('/dashboard/admin');
          break;
        case 'TEACHER':
          router.replace('/dashboard/teacher/attendance');
          break;
        case 'PARENT':
          router.replace('/dashboard/parent');
          break;
        default:
          console.error('Unknown role:', userInfo.role);
          router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
