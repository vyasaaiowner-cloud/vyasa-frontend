'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { useLogout } from '@/features/auth';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    // Check authentication on mount
    const token = storage.getToken();
    
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  // Don't render protected content until we verify token exists
  const token = storage.getToken();
  
  if (!token) {
    return null; // or a loading spinner
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
