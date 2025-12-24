// Student types matching backend DTOs
export interface CreateStudentDto {
  name: string;
  classId: string;
  sectionId: string;
  rollNo: number;
  parentName?: string;
  parentCountryCode?: string;
  parentMobileNo?: string;
  parentEmail?: string;
}

export interface UpdateStudentDto {
  name?: string;
  classId?: string;
  sectionId?: string;
  rollNo?: number;
  parents?: Array<{
    parentId?: string;
    name: string;
    email?: string;
    countryCode: string;
    mobileNo: string;
  }>;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  sectionId: string;
  rollNo: number;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
  };
  section: {
    id: string;
    name: string;
    classId: string;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
  };
  parents?: ParentLink[];
}

export interface ParentLink {
  id: string;
  parentId: string;
  studentId: string;
  parent: {
    id: string;
    name: string;
    email: string | null;
    phoneE164: string;
    phoneCode: string;
    phoneNumber: string;
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
