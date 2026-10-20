'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, SchoolConfig } from '@/types';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Award, X } from 'lucide-react';

interface SchoolCinematicIntroProps {
  school: SchoolConfig;
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
}

// Celebration confetti blast
function fireCelebrationConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4A853', '#F3E5AB', '#F97316', '#FFFFFF', '#0F766E'],
      zIndex: 99999,
    });
  } catch {
    // ignore
  }
}

export default function SchoolCinematicIntro({
  school,
  students,
  isOpen,
  onClose,
}: SchoolCinematicIntroProps) {
  // Phase: 'title' (2 seconds) -> 'students' (cycles each student for 2.6s) -> auto close
  const [phase, setPhase] = useState<'title' | 'students'>('title');
  const [currentIndex, setCurrentIndex] = useState(0);

  const effectiveStudents = students && students.length > 0 ? students : [];
  const currentStudent = effectiveStudents[currentIndex] || effectiveStudents[0];

  // 1. Fully Automatic Sequence (Zero Clicks Required)
  useEffect(() => {
    if (!isOpen) return;

    // Reset to title phase on open
    setPhase('title');
    setCurrentIndex(0);

    // Initial fireworks on open
    fireCelebrationConfetti();
    const fireworks2 = setTimeout(() => fireCelebrationConfetti(), 900);

    // Transition automatically to students after 2.2 seconds
    const titleTimer = setTimeout(() => {
      setPhase('students');
      fireCelebrationConfetti();
    }, 2200);

    return () => {
      clearTimeout(fireworks2);
      clearTimeout(titleTimer);
    };
  }, [isOpen]);

  // 2. Automatic student cycle (2.6 seconds per student, hands-free)
  useEffect(() => {
    if (!isOpen || phase !== 'students' || effectiveStudents.length === 0) return;

    const studentTimer = setTimeout(() => {
      if (currentIndex < effectiveStudents.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        fireCelebrationConfetti();
      } else {
        // Automatically close when all students finished, smoothly showing the site
        onClose();
      }
    }, 2600);

    return () => clearTimeout(studentTimer);
  }, [isOpen, phase, currentIndex, effectiveStudents.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#040E16] text-[#FFFBF2] select-none">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC AMBIENT STAGE & SPOTLIGHTS                  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial dark petroleum backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A273D] via-[#051420] to-[#02080D]" />

        {/* Dramatic Golden Overhead Spotlight Cone */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[750px] bg-gradient-to-b from-[#D4A853]/30 via-[#D4A853]/8 to-transparent blur-3xl pointer-events-none" />

        {/* Subtle Stardust Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4A853_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      {/* ======================================================== */}
      {/* 2. SUBTLE TOP SKIP BUTTON (Single Clean Option)          */}
      {/* ======================================================== */}
      <div className="absolute top-4 left-4 z-40">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-[#FFFBF2]/80 hover:text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
        >
          <span>تخطي العرض</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top School & Progress Pill */}
      {phase === 'students' && (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-black/40 border border-[#D4A853]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A853]" />
          <span className="text-xs font-black text-[#D4A853]">
            {currentIndex + 1} / {effectiveStudents.length}
          </span>
          <span className="text-xs text-[#FFFBF2]/70 font-semibold">
            {school.name || 'مدارس نخبة الشمال'}
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CINEMATIC SCENE CONTENT                               */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center">
        
        {/* ---------------------------------------------------- */}
        {/* SCENE 1: CINEMATIC TITLE OVERTURE (2 SECONDS)         */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence mode="wait">
          {phase === 'title' && (
            <motion.div
              key="scene-title"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Glowing School Crest with Rotating Halo */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-[#D4A853]/50"
                />
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border-2 border-[#D4A853] shadow-[0_0_40px_rgba(212,168,83,0.55)] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/school-logo.jpg"
                    alt="شعار مدارس نخبة الشمال"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>
              </div>

              {/* School Name */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-xs sm:text-sm font-extrabold text-[#D4A853] tracking-widest uppercase"
              >
                {school.name || 'مدارس نخبة الشمال الأهلية والعالمية'}
              </motion.p>

              {/* Grand Gilded 3D Title */}
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: 'spring', damping: 12 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#D4A853] to-[#F97316] drop-shadow-[0_4px_30px_rgba(212,168,83,0.5)] leading-tight tracking-tight"
              >
                نجوم الأسبوع
              </motion.h1>

              {/* Subtitle with Laurel Glyphs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A853]/15 border border-[#D4A853]/40 text-[#F3E5AB] text-xs sm:text-sm font-black"
              >
                <Star className="w-3.5 h-3.5 fill-[#D4A853] text-[#D4A853]" />
                <span>كوكبة التميز والتكريم الأسبوعي</span>
                <Star className="w-3.5 h-3.5 fill-[#D4A853] text-[#D4A853]" />
              </motion.div>
            </motion.div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SCENE 2: STUDENT BY STUDENT SPOTLIGHT (AUTOMATED)    */}
          {/* ---------------------------------------------------- */}
          {phase === 'students' && currentStudent && (
            <motion.div
              key={currentStudent.id}
              initial={{ opacity: 0, scale: 0.85, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -25, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-b from-[#0A2335]/95 via-[#061824]/95 to-[#030E16]/95 border-2 border-[#D4A853] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center"
            >
              {/* Top Golden Ornate Corner Filigree */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D4A853]" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#D4A853]" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#D4A853]" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D4A853]" />

              {/* Achievement Badge Ribbon */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4A853]/20 border border-[#D4A853] text-[#D4A853] text-xs font-black mb-4 shadow-sm">
                <Award className="w-4 h-4" />
                <span>{currentStudent.badges?.[0] || 'وسام التميز والتفوق'}</span>
              </div>

              {/* SQUARE STUDENT PORTRAIT (صورة الطالب مربعة بإطار ملكي) */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-2xl p-1 bg-gradient-to-tr from-[#996515] via-[#F3E5AB] to-[#C59B27] shadow-[0_12px_35px_rgba(212,168,83,0.4)]">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-white border-2 border-[#D4A853]">
                  <Image
                    src={currentStudent.avatarUrl || '/images/students/omar-ahmed.jpg'}
                    alt={currentStudent.fullName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Filigree brackets on square frame */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#D4A853]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#D4A853]" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#D4A853]" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#D4A853]" />
              </div>

              {/* Student Full Name */}
              <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#FFE6A3] tracking-tight drop-shadow-md">
                {currentStudent.fullName}
              </h2>

              {/* Grade and Class Section Pill */}
              <div className="mt-1.5 inline-flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#F5EAD4]/80">
                  {currentStudent.gradeLevel}
                </span>
                <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg bg-[#F97316] text-[#FFFBF2] shadow-sm">
                  {currentStudent.className}
                </span>
              </div>

              {/* Praise Reason / Recognition */}
              <p className="mt-3.5 text-xs sm:text-sm text-[#F5EAD4]/90 font-medium leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/10 w-full">
                &ldquo;{currentStudent.recognitionReason || 'الانضباط والحرص الدائم والتميز بين زملائه في الفصل'}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
