'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { setSchoolContext } from '@/lib/school-scope';
import { decodeJWT } from '@/features/auth';

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // No token found, redirect to login
      router.push('/auth/login');
      return;
    }

    try {
      // Store the access token
      storage.setToken(token);

      // Decode JWT to extract user information
      const userInfo = decodeJWT(token);

      // Set school context for data isolation
      if (userInfo.schoolId && userInfo.schoolId !== 'platform') {
        setSchoolContext(userInfo.schoolId);
      }

      // Check if device should be remembered
      const shouldRemember = storage.getRememberDevice();
      if (shouldRemember) {
        // Device token logic can be added here if backend supports it
        storage.setRememberDevice(true);
      }

      // Redirect based on user role
      const role = userInfo.role?.toUpperCase();

      switch (role) {
        case 'SUPER_ADMIN':
          router.push('/dashboard/super-admin');
          break;
        case 'SCHOOL_ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'TEACHER':
          router.push('/dashboard/teacher/attendance');
          break;
        case 'PARENT':
          router.push('/dashboard/parent');
          break;
        default:
          console.warn('Unknown role:', userInfo.role);
          router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to process Google auth token:', error);
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            <h2 className="text-xl font-semibold">Signing you in...</h2>
            <p className="text-sm text-slate-600 text-center">
              Please wait while we complete your authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                <h2 className="text-xl font-semibold">Loading...</h2>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <GoogleAuthCallbackContent />
    </Suspense>
  );
}
