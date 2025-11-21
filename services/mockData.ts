
import { Student, Teacher, Parent, Book, ScheduleItem, Notification, GRADE_LEVELS, DAYS_OF_WEEK } from '../types';

// --- Database Keys ---
const DB_KEYS = {
  STUDENTS: 'MADRASATI_DB_STUDENTS',
  TEACHERS: 'MADRASATI_DB_TEACHERS',
  PARENTS: 'MADRASATI_DB_PARENTS',
  BOOKS: 'MADRASATI_DB_BOOKS',
  NOTIFICATIONS: 'MADRASATI_DB_NOTIFICATIONS',
  SCHEDULES: 'MADRASATI_DB_SCHEDULES'
};

// --- Initial Mock Data (Seeds) ---
const seedStudents: Student[] = [
  { id: 's1', name: 'أحمد محمد', seatNumber: '1001', password: '123', gradeLevel: 'الصف الأول', parentId: 'p1', grades: { 'الرياضيات': 95, 'لغتي': 88, 'العلوم': 92 } },
  { id: 's2', name: 'سارة علي', seatNumber: '1002', password: '123', gradeLevel: 'الصف الأول', parentId: 'p2', grades: { 'الرياضيات': 98, 'لغتي': 99, 'العلوم': 100 } },
  { id: 's3', name: 'خالد عبدالله', seatNumber: '2001', password: '123', gradeLevel: 'الصف الثاني', parentId: 'p1', grades: { 'العلوم': 85, 'اللغة الإنجليزية': 90 } },
  { id: 's4', name: 'منى سعيد', seatNumber: '3001', password: '123', gradeLevel: 'الصف الثالث', parentId: 'p3', grades: { 'القرآن الكريم': 100 } },
  { id: 's5', name: 'فهد عمر', seatNumber: '6001', password: '123', gradeLevel: 'الصف السادس', parentId: 'p2', grades: { 'الاجتماعيات': 75, 'الرياضيات': 60 } },
  { id: 's6', name: 'عبدالرحمن يوسف', seatNumber: '4001', password: '123', gradeLevel: 'الصف الرابع', parentId: 'p3', grades: { 'الرياضيات': 88 } },
];

const seedTeachers: Teacher[] = [
  { id: 't1', name: 'الأستاذ/ حسن المالكي', username: 't_hassan', password: '123', subject: 'الرياضيات', gradeLevels: ['الصف الأول', 'الصف الثاني', 'الصف الرابع', 'الصف السادس'] },
  { id: 't2', name: 'الأستاذة/ نورة العمري', username: 't_noura', password: '123', subject: 'لغتي', gradeLevels: ['الصف الأول', 'الصف الثالث'] },
  { id: 't3', name: 'الأستاذ/ فيصل القحطاني', username: 't_faisal', password: '123', subject: 'العلوم', gradeLevels: ['الصف الأول', 'الصف الثاني', 'الصف الخامس'] },
];

const seedParents: Parent[] = [
  { id: 'p1', name: 'محمد عبدالله', username: 'abu_ahmed', password: '123' },
  { id: 'p2', name: 'علي سعيد', username: 'abu_sara', password: '123' },
  { id: 'p3', name: 'سعيد الغامدي', username: 'abu_mona', password: '123' },
];

const seedBooks: Book[] = [
  { id: 'b1', title: 'كتاب الرياضيات - الفصل الأول', gradeLevel: 'الصف الأول', fileName: 'math_g1_v1.pdf', dateAdded: '2023-09-01' },
  { id: 'b2', title: 'كتاب لغتي الجميلة', gradeLevel: 'الصف الأول', fileName: 'arabic_g1.pdf', dateAdded: '2023-09-01' },
  { id: 'b3', title: 'كتاب العلوم', gradeLevel: 'الصف الثاني', fileName: 'science_g2.pdf', dateAdded: '2023-09-05' },
];

const seedNotifications: Notification[] = [
  { id: 'n1', title: 'بداية العام الدراسي', message: 'نرحب بكم في العام الدراسي الجديد ونتمنى لكم التوفيق', date: '2023-08-20', type: 'GENERAL', sender: 'الإدارة' },
  { id: 'n2', title: 'رحلة مدرسية', message: 'يوجد رحلة مدرسية للصف الأول يوم الخميس', date: '2023-09-15', type: 'GRADE', targetId: 'الصف الأول', sender: 'رائد النشاط' },
  { id: 'n3', title: 'اجتماع مجلس الآباء', message: 'ندعوكم لحضور اجتماع مجلس الآباء يوم الثلاثاء القادم', date: '2023-10-01', type: 'GENERAL', sender: 'الإدارة' },
];

