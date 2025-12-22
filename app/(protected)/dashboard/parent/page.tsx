'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton, StatCardsSkeleton } from '@/components/skeletons';
import { attendanceApi } from '@/features/attendance/api';
import type { AttendanceStatus } from '@/features/attendance/types';

// Helper to safely get class and section display
const getClassDisplay = (student: any) => {
  const className = student.className || student.class?.name || 'N/A';
  const sectionName = student.section || student.section?.name || 'N/A';
  return `${className} - ${sectionName}`;
};

export default function ParentDashboard() {
  // Fetch attendance for all children
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['my-children-attendance'],
    queryFn: () => attendanceApi.getMyChildren(),
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
          <p className="text-slate-600">View your child's attendance records</p>
        </div>

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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance History
            </CardTitle>
            <CardDescription>Recent attendance records for your children</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <TableSkeleton rows={10} />
            ) : attendanceRecords.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
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
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.student.name}</div>
                        <div className="text-xs text-slate-500">Roll No: {record.student.rollNo}</div>
                      </TableCell>
                      <TableCell>
                        {getClassDisplay(record.student)}
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
      </div>
    </ErrorBoundary>
  );
}
