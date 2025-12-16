import { scopedApiCall } from '@/lib/school-scope';
import type { Class, Section, CreateClassDto, UpdateClassDto, CreateSectionDto, UpdateSectionDto } from './types';

export const classesApi = {
  // ========== Class endpoints ==========
  
  /**
   * Get all classes for the current school
   */
  getAll: async (): Promise<Class[]> => {
    return scopedApiCall('/classes', {
      method: 'GET',
    });
  },

  /**
   * Get a single class by ID
   */
  getById: async (id: string): Promise<Class> => {
    return scopedApiCall(`/classes/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new class
   */
  create: async (data: CreateClassDto): Promise<Class> => {
    return scopedApiCall('/classes', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update a class
   */
  update: async (id: string, data: UpdateClassDto): Promise<Class> => {
    return scopedApiCall(`/classes/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Delete a class
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/classes/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== Section endpoints ==========

  /**
   * Get all sections for the current school
   * Optionally filter by classId
   */
  getSections: async (classId?: string): Promise<Section[]> => {
    const query = classId ? `?classId=${classId}` : '';
    return scopedApiCall(`/sections${query}`, {
      method: 'GET',
    });
  },

  /**
   * Get a single section by ID
   */
  getSectionById: async (id: string): Promise<Section> => {
    return scopedApiCall(`/sections/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new section
   */
  createSection: async (data: CreateSectionDto): Promise<Section> => {
    return scopedApiCall('/sections', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update a section
   */
  updateSection: async (id: string, data: UpdateSectionDto): Promise<Section> => {
    return scopedApiCall(`/sections/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Delete a section
   */
  deleteSection: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/sections/${id}`, {
      method: 'DELETE',
    });
  },
};
