'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  status?: 'present' | 'absent' | 'late';
}

interface Class {
  id: string;
  name: string;
  section: string;
}

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // TODO: Replace with actual API calls
  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['teacher-classes'],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { id: '1', name: 'Class 5', section: 'A' },
        { id: '2', name: 'Class 5', section: 'B' },
        { id: '3', name: 'Class 6', section: 'A' },
      ];
    },
  });

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['class-students', selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];
      // Mock data - replace with actual API call
      return [
        { id: '1', name: 'John Doe', rollNo: '001' },
        { id: '2', name: 'Jane Smith', rollNo: '002' },
        { id: '3', name: 'Bob Johnson', rollNo: '003' },
      ];
    },
    enabled: !!selectedClass,
  });

  const submitAttendanceMutation = useMutation({
    mutationFn: async (data: { classId: string; date: string; attendance: Record<string, string> }) => {
      // TODO: Replace with actual API call
      console.log('Submitting attendance:', data);
      return { success: true };
    },
    onSuccess: () => {
      alert('Attendance submitted successfully!');
      setAttendanceData({});
    },
  });

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const allStudents = students.reduce((acc, student) => ({
      ...acc,
      [student.id]: status,
    }), {});
    setAttendanceData(allStudents);
  };

  const handleSubmit = () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const allMarked = students.every(student => attendanceData[student.id]);
    if (!allMarked) {
      alert('Please mark attendance for all students');
      return;
    }

    submitAttendanceMutation.mutate({
      classId: selectedClass,
      date,
      attendance: attendanceData,
    });
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendanceData).filter(s => s === 'present').length;
    const absent = Object.values(attendanceData).filter(s => s === 'absent').length;
    const late = Object.values(attendanceData).filter(s => s === 'late').length;
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
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
          <CardDescription>Choose the class for attendance marking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - Section {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      {selectedClass && students.length > 0 && (
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
      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Attendance</CardTitle>
                <CardDescription>Mark attendance for each student</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>
                  Mark All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-slate-600">Loading students...</p>
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
                              attendanceData[student.id] === 'present'
                                ? 'default'
                                : attendanceData[student.id] === 'late'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {attendanceData[student.id]}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Marked</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={attendanceData[student.id] === 'present' ? 'default' : 'outline'}
                            onClick={() => handleAttendanceChange(student.id, 'present')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceData[student.id] === 'late' ? 'secondary' : 'outline'}
                            onClick={() => handleAttendanceChange(student.id, 'late')}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceData[student.id] === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleAttendanceChange(student.id, 'absent')}
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
      {selectedClass && students.length > 0 && (
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
  );
}
