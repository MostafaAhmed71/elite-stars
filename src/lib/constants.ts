import { Student, WeeklyEdition, SchoolConfig, CategoryItem } from '@/types';

export const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  name: 'مدارس نخبة الشمال الأهلية والعالمية',
  slogan: 'تميز بالتعليم .. جودة في الأداء .. تنمية للمواهب',
  logoUrl: '/images/school-logo.jpg',
  heroTitle: 'نجوم الأسبوع',
  heroSubtitle: 'كوكبة التميز لهذا الأسبوع',
};

export const CATEGORIES: CategoryItem[] = [
  {
    name: 'التفوق الأكاديمي',
    icon: 'GraduationCap',
    label: 'التفوق الأكاديمي',
    description: 'إتقان المهارات الدراسية والشغف المعرفي المستمر',
  },
  {
    name: 'القيادة والمبادرة',
    icon: 'Compass',
    label: 'القيادة والمبادرة',
    description: 'روح المبادرة وتحمل المسؤولية بروح الفريق',
  },
  {
    name: 'الإبداع والابتكار',
    icon: 'Lightbulb',
    label: 'الإبداع والابتكار',
    description: 'التفكير الإبداعي والحلول الذكية المتميزة',
  },
  {
    name: 'خدمة المجتمع',
    icon: 'Sprout',
    label: 'خدمة المجتمع',
    description: 'المساهمة الفعالة في بيئة المدرسة وخدمة الآخرين',
  },
  {
    name: 'الأخلاق والقيم',
    icon: 'Heart',
    label: 'الأخلاق والقيم',
    description: 'التحلي بالآداب الرفيعة والقدوة الحسنة بين الزملاء',
  },
];

export const INITIAL_EDITION: WeeklyEdition = {
  id: 'week-01-1446',
  title: 'الأسبوع الأول - الفصل الدراسي الأول 1446هـ',
  weekNumber: 1,
  academicYear: '1446هـ',
  isPublished: true,
  publishedAt: new Date().toISOString().split('T')[0],
  totalStudents: 0,
  celestialQuote: 'كل طالب يضيء بطريقته.. ومعاً نصنع كوكبة من التميز',
  clusters: [
    { id: 1, name: 'كوكبة الإشراق', description: 'المجموعة الأولى من نجوم التميز' },
    { id: 2, name: 'كوكبة الإبداع', description: 'المجموعة الثانية من نجوم التميز' },
    { id: 3, name: 'كوكبة العطاء', description: 'المجموعة الثالثة من نجوم التميز' },
    { id: 4, name: 'كوكبة الروّاد', description: 'المجموعة الرابعة من نجوم التميز' },
  ],
};

// All fake demo student records removed. Clean slate for real school data.
export const INITIAL_STUDENTS: Student[] = [];
