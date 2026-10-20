'use client';

import React from 'react';
import Image from 'next/image';
import { Student } from '@/types';
import { SchoolClassInfo, SCHOOL_CLASSES } from '@/lib/schoolData';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolClassroomShowcaseProps {
  currentClass: SchoolClassInfo;
  classes: SchoolClassInfo[];
  students: Student[];
  onSelectClass: (classInfo: SchoolClassInfo) => void;
  onSelectStudent: (student: Student) => void;
  onBackToGrid: () => void;
}

export default function SchoolClassroomShowcase({
  currentClass,
  classes = SCHOOL_CLASSES,
  students,
  onSelectClass,
  onSelectStudent,
  onBackToGrid,
}: SchoolClassroomShowcaseProps) {
  const currentIndex = classes.findIndex((c) => c.id === currentClass.id);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + classes.length) % classes.length;
    onSelectClass(classes[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % classes.length;
    onSelectClass(classes[nextIdx]);
  };

  const classStudents = students.filter(
    (s) => s.className === currentClass.classSection || s.gradeLevel.includes(currentClass.gradeName)
  ).slice(0, 2);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-white p-3 rounded-2xl border border-[#0B3D3A]/10 shadow-sm">
        <button
          onClick={onBackToGrid}
          className="flex items-center gap-2 text-xs font-black text-[#0B3D3A] hover:text-[#FFF7E6] bg-[#E6F4F1] hover:bg-[#0B3D3A] px-4 py-2 rounded-xl border border-[#0F766E]/20 transition-all cursor-pointer shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكل الفصول</span>
        </button>

        {/* Breadcrumb Path in Petroleum & Gold */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B3D3A] truncate">
          <span className="text-[#4B6B67]">{currentClass.level}</span>
          <span className="text-[#D4A853]">›</span>
          <span className="text-[#0B3D3A] font-extrabold">{currentClass.gradeName}</span>
          <span className="text-[#D4A853]">›</span>
          <span className="px-3 py-0.5 rounded-lg bg-[#F97316] text-[#FFF7E6] font-black shadow-sm">
            {currentClass.classSection}
          </span>
        </div>
      </div>

      {/* Main Classroom Stage */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A853]/40 shadow-xl bg-[#0B3D3A]">
        
        <div className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px]">
          <Image
            src="/images/theme-school/classroom_bg.jpg"
            alt="بيئة الفصل المدرسي"
            fill
            className="object-cover brightness-[0.75] contrast-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/50 to-transparent" />

          {/* Chalkboard Title Banner in Classroom */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-center px-4 w-full max-w-md">
            <motion.div
              key={currentClass.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-2xl bg-[#0B3D3A]/90 border-2 border-[#D4A853] backdrop-blur-md shadow-lg w-full"
            >
              <Sparkles className="w-4 h-4 text-[#D4A853]" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FFF7E6] tracking-wide">
                {currentClass.gradeName} • <span className="text-[#D4A853]">{currentClass.classSection}</span>
              </h2>
              <Star className="w-4 h-4 text-[#F97316] fill-[#F97316]" />
            </motion.div>
          </div>

          {/* Navigation Arrows for Carousel */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-[#F97316] text-[#0B3D3A] hover:text-[#FFF7E6] border-2 border-[#D4A853] flex items-center justify-center transition-all shadow-xl cursor-pointer backdrop-blur-md"
            aria-label="الفصل السابق"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-[#F97316] text-[#0B3D3A] hover:text-[#FFF7E6] border-2 border-[#D4A853] flex items-center justify-center transition-all shadow-xl cursor-pointer backdrop-blur-md"
            aria-label="الفصل التالي"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Featured Students Cards inside the stage */}
          <div className="absolute inset-x-6 sm:inset-x-16 bottom-6 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentClass.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3 sm:gap-6 justify-center"
              >
                {classStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectStudent(student)}
                    className="relative rounded-3xl bg-white/95 border-2 border-[#D4A853] p-3 sm:p-5 text-center cursor-pointer shadow-2xl backdrop-blur-md group transition-all"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#F97316] p-0.5 shadow-md flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>

                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mt-2 rounded-2xl overflow-hidden border-2 border-[#D4A853] shadow-md bg-white">
                      <Image
                        src={student.avatarUrl || '/images/students/omar-ahmed.jpg'}
                        alt={student.fullName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="mt-3 text-sm sm:text-base md:text-lg font-black text-[#0B3D3A] group-hover:text-[#0F766E] transition-colors truncate">
                      {student.fullName}
                    </h3>

                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#0F766E]/20 text-[11px] sm:text-xs font-black text-[#0B3D3A] shadow-sm">
                      <Award className="w-3.5 h-3.5 text-[#D4A853]" />
                      <span>{student.badges?.[0] || 'نجم الأسبوع المتميز'}</span>
                    </div>

                    <div className="mt-2 text-[10px] text-[#4B6B67] font-semibold">
                      انقر لعرض ومشاركة وسام التكريم ✨
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}
