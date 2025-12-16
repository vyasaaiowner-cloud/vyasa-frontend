import { scopedApiCall } from '@/lib/school-scope';
import type { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from './types';

export const announcementsApi = {
  /**
   * Get all announcements for the current user
   * Filters based on user role and assigned classes/sections
   */
  getAll: async (): Promise<Announcement[]> => {
    return scopedApiCall('/announcements', {
      method: 'GET',
    });
  },

  /**
   * Get a single announcement by ID
   */
  getById: async (id: string): Promise<Announcement> => {
    return scopedApiCall(`/announcements/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new announcement (SCHOOL_ADMIN only)
   */
  create: async (data: CreateAnnouncementDto): Promise<Announcement> => {
    return scopedApiCall('/announcements', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update an announcement (SCHOOL_ADMIN only)
   */
  update: async (id: string, data: UpdateAnnouncementDto): Promise<Announcement> => {
    return scopedApiCall(`/announcements/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Delete an announcement (SCHOOL_ADMIN only)
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return scopedApiCall(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};
