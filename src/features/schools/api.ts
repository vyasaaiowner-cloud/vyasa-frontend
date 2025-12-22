import api from '@/lib/api';
import { extractErrorMessage } from '@/lib/error-handler';
import type { School, CreateSchoolDto, UpdateSchoolDto } from './types';

/**
 * Get all schools (SUPER_ADMIN only)
 */
export async function getAll(): Promise<School[]> {
  try {
    const response = await api.get('/schools');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a single school by ID
 */
export async function getById(id: string): Promise<School> {
  try {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new school (SUPER_ADMIN only)
 */
export async function create(data: CreateSchoolDto): Promise<School> {
  try {
    const response = await api.post('/schools', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update a school (SUPER_ADMIN only)
 */
export async function update(id: string, data: UpdateSchoolDto): Promise<School> {
  try {
    const response = await api.patch(`/schools/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a school (SUPER_ADMIN only)
 */
export async function deleteSchool(id: string): Promise<void> {
  try {
    await api.delete(`/schools/${id}`);
  } catch (error) {
    throw error;
  }
}

/**
 * Activate a school (SUPER_ADMIN only)
 */
export async function activate(id: string): Promise<School> {
  try {
    const response = await api.patch(`/schools/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Deactivate a school (SUPER_ADMIN only)
 */
export async function deactivate(id: string): Promise<School> {
  try {
    const response = await api.patch(`/schools/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const schoolsApi = {
  getAll,
  getById,
  create,
  update,
  delete: deleteSchool,
  activate,
  deactivate,
};
