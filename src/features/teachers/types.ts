// Teacher types matching backend DTOs
export interface CreateTeacherDto {
  name: string;
  countryCode: string;
  mobileNo: string;
  email?: string;
  sectionIds?: string[];
}

export interface UpdateTeacherDto {
  sectionIds?: string[];
}

export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phoneE164: string;
    phoneCode: string;
    phoneNumber: string;
  };
  assignments: TeacherAssignment[];
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  sectionId: string;
  createdAt: string;
  section: {
    id: string;
    name: string;
    classId: string;
    class: {
      id: string;
      name: string;
    };
  };
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}
