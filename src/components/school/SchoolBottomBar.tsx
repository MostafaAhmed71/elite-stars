'use client';

import React from 'react';
import Image from 'next/image';
import { Student } from '@/types';
import { Trophy, GraduationCap, Heart, Award, Clock } from 'lucide-react';

interface SchoolBottomBarProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export default function SchoolBottomBar({
  students,
  onSelectStudent,
}: SchoolBottomBarProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* 2. Values We Honor & 3. Mascot Boy with Speech Bubble */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Values We Honor Card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 text-[#173331] shadow-[0_8px_25px_rgba(11,61,58,0.06)] border-2 border-[#D4A853]/40 flex flex-col justify-between">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <Trophy className="w-5 h-5 text-[#D4A853]" />
            <h3 className="text-lg sm:text-xl font-black text-[#0B3D3A]">
              قيم نكرمها في أبطالنا
            </h3>
            <span className="text-[#D4A853]">⭐</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#E6F4F1] border border-[#0F766E]/15">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0F766E] flex items-center justify-center mb-1.5 shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0B3D3A]">الانضباط</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#E0F2FE] border border-[#0284C7]/20">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0284C7] flex items-center justify-center mb-1.5 shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0B3D3A]">التميز الأكاديمي</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#FFE4E6] border border-[#E11D48]/20">
              <div className="w-9 h-9 rounded-xl bg-white text-[#E11D48] flex items-center justify-center mb-1.5 shadow-sm">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0B3D3A]">السلوك الإيجابي</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#FFF7ED] border border-[#F97316]/20">
              <div className="w-9 h-9 rounded-xl bg-white text-[#F97316] flex items-center justify-center mb-1.5 shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0B3D3A]">المشاركة الفعالة</span>
            </div>
          </div>
        </div>

        {/* Mascot Character with Speech Bubble */}
        <div className="rounded-3xl bg-white p-5 border-2 border-[#D4A853]/40 shadow-[0_8px_25px_rgba(11,61,58,0.06)] flex items-center gap-4 relative overflow-hidden">

          <div className="relative w-22 h-22 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-[#D4A853] bg-[#E6F4F1] shadow-sm">
            <Image
              src="/images/theme-school/mascot_boy.jpg"
              alt="شخصية مدارس نخبة الشمال"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative flex-1 bg-[#FFF7E6] rounded-2xl p-4 shadow-sm text-right border border-[#D4A853]/50">
            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#FFF7E6]" />

            <p className="text-xs sm:text-sm font-black text-[#0B3D3A] leading-relaxed">
              &ldquo; لأن التميز .. لا يبدأ من الكبار .. بل من أطفالنا. &rdquo;
            </p>
            <div className="mt-1.5 text-xs font-extrabold text-[#F97316] flex items-center gap-1">
              <span>مدارس نخبة الشمال الأهلية</span>
              <span>🌟</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Leadership & Patronage Honors Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#062824] via-[#093530] to-[#041A18] border-2 border-[#D4A853] p-3 sm:p-5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-[#D4A853]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 max-w-3xl mx-auto">
          {/* Right (اليمين): Executive Director */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-[#031A17]/85 border border-[#D4A853]/60 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-sm">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#996515] to-[#FFD884] p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[8px] sm:rounded-[10px] bg-[#0A3430] flex items-center justify-center text-[#FFD884]">
                <Award className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="text-right min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-[#FFD884] block truncate">
                المدير التنفيذي
              </span>
              <span className="text-[11px] sm:text-base font-black text-white block truncate">
                أ. عيد بن قيران العنزي
              </span>
            </div>
          </div>

          {/* Left (اليسار): Activity Leader */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-[#031A17]/85 border border-[#D4A853]/60 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-sm">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#996515] to-[#FFD884] p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[8px] sm:rounded-[10px] bg-[#0A3430] flex items-center justify-center text-[#FFD884]">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="text-right min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-[#FFD884] block truncate">
                رائد النشاط
              </span>
              <span className="text-[11px] sm:text-base font-black text-white block truncate">
                أ. طه شوقي
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
