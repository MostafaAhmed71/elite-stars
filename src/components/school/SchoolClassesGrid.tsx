'use client';

import React from 'react';
import Image from 'next/image';
import { Student } from '@/types';
import { SchoolClassInfo, SCHOOL_CLASSES, isStudentInClass } from '@/lib/schoolData';
import { Users, ChevronLeft, Sparkles, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolClassesGridProps {
  classes: SchoolClassInfo[];
  students: Student[];
  onSelectClass: (classInfo: SchoolClassInfo) => void;
  onSelectStudent: (student: Student) => void;
}

export default function SchoolClassesGrid({
  classes = SCHOOL_CLASSES,
  students,
  onSelectClass,
  onSelectStudent,
}: SchoolClassesGridProps) {
  const getStudentsForClass = (classSection: string, gradeName: string) => {
    return students.filter((s) => isStudentInClass(s, classSection, gradeName)).slice(0, 2);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6F4F1] border border-[#0F766E]/30 flex items-center justify-center text-[#0F766E] shadow-sm">
            <Award className="w-5 h-5 text-[#D4A853]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0B3D3A]">
              لوحة شرف الفصول الدراسية
            </h3>
            <p className="text-xs sm:text-sm text-[#4B6B67] font-semibold mt-0.5">
              انقر على أي طالب لاستعراض شهادة التكريم الرسمية ومشاركتها
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] border border-[#0F766E]/20 text-xs font-bold text-[#0B3D3A]">
          <Star className="w-3.5 h-3.5 fill-[#D4A853] text-[#D4A853]" />
          <span>6 فصول متميزة</span>
        </span>
      </div>

      {/* Grid of Classrooms (1 col on small phones, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {classes.map((cls, index) => {
          const classStudents = getStudentsForClass(cls.classSection, cls.gradeName);

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-3xl bg-white border-2 border-[#D4A853]/40 hover:border-[#0F766E] shadow-[0_8px_25px_rgba(11,61,58,0.06)] hover:shadow-[0_16px_35px_rgba(11,61,58,0.12)] transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Top Banner Header with Class Name & Section Pill */}
              <div className="relative w-full h-24 sm:h-28 overflow-hidden bg-[#0B3D3A] flex items-start justify-between p-3.5 border-b border-[#D4A853]/30">
                <Image
                  src="/images/theme-school/classroom_card_banner.jpg"
                  alt={`فصل ${cls.gradeName} - ${cls.classSection}`}
                  fill
                  className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/70 to-transparent" />

                {/* Grade Name Header Text */}
                <div className="relative z-10 text-right">
                  <span className="text-[11px] font-bold text-[#D4A853] block leading-tight">
                    {cls.level}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-[#FFF7E6] drop-shadow-sm mt-0.5">
                    {cls.gradeName}
                  </h4>
                </div>

                {/* Section Pill e.g. "1/أ" */}
                <div className="relative z-10 px-3 py-1 rounded-xl bg-[#F97316] text-[#FFF7E6] font-black text-xs sm:text-sm shadow-md border border-white/20">
                  {cls.classSection}
                </div>
              </div>

              {/* Student Avatars Showcase (The 2 Stars of the Class) */}
              <div className="p-4 sm:p-5 flex items-start justify-around gap-3 my-auto bg-[#FDFBF7]">
                {classStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className="flex-1 flex flex-col items-center group/student cursor-pointer transition-transform hover:scale-105 text-center"
                    title={`عرض شهادة وتكريم ${student.fullName}`}
                  >
                    {/* Gold & Orange Ring Avatar Frame */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-[#D4A853] via-[#F97316] to-[#FFF7E6] shadow-md group-hover/student:shadow-[0_0_18px_rgba(249,115,22,0.5)] transition-all">
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-white border border-[#D4A853]/30">
                        <Image
                          src={student.avatarUrl || '/images/students/omar-ahmed.jpg'}
                          alt={student.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-md">
                        <Star className="w-3 h-3 fill-white" />
                      </span>
                    </div>

                    {/* Student Name in High Contrast Dark Petroleum #173331 */}
                    <span className="mt-2.5 text-xs sm:text-sm font-black text-[#173331] group-hover/student:text-[#0F766E] transition-colors truncate max-w-[110px] block">
                      {student.fullName}
                    </span>

                    {/* Badge Pill */}
                    <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4F1] text-[#0B3D3A] border border-[#0F766E]/20 truncate max-w-[110px] block">
                      {student.badges?.[0] || 'نجم متميز'}
                    </span>
                  </button>
                ))}

                {classStudents.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#4B6B67] font-medium">
                    سيتم إعلان النجوم قريباً
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3.5 bg-white flex items-center justify-between gap-2.5 border-t border-[#0B3D3A]/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E] bg-[#E6F4F1] px-2.5 py-1.5 rounded-xl border border-[#0F766E]/20">
                  <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>
                    {classStudents.length === 0
                      ? 'لا يوجد نجوم حالياً'
                      : classStudents.length === 1
                      ? 'نجم واحد'
                      : classStudents.length === 2
                      ? 'نجمان'
                      : `${classStudents.length} نجوم`}
                  </span>
                </div>

                <button
                  onClick={() => onSelectClass(cls)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#0F766E] hover:bg-[#0B3D3A] text-xs font-black text-[#FFF7E6] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>استعراض الفصل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
