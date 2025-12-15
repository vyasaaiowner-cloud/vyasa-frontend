'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  className: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

interface StudentInfo {
  name: string;
  rollNo: string;
  className: string;
  section: string;
}

export default function ParentDashboard() {
  // TODO: Replace with actual API calls
  const { data: studentInfo } = useQuery<StudentInfo>({
    queryKey: ['student-info'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        name: 'Student Name',
        rollNo: '001',
        className: 'Class 5',
        section: 'A',
      };
    },
  });

  const { data: attendanceRecords = [] } = useQuery<AttendanceRecord[]>({
    queryKey: ['student-attendance'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      const today = new Date();
      return Array.from({ length: 10 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const statuses: ('present' | 'absent' | 'late')[] = ['present', 'absent', 'late'];
        return {
          id: `${i}`,
          date: date.toISOString().split('T')[0],
          status: i === 0 ? 'present' : statuses[Math.floor(Math.random() * statuses.length)],
          className: 'Class 5 - A',
        };
      });
    },
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          title: 'Parent-Teacher Meeting',
          content: 'Parent-teacher meeting scheduled for next Saturday at 10 AM.',
          date: new Date().toISOString().split('T')[0],
          isRead: false,
        },
        {
          id: '2',
          title: 'Holiday Notice',
          content: 'School will be closed on Monday for a public holiday.',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          isRead: true,
        },
      ];
    },
  });

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    return { total, present, absent, late, percentage };
  };

  const stats = getAttendanceStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
        <p className="text-slate-600">View your child's attendance and school updates</p>
      </div>

      {/* Student Info Card */}
      {studentInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Name:</span>
                <span className="font-medium">{studentInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Roll No:</span>
                <span className="font-medium">{studentInfo.rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Class:</span>
                <span className="font-medium">{studentInfo.className} - {studentInfo.section}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {announcements.some(a => !a.isRead) && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {announcements.filter(a => !a.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          {/* Attendance Stats */}
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

          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceRecords.length === 0 ? (
                <p className="text-center py-8 text-slate-600">No attendance records found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.className}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <Badge
                              variant={
                                record.status === 'present'
                                  ? 'default'
                                  : record.status === 'late'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {record.status}
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
              {announcements.length === 0 ? (
                <p className="text-center py-8 text-slate-600">No announcements</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div
                      key={announcement.id}
                      className={`border rounded-lg p-4 ${!announcement.isRead ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        {!announcement.isRead && (
                          <Badge variant="default" className="ml-2">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{announcement.content}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
