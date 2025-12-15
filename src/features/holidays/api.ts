import { scopedApiCall } from '@/lib/school-scope';
import type { Holiday, CreateHolidayDto, UpdateHolidayDto } from './types';

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
};
