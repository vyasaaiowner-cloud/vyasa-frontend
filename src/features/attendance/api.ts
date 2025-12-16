import { scopedApiCall } from '@/lib/school-scope';
import type {
  MarkAttendanceDto,
  MarkAttendanceResponse,
  AttendanceRecord,
  StudentAttendanceResponse,
} from './types';

export const attendanceApi = {
  /**
   * Mark attendance for a class/section
   */
  mark: async (data: MarkAttendanceDto): Promise<MarkAttendanceResponse> => {
    return scopedApiCall('/attendance/mark', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Get attendance records for a class/section
   */
  getByClass: async (
    className: string,
    section: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString();
    return scopedApiCall(
      `/attendance/class/${className}/section/${section}${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
  },

  /**
   * Get attendance records for a specific student
   */
  getByStudent: async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<StudentAttendanceResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString();
    return scopedApiCall(
      `/attendance/student/${studentId}${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
  },

  /**
   * Get attendance for all children of the current parent user
   */
  getMyChildren: async (
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString();
    return scopedApiCall(
      `/attendance/my-children${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
  },
};
