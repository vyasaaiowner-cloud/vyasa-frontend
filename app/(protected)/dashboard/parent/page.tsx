'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, CheckCircle2, XCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton, StatCardsSkeleton } from '@/components/skeletons';
import { attendanceApi } from '@/features/attendance/api';
import { announcementsApi } from '@/features/announcements/api';
import { HolidaysList } from '@/components/holidays-list';
import type { AttendanceStatus } from '@/features/attendance/types';

export default function ParentDashboard() {
  // Fetch attendance for all children
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['my-children-attendance'],
    queryFn: () => attendanceApi.getMyChildren(),
  });

  // Fetch announcements
  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.getAll(),
  });

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const absent = attendanceRecords.filter(r => r.status === 'ABSENT').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
          <p className="text-slate-600">View your child's attendance and school updates</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Announcements
              {announcements.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {announcements.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Holidays
            </TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            {/* Attendance Stats */}
            {attendanceLoading ? (
              <StatCardsSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.percentage}%</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Attendance Records */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Recent attendance records for your children</CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <TableSkeleton rows={10} />
                ) : attendanceRecords.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No attendance records found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map(record => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {record.student.name}
                            <div className="text-xs text-slate-500">Roll No: {record.student.rollNo}</div>
                          </TableCell>
                          <TableCell>
                            {record.student.className} - {record.student.section}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <Badge
                                variant={
                                  record.status === 'PRESENT'
                                    ? 'default'
                                    : 'destructive'
                                }
                              >
                                {record.status.toLowerCase()}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>School Announcements</CardTitle>
                <CardDescription>Latest updates from the school</CardDescription>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No announcements yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map(announcement => (
                      <div
                        key={announcement.id}
                        className="border rounded-lg p-4 border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          {announcement.targetAll ? (
                            <Badge variant="secondary" className="ml-2">All</Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-2">
                              {announcement.targetClass}
                              {announcement.targetSection && ` - ${announcement.targetSection}`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{announcement.content}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holidays Tab */}
          <TabsContent value="holidays">
            <HolidaysList />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
