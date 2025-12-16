import { scopedApiCall } from '@/lib/school-scope';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from './types';

export const teachersApi = {
  /**
   * Get all teachers for the current school
   */
  getAll: async (includeInactive = false): Promise<Teacher[]> => {
    return scopedApiCall(
      `/teachers?includeInactive=${includeInactive}`,
      {
        method: 'GET',
      }
    );
  },

  /**
   * Get a single teacher by ID
   */
  getById: async (id: string): Promise<Teacher> => {
    return scopedApiCall(`/teachers/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new teacher
   */
  create: async (data: CreateTeacherDto): Promise<Teacher> => {
    return scopedApiCall('/teachers', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update a teacher (assign sections)
   */
  update: async (id: string, data: UpdateTeacherDto): Promise<Teacher> => {
    return scopedApiCall(`/teachers/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Activate a teacher
   */
  activate: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/teachers/${id}/activate`, {
      method: 'PUT',
    });
  },

  /**
   * Deactivate a teacher
   */
  deactivate: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/teachers/${id}/deactivate`, {
      method: 'PUT',
    });
  },

  /**
   * Delete a teacher
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/teachers/${id}`, {
      method: 'DELETE',
    });
  },
};
