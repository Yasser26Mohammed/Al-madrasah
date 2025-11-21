
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface Student {
  id: string;
  name: string;
  seatNumber: string; // Acts as username
  password?: string;
  gradeLevel: string;
  parentId?: string;
  grades: Record<string, number>; // Subject -> Score
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  password?: string;
  subject: string;
  gradeLevels: string[];
}

export interface Parent {
  id: string;
  name: string;
  username: string;
  password?: string;
}

export interface Book {
  id: string;
  title: string;
  gradeLevel: string;
  fileName: string;
  dateAdded: string;
}

export interface ScheduleItem {
  day: string;
  periods: string[]; // Array of 6 subjects
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'GENERAL' | 'GRADE' | 'PARENT_SPECIFIC' | 'HOMEWORK';
  targetId?: string; // Could be gradeLevel or parentId
  sender: string;
}

export const GRADE_LEVELS = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'];
export const DAYS_OF_WEEK = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
export const SUBJECTS = ['القرآن الكريم', 'الرياضيات', 'العلوم', 'لغتي', 'اللغة الإنجليزية', 'التربية الفنية', 'الاجتماعيات'];
