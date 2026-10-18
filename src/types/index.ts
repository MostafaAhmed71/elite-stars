export type CategoryType = 
  | 'التفوق الأكاديمي'
  | 'القيادة والمبادرة'
  | 'الإبداع والابتكار'
  | 'خدمة المجتمع'
  | 'الأخلاق والقيم';

export interface Student {
  id: string;
  fullName: string;
  gradeLevel: string; // e.g. "الصف الثاني الابتدائي"
  className: string;  // e.g. "2/ب"
  avatarUrl: string;
  category: CategoryType;
  clusterGroup: number; // 1, 2, 3, 4 (6 students per group)
  recognitionReason: string;
  badges: string[]; // e.g. ["القدوة الحسنة", "مساعدة الآخرين", "التفوق الأكاديمي"]
  quote?: string;
  isFeatured?: boolean; // Central anchor node of cluster
  position: {
    x: number; // Percentage 0 - 100
    y: number; // Percentage 0 - 100
  };
}

export interface WeeklyEdition {
  id: string;
  title: string; // e.g. "الأسبوع الثامن - الفصل الأول 1446هـ"
  weekNumber: number;
  academicYear: string;
  isPublished: boolean;
  publishedAt: string;
  totalStudents: number;
  celestialQuote: string;
  clusters: {
    id: number;
    name: string;
    description: string;
  }[];
}

export interface SchoolConfig {
  name: string;
  slogan: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface CategoryItem {
  name: CategoryType;
  icon: string;
  label: string;
  description: string;
}
