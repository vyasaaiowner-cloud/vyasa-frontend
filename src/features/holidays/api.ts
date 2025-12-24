import { scopedApiCall } from '@/lib/school-scope';
import type { Holiday, CreateHolidayDto, UpdateHolidayDto, BulkUploadResult } from './types';

export const holidaysApi = {
  /**
   * Get all holidays for the current school
   */
  getAll: async (): Promise<Holiday[]> => {
    return scopedApiCall('get', '/holidays');
  },

  /**
   * Get a single holiday by ID
   */
  getById: async (id: string): Promise<Holiday> => {
    return scopedApiCall('get', `/holidays/${id}`);
  },

  /**
   * Create a new holiday
   */
  create: async (data: CreateHolidayDto): Promise<Holiday> => {
    return scopedApiCall('post', '/holidays', data);
  },

  /**
   * Update a holiday
   */
  update: async (id: string, data: UpdateHolidayDto): Promise<Holiday> => {
    return scopedApiCall('put', `/holidays/${id}`, data);
  },

  /**
   * Delete a holiday
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall('delete', `/holidays/${id}`);
  },

  /**
   * Bulk upload holidays from CSV/Excel file
   */
  bulkUpload: async (file: File): Promise<BulkUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response: any = await scopedApiCall('post', '/holidays/bulk-upload', formData);
    // Backend returns { message, results: { success, failed, errors } }
    return response.results || response;
  },
};
