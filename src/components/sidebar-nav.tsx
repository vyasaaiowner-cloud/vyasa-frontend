'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Megaphone,
  School,
  LayoutDashboard,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[]; // Which roles can see this item
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT'],
  },
  // Super Admin only
  {
    title: 'Schools',
    href: '/dashboard/super-admin',
    icon: School,
    roles: ['SUPER_ADMIN'],
  },
  // School Admin items
  {
    title: 'Classes',
    href: '/dashboard/admin/classes',
    icon: BookOpen,
    roles: ['SCHOOL_ADMIN'],
  },
  {
    title: 'Teachers',
    href: '/dashboard/admin/teachers',
    icon: Users,
    roles: ['SCHOOL_ADMIN'],
  },
  {
    title: 'Students',
    href: '/dashboard/admin/students',
    icon: GraduationCap,
    roles: ['SCHOOL_ADMIN'],
  },
  {
    title: 'Holidays',
    href: '/dashboard/admin/holidays',
    icon: Calendar,
    roles: ['SCHOOL_ADMIN'],
  },
  {
    title: 'Announcements',
    href: '/dashboard/admin/announcements',
    icon: Megaphone,
    roles: ['SCHOOL_ADMIN'],
  },
  // Teacher items
  {
    title: 'Attendance',
    href: '/dashboard/teacher/attendance',
    icon: ClipboardList,
    roles: ['TEACHER'],
  },
  {
    title: 'My Classes',
    href: '/dashboard/teacher/classes',
    icon: BookOpen,
    roles: ['TEACHER'],
  },
  // Parent items
  {
    title: 'Announcements',
    href: '/dashboard/parent/announcements',
    icon: Megaphone,
    roles: ['PARENT'],
  },
  {
    title: 'Holidays',
    href: '/dashboard/parent/holidays',
    icon: Calendar,
    roles: ['PARENT'],
  },
];

interface SidebarNavProps {
  userRole: string;
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Filter nav items based on user role
  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  const NavContent = () => (
    <>
      <div className="space-y-1 p-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          // Special handling for Dashboard - active on main dashboard pages only
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' || 
              pathname === '/dashboard/admin' || 
              pathname === '/dashboard/super-admin' ||
              pathname === '/dashboard/teacher' ||
              pathname === '/dashboard/parent'
            : item.href === '/dashboard/parent' && (item.title === 'Holidays' || item.title === 'Announcements')
            ? false // Parent Holidays/Announcements are never highlighted (they just navigate to tabs)
            : pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100',
                isActive 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'text-slate-700 hover:text-slate-900',
                isCollapsed && 'justify-center'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isCollapsed && 'h-6 w-6')} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-20 left-4 z-50 bg-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'md:hidden fixed left-0 top-0 z-50 h-full w-64 border-r bg-white transition-transform duration-200',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 border-b flex items-center justify-between px-4">
          <h2 className="font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block border-r bg-white transition-all duration-200',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="sticky top-0 h-screen flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="h-4"></div> {/* Spacer for breadcrumbs */}
            <NavContent />
          </div>
          
          {/* Collapse Toggle */}
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn('w-full', isCollapsed && 'px-2')}
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')} />
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
