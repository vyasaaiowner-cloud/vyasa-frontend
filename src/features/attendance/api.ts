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
   * Update existing attendance for a class/section
   */
  update: async (data: MarkAttendanceDto): Promise<MarkAttendanceResponse> => {
    return scopedApiCall('/attendance/update', {
      method: 'PUT',
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

  /**
   * Get attendance for a specific section and date
   */
  getBySectionAndDate: async (
    sectionId: string,
    date: string
  ): Promise<AttendanceRecord[]> => {
    const params = new URLSearchParams();
    params.append('date', date);
    
    return scopedApiCall(
      `/attendance/section/${sectionId}?${params.toString()}`,
      { method: 'GET' }
    );
  },
};
