import { Student, WeeklyEdition, SchoolConfig } from '@/types';
import { INITIAL_EDITION, INITIAL_STUDENTS, INITIAL_SCHOOL_CONFIG } from './constants';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  SCHOOL: 'elite_stars_school_config',
  EDITIONS: 'elite_stars_editions',
  ACTIVE_EDITION_ID: 'elite_stars_active_edition_id',
  STUDENTS: 'elite_stars_students',
  VERSION: 'elite_stars_data_version_v6_saved',
};

// Seed or update localStorage with mock students and default configuration
if (typeof window !== 'undefined') {
  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (currentVersion !== 'v6') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.EDITIONS, JSON.stringify([INITIAL_EDITION]));
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(INITIAL_SCHOOL_CONFIG));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EDITION_ID, INITIAL_EDITION.id);
      localStorage.setItem(STORAGE_KEYS.VERSION, 'v6');
    }
  } catch (e) {
    // ignore
  }
}

// Safe LocalStorage helpers
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// School Configuration
export function getStoredSchoolConfig(): SchoolConfig {
  const config = getLocalItem<SchoolConfig>(STORAGE_KEYS.SCHOOL, INITIAL_SCHOOL_CONFIG);
  if (!config.logoUrl || config.name === 'مدرستنا') {
    return INITIAL_SCHOOL_CONFIG;
  }
  return config;
}

export function saveStoredSchoolConfig(config: SchoolConfig): void {
  setLocalItem(STORAGE_KEYS.SCHOOL, config);
}

// Editions
export function getStoredEditions(): WeeklyEdition[] {
  return getLocalItem<WeeklyEdition[]>(STORAGE_KEYS.EDITIONS, [INITIAL_EDITION]);
}

export function getActiveEditionId(): string {
  return getLocalItem<string>(STORAGE_KEYS.ACTIVE_EDITION_ID, INITIAL_EDITION.id);
}

export function setActiveEditionId(id: string): void {
  setLocalItem(STORAGE_KEYS.ACTIVE_EDITION_ID, id);
}

export function getActiveEdition(): WeeklyEdition {
  const editions = getStoredEditions();
  const activeId = getActiveEditionId();
  return editions.find((e) => e.id === activeId) || editions[0] || INITIAL_EDITION;
}

// Students
export function getStoredStudents(editionId?: string): Student[] {
  const allStudents = getLocalItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  if (!allStudents || allStudents.length === 0) {
    setLocalItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  }
  if (!editionId) return allStudents;
  return allStudents;
}

export function saveStoredStudents(students: Student[]): void {
  setLocalItem(STORAGE_KEYS.STUDENTS, students);
}

// Create New Weekly Edition
export function createNewEdition(data: {
  title: string;
  weekNumber: number;
  academicYear: string;
}): WeeklyEdition {
  const editions = getStoredEditions();
  const newEdition: WeeklyEdition = {
    id: `week-${data.weekNumber}-${Date.now()}`,
    title: data.title,
    weekNumber: data.weekNumber,
    academicYear: data.academicYear,
    isPublished: true,
    publishedAt: new Date().toISOString().split('T')[0],
    totalStudents: INITIAL_STUDENTS.length,
    celestialQuote: 'كل طالب يضيء بطريقته.. ومعاً نصنع كوكبة من التميز',
    clusters: INITIAL_EDITION.clusters,
  };

  const updated = [newEdition, ...editions];
  setLocalItem(STORAGE_KEYS.EDITIONS, updated);
  setActiveEditionId(newEdition.id);
  return newEdition;
}

// Reset Data
export function resetToDemo(): void {
  if (typeof window === 'undefined') return;
  setLocalItem(STORAGE_KEYS.SCHOOL, INITIAL_SCHOOL_CONFIG);
  setLocalItem(STORAGE_KEYS.EDITIONS, [INITIAL_EDITION]);
  setLocalItem(STORAGE_KEYS.ACTIVE_EDITION_ID, INITIAL_EDITION.id);
  setLocalItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
}
