// Holiday types matching backend DTOs
export interface CreateHolidayDto {
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface UpdateHolidayDto {
  name?: string;
  date?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}
