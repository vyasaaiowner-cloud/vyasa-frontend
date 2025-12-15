// Class and Section types matching backend DTOs
export interface CreateClassDto {
  name: string;
}

export interface UpdateClassDto {
  name: string;
}

export interface CreateSectionDto {
  name: string;
  classId: string;
}

export interface UpdateSectionDto {
  name: string;
}

export interface Class {
  id: string;
  name: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    name: string;
  };
}
