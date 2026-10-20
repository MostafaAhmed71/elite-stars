'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Student, WeeklyEdition, SchoolConfig, CategoryType } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
  School,
  Lock,
  LogOut,
} from 'lucide-react';

interface AdminModalProps {
  students: Student[];
  edition: WeeklyEdition;
  school: SchoolConfig;
  allEditions: WeeklyEdition[];
  onSaveStudents: (students: Student[]) => void;
  onSaveSchool: (school: SchoolConfig) => void;
  onCreateEdition: (data: { title: string; weekNumber: number; academicYear: string }) => void;
  onClose: () => void;
}

export default function AdminModal({
  students,
  edition,
  school,
  allEditions,
  onSaveStudents,
  onSaveSchool,
  onCreateEdition,
  onClose,
}: AdminModalProps) {
  // Admin Auth Gate (Simple secure passcode for demonstration, extensible to Supabase Auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'students' | 'editions' | 'branding'>('students');

  // Local state for editing
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [localSchool, setLocalSchool] = useState<SchoolConfig>(school);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Edition State
  const [newWeekTitle, setNewWeekTitle] = useState('الأسبوع التاسع - الفصل الأول 1446هـ');
  const [newWeekNum, setNewWeekNum] = useState(9);
  const [newAcademicYear, setNewAcademicYear] = useState('1446هـ');
  const [publishSuccessMessage, setPublishSuccessMessage] = useState('');

  // Available student avatars for quick selection or preview
  const demoAvatars = [
    '/images/students/ahmed-otaibi.jpg',
    '/images/students/sarah.jpg',
    '/images/students/omar.jpg',
    '/images/students/mariam.jpg',
    '/images/students/khalid.jpg',
    '/images/students/noura.jpg',
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin' || passcode === 'admin123' || passcode === '123456') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة (جرّب: admin123)');
    }
  };

  const handleSaveStudentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (isAddingNew) {
      const updated = [editingStudent, ...localStudents];
      setLocalStudents(updated);
      onSaveStudents(updated);
      setIsAddingNew(false);
    } else {
      const updated = localStudents.map((s) => (s.id === editingStudent.id ? editingStudent : s));
      setLocalStudents(updated);
      onSaveStudents(updated);
    }
    setEditingStudent(null);
    showSuccessToast('تم حفظ بيانات الطالب بنجاح');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التكريم؟')) {
      const updated = localStudents.filter((s) => s.id !== id);
      setLocalStudents(updated);
      onSaveStudents(updated);
      showSuccessToast('تم حذف الطالب بنجاح');
    }
  };

  const handleCreateNewWeek = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateEdition({
      title: newWeekTitle,
      weekNumber: Number(newWeekNum),
      academicYear: newAcademicYear,
    });
    showSuccessToast('تم نشر الأسبوع الجديد بنجاح وتحديث الموقع العام تلقائياً!');
  };

  const handleSaveSchoolConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool(localSchool);
    showSuccessToast('تم تحديث هوية المدرسة وبيانات الواجهة!');
  };

  const showSuccessToast = (msg: string) => {
    setPublishSuccessMessage(msg);
    setTimeout(() => setPublishSuccessMessage(''), 4000);
  };

  // Image Upload handler (Data URL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingStudent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStudent({
          ...editingStudent,
          avatarUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#061325]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#071B37] border-2 border-[#FFD884]/80 p-5 sm:p-7 shadow-[0_0_60px_rgba(255,216,132,0.3)] z-10 text-right overflow-y-auto flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFC16C]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#102D54] border border-[#FFD884]/60 flex items-center justify-center text-[#FFD884]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#FFF8EA]">
                لوحة الإدارة الأسبوعية • نجوم الأسبوع
              </h2>
              <p className="text-xs text-[#EFC16C]">
                إدارة تكريم 24 طالباً ونشر الأسابيع بدون الحاجة لتعديل الكود
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-[#102D54] border border-[#EFC16C]/30 text-xs text-[#FFF8EA] hover:bg-rose-950/40 hover:text-rose-300 transition-all flex items-center gap-1.5"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#102D54] text-[#FFD884] hover:bg-[#102D54]/70 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {publishSuccessMessage && (
          <div className="my-3 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{publishSuccessMessage}</span>
          </div>
        )}

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="py-12 max-w-sm mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#102D54] border border-[#FFD884] flex items-center justify-center mx-auto text-[#FFD884]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FFF8EA]">تسجيل دخول المشرف</h3>
              <p className="text-xs text-[#EFC16C] mt-1">
                الوصول محمي للمسؤولين عن نشر لوحة الشرف
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل كلمة المرور (افتراضي: admin123)"
                className="w-full text-center py-3 px-4 rounded-xl bg-[#102D54]/70 border border-[#FFD884]/40 text-sm text-[#FFF8EA] focus:outline-none focus:ring-2 focus:ring-[#FFD884]"
              />

              {authError && <p className="text-xs text-rose-400 font-medium">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] font-bold text-sm shadow-[0_0_20px_rgba(255,216,132,0.4)] cursor-pointer"
              >
                دخول لوحة التحكم
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="pt-4 flex-1 flex flex-col">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-[#EFC16C]/20 pb-3">
              <button
                onClick={() => {
                  setActiveTab('students');
                  setEditingStudent(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325]'
                    : 'text-[#FFF8EA]/70 hover:text-[#FFF8EA] hover:bg-[#102D54]'
                }`}
              >
                الطلاب
              </button>

              <button
                onClick={() => setActiveTab('editions')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'editions'
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325]'
                    : 'text-[#FFF8EA]/70 hover:text-[#FFF8EA] hover:bg-[#102D54]'
                }`}
              >
                إصدار الأسبوع والنشر
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'branding'
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325]'
                    : 'text-[#FFF8EA]/70 hover:text-[#FFF8EA] hover:bg-[#102D54]'
                }`}
              >
                هوية المدرسة والواجهة
              </button>
            </div>

            {/* TAB 1: STUDENTS MANAGEMENT */}
            {activeTab === 'students' && (
              <div className="py-4 space-y-4">
                {editingStudent ? (
                  /* Edit / Add Student Form */
                  <form onSubmit={handleSaveStudentForm} className="space-y-4 bg-[#102D54]/50 p-5 rounded-2xl border border-[#FFD884]/40">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EFC16C]/30">
                      <h4 className="text-sm font-bold text-[#FFD884]">
                        {isAddingNew ? 'إضافة طالب جديد' : `تعديل بيانات: ${editingStudent.fullName}`}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="text-xs text-[#FFF8EA]/70 hover:text-[#FFF8EA]"
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          اسم الطالب الرباعي:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingStudent.fullName}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                        />
                      </div>

                      {/* Class Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          الصف والفصل (مثال: 2/ب):
                        </label>
                        <input
                          type="text"
                          required
                          value={editingStudent.className}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, className: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                        />
                      </div>

                      {/* Grade Level */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          المرحلة الدراسية:
                        </label>
                        <select
                          value={editingStudent.gradeLevel}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, gradeLevel: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                        >
                          <option>الصف الأول الابتدائي</option>
                          <option>الصف الثاني الابتدائي</option>
                          <option>الصف الثالث الابتدائي</option>
                          <option>الصف الرابع الابتدائي</option>
                          <option>الصف الخامس الابتدائي</option>
                          <option>الصف السادس الابتدائي</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          مجال التكريم (الفئة):
                        </label>
                        <select
                          value={editingStudent.category}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              category: e.target.value as CategoryType,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Primary Distinction Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          وسام التميز والتكريم (يظهر على بطاقة الطالب):
                        </label>
                        <select
                          value={editingStudent.badges?.[0] || 'الانضباط والالتزام'}
                          onChange={(e) => {
                            const newBadge = e.target.value;
                            const otherBadges = (editingStudent.badges || []).slice(1);
                            setEditingStudent({
                              ...editingStudent,
                              badges: [newBadge, ...otherBadges],
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                        >
                          <option value="الانضباط والالتزام">الانضباط والالتزام ⭐</option>
                          <option value="التميز الأكاديمي">التميز الأكاديمي 🎓</option>
                          <option value="السلوك الإيجابي">السلوك الإيجابي ❤️</option>
                          <option value="المشاركة الفعالة">المشاركة الفعالة ✨</option>
                          <option value="القدوة الحسنة">القدوة الحسنة 🏆</option>
                          <option value="الإبداع والابتكار">الإبداع والابتكار 💡</option>
                          <option value="شغف القراءة">شغف القراءة 📖</option>
                        </select>
                      </div>

                      {/* Photo / Avatar Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          صورة الطالب (رفع صورة أو اختيار نموذج):
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#FFD884]">
                            <Image
                              src={editingStudent.avatarUrl}
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#102D54] border border-[#FFD884]/40 text-xs font-semibold text-[#FFD884] hover:bg-[#102D54]/70 flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>رفع صورة</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Recognition Reason */}
                    <div>
                      <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                        سبب التكريم وعبارة التهنئة:
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingStudent.recognitionReason}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            recognitionReason: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                      />
                    </div>

                    {/* Badges comma-separated */}
                    <div>
                      <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                        الأوسمة التكريمية (3 أوسمة مفصولة بفاصلة):
                      </label>
                      <input
                        type="text"
                        value={editingStudent.badges.join('، ')}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            badges: e.target.value.split(/[,،]/).map((b) => b.trim()).filter(Boolean),
                          })
                        }
                        placeholder="القدوة الحسنة، مساعدة الآخرين، التفوق الأكاديمي"
                        className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-sm text-[#FFF8EA]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl bg-[#071B37] text-xs font-medium text-[#FFF8EA]"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] text-xs font-bold shadow-md cursor-pointer"
                      >
                        حفظ بيانات الطالب
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Controls Bar */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#EFC16C]">
                        إجمالي الطلاب: <span className="font-bold text-[#FFD884]">{localStudents.length}</span>
                      </div>

                      <button
                        onClick={() => {
                          setIsAddingNew(true);
                          setEditingStudent({
                            id: `s-new-${Date.now()}`,
                            fullName: '',
                            gradeLevel: 'الصف الأول الابتدائي',
                            className: '',
                            avatarUrl: demoAvatars[Math.floor(Math.random() * demoAvatars.length)],
                            category: 'التفوق الأكاديمي',
                            clusterGroup: 1,
                            recognitionReason: '',
                            badges: ['القدوة الحسنة', 'مساعدة الآخرين', 'التفوق الأكاديمي'],
                            position: { x: 50, y: 50 },
                          });
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة طالب</span>
                      </button>
                    </div>

                    {/* Students List Table */}
                    <div className="border border-[#EFC16C]/30 rounded-2xl overflow-hidden bg-[#102D54]/30">
                      <div className="max-h-[50vh] overflow-y-auto">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-[#102D54] text-[#FFD884] font-bold sticky top-0">
                            <tr>
                              <th className="p-3">الطالب</th>
                              <th className="p-3">الصف</th>
                              <th className="p-3">المجال</th>
                              <th className="p-3">وسام التميز</th>
                              <th className="p-3 text-center">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EFC16C]/15">
                            {localStudents.map((st) => (
                              <tr key={st.id} className="hover:bg-[#102D54]/50">
                                <td className="p-3 flex items-center gap-2">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FFD884]/40 shrink-0">
                                    <Image
                                      src={st.avatarUrl}
                                      alt={st.fullName}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="font-semibold text-[#FFF8EA]">
                                    {st.fullName}
                                  </span>
                                </td>
                                <td className="p-3 text-[#FFF8EA]/80">{st.className}</td>
                                <td className="p-3 text-[#FFD884]">{st.category}</td>
                                <td className="p-3 text-[#FFD884] font-semibold">{st.badges?.[0] || 'الانضباط والالتزام'}</td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        setIsAddingNew(false);
                                        setEditingStudent(st);
                                      }}
                                      className="p-1.5 rounded-lg bg-[#071B37] text-[#FFD884] hover:bg-[#102D54]"
                                      title="تعديل"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(st.id)}
                                      className="p-1.5 rounded-lg bg-[#071B37] text-rose-400 hover:bg-rose-950/40"
                                      title="حذف"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: EDITIONS & PUBLISHING */}
            {activeTab === 'editions' && (
              <div className="py-4 space-y-5">
                {/* Create New Weekly Edition Card */}
                <div className="p-5 rounded-2xl bg-[#102D54]/40 border border-[#FFD884]/40">
                  <h3 className="text-sm font-bold text-[#FFD884] mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FFD884]" />
                    <span>إنشاء ونشر أسبوع جديد (Weekly Edition)</span>
                  </h3>
                  
                  <form onSubmit={handleCreateNewWeek} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          عنوان الأسبوع:
                        </label>
                        <input
                          type="text"
                          required
                          value={newWeekTitle}
                          onChange={(e) => setNewWeekTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          رقم الأسبوع:
                        </label>
                        <input
                          type="number"
                          required
                          value={newWeekNum}
                          onChange={(e) => setNewWeekNum(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                          العام الدراسي:
                        </label>
                        <input
                          type="text"
                          required
                          value={newAcademicYear}
                          onChange={(e) => setNewAcademicYear(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#071B37] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] text-xs font-bold shadow-lg cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>نشر الأسبوع الجديد فوراً</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Published History */}
                <div>
                  <h4 className="text-xs font-bold text-[#EFC16C] mb-2">
                    الأسابيع المؤرشفة:
                  </h4>
                  <div className="space-y-2">
                    {allEditions.map((ed) => (
                      <div
                        key={ed.id}
                        className="p-3 rounded-xl bg-[#102D54]/25 border border-[#EFC16C]/25 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#FFF8EA]">{ed.title}</span>
                        <span className="text-[#FFD884]">
                          {ed.isPublished ? 'منشور للعامة' : 'مسودة'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: SCHOOL BRANDING */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveSchoolConfig} className="py-4 space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                    اسم المدرسة:
                  </label>
                  <input
                    type="text"
                    value={localSchool.name}
                    onChange={(e) => setLocalSchool({ ...localSchool, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#102D54] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                    الشعار / الرسالة التحفيزية:
                  </label>
                  <input
                    type="text"
                    value={localSchool.slogan}
                    onChange={(e) => setLocalSchool({ ...localSchool, slogan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#102D54] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                    عنوان الواجهة الرئيسي (Headline):
                  </label>
                  <input
                    type="text"
                    value={localSchool.heroTitle}
                    onChange={(e) => setLocalSchool({ ...localSchool, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#102D54] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFF8EA] mb-1">
                    العنوان الفرعي:
                  </label>
                  <input
                    type="text"
                    value={localSchool.heroSubtitle}
                    onChange={(e) => setLocalSchool({ ...localSchool, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#102D54] border border-[#EFC16C]/40 text-xs text-[#FFF8EA]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] text-xs font-bold shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ إعدادات الهوية</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
