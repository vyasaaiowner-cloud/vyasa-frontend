import { scopedApiCall } from '@/lib/school-scope';
import type { Student, CreateStudentDto, UpdateStudentDto, BulkUploadResult } from './types';

export const studentsApi = {
  /**
   * Get all students for the current school
   * Optionally filter by classId and sectionId
   */
  getAll: async (classId?: string, sectionId?: string): Promise<Student[]> => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (sectionId) params.append('sectionId', sectionId);
    
    const query = params.toString();
    return scopedApiCall(
      `/students${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );
  },

  /**
   * Get a single student by ID
   */
  getById: async (id: string): Promise<Student> => {
    return scopedApiCall(`/students/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new student
   */
  create: async (data: CreateStudentDto): Promise<Student> => {
    return scopedApiCall('/students', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update a student
   */
  update: async (id: string, data: UpdateStudentDto): Promise<Student> => {
    return scopedApiCall(`/students/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Delete a student
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Bulk upload students from CSV file
   */
  bulkUpload: async (file: File): Promise<BulkUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response: any = await scopedApiCall('/students/bulk-upload', {
      method: 'POST',
      body: formData,
    });
    // Backend returns { message, results: { success, failed, errors } }
    return response.results || response;
  },
};
