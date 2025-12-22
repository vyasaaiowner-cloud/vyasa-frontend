// Attendance types matching backend DTOs
// Phase 0 PRD: Only PRESENT / ABSENT (no LATE)
export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface StudentAttendanceDto {
  studentId: string;
  status: AttendanceStatus;
}

export interface MarkAttendanceDto {
  sectionId: string;
  date: string; // ISO date string
  attendances: StudentAttendanceDto[];
}

export interface MarkAttendanceResponse {
  message: string;
  date: string;
  sectionId: string;
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
    className?: string;  // For backward compatibility
    section?: string;    // For backward compatibility
    class?: {            // Actual API response structure
      name: string;
    };
    section?: {          // Actual API response structure
      name: string;
    };
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
