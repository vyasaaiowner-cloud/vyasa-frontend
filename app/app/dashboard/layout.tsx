'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      // Redirect to login if no token
      router.push('/auth/login');
    }
  }, [router]);

  // You can add a loading state here if needed
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Vyasa Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              router.push('/auth/login');
            }}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
