'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { classesApi } from '@/features/classes/api';
import { studentsApi } from '@/features/students/api';
import { attendanceApi } from '@/features/attendance/api';
import type { AttendanceStatus } from '@/features/attendance/types';
import { toast } from 'sonner';

export default function TeacherAttendancePage() {
  const queryClient = useQueryClient();
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Fetch all sections
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: () => classesApi.getSections(),
  });

  // Fetch students for selected class/section
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students', selectedClassName, selectedSection],
    queryFn: () => studentsApi.getAll(selectedClassName, selectedSection),
    enabled: !!selectedClassName && !!selectedSection,
  });

  // Submit attendance mutation
  const submitAttendanceMutation = useMutation({
    mutationFn: async () => {
      if (!selectedClassName || !selectedSection) {
        throw new Error('Class and section must be selected');
      }

      const attendances = students.map(student => ({
        studentId: student.id,
        status: attendanceData[student.id] || 'ABSENT' as AttendanceStatus,
      }));

      return attendanceApi.mark({
        className: selectedClassName,
        section: selectedSection,
        date,
        attendances,
      });
    },
    onSuccess: () => {
      toast.success('Attendance submitted successfully!');
      setAttendanceData({});
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit attendance: ${error.message}`);
    },
  });

  const handleSectionChange = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setSelectedClassName(section.class?.name || '');
      setSelectedSection(section.name);
      setAttendanceData({});
    }
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const allStudents = students.reduce((acc, student) => ({
      ...acc,
      [student.id]: status,
    }), {} as Record<string, AttendanceStatus>);
    setAttendanceData(allStudents);
  };

  const handleSubmit = () => {
    if (!selectedSectionId) {
      toast.error('Please select a class section');
      return;
    }

    const allMarked = students.every(student => attendanceData[student.id]);
    if (!allMarked) {
      toast.error('Please mark attendance for all students');
      return;
    }

    submitAttendanceMutation.mutate();
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendanceData).filter(s => s === 'PRESENT').length;
    const absent = Object.values(attendanceData).filter(s => s === 'ABSENT').length;
    return { total, present, absent };
  };

  const stats = getAttendanceStats();

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
          <p className="text-slate-600">Select a class and mark student attendance</p>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
            <CardDescription>Choose the class section for attendance marking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Section</label>
                {sectionsLoading ? (
                  <p className="text-sm text-slate-500">Loading sections...</p>
                ) : (
                  <Select value={selectedSectionId} onValueChange={handleSectionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.class?.name} - Section {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Stats */}
        {selectedSectionId && students.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
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
                <CardTitle className="text-sm font-medium">Late</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student List */}
        {selectedSectionId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>Mark attendance for each student</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll('PRESENT')}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll('ABSENT')}>
                    Mark All Absent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <TableSkeleton rows={5} />
              ) : students.length === 0 ? (
                <p className="text-center py-8 text-slate-600">No students found in this class</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {attendanceData[student.id] ? (
                            <Badge
                              variant={
                                attendanceData[student.id] === 'PRESENT'
                                  ? 'default'
                                  : 'destructive'
                              }
                            >
                              {attendanceData[student.id].toLowerCase()}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Marked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={attendanceData[student.id] === 'PRESENT' ? 'default' : 'outline'}
                              onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={attendanceData[student.id] === 'ABSENT' ? 'destructive' : 'outline'}
                              onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {selectedSectionId && students.length > 0 && (
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitAttendanceMutation.isPending || Object.keys(attendanceData).length === 0}
            >
              {submitAttendanceMutation.isPending ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
