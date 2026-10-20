import { Student } from '@/types';

export interface SchoolClassInfo {
  id: string;
  gradeName: string;      // e.g. "الصف الأول"
  classSection: string;   // e.g. "1/أ"
  level: string;          // e.g. "المرحلة الابتدائية"
  badgeText: string;
}

export const SCHOOL_CLASSES: SchoolClassInfo[] = [
  { id: '1-a', gradeName: 'الصف الأول', classSection: '1/أ', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
  { id: '1-b', gradeName: 'الصف الأول', classSection: '1/ب', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
  { id: '2-a', gradeName: 'الصف الثاني', classSection: '2/أ', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
  { id: '2-b', gradeName: 'الصف الثاني', classSection: '2/ب', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
  { id: '3-a', gradeName: 'الصف الثالث', classSection: '3/أ', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
  { id: '3-b', gradeName: 'الصف الثالث', classSection: '3/ب', level: 'المرحلة الابتدائية', badgeText: '2 طالب' },
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

export const DEMO_SCHOOL_STUDENTS: Student[] = [
  // الصف الأول - 1/أ
  {
    id: 'student-omar-ahmed',
    fullName: 'عمر أحمد',
    gradeLevel: 'الصف الأول',
    className: '1/أ',
    avatarUrl: '/images/students/omar-ahmed.jpg',
    category: 'الأخلاق والقيم',
    clusterGroup: 1,
    recognitionReason: 'الانضباط والالتزام العالي وحرصه الدائم على مساعدة زملائه وكونه قدوة في الفصل.',
    badges: ['الانضباط والالتزام', 'قدوة حسنة', 'مثابرة', 'سلوك مميز'],
    quote: 'أحب مدرستي ومعلمي وأسعى دائماً لأكون الأفضل!',
    position: { x: 25, y: 35 },
  },
  {
    id: 'student-lojain-mohammed',
    fullName: 'لجين محمد',
    gradeLevel: 'الصف الأول',
    className: '1/أ',
    avatarUrl: '/images/students/lojain-mohammed.jpg',
    category: 'التفوق الأكاديمي',
    clusterGroup: 1,
    recognitionReason: 'التميز الأكاديمي والمشاركة الفعالة وشغف القراءة والتعلم المستمر.',
    badges: ['التميز الأكاديمي', 'المشاركة الفعالة', 'شغف القراءة', 'قدوة حسنة'],
    quote: 'العلم نور وأتمنى أن أصبح طبيبة لأساعد الجميع.',
    position: { x: 75, y: 35 },
  },

  // الصف الأول - 1/ب
  {
    id: 'student-yasir-ali',
    fullName: 'ياسر علي',
    gradeLevel: 'الصف الأول',
    className: '1/ب',
    avatarUrl: '/images/students/yasir-ali.jpg',
    category: 'القيادة والمبادرة',
    clusterGroup: 1,
    recognitionReason: 'روح القيادة والمبادرة في الأنشطة الصفية والتعاون المثمر.',
    badges: ['المشاركة الفعالة', 'روح المبادرة', 'قدوة حسنة', 'انضباط'],
    position: { x: 25, y: 50 },
  },
  {
    id: 'student-layan-mohammed',
    fullName: 'ليان محمد',
    gradeLevel: 'الصف الأول',
    className: '1/ب',
    avatarUrl: '/images/students/layan-mohammed.jpg',
    category: 'الأخلاق والقيم',
    clusterGroup: 1,
    recognitionReason: 'السلوك الإيجابي واللباقة وحب المعرفة ومساعدة الصديقات.',
    badges: ['السلوك الإيجابي', 'التميز الأكاديمي', 'أخلاق عالية', 'مثابرة'],
    position: { x: 75, y: 50 },
  },

  // الصف الثاني - 2/أ
  {
    id: 'student-ammar-tamer',
    fullName: 'عمار تامر',
    gradeLevel: 'الصف الثاني',
    className: '2/أ',
    avatarUrl: '/images/students/ammar-tamer.jpg',
    category: 'التفوق الأكاديمي',
    clusterGroup: 2,
    recognitionReason: 'التفوق في مادة الرياضيات والحلول الذكية في المسابقات.',
    badges: ['التميز الأكاديمي', 'ذكاء رياضي', 'انضباط', 'مثابرة'],
    position: { x: 25, y: 65 },
  },
  {
    id: 'student-renad-saeed',
    fullName: 'ريناد سعيد',
    gradeLevel: 'الصف الثاني',
    className: '2/أ',
    avatarUrl: '/images/students/noura.jpg',
    category: 'الإبداع والابتكار',
    clusterGroup: 2,
    recognitionReason: 'الإبداع الفني والاهتمام بالبيئة المدرسية وترتيب الفصل.',
    badges: ['الإبداع والابتكار', 'نظافة ونظام', 'سلوك راقي', 'قدوة حسنة'],
    position: { x: 75, y: 65 },
  },

  // الصف الثاني - 2/ب
  {
    id: 'student-abdullah-fahad',
    fullName: 'عبدالله فهد',
    gradeLevel: 'الصف الثاني',
    className: '2/ب',
    avatarUrl: '/images/students/abdullah-fahad.jpg',
    category: 'خدمة المجتمع',
    clusterGroup: 2,
    recognitionReason: 'القدوة الحسنة والمساهمة الفعالة في نظافة وترتيب الصف ومساعدة الزملاء.',
    badges: ['قدوة حسنة', 'الانضباط والالتزام', 'عطاء وتميز', 'روح التعاون'],
    position: { x: 25, y: 80 },
  },
  {
    id: 'student-lama-khalid',
    fullName: 'لمى خالد',
    gradeLevel: 'الصف الثاني',
    className: '2/ب',
    avatarUrl: '/images/students/sarah.jpg',
    category: 'القيادة والمبادرة',
    clusterGroup: 2,
    recognitionReason: 'المشاركة الفعالة في الإذاعة المدرسية والإلقاء المتميز.',
    badges: ['المشاركة الفعالة', 'فصاحة وإلقاء', 'مثابرة', 'أخلاق فاضلة'],
    position: { x: 75, y: 80 },
  },

  // الصف الثالث - 3/أ
  {
    id: 'student-sarah-khalid',
    fullName: 'سارة خالد',
    gradeLevel: 'الصف الثالث',
    className: '3/أ',
    avatarUrl: '/images/students/sarah.jpg',
    category: 'التفوق الأكاديمي',
    clusterGroup: 3,
    recognitionReason: 'التفوق الأكاديمي العام والحصول على أعلى الدرجات في جميع المواد.',
    badges: ['التميز الأكاديمي', 'مثابرة', 'شغف القراءة', 'قدوة حسنة'],
    position: { x: 25, y: 20 },
  },
  {
    id: 'student-fahad-tamimi',
    fullName: 'فهد التميمي',
    gradeLevel: 'الصف الثالث',
    className: '3/أ',
    avatarUrl: '/images/students/khalid.jpg',
    category: 'الأخلاق والقيم',
    clusterGroup: 3,
    recognitionReason: 'السلوك الإيجابي والهدوء والتعامل الراقي مع المعلمين والزملاء.',
    badges: ['الانضباط المدرسي', 'سلوك مميز', 'احترام وتقدير', 'أمانة'],
    position: { x: 75, y: 20 },
  },

  // الصف الثالث - 3/ب
  {
    id: 'student-nour-ahmed',
    fullName: 'نور أحمد',
    gradeLevel: 'الصف الثالث',
    className: '3/ب',
    avatarUrl: '/images/students/nour-ahmed.jpg',
    category: 'الإبداع والابتكار',
    clusterGroup: 3,
    recognitionReason: 'الإبداع في التعبير الكتابي والقصص المصورة والأنشطة اللغوية.',
    badges: ['الإبداع والابتكار', 'كتابة إبداعية', 'مثابرة', 'مشاركة فعالة'],
    position: { x: 25, y: 40 },
  },
  {
    id: 'student-ziad-mansour',
    fullName: 'زياد منصور',
    gradeLevel: 'الصف الثالث',
    className: '3/ب',
    avatarUrl: '/images/students/omar.jpg',
    category: 'القيادة والمبادرة',
    clusterGroup: 3,
    recognitionReason: 'الانضباط والالتزام الرياضي والأخلاقي في جميع الفعاليات.',
    badges: ['روح رياضية', 'انضباط', 'مبادرة', 'قدوة حسنة'],
    position: { x: 75, y: 40 },
  },
];
