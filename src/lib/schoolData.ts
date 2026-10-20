import { Student } from '@/types';

export interface SchoolClassInfo {
  id: string;
  gradeName: string;      // e.g. "الصف الأول"
  classSection: string;   // e.g. "1/أ"
  level: string;          // e.g. "المرحلة الابتدائية"
}

export const SCHOOL_CLASSES: SchoolClassInfo[] = [
  { id: '1-a', gradeName: 'الصف الأول', classSection: '1/أ', level: 'المرحلة الابتدائية' },
  { id: '1-b', gradeName: 'الصف الأول', classSection: '1/ب', level: 'المرحلة الابتدائية' },
  { id: '2-a', gradeName: 'الصف الثاني', classSection: '2/أ', level: 'المرحلة الابتدائية' },
  { id: '2-b', gradeName: 'الصف الثاني', classSection: '2/ب', level: 'المرحلة الابتدائية' },
  { id: '3-a', gradeName: 'الصف الثالث', classSection: '3/أ', level: 'المرحلة الابتدائية' },
  { id: '3-b', gradeName: 'الصف الثالث', classSection: '3/ب', level: 'المرحلة الابتدائية' },
];

/**
 * Strict and robust class matching helper so students in section "1/أ" NEVER leak into "1/ب"
 */
export function isStudentInClass(student: Student, classSection: string, gradeName?: string): boolean {
  if (!student) return false;
  
  const sClass = (student.className || '').trim().replace(/\s+/g, '').replace(/[\-–—]/g, '/');
  const targetClass = (classSection || '').trim().replace(/\s+/g, '').replace(/[\-–—]/g, '/');

  // 1. Exact match e.g. "1/أ" === "1/أ"
  if (sClass === targetClass) return true;

  // 2. Formatted without slash e.g. "1أ" === "1أ"
  const cleanS = sClass.replace('/', '');
  const cleanTarget = targetClass.replace('/', '');
  if (cleanS === cleanTarget && cleanS.length > 0) return true;

  // 3. If student has only section letter "أ" or "ب", verify both letter AND gradeName
  if (sClass === 'أ' || sClass === 'ب') {
    if (targetClass.endsWith(sClass) && gradeName && student.gradeLevel?.includes(gradeName)) {
      return true;
    }
  }

  return false;
}

export const DEMO_SCHOOL_STUDENTS: Student[] = [];
