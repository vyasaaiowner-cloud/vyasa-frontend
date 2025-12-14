'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { useLogout, getCurrentUser } from '@/features/auth';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const logout = useLogout();
  const [shouldValidate, setShouldValidate] = useState(false);

  // Check if token exists before attempting to validate
  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      router.push('/auth/login');
    } else {
      setShouldValidate(true);
    }
  }, [router]);

  // Validate token by fetching current user
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: shouldValidate,
    retry: false,
  });

  // If validation fails, logout
  useEffect(() => {
    if (isError && shouldValidate) {
      logout();
    }
  }, [isError, shouldValidate, logout]);

  // Show loading state while validating
  if (!shouldValidate || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user data
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Vyasa</h1>
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
              Dashboard
            </a>
            <button
              onClick={logout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
