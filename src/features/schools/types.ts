export interface School {
  id: string;
  name: string;
  schoolCode: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCountryCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    teachers: number;
    students: number;
    classes: number;
  };
}

export interface CreateSchoolDto {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCountryCode?: string;
  adminName: string;
  adminEmail: string;
  adminPhoneCode: string;
  adminPhoneNumber: string;
}

export interface UpdateSchoolDto {
  name?: string;
  schoolCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCountryCode?: string;
  isActive?: boolean;
}
