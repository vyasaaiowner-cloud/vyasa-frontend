// Announcement types matching backend DTOs
export interface CreateAnnouncementDto {
  title: string;
  content: string;
  targetAll: boolean;
  targetClass?: string;
  targetSection?: string;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  targetAll?: boolean;
  targetClass?: string;
  targetSection?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAll: boolean;
  targetClass: string | null;
  targetSection: string | null;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
