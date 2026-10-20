'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Student, WeeklyEdition, SchoolConfig, CategoryType } from '@/types';
import { CATEGORIES, INITIAL_EDITION, INITIAL_SCHOOL_CONFIG } from '@/lib/constants';
import {
  getStoredSchoolConfig,
  saveStoredSchoolConfig,
  getStoredEditions,
  getActiveEdition,
  getStoredStudents,
  saveStoredStudents,
  createNewEdition,
} from '@/lib/storage';
import {
  fetchSupabaseData,
  saveStudentToSupabase,
  deleteStudentFromSupabase,
} from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Shield,
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
  ArrowRight,
  ExternalLink,
  Cloud,
  CloudCheck,
} from 'lucide-react';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'students' | 'editions' | 'branding'>('students');

  // Core Data
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<SchoolConfig>(INITIAL_SCHOOL_CONFIG);
  const [editions, setEditions] = useState<WeeklyEdition[]>([INITIAL_EDITION]);
  const [activeEdition, setActiveEdition] = useState<WeeklyEdition>(INITIAL_EDITION);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  // Edit / Add Form State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Edition Form State
  const [newWeekTitle, setNewWeekTitle] = useState('الأسبوع التاسع - الفصل الأول 1446هـ');
  const [newWeekNum, setNewWeekNum] = useState(9);
  const [newAcademicYear, setNewAcademicYear] = useState('1446هـ');
  const [toastMessage, setToastMessage] = useState('');

  // Load data on mount: First local cache, then fetch real Supabase data if available
  useEffect(() => {
    setMounted(true);
    setSchool(getStoredSchoolConfig());
    setEditions(getStoredEditions());
    setActiveEdition(getActiveEdition());
    setStudents(getStoredStudents());

    fetchSupabaseData().then((res) => {
      if (res.isRealData && res.students.length > 0) {
        setSchool(res.school);
        setEditions(res.editions);
        setActiveEdition(res.activeEdition);
        setStudents(res.students);
        setIsUsingRealData(true);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin' || passcode === 'admin123' || passcode === '123456') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة (جرّب: admin123)');
    }
  };

  const handleSaveStudentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    let updated: Student[];
    if (isAddingNew) {
      updated = [editingStudent, ...students];
      setIsAddingNew(false);
    } else {
      updated = students.map((s) => (s.id === editingStudent.id ? editingStudent : s));
    }

    setStudents(updated);
    saveStoredStudents(updated, activeEdition.id);

    // Save directly to Supabase
    const res = await saveStudentToSupabase(editingStudent, activeEdition.id);
    setEditingStudent(null);

    if (res.success) {
      showToast('تم حفظ الطالب في قاعدة بيانات سوبابيز بنجاح ☁️');
    } else if (res.error?.includes('row-level security')) {
      showToast('تم الحفظ محلياً. لتفعيل الحفظ في سوبابيز، يرجى تشغيل ملف fix_rls_and_seed.sql في لوحة Supabase SQL Editor.');
    } else {
      showToast('تم حفظ الطالب بنجاح');
    }
  };

  const handleSyncAllToSupabase = async () => {
    showToast('جاري رفع ومزامنة الطلاب مع قاعدة بيانات سوبابيز...');
    let successCount = 0;
    let rlsBlocked = false;

    for (const st of students) {
      const res = await saveStudentToSupabase(st, activeEdition.id);
      if (res.success) {
        successCount++;
      } else if (res.error?.includes('row-level security')) {
        rlsBlocked = true;
      }
    }

    if (rlsBlocked) {
      showToast('⚠️ قاعدة بيانات سوبابيز ترفض الكتابة بسبب قيود RLS. يرجى تنفيذ ملف fix_rls_and_seed.sql في لوحة Supabase SQL Editor.');
    } else if (successCount > 0) {
      showToast(`تم رفع وتخزين ${successCount} طالباً في سوبابيز بنجاح! ☁️`);
      setIsUsingRealData(true);
    } else {
      showToast('تعذر الاتصال بقاعدة البيانات.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب من لوحة الشرف؟')) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      saveStoredStudents(updated);
      await deleteStudentFromSupabase(id);
      showToast('تم حذف الطالب بنجاح');
    }
  };

  const handleCreateNewWeek = (e: React.FormEvent) => {
    e.preventDefault();
    const newEd = createNewEdition({
      title: newWeekTitle,
      weekNumber: Number(newWeekNum),
      academicYear: newAcademicYear,
    });
    setEditions(getStoredEditions());
    setActiveEdition(newEd);
    showToast('تم نشر الأسبوع الجديد بنجاح!');
  };

  const handleSaveSchoolConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSchoolConfig(school);
    showToast('تم تحديث بيانات وهوية المدرسة بنجاح!');
  };

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#071D2C] text-[#FFFBF2] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FF7A00]/25 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0E334D] border-2 border-[#FF7A00] flex items-center justify-center text-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.3)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#FFFBF2]">
                لوحة الإدارة المدرسية • نجوم الأسبوع
              </h1>
              <p className="text-xs text-[#FF9225]">
                {school.name} — إدارة تكريم الطلاب ونشر الأسابيع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#FF7A00]/40 text-xs font-bold text-[#FFFBF2] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>عرض الواجهة العامة</span>
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            )}
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#0E334D] border-2 border-[#FF7A00] text-[#FFFBF2] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-[#0A2538] border-2 border-[#FF7A00]/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#0E334D] border border-[#FF7A00] flex items-center justify-center text-[#FF7A00] mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-[#FFFBF2] mb-1">
              منطقة الإدارة المدرسية
            </h2>
            <p className="text-xs text-[#F5EAD4]/70 mb-5">
              يرجى إدخال رمز المرور للوصول إلى لوحة التحكم
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="رمز المرور (الافتراضي: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#071D2C] border-2 border-[#FF7A00]/40 text-[#FFFBF2] text-center text-sm focus:outline-none focus:border-[#FF7A00]"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-400 font-medium">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] hover:from-[#FF9225] hover:to-[#FF7A00] text-[#071D2C] font-black text-sm shadow-lg cursor-pointer transition-all"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            
            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-[#FF7A00]/25 pb-3">
              <button
                onClick={() => {
                  setActiveTab('students');
                  setEditingStudent(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] shadow-md'
                    : 'text-[#F5EAD4]/75 hover:text-[#FFFBF2] hover:bg-[#0E334D]'
                }`}
              >
                إدارة الطلاب ({students.length})
              </button>

              <button
                onClick={() => setActiveTab('editions')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'editions'
                    ? 'bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] shadow-md'
                    : 'text-[#F5EAD4]/75 hover:text-[#FFFBF2] hover:bg-[#0E334D]'
                }`}
              >
                نشر الأسبوع الحالي
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'branding'
                    ? 'bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] shadow-md'
                    : 'text-[#F5EAD4]/75 hover:text-[#FFFBF2] hover:bg-[#0E334D]'
                }`}
              >
                هوية المدرسة
              </button>
            </div>

            {/* TAB 1: STUDENTS */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                {editingStudent ? (
                  /* Form: Edit or Add Student */
                  <form onSubmit={handleSaveStudentForm} className="bg-[#0A2538] p-5 sm:p-6 rounded-3xl border-2 border-[#FF7A00]/40 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#FF7A00]/25">
                      <h3 className="text-base font-black text-[#FF9225]">
                        {isAddingNew ? 'إضافة طالب جديد' : `تعديل بيانات: ${editingStudent.fullName}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="text-xs text-[#F5EAD4]/70 hover:text-[#FFFBF2] cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                          اسم الطالب الرباعي:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingStudent.fullName}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-sm text-[#FFFBF2] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>

                      {/* Class */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                          الفصل / الشعبة:
                        </label>
                        <select
                          value={editingStudent.className}
                          onChange={(e) => {
                            const val = e.target.value;
                            let autoGrade = editingStudent.gradeLevel;
                            if (val.startsWith('1')) autoGrade = 'الصف الأول الابتدائي';
                            else if (val.startsWith('2')) autoGrade = 'الصف الثاني الابتدائي';
                            else if (val.startsWith('3')) autoGrade = 'الصف الثالث الابتدائي';
                            setEditingStudent({ ...editingStudent, className: val, gradeLevel: autoGrade });
                          }}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-sm text-[#FFFBF2] focus:outline-none cursor-pointer"
                        >
                          <option value="1/أ">الصف الأول - 1/أ</option>
                          <option value="1/ب">الصف الأول - 1/ب</option>
                          <option value="2/أ">الصف الثاني - 2/أ</option>
                          <option value="2/ب">الصف الثاني - 2/ب</option>
                          <option value="3/أ">الصف الثالث - 3/أ</option>
                          <option value="3/ب">الصف الثالث - 3/ب</option>
                        </select>
                      </div>

                      {/* Grade */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                          المرحلة الدراسية:
                        </label>
                        <select
                          value={editingStudent.gradeLevel}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, gradeLevel: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-sm text-[#FFFBF2] focus:outline-none cursor-pointer"
                        >
                          <option>الصف الأول الابتدائي</option>
                          <option>الصف الثاني الابتدائي</option>
                          <option>الصف الثالث الابتدائي</option>
                          <option>الصف الرابع الابتدائي</option>
                          <option>الصف الخامس الابتدائي</option>
                          <option>الصف السادس الابتدائي</option>
                        </select>
                      </div>

                      {/* Distinction Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
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
                          className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-sm text-[#FFFBF2] focus:outline-none cursor-pointer"
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

                      {/* Praise Reason */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                          سبب التكريم ورسالة التهنئة (تظهر في بطاقة الطالب):
                        </label>
                        <textarea
                          rows={2}
                          value={editingStudent.recognitionReason}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              recognitionReason: e.target.value,
                            })
                          }
                          placeholder="مثال: على انضباطك وحرصك الدائم وكونك قدوة لزملائك في الفصل."
                          className="w-full px-3 py-2 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-sm text-[#FFFBF2] focus:outline-none focus:border-[#FF7A00]"
                        />
                      </div>

                      {/* Photo Upload */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                          صورة الطالب:
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#FF7A00]">
                            <Image
                              src={editingStudent.avatarUrl || '/images/students/omar-ahmed.jpg'}
                              alt="صورة الطالب"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#0E334D] border border-[#FF7A00] text-xs font-bold text-[#FF9225] hover:bg-[#FF7A00] hover:text-[#071D2C] transition-all flex items-center gap-1.5">
                            <Upload className="w-4 h-4" />
                            <span>رفع صورة جديدة</span>
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

                    <div className="flex justify-end gap-3 pt-3 border-t border-[#FF7A00]/25">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl bg-[#071D2C] text-xs font-bold text-[#FFFBF2]"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] text-xs font-black shadow-md cursor-pointer"
                      >
                        حفظ بيانات الطالب
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-xs text-[#FF9225]">
                          الطلاب المسجلون: <span className="font-bold text-[#FFFBF2]">{students.length}</span>
                        </div>
                        <span className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-bold border ${
                          isUsingRealData
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                            : 'bg-teal-950/80 text-teal-300 border-teal-500/40'
                        }`}>
                          {isUsingRealData ? '● متصل بقاعدة بيانات سوبابيز (بيانات حقيقية)' : '● تخزين محلي معتمد (بيانات حقيقية فقط)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleSyncAllToSupabase}
                          title="رفع وحفظ جميع الطلاب الحاليين إلى قاعدة بيانات سوبابيز"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
                        >
                          <Cloud className="w-3.5 h-3.5" />
                          <span>مزامنة سوبابيز ☁️</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingNew(true);
                            setEditingStudent({
                              id: generateUUID(),
                              fullName: '',
                              gradeLevel: 'الصف الأول الابتدائي',
                              className: '1/أ',
                              avatarUrl: '/images/students/omar-ahmed.jpg',
                              category: 'التفوق الأكاديمي',
                              clusterGroup: 1,
                              recognitionReason: 'الانضباط والحرص الدائم والتميز بين زملائه في الفصل.',
                              badges: ['الانضباط والالتزام', 'قدوة حسنة', 'مثابرة'],
                              position: { x: 50, y: 50 },
                            });
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] text-xs font-black cursor-pointer shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة طالب جديد</span>
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="border border-[#FF7A00]/30 rounded-2xl overflow-hidden bg-[#0A2538]">
                      <div className="max-h-[60vh] overflow-y-auto">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-[#0E334D] text-[#FF9225] font-black sticky top-0">
                            <tr>
                              <th className="p-3">الطالب</th>
                              <th className="p-3">الصف</th>
                              <th className="p-3">المجال</th>
                              <th className="p-3">وسام التميز</th>
                              <th className="p-3 text-center">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#FF7A00]/15">
                            {students.map((st) => (
                              <tr key={st.id} className="hover:bg-[#0E334D]/60 transition-colors">
                                <td className="p-3 flex items-center gap-2.5">
                                  <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#FF7A00] shrink-0">
                                    <Image
                                      src={st.avatarUrl || '/images/students/omar-ahmed.jpg'}
                                      alt={st.fullName}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="font-bold text-[#FFFBF2]">
                                    {st.fullName}
                                  </span>
                                </td>
                                <td className="p-3 text-[#F5EAD4]">{st.className}</td>
                                <td className="p-3 text-[#FF9225]">{st.category}</td>
                                <td className="p-3 text-[#FFFBF2] font-semibold">{st.badges?.[0] || 'الانضباط والالتزام'}</td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        setIsAddingNew(false);
                                        setEditingStudent(st);
                                      }}
                                      className="p-1.5 rounded-lg bg-[#071D2C] text-[#FF9225] hover:bg-[#FF7A00] hover:text-[#071D2C] transition-all cursor-pointer"
                                      title="تعديل"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(st.id)}
                                      className="p-1.5 rounded-lg bg-[#071D2C] text-rose-400 hover:bg-rose-900/60 transition-all cursor-pointer"
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

            {/* TAB 2: EDITIONS */}
            {activeTab === 'editions' && (
              <div className="bg-[#0A2538] p-5 sm:p-6 rounded-3xl border border-[#FF7A00]/30 space-y-5 max-w-xl">
                <h3 className="text-base font-black text-[#FF9225]">
                  نشر وتحديث أسبوع التكريم
                </h3>

                <form onSubmit={handleCreateNewWeek} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                      عنوان الأسبوع:
                    </label>
                    <input
                      type="text"
                      required
                      value={newWeekTitle}
                      onChange={(e) => setNewWeekTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-xs text-[#FFFBF2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                        رقم الأسبوع:
                      </label>
                      <input
                        type="number"
                        required
                        value={newWeekNum}
                        onChange={(e) => setNewWeekNum(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-xs text-[#FFFBF2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                        العام الدراسي:
                      </label>
                      <input
                        type="text"
                        required
                        value={newAcademicYear}
                        onChange={(e) => setNewAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-xs text-[#FFFBF2]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] font-black text-xs sm:text-sm cursor-pointer shadow-lg"
                  >
                    نشر الأسبوع وتحديث الواجهة فوراً
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: BRANDING */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveSchoolConfig} className="bg-[#0A2538] p-5 sm:p-6 rounded-3xl border border-[#FF7A00]/30 space-y-4 max-w-lg">
                <h3 className="text-base font-black text-[#FF9225]">
                  إعدادات وهوية المدرسة
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                    اسم المدرسة:
                  </label>
                  <input
                    type="text"
                    value={school.name}
                    onChange={(e) => setSchool({ ...school, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-xs text-[#FFFBF2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFFBF2] mb-1">
                    الشعار / الرسالة التحفيزية:
                  </label>
                  <input
                    type="text"
                    value={school.slogan}
                    onChange={(e) => setSchool({ ...school, slogan: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071D2C] border border-[#FF7A00]/40 text-xs text-[#FFFBF2]"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-[#071D2C] font-black text-xs shadow-md cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
