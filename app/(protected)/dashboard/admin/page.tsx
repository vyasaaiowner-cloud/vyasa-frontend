'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Users, BookOpen, Calendar, Bell, School, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  // TODO: Fetch actual data from API
  const schoolStats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingRequests: 0,
    attendanceRate: '0%',
  };

  const quickActions = [
    { title: 'Manage Teachers', href: '/dashboard/teachers', icon: Users, description: 'Add, edit, or remove teachers' },
    { title: 'Manage Students', href: '/dashboard/students', icon: BookOpen, description: 'View and manage student records' },
    { title: 'View Attendance', href: '/dashboard/attendance', icon: Calendar, description: 'Monitor student attendance' },
    { title: 'Announcements', href: '/dashboard/announcements', icon: Bell, description: 'Create and manage announcements' },
    { title: 'Classes', href: '/dashboard/classes', icon: School, description: 'Manage classes and sections' },
    { title: 'Reports', href: '/dashboard/reports', icon: BarChart, description: 'View analytics and reports' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-slate-600">Welcome back! Here's your school overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalStudents}</div>
            <p className="text-xs text-slate-600">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalTeachers}</div>
            <p className="text-xs text-slate-600">Active teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <School className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalClasses}</div>
            <p className="text-xs text-slate-600">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.attendanceRate}</div>
            <p className="text-xs text-slate-600">This month</p>
          </CardContent>
        </Card>
      </div>

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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs text-slate-600">Activity will appear here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