// Helper to generate empty schedule
const generateEmptySchedule = (): Record<string, ScheduleItem[]> => {
  const schedule: Record<string, ScheduleItem[]> = {};
  GRADE_LEVELS.forEach(grade => {
    schedule[grade] = DAYS_OF_WEEK.map(day => ({
      day,
      periods: Array(6).fill('---')
    }));
  });
  return schedule;
};

// Helper to load from LocalStorage or use Seed
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return fallback;
  }
};

// Helper to save to LocalStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
};

// --- Runtime State (Loaded from DB) ---
let dbStudents = loadFromStorage<Student[]>(DB_KEYS.STUDENTS, seedStudents);
let dbTeachers = loadFromStorage<Teacher[]>(DB_KEYS.TEACHERS, seedTeachers);
let dbParents = loadFromStorage<Parent[]>(DB_KEYS.PARENTS, seedParents);
let dbBooks = loadFromStorage<Book[]>(DB_KEYS.BOOKS, seedBooks);
let dbNotifications = loadFromStorage<Notification[]>(DB_KEYS.NOTIFICATIONS, seedNotifications);
let dbSchedules = loadFromStorage<Record<string, ScheduleItem[]>>(DB_KEYS.SCHEDULES, generateEmptySchedule());

// Pre-fill schedule if empty (for first run)
if (dbSchedules['الصف الأول'][0].periods[0] === '---') {
  dbSchedules['الصف الأول'][0].periods = ['القرآن الكريم', 'الرياضيات', 'لغتي', 'راحة', 'العلوم', 'التربية الفنية'];
  dbSchedules['الصف الأول'][1].periods = ['الرياضيات', 'لغتي', 'القرآن الكريم', 'راحة', 'الاجتماعيات', 'بدنية'];
  saveToStorage(DB_KEYS.SCHEDULES, dbSchedules);
}

// --- Service Functions ---

