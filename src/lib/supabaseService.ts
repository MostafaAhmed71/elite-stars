import { supabase, isSupabaseConfigured } from './supabase';
import { Student, WeeklyEdition, SchoolConfig } from '@/types';
import { INITIAL_EDITION, INITIAL_STUDENTS, INITIAL_SCHOOL_CONFIG } from './constants';

export interface FetchedDataResult {
  school: SchoolConfig;
  editions: WeeklyEdition[];
  activeEdition: WeeklyEdition;
  students: Student[];
  isRealData: boolean;
}

// Convert DB snake_case row to frontend Student interface
export function mapRowToStudent(row: Record<string, unknown>): Student {
  return {
    id: String(row.id || ''),
    fullName: String(row.full_name || ''),
    gradeLevel: String(row.grade_level || ''),
    className: String(row.class_name || ''),
    avatarUrl: String(row.avatar_url || '/images/students/omar-ahmed.jpg'),
    category: (row.category as Student['category']) || 'التفوق الأكاديمي',
    clusterGroup: Number(row.cluster_group) || 1,
    recognitionReason: String(row.recognition_reason || ''),
    badges: Array.isArray(row.badges) ? row.badges : ['وسام التميز والتفوق'],
    quote: row.quote ? String(row.quote) : undefined,
    isFeatured: Boolean(row.is_featured),
    position: {
      x: typeof row.pos_x === 'number' ? row.pos_x : 50,
      y: typeof row.pos_y === 'number' ? row.pos_y : 50,
    },
  };
}

// Convert frontend Student interface to DB snake_case row
export function mapStudentToRow(student: Student, editionId?: string) {
  // If the id looks like a standard UUID, keep it, otherwise let postgres generate or keep it
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(student.id);

  const row: Record<string, unknown> = {
    full_name: student.fullName,
    grade_level: student.gradeLevel,
    class_name: student.className,
    avatar_url: student.avatarUrl,
    category: student.category,
    cluster_group: student.clusterGroup || 1,
    recognition_reason: student.recognitionReason,
    badges: student.badges || ['وسام التميز والتفوق'],
    quote: student.quote || null,
    is_featured: Boolean(student.isFeatured),
    pos_x: student.position?.x ?? 50,
    pos_y: student.position?.y ?? 50,
  };

  if (isUuid) {
    row.id = student.id;
  }
  // Only assign edition_id if it's a valid Postgres UUID
  if (editionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editionId)) {
    row.edition_id = editionId;
  }

  return row;
}

