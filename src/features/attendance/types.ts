// Attendance types matching backend DTOs
// Phase 0 PRD: Only PRESENT / ABSENT (no LATE)
export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface StudentAttendanceDto {
  studentId: string;
  status: AttendanceStatus;
}

export interface MarkAttendanceDto {
  className: string;
  section: string;
  date: string; // ISO date string
  attendances: StudentAttendanceDto[];
}

export interface MarkAttendanceResponse {
  message: string;
  date: string;
  className: string;
  section: string;
  count: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    rollNo: number;
    className: string;
    section: string;
  };
}

export interface StudentAttendanceResponse {
  student: {
    id: string;
    name: string;
    rollNo: number;
    className: string;
    section: string;
  };
  attendance: AttendanceRecord[];
}
