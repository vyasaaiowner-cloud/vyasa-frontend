import api from '@/lib/api';
import type { School, CreateSchoolDto, UpdateSchoolDto } from './types';

/**
 * Get all schools (SUPER_ADMIN only)
 */
export async function getAll(): Promise<School[]> {
  const response = await api.get('/schools');
  return response.data;
}

/**
 * Get a single school by ID
 */
export async function getById(id: string): Promise<School> {
  const response = await api.get(`/schools/${id}`);
  return response.data;
}

/**
 * Create a new school (SUPER_ADMIN only)
 */
export async function create(data: CreateSchoolDto): Promise<School> {
  const response = await api.post('/schools', data);
  return response.data;
}

/**
 * Update a school (SUPER_ADMIN only)
 */
export async function update(id: string, data: UpdateSchoolDto): Promise<School> {
  const response = await api.patch(`/schools/${id}`, data);
  return response.data;
}

/**
 * Delete a school (SUPER_ADMIN only)
 */
export async function deleteSchool(id: string): Promise<void> {
  await api.delete(`/schools/${id}`);
}

/**
 * Activate a school (SUPER_ADMIN only)
 */
export async function activate(id: string): Promise<School> {
  const response = await api.patch(`/schools/${id}/activate`);
  return response.data;
}

/**
 * Deactivate a school (SUPER_ADMIN only)
 */
export async function deactivate(id: string): Promise<School> {
  const response = await api.patch(`/schools/${id}/deactivate`);
  return response.data;
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
