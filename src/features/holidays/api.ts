import { scopedApiCall } from '@/lib/school-scope';
import type { Holiday, CreateHolidayDto, UpdateHolidayDto } from './types';

export const holidaysApi = {
  /**
   * Get all holidays for the current school
   */
  getAll: async (): Promise<Holiday[]> => {
    return scopedApiCall('/holidays', {
      method: 'GET',
    });
  },

  /**
   * Get a single holiday by ID
   */
  getById: async (id: string): Promise<Holiday> => {
    return scopedApiCall(`/holidays/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new holiday
   */
  create: async (data: CreateHolidayDto): Promise<Holiday> => {
    return scopedApiCall('/holidays', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a holiday
   */
  update: async (id: string, data: UpdateHolidayDto): Promise<Holiday> => {
    return scopedApiCall(`/holidays/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a holiday
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/holidays/${id}`, {
      method: 'DELETE',
    });
  },
};