// 1. Fetch Real Data from Supabase with Seamless Fallback
export async function fetchSupabaseData(): Promise<FetchedDataResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      school: INITIAL_SCHOOL_CONFIG,
      editions: [INITIAL_EDITION],
      activeEdition: INITIAL_EDITION,
      students: INITIAL_STUDENTS,
      isRealData: false,
    };
  }

  try {
    // 1. Fetch Students
    const { data: dbStudents, error: studentsErr } = await supabase
      .from('student_recognitions')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch Editions
    const { data: dbEditions } = await supabase
      .from('weekly_editions')
      .select('*')
      .order('week_number', { ascending: false });

    // 3. Fetch School
    const { data: dbSchools } = await supabase
      .from('schools')
      .select('*')
      .limit(1);

    const hasRealStudents = Boolean(dbStudents && dbStudents.length > 0 && !studentsErr);

    // If real students exist in Supabase, parse and return them
    if (hasRealStudents && dbStudents) {
      const parsedStudents: Student[] = dbStudents.map(mapRowToStudent);

      let parsedEditions: WeeklyEdition[] = [INITIAL_EDITION];
      if (dbEditions && dbEditions.length > 0) {
        parsedEditions = dbEditions.map((row) => ({
          id: String(row.id),
          title: String(row.title || 'الأسبوع الأول'),
          weekNumber: Number(row.week_number) || 1,
          academicYear: String(row.academic_year || '1448هـ'),
          isPublished: Boolean(row.is_published),
          publishedAt: String(row.published_at || new Date().toISOString()),
          totalStudents: Number(row.total_students) || parsedStudents.length,
          celestialQuote: String(row.celestial_quote || INITIAL_EDITION.celestialQuote),
          clusters: INITIAL_EDITION.clusters,
        }));
      }

      let parsedSchool: SchoolConfig = INITIAL_SCHOOL_CONFIG;
      if (dbSchools && dbSchools.length > 0) {
        const s = dbSchools[0];
        parsedSchool = {
          name: String(s.name || INITIAL_SCHOOL_CONFIG.name),
          slogan: String(s.slogan || INITIAL_SCHOOL_CONFIG.slogan),
          heroTitle: String(s.hero_title || INITIAL_SCHOOL_CONFIG.heroTitle),
          heroSubtitle: String(s.hero_subtitle || INITIAL_SCHOOL_CONFIG.heroSubtitle),
          logoUrl: s.logo_url ? String(s.logo_url) : INITIAL_SCHOOL_CONFIG.logoUrl,
        };
      }

      return {
        school: parsedSchool,
        editions: parsedEditions,
        activeEdition: parsedEditions[0] || INITIAL_EDITION,
        students: parsedStudents,
        isRealData: true,
      };
    }

    // Fallback: If database is empty, return initial demo data
    return {
      school: INITIAL_SCHOOL_CONFIG,
      editions: [INITIAL_EDITION],
      activeEdition: INITIAL_EDITION,
      students: INITIAL_STUDENTS,
      isRealData: false,
    };
  } catch (error) {
    console.warn('Error connecting to Supabase, falling back to local demo:', error);
    return {
      school: INITIAL_SCHOOL_CONFIG,
      editions: [INITIAL_EDITION],
      activeEdition: INITIAL_EDITION,
      students: INITIAL_STUDENTS,
      isRealData: false,
    };
  }
}

// 2. Save / Upsert Student in Supabase
export async function saveStudentToSupabase(student: Student, editionId?: string): Promise<{ success: boolean; error?: string; data?: unknown }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'سوبابيز غير مهيأ' };
  }

  try {
    const row = mapStudentToRow(student, editionId);
    
    // Check if record exists
    if (student.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(student.id)) {
      const { data, error } = await supabase
        .from('student_recognitions')
        .upsert(row)
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('student_recognitions')
        .insert([row])
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

// 3. Delete Student from Supabase
export async function deleteStudentFromSupabase(studentId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !studentId) return false;

  // Validate UUID to avoid Postgres error 400 (invalid input syntax for type uuid)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
  if (!isUuid) {
    // If it's a client mock id (e.g. 'student-omar-ahmed'), it was never in PostgreSQL
    return true;
  }

  try {
    const { error } = await supabase
      .from('student_recognitions')
      .delete()
      .eq('id', studentId);
    return !error;
  } catch {
    return false;
  }
}

// 4. Save School Config to Supabase
export async function saveSchoolConfigToSupabase(config: SchoolConfig): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { data: existing } = await supabase.from('schools').select('id').limit(1);
    if (existing && existing.length > 0) {
      await supabase.from('schools').update({
        name: config.name,
        slogan: config.slogan,
        hero_title: config.heroTitle,
        hero_subtitle: config.heroSubtitle,
        logo_url: config.logoUrl,
      }).eq('id', existing[0].id);
    } else {
      await supabase.from('schools').insert([{
        name: config.name,
        slogan: config.slogan,
        hero_title: config.heroTitle,
        hero_subtitle: config.heroSubtitle,
        logo_url: config.logoUrl,
      }]);
    }
    return true;
  } catch {
    return false;
  }
}

// 5. Save Weekly Edition to Supabase
export async function saveWeeklyEditionToSupabase(edition: WeeklyEdition): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    await supabase.from('weekly_editions').insert([{
      title: edition.title,
      week_number: edition.weekNumber,
      academic_year: edition.academicYear,
      is_published: edition.isPublished,
      published_at: edition.publishedAt,
      total_students: edition.totalStudents,
      celestial_quote: edition.celestialQuote,
    }]);
    return true;
  } catch {
    return false;
  }
}
