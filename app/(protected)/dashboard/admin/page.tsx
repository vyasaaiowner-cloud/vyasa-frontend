'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Users, BookOpen, Calendar, Bell, School, BarChart } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { StatCardsSkeleton, ListSkeleton } from '@/components/skeletons';
import { studentsApi } from '@/features/students/api';
import { teachersApi } from '@/features/teachers/api';
import { classesApi } from '@/features/classes/api';
import { announcementsApi } from '@/features/announcements/api';

export default function AdminDashboard() {
  // Fetch real data from backend
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.getAll(false),
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classesApi.getAll(),
  });

  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.getAll(),
  });

  // Calculate stats
  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.filter(t => t.isActive).length || 0;
  const totalClasses = classes?.reduce((acc, c) => acc + c.sections.length, 0) || 0;
  
  // Get recent announcements (last 5)
  const recentAnnouncements = announcements?.slice(0, 5) || [];

  const quickActions = [
    { title: 'Manage Teachers', href: '/dashboard/admin/teachers', icon: Users, description: 'Add, edit, or remove teachers' },
    { title: 'Manage Students', href: '/dashboard/admin/students', icon: BookOpen, description: 'View and manage student records' },
    { title: 'View Attendance', href: '/dashboard/teacher/attendance', icon: Calendar, description: 'Monitor student attendance' },
    { title: 'Announcements', href: '/dashboard/admin/announcements', icon: Bell, description: 'Create and manage announcements' },
    { title: 'Classes', href: '/dashboard/admin/classes', icon: School, description: 'Manage classes and sections' },
    { title: 'Reports', href: '/dashboard/admin/reports', icon: BarChart, description: 'View analytics and reports' },
  ];

  const isLoading = studentsLoading || teachersLoading || classesLoading;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-600">Welcome back! Here's your school overview.</p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatCardsSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-slate-600">Enrolled students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTeachers}</div>
                <p className="text-xs text-slate-600">Active teachers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes & Sections</CardTitle>
                <School className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClasses}</div>
                <p className="text-xs text-slate-600">{classes?.length || 0} classes total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Bell className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{announcements?.length || 0}</div>
                <p className="text-xs text-slate-600">Total announcements</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <action.icon className="h-5 w-5 text-slate-600" />
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest updates from your school</CardDescription>
          </CardHeader>
          <CardContent>
            {announcementsLoading ? (
              <ListSkeleton items={3} />
            ) : recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{announcement.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{announcement.content}</p>
                      <div className="flex gap-2 mt-2">
                        {announcement.targetAll ? (
                          <Badge variant="secondary" className="text-xs">All</Badge>
                        ) : (
                          <>
                            {announcement.targetClass && (
                              <Badge variant="secondary" className="text-xs">
                                {announcement.targetClass}
                                {announcement.targetSection && ` - ${announcement.targetSection}`}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No announcements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
