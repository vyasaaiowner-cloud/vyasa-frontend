'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { useLogout, getCurrentUser, decodeJWT } from '@/features/auth';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { generateBreadcrumbs, getCustomBreadcrumbs } from '@/lib/breadcrumbs';
import { ChevronRight } from 'lucide-react';
import { SidebarNav } from '@/components/sidebar-nav';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    role: string;
    schoolId: string;
    name?: string;
  } | null>(null);

  // Check if token exists and decode it
  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      router.push('/auth/login');
    } else {
      try {
        const decoded = decodeJWT(token);
        setUserInfo({
          role: decoded.role,
          schoolId: decoded.schoolId,
        });
        setShouldValidate(true);
      } catch (error) {
        console.error('Failed to decode token:', error);
        router.push('/auth/login');
      }
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
  if (!user || !userInfo) {
    return null;
  }

  // Determine display name and badge based on role
  const getHeaderInfo = () => {
    switch (userInfo.role) {
      case 'SUPER_ADMIN':
        return {
          title: 'Vyasa Admin',
          badge: 'Platform Admin',
          badgeVariant: 'default' as const,
        };
      case 'SCHOOL_ADMIN':
        return {
          title: user.school?.name || 'School Admin',
          badge: 'School Admin',
          badgeVariant: 'secondary' as const,
        };
      case 'TEACHER':
        return {
          title: user.school?.name || 'Teacher Portal',
          badge: 'Teacher',
          badgeVariant: 'outline' as const,
        };
      case 'PARENT':
        return {
          title: user.school?.name || 'Parent Portal',
          badge: 'Parent',
          badgeVariant: 'outline' as const,
        };
      default:
        return {
          title: 'Vyasa',
          badge: 'User',
          badgeVariant: 'outline' as const,
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // Generate breadcrumbs
  const breadcrumbs = getCustomBreadcrumbs(pathname) || generateBreadcrumbs(pathname);
  const showBreadcrumbs = breadcrumbs.length > 1; // Only show if more than just Dashboard

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{headerInfo.title}</h1>
            <Badge variant={headerInfo.badgeVariant}>{headerInfo.badge}</Badge>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.name}</span>
            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </nav>
        </div>
        
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-2">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    
                    return (
                      <div key={crumb.href} className="flex items-center">
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={crumb.href} className="text-slate-600 hover:text-slate-900">
                                {crumb.label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                          </BreadcrumbSeparator>
                        )}
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Layout with Sidebar */}
      <div className="flex">
        <SidebarNav userRole={userInfo.role} />
        <main className="flex-1 container mx-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
