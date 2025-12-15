'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    // TODO: Optionally fetch current user data from /auth/me endpoint
    // For now, we just check if token exists
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    router.push('/auth/login');
  };

  const isAuthenticated = () => {
    return !!storage.getToken();
  };

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    logout,
  };
}