export const dataService = {
  // Registration
  registerStudent: (name: string, seatNumber: string, gradeLevel: string, password: string) => {
    const exists = dbStudents.find(s => s.seatNumber === seatNumber);
    if (exists) throw new Error('رقم الجلوس مستخدم بالفعل');
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      seatNumber,
      gradeLevel,
      password,
      grades: {}
    };
    dbStudents.push(newStudent);
    saveToStorage(DB_KEYS.STUDENTS, dbStudents);
    return newStudent;
  },

  registerTeacher: (name: string, username: string, subject: string, gradeLevels: string[], password: string) => {
    const exists = dbTeachers.find(t => t.username === username);
    if (exists) throw new Error('اسم المستخدم مستخدم بالفعل');
    
    const newTeacher: Teacher = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username,
      subject,
      gradeLevels,
      password
    };
    dbTeachers.push(newTeacher);
    saveToStorage(DB_KEYS.TEACHERS, dbTeachers);
    return newTeacher;
  },

  registerParent: (name: string, username: string, childSeatNumbers: string[], password: string) => {
    const exists = dbParents.find(p => p.username === username);
    if (exists) throw new Error('اسم المستخدم مستخدم بالفعل');
    
    const newParent: Parent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username,
      password
    };
    dbParents.push(newParent);
    saveToStorage(DB_KEYS.PARENTS, dbParents);

    // Link children
    let studentsUpdated = false;
    childSeatNumbers.forEach(seat => {
      const student = dbStudents.find(s => s.seatNumber === seat);
      if (student) {
        student.parentId = newParent.id;
        studentsUpdated = true;
      }
    });
    
    if (studentsUpdated) {
      saveToStorage(DB_KEYS.STUDENTS, dbStudents);
    }

    return newParent;
  },

  // Login
  loginStudent: (seatNumber: string, password: string) => {
    // Refresh data from storage just in case
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents); 
    return dbStudents.find(s => s.seatNumber === seatNumber && s.password === password);
  },
  
  loginTeacher: (username: string, password: string) => {
    dbTeachers = loadFromStorage(DB_KEYS.TEACHERS, dbTeachers);
    return dbTeachers.find(t => t.username === username && t.password === password);
  },

  loginParent: (username: string, password: string) => {
    dbParents = loadFromStorage(DB_KEYS.PARENTS, dbParents);
    return dbParents.find(p => p.username === username && p.password === password);
  },

  // Students
  getStudents: () => {
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    return dbStudents;
  },
  getStudentById: (id: string) => {
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    return dbStudents.find(s => s.id === id);
  },
  getStudentsByGrade: (grade: string) => {
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    return dbStudents.filter(s => s.gradeLevel === grade);
  },
  getStudentsByParent: (parentId: string) => {
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    return dbStudents.filter(s => s.parentId === parentId);
  },
  updateStudentGrades: (studentId: string, subject: string, score: number) => {
    // Always reload first to get latest
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    const studentIndex = dbStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      dbStudents[studentIndex].grades = { 
        ...dbStudents[studentIndex].grades, 
        [subject]: score 
      };
      saveToStorage(DB_KEYS.STUDENTS, dbStudents);
    }
  },

  // Teachers
  getTeachers: () => {
    dbTeachers = loadFromStorage(DB_KEYS.TEACHERS, dbTeachers);
    return dbTeachers;
  },
  getTeacherById: (id: string) => dbTeachers.find(t => t.id === id),

  // Parents
  getParents: () => {
    dbParents = loadFromStorage(DB_KEYS.PARENTS, dbParents);
    return dbParents;
  },
  getParentById: (id: string) => dbParents.find(p => p.id === id),

  // Books
  getBooksByGrade: (grade: string) => {
    dbBooks = loadFromStorage(DB_KEYS.BOOKS, dbBooks);
    return dbBooks.filter(b => b.gradeLevel === grade);
  },
  addBook: (book: Book) => {
    dbBooks.push(book);
    saveToStorage(DB_KEYS.BOOKS, dbBooks);
  },
  deleteBook: (bookId: string) => {
    dbBooks = dbBooks.filter(b => b.id !== bookId);
    saveToStorage(DB_KEYS.BOOKS, dbBooks);
  },

  // Schedule
  getSchedule: (grade: string) => {
    dbSchedules = loadFromStorage(DB_KEYS.SCHEDULES, dbSchedules);
    return dbSchedules[grade] || [];
  },
  updateSchedulePeriod: (grade: string, dayIndex: number, periodIndex: number, subject: string) => {
    if (dbSchedules[grade] && dbSchedules[grade][dayIndex]) {
      dbSchedules[grade][dayIndex].periods[periodIndex] = subject;
      saveToStorage(DB_KEYS.SCHEDULES, dbSchedules);
    }
  },

  // Notifications
  getNotifications: () => {
    dbNotifications = loadFromStorage(DB_KEYS.NOTIFICATIONS, dbNotifications);
    return [...dbNotifications].reverse();
  },
  addNotification: (notif: Notification) => {
    dbNotifications.push(notif);
    saveToStorage(DB_KEYS.NOTIFICATIONS, dbNotifications);
  },
  deleteNotification: (id: string) => {
    dbNotifications = dbNotifications.filter(n => n.id !== id);
    saveToStorage(DB_KEYS.NOTIFICATIONS, dbNotifications);
  },
  getNotificationsForParent: (parentId: string) => {
    dbNotifications = loadFromStorage(DB_KEYS.NOTIFICATIONS, dbNotifications);
    dbStudents = loadFromStorage(DB_KEYS.STUDENTS, dbStudents);
    
    const parentStudents = dbStudents.filter(s => s.parentId === parentId);
    const studentGrades = parentStudents.map(s => s.gradeLevel);
    
    return dbNotifications.filter(n => {
      if (n.type === 'GENERAL') return true;
      if (n.type === 'PARENT_SPECIFIC' && n.targetId === parentId) return true;
      if ((n.type === 'GRADE' || n.type === 'HOMEWORK') && n.targetId && studentGrades.includes(n.targetId)) return true;
      return false;
    }).reverse();
  },
  getNotificationsForStudent: (gradeLevel: string) => {
    dbNotifications = loadFromStorage(DB_KEYS.NOTIFICATIONS, dbNotifications);
    return dbNotifications.filter(n => {
        if (n.type === 'GENERAL') return true;
        if ((n.type === 'GRADE' || n.type === 'HOMEWORK') && n.targetId === gradeLevel) return true;
        return false;
    }).reverse();
  }
};
