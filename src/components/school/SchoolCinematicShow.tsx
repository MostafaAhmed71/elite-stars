'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Student, SchoolConfig, WeeklyEdition } from '@/types';
import { SCHOOL_CLASSES, SchoolClassInfo, isStudentInClass } from '@/lib/schoolData';
import { Star, Award, X, Sparkles, Trophy, Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';

interface SchoolCinematicShowProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
}

interface ClassAwardGroup {
  classInfo: SchoolClassInfo;
  students: Student[];
}

export default function SchoolCinematicShow({
  school,
  edition,
  students,
  isOpen,
  onClose,
}: SchoolCinematicShowProps) {
  const shouldReduceMotion = useReducedMotion();

  // 1. Audio synthesis state (Muted by default to respect browser autoplay policy)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle orchestral chime / fanfare chord
  const playSound = useCallback((frequency = 587.33, endFreq = 880, duration = 0.9) => {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.4);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isAudioEnabled]);

  // 2. Data-Driven Grouping: Group students strictly by their assigned class
  const classGroups = useMemo<ClassAwardGroup[]>(() => {
    if (!students || students.length === 0) return [];
    
    return SCHOOL_CLASSES.map((cls) => {
      const matched = students.filter((s) =>
        isStudentInClass(s, cls.classSection, cls.gradeName)
      );
      return {
        classInfo: cls,
        students: matched,
      };
    }).filter((group) => group.students.length > 0); // Only include classes with honored stars
  }, [students]);

  // All featured students for Hall of Fame
  const allHonoredStudents = useMemo(() => {
    return classGroups.flatMap((g) => g.students);
  }, [classGroups]);

  // Scene state:
  // 'opening' (Scene 1: Grand Opening Prologue, ~2.8s)
  // 'classroom' (Scene 2: Classroom Sequential Awards, ~7.5s per class)
  // 'hall_of_fame' (Scene 3: Hall of Fame Mosaic, ~4.5s)
  // 'finale' (Scene 4: Grand Star Finale & Transition, ~1.5s)
  const [scene, setScene] = useState<'opening' | 'classroom' | 'hall_of_fame' | 'finale'>('opening');
  const [currentClassIndex, setCurrentClassIndex] = useState(0);

  // Classroom Sequential Substep Choreography:
  // 'intro' (Classroom name & banner entrance, ~1.4s)
  // 'student_1' (Spotlight on Student 1 + Reveal + Name beneath, ~2.2s)
  // 'student_2' (Spotlight shifts to Student 2 + Reveal + Name beneath, ~2.2s)
  // 'group' (Celebratory group star + "نجوم هذا الفصل" banner, ~2.0s)
  const [classSubstep, setClassSubstep] = useState<'intro' | 'student_1' | 'student_2' | 'group'>('intro');

  // Active class for Scene 2
  const currentClassGroup = classGroups[currentClassIndex] || classGroups[0];

  // Timing references
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const classChoreographyRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timers helper
  const clearClassTimers = () => {
    classChoreographyRef.current.forEach((t) => clearTimeout(t));
    classChoreographyRef.current = [];
  };

  // Support direct scene and step inspection via query parameters for verification
  const [isManualInspection, setIsManualInspection] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get('scene');
    const stepParam = params.get('step');
    const classIdx = params.get('class');

    if (sceneParam === 'opening' || sceneParam === 'classroom' || sceneParam === 'hall_of_fame' || sceneParam === 'finale') {
      setScene(sceneParam);
      setIsManualInspection(true);
    }
    if (stepParam === 'intro' || stepParam === 'student_1' || stepParam === 'student_2' || stepParam === 'group') {
      setClassSubstep(stepParam);
      setIsManualInspection(true);
    }
    if (classIdx !== null && !isNaN(Number(classIdx))) {
      setCurrentClassIndex(Number(classIdx));
    }
  }, []);

  // Auto-close if no published data or empty classes
  useEffect(() => {
    if (isOpen && classGroups.length === 0) {
      onClose();
    }
  }, [isOpen, classGroups.length, onClose]);

  // Master Choreography Director (Broadcast Automation)
  useEffect(() => {
    if (!isOpen || classGroups.length === 0 || isManualInspection) return;

    if (scene === 'opening') {
      playSound(440, 659.25, 1.2);
      timerRef.current = setTimeout(() => {
        setCurrentClassIndex(0);
        setScene('classroom');
      }, 2800);
    } else if (scene === 'classroom') {
      clearClassTimers();
      setClassSubstep('intro');

      const studentCount = currentClassGroup?.students?.length || 0;

      if (studentCount >= 2) {
        // Step 1: Student 1 Spotlight Reveal after 1.4s
        const t1 = setTimeout(() => {
          setClassSubstep('student_1');
          playSound(523.25, 783.99, 1.0); // C5 -> G5 chime
        }, 1400);

        // Step 2: Student 2 Spotlight Reveal after 3.6s
        const t2 = setTimeout(() => {
          setClassSubstep('student_2');
          playSound(587.33, 880, 1.0); // D5 -> A5 chime
        }, 3600);

        // Step 3: Full Classroom Celebratory Group Moment at 5.6s
        const t3 = setTimeout(() => {
          setClassSubstep('group');
          playSound(659.25, 1046.5, 1.4); // Golden fanfare
        }, 5600);

        // Step 4: Advance to next class or Hall of Fame at 7.6s
        const t4 = setTimeout(() => {
          if (currentClassIndex < classGroups.length - 1) {
            setCurrentClassIndex((prev) => prev + 1);
          } else {
            setScene('hall_of_fame');
            playSound(587.33, 880, 1.3);
          }
        }, 7600);

        classChoreographyRef.current = [t1, t2, t3, t4];
      } else if (studentCount === 1) {
        // Solo Student Choreography
        const t1 = setTimeout(() => {
          setClassSubstep('student_1');
          playSound(523.25, 783.99, 1.0);
        }, 1400);

        const t2 = setTimeout(() => {
          setClassSubstep('group');
          playSound(659.25, 1046.5, 1.4);
        }, 3800);

        const t3 = setTimeout(() => {
          if (currentClassIndex < classGroups.length - 1) {
            setCurrentClassIndex((prev) => prev + 1);
          } else {
            setScene('hall_of_fame');
            playSound(587.33, 880, 1.3);
          }
        }, 5800);

        classChoreographyRef.current = [t1, t2, t3];
      }
    } else if (scene === 'hall_of_fame') {
      // Scene 3: Hall of Fame plays for 4.5s
      timerRef.current = setTimeout(() => {
        setScene('finale');
        playSound(659.25, 987.77, 1.4);
      }, 4500);
    } else if (scene === 'finale') {
      // Scene 4: Grand Star Finale plays for 1.5s, then seamlessly dissolves into main platform
      timerRef.current = setTimeout(() => {
        onClose();
      }, 1500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearClassTimers();
    };
  }, [isOpen, scene, currentClassIndex, classGroups, currentClassGroup, onClose, playSound]);

  // Progress Calculation for the top timeline bar
  const totalSteps = 2 + classGroups.length;
  const currentStep =
    scene === 'opening'
      ? 1
      : scene === 'classroom'
      ? 2 + currentClassIndex
      : scene === 'hall_of_fame'
      ? totalSteps
      : totalSteps;
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  // Manual Next/Prev Navigation during Classroom Scene
  const handleNextClass = () => {
    if (scene === 'classroom') {
      clearClassTimers();
      if (currentClassIndex < classGroups.length - 1) {
        setCurrentClassIndex((prev) => prev + 1);
      } else {
        setScene('hall_of_fame');
      }
    }
  };

  const handlePrevClass = () => {
    if (scene === 'classroom' && currentClassIndex > 0) {
      clearClassTimers();
      setCurrentClassIndex((prev) => prev - 1);
    }
  };

  if (!isOpen || classGroups.length === 0) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[99999] overflow-hidden bg-[#041110] text-[#FFF7E6] select-none flex flex-col justify-between"
      style={{ isolation: 'isolate' }}
      dir="rtl"
    >
      {/* ======================================================== */}
      {/* 1. MASTER VIRTUAL AWARDS STAGE ENVIRONMENT               */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer A: Multi-depth Deep Petroleum Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B0A] via-[#071F1E] to-[#0A2E2C]" />

        {/* Layer B: Grand Architectural Proscenium Gold Arches */}
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldArchGradFinal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A853" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F3E5AB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#996515" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Grand Neoclassical Stage Pillars (Left & Right) */}
          <rect x="0" y="0" width="120" height="900" fill="#041413" />
          <line x1="120" y1="0" x2="120" y2="900" stroke="url(#goldArchGradFinal)" strokeWidth="3" />
          <rect x="1320" y="0" width="120" height="900" fill="#041413" />
          <line x1="1320" y1="0" x2="1320" y2="900" stroke="url(#goldArchGradFinal)" strokeWidth="3" />

          {/* Majestic Top Stage Arch Profile */}
          <path
            d="M 120 0 Q 720 120 1320 0 L 1320 30 Q 720 150 120 30 Z"
            fill="url(#goldArchGradFinal)"
          />
        </svg>

        {/* Layer C: Dynamic Twin Volumetric Moving Spotlights (Reacts to Substep) */}
        {/* Left Spotlight (Focuses on Right Student in RTL) */}
        <motion.div
          animate={
            scene === 'classroom' && classSubstep === 'student_1'
              ? { opacity: 0.95, rotate: -18, scale: 1.1 }
              : scene === 'classroom' && classSubstep === 'student_2'
              ? { opacity: 0.35, rotate: -24, scale: 0.9 }
              : { opacity: [0.55, 0.85, 0.6], rotate: [-24, -16, -24], scale: 1 }
          }
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/4 w-[280px] sm:w-[500px] h-[950px] bg-gradient-to-b from-[#D4A853]/40 via-[#D4A853]/15 to-transparent blur-3xl transform origin-top pointer-events-none"
        />

        {/* Right Spotlight (Focuses on Left Student in RTL) */}
        <motion.div
          animate={
            scene === 'classroom' && classSubstep === 'student_2'
              ? { opacity: 0.95, rotate: 18, scale: 1.1 }
              : scene === 'classroom' && classSubstep === 'student_1'
              ? { opacity: 0.35, rotate: 24, scale: 0.9 }
              : { opacity: [0.6, 0.9, 0.65], rotate: [24, 16, 24], scale: 1 }
          }
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute -top-32 right-1/4 w-[280px] sm:w-[500px] h-[950px] bg-gradient-to-b from-[#D4A853]/40 via-[#D4A853]/15 to-transparent blur-3xl transform origin-top pointer-events-none"
        />

        {/* Layer D: Perspective Stage Floor Dais with Glossy Reflection */}
        <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 bg-gradient-to-t from-[#020A09] via-[#051C1B]/95 to-transparent border-t border-[#D4A853]/30">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0F766E]/30 via-[#D4A853]/10 to-transparent blur-xl" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP HUD PELMET: FIXED SCHOOL EMBLEM, CONTROLS & BANNER */}
      {/* ======================================================== */}
      <header className="relative z-40 w-full pt-3 sm:pt-6 px-3 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Top Mobile Bar: School Crest + Actions */}
        <div className="w-full flex items-center justify-between sm:w-auto">
          {/* School Official Logo: Fixed and elegant across all scenes */}
          <div className="flex items-center gap-2 bg-[#061A19]/90 backdrop-blur-md px-2.5 py-1 rounded-xl sm:rounded-2xl border border-[#D4A853]/60 shadow-[0_0_15px_rgba(212,168,83,0.3)] shrink-0 max-w-[210px] sm:max-w-none">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white p-0.5 border border-[#D4A853] shrink-0">
              <Image
                src="/images/school-logo.jpg"
                alt="شعار مدارس نخبة الشمال الأهلية"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-right overflow-hidden">
              <span className="text-[9px] sm:text-xs font-bold text-[#D4A853] block leading-tight truncate">
                {school.name || 'مدارس نخبة الشمال'}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-[#FFF7E6] truncate block">
                {edition.title?.split('-')[0]?.trim() || 'حفل التكريم الأسبوعي'}
              </span>
            </div>
          </div>

          {/* Action buttons on mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isAudioEnabled;
                setIsAudioEnabled(nextState);
                if (nextState) playSound(587.33, 880, 0.8);
              }}
              className="p-1.5 rounded-full bg-[#061A19]/85 border border-[#D4A853]/40 text-[#D4A853]"
              title={isAudioEnabled ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
              aria-label="تبديل الصوت"
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#061A19]/85 border border-[#D4A853]/40 text-[#FFF7E6]/90 text-[11px] font-bold"
              aria-label="تخطي العرض"
            >
              <span>تخطي</span>
              <X className="w-3 h-3 text-[#D4A853]" />
            </button>
          </div>
        </div>

        {/* Central Arch Banner (Dynamic per scene) */}
        <div className="flex justify-center w-full sm:w-auto mt-1 sm:mt-0">
          <AnimatePresence mode="wait">
            {scene === 'opening' && (
              <motion.div
                key="banner-opening"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-1 rounded-full bg-gradient-to-r from-[#0B3D3A] via-[#0F766E] to-[#0B3D3A] border border-[#D4A853] shadow-[0_0_20px_rgba(212,168,83,0.35)]"
              >
                <Trophy className="w-3.5 h-3.5 text-[#D4A853]" />
                <span className="text-[11px] sm:text-base font-black text-[#FFF7E6]">
                  افتتاح حفل نجوم النخبة
                </span>
              </motion.div>
            )}

            {scene === 'classroom' && currentClassGroup && (
              <motion.div
                key={`banner-${currentClassGroup.classInfo.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-6 py-1 rounded-full bg-gradient-to-r from-[#0B3D3A] via-[#0F766E] to-[#0B3D3A] border border-[#D4A853] shadow-[0_0_20px_rgba(212,168,83,0.35)] max-w-[95vw] sm:max-w-none"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4A853] animate-pulse shrink-0" />
                <h1 className="text-[10.5px] sm:text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E6] via-[#F3E5AB] to-[#D4A853] tracking-tight truncate">
                  نجوم {currentClassGroup.classInfo.gradeName} {currentClassGroup.classInfo.level} — فصل {currentClassGroup.classInfo.classSection}
                </h1>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4A853] animate-pulse shrink-0" />
              </motion.div>
            )}

            {scene === 'hall_of_fame' && (
              <motion.div
                key="banner-hall-of-fame"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-1 rounded-full bg-gradient-to-r from-[#996515] via-[#D4A853] to-[#996515] text-[#041413] font-black text-[11px] sm:text-base shadow-[0_0_25px_rgba(212,168,83,0.5)]"
              >
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <span>لوحة الشرف الكبرى — نجوم الأسبوع</span>
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons on Desktop */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const nextState = !isAudioEnabled;
              setIsAudioEnabled(nextState);
              if (nextState) playSound(587.33, 880, 0.8);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#061A19]/85 hover:bg-[#0A2B29] border border-[#D4A853]/40 text-[#D4A853] text-xs font-bold transition-all cursor-pointer backdrop-blur-md shadow-md"
            title={isAudioEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية الفاخرة'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4A853]" />
                <span className="text-[#FFF7E6]/90">الصوت مفعل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#FFF7E6]/60" />
                <span className="text-[#FFF7E6]/60">تشغيل الصوت</span>
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#061A19]/85 hover:bg-[#0A2B29] border border-[#D4A853]/40 text-[#FFF7E6]/90 hover:text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md shadow-lg"
            aria-label="تخطي العرض"
          >
            <span>تخطي العرض</span>
            <X className="w-3.5 h-3.5 text-[#D4A853]" />
          </button>
        </div>
      </header>

      {/* Thin Gold Progress Line at Very Top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4A853] via-[#F3E5AB] to-[#F97316]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* ======================================================== */}
      {/* 3. CENTER STAGE: THE 4 CHOREOGRAPHED SCENES              */}
      {/* ======================================================== */}
      <main className="relative z-30 w-full max-w-6xl mx-auto px-2 sm:px-8 my-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
        <AnimatePresence mode="wait">

          {/* ---------------------------------------------------- */}
          {/* SCENE 1: GRAND OPENING PROLOGUE                      */}
          {/* ---------------------------------------------------- */}
          {scene === 'opening' && (
            <motion.div
              key="scene-opening"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-4 px-4"
            >
              {/* Grand School Emblem inside Glowing Medallion */}
              <div className="relative flex items-center justify-center mb-2">
                <motion.div
                  animate={shouldReduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-[#D4A853]/60"
                />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-2.5 border-2 border-[#D4A853] shadow-[0_0_45px_rgba(212,168,83,0.6)] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/school-logo.jpg"
                    alt="شعار المدرسة"
                    fill
                    className="object-contain p-1.5"
                    priority
                  />
                </div>
              </div>

              {/* Royal Subtitle Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B3D3A]/90 border border-[#D4A853] text-[#D4A853] text-xs sm:text-sm font-bold shadow-lg"
              >
                <Trophy className="w-4 h-4" />
                <span>حفل التكريم الأسبوعي الرسمي</span>
              </motion.div>

              {/* Monumental Title in Tajawal Black */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-2xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E6] via-[#D4A853] to-[#F97316] drop-shadow-[0_6px_35px_rgba(212,168,83,0.5)] tracking-tight leading-tight"
              >
                نجوم النخبة لهذا الأسبوع
              </motion.h1>

              {/* Academic Year & Week Citation */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs sm:text-base text-[#FFF7E6]/90 font-medium max-w-md mx-auto"
              >
                {edition.title || 'الأسبوع الأول'} • العام الدراسي {edition.academicYear || '1448هـ'}
              </motion.p>
            </motion.div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SCENE 2: CLASSROOM AWARDS (SEQUENTIAL CHOREOGRAPHY)  */}
          {/* ---------------------------------------------------- */}
          {scene === 'classroom' && currentClassGroup && (
            <motion.div
              key={`classroom-group-${currentClassGroup.classInfo.id}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 70, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -70, scale: 0.94, filter: 'blur(6px)' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center relative"
            >
              {/* Group Celebration Banner: Appears during 'group' substep */}
              <AnimatePresence>
                {classSubstep === 'group' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-12 z-40 flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#996515] via-[#D4A853] to-[#996515] text-[#041413] shadow-[0_0_30px_rgba(212,168,83,0.8)] border border-[#FFF7E6]"
                  >
                    <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-black text-xs sm:text-sm tracking-tight">
                      {currentClassGroup.students.length > 1 ? 'نجوم هذا الفصل' : 'نجم هذا الفصل'}
                    </span>
                    <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '6s' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* -------------------------------------------------- */}
              {/* SOLO STUDENT (If 1 Student in Class)               */}
              {/* -------------------------------------------------- */}
              {currentClassGroup.students.length === 1 ? (
                <div className="w-full flex flex-col items-center text-center max-w-md mx-auto">
                  {/* Halo backlight */}
                  <div className="absolute -inset-8 bg-gradient-to-tr from-[#D4A853]/25 via-[#0F766E]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

                  {/* Student Portrait Reveal with Soft Theatrical Masking (No boxy card) */}
                  <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.9 }}
                    animate={
                      classSubstep !== 'intro'
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 35, scale: 0.9 }
                    }
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Top Floating Golden Star */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#996515] via-[#D4A853] to-[#FFF7E6] p-0.5 shadow-[0_0_20px_rgba(212,168,83,0.8)] flex items-center justify-center mb-3 z-10">
                      <div className="w-full h-full rounded-full bg-[#071F1E] flex items-center justify-center">
                        <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4A853] fill-[#D4A853]" />
                      </div>
                    </div>

                    {/* Stage Cutout-Vignette Portrait Container */}
                    <div className="relative w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl p-1.5 bg-gradient-to-b from-[#D4A853] via-[#996515] to-transparent shadow-[0_20px_55px_rgba(0,0,0,0.9)] z-10 overflow-hidden">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#071F1E]">
                        <Image
                          src={currentClassGroup.students[0].avatarUrl || '/images/students/omar-ahmed.jpg'}
                          alt={currentClassGroup.students[0].fullName}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 200px, 320px"
                          priority
                        />
                        {/* Soft ambient vignette blending portrait into stage */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#041110] via-transparent to-transparent opacity-40 pointer-events-none" />
                        
                        {/* Coronation Golden Shine Sweep */}
                        {classSubstep === 'group' && (
                          <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: [0, 0.7, 0] }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none"
                          />
                        )}
                      </div>
                    </div>

                    {/* Student Name: Appears Directly Beneath the Photo */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={
                        classSubstep !== 'intro'
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 15 }
                      }
                      transition={{ delay: 0.25, duration: 0.6 }}
                      className="mt-3.5 z-10 flex flex-col items-center w-full"
                    >
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FFF7E6] tracking-tight drop-shadow-[0_4px_20px_rgba(212,168,83,0.7)] truncate max-w-full">
                        {currentClassGroup.students[0].fullName}
                      </h2>

                      {/* Honor Ribbon Badge beneath name */}
                      <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#0B3D3A] border border-[#D4A853] text-[#D4A853] text-xs sm:text-sm font-black shadow-md">
                        <Award className="w-4 h-4 text-[#D4A853]" />
                        <span>{currentClassGroup.students[0].badges?.[0] || 'وسام التميز والتفوق'}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                /* -------------------------------------------------- */
                /* DUO STUDENTS: SEQUENTIAL REVEAL (Student 1 -> 2)   */
                /* -------------------------------------------------- */
                <div className="w-full flex flex-row items-center justify-center gap-3 sm:gap-8 md:gap-14">
                  {currentClassGroup.students.map((student, index) => {
                    // Visibility condition:
                    // index 0 (student 1): visible during 'student_1', 'student_2', 'group'
                    // index 1 (student 2): visible during 'student_2', 'group'
                    const isStudentVisible =
                      index === 0
                        ? classSubstep !== 'intro'
                        : classSubstep === 'student_2' || classSubstep === 'group';

                    const isCurrentFocus =
                      (index === 0 && classSubstep === 'student_1') ||
                      (index === 1 && classSubstep === 'student_2');

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 40, scale: 0.88 }}
                        animate={
                          isStudentVisible
                            ? {
                                opacity: 1,
                                y: 0,
                                scale: isCurrentFocus ? 1.04 : 1,
                              }
                            : { opacity: 0, y: 40, scale: 0.88 }
                        }
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-1/2 max-w-[185px] sm:max-w-[340px] md:max-w-[390px] flex flex-col items-center text-center"
                      >
                        {/* Halos & Laurel Backlight */}
                        <div
                          className={`absolute -inset-3 sm:-inset-6 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-700 ${
                            isCurrentFocus
                              ? 'bg-gradient-to-tr from-[#D4A853]/40 via-[#0F766E]/30 to-transparent opacity-100'
                              : 'opacity-40'
                          }`}
                        />

                        {/* Top Floating Crown Star */}
                        <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#996515] via-[#D4A853] to-[#FFF7E6] p-0.5 shadow-[0_0_15px_rgba(212,168,83,0.7)] flex items-center justify-center mb-1.5 sm:mb-2 z-10">
                          <div className="w-full h-full rounded-full bg-[#071F1E] flex items-center justify-center">
                            <Star className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#D4A853] fill-[#D4A853]" />
                          </div>
                        </div>

                        {/* Theatrical Cutout Portrait (No Cards) */}
                        <div
                          className={`relative w-36 h-36 sm:w-64 sm:h-64 md:w-76 md:h-76 lg:w-80 lg:h-80 rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 shadow-[0_15px_45px_rgba(0,0,0,0.85)] z-10 transition-all duration-500 overflow-hidden ${
                            isCurrentFocus
                              ? 'bg-gradient-to-b from-[#F3E5AB] via-[#D4A853] to-transparent ring-2 ring-[#D4A853]'
                              : 'bg-gradient-to-b from-[#D4A853]/60 via-[#996515]/40 to-transparent'
                          }`}
                        >
                          <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#071F1E]">
                            <Image
                              src={student.avatarUrl || '/images/students/omar-ahmed.jpg'}
                              alt={student.fullName}
                              fill
                              className="object-cover object-top"
                              sizes="(max-width: 640px) 150px, (max-width: 1024px) 260px, 320px"
                              priority
                            />
                            {/* Soft bottom vignette blend */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#041110] via-transparent to-transparent opacity-35 pointer-events-none" />

                            {/* Celebratory Coronation Shine Sweep */}
                            {classSubstep === 'group' && (
                              <motion.div
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: '100%', opacity: [0, 0.6, 0] }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
                              />
                            )}
                          </div>
                        </div>

                        {/* Student Name: Directly Beneath Student Portrait */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={
                            isStudentVisible
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 10 }
                          }
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="mt-2.5 sm:mt-4 z-10 flex flex-col items-center w-full"
                        >
                          <h2 className="text-base sm:text-3xl md:text-4xl font-black text-[#FFF7E6] tracking-tight drop-shadow-[0_4px_15px_rgba(212,168,83,0.6)] truncate w-full">
                            {student.fullName}
                          </h2>

                          {/* Distinction Ribbon Badge */}
                          <div className="mt-1 sm:mt-2 inline-flex items-center gap-1 px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0B3D3A] border border-[#D4A853] text-[#D4A853] text-[10px] sm:text-xs font-black shadow-md whitespace-nowrap">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4A853]" />
                            <span>{student.badges?.[0] || 'وسام التميز والتفوق'}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SCENE 3: HALL OF FAME MOSAIC                         */}
          {/* ---------------------------------------------------- */}
          {scene === 'hall_of_fame' && (
            <motion.div
              key="scene-hall-of-fame"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center text-center px-2"
            >
              {/* Header Titles: Exact words requested */}
              <div className="mb-4 sm:mb-6">
                <motion.h2
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E6] via-[#D4A853] to-[#F97316] drop-shadow-md"
                >
                  مبارك لنجوم النخبة
                </motion.h2>
                <p className="mt-1.5 text-sm sm:text-xl text-[#D4A853] font-black tracking-wide">
                  « أنتم فخر مدارس نخبة الشمال الأهلية »
                </p>
              </div>

              {/* Dynamic Responsive Mosaic Grid of All Stars */}
              <div
                className={`w-full grid gap-2.5 sm:gap-4 max-h-[55vh] overflow-y-auto px-1 py-1 ${
                  allHonoredStudents.length <= 4
                    ? 'grid-cols-2 sm:grid-cols-4 max-w-xl'
                    : allHonoredStudents.length <= 6
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-3xl'
                    : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 max-w-5xl'
                }`}
              >
                {allHonoredStudents.map((st, i) => (
                  <motion.div
                    key={st.id}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    className="rounded-2xl bg-gradient-to-b from-[#0F4E4A]/90 to-[#072422]/95 border border-[#D4A853]/60 p-2 text-center shadow-lg flex flex-col items-center"
                  >
                    {/* Photo with Soft Stage Border */}
                    <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-xl overflow-hidden border-2 border-[#D4A853] bg-white shadow-sm shrink-0">
                      <Image
                        src={st.avatarUrl || '/images/students/omar-ahmed.jpg'}
                        alt={st.fullName}
                        fill
                        className="object-cover object-top"
                        sizes="90px"
                      />
                    </div>
                    {/* Student Name */}
                    <span className="mt-1.5 text-[11px] sm:text-xs font-black text-[#FFF7E6] truncate w-full">
                      {st.fullName}
                    </span>
                    {/* Class Name */}
                    <span className="text-[10px] font-extrabold text-[#D4A853]">
                      {st.className}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SCENE 4: GRAND FINALE & SEAMLESS DISSOLVE            */}
          {/* ---------------------------------------------------- */}
          {scene === 'finale' && (
            <motion.div
              key="scene-finale"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: [1, 1.3, 2.8] }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center">
                <Star className="w-full h-full text-[#D4A853] fill-[#D4A853] drop-shadow-[0_0_60px_rgba(212,168,83,0.9)]" />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ======================================================== */}
      {/* 4. BOTTOM STAGE FOOTER: PROGRESSION & CORONATION STATUS   */}
      {/* ======================================================== */}
      <footer className="relative z-40 w-full pb-4 sm:pb-6 px-4 sm:px-8 flex items-center justify-between text-xs text-[#FFF7E6]/70">
        
        {/* Navigation Indicator / Buttons */}
        <div className="flex items-center gap-2">
          {scene === 'classroom' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevClass}
                disabled={currentClassIndex === 0}
                className="p-1 rounded-md bg-[#061A19]/80 border border-[#D4A853]/40 text-[#D4A853] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#0B3D3A]"
                title="الفصل السابق"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-[#D4A853] text-[11px] sm:text-xs">
                فصل {currentClassIndex + 1} من {classGroups.length}
              </span>
              <button
                onClick={handleNextClass}
                className="p-1 rounded-md bg-[#061A19]/80 border border-[#D4A853]/40 text-[#D4A853] hover:bg-[#0B3D3A]"
                title="الفصل التالي"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {scene === 'opening' && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4A853] animate-ping" />
              <span className="font-bold text-[#D4A853]">المقدمة الرسمية</span>
            </div>
          )}

          {scene === 'hall_of_fame' && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4A853] animate-ping" />
              <span className="font-bold text-[#D4A853]">لوحة الشرف</span>
            </div>
          )}
        </div>

        {/* Center: School Citation */}
        <div className="hidden sm:block text-center font-semibold text-[11px] sm:text-xs text-[#FFF7E6]/60">
          مدارس نخبة الشمال الأهلية والعالمية بمحافظة رفحاء
        </div>

        {/* Left: Academic Level or Stars count */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#FFF7E6] text-[11px] sm:text-xs">
            {scene === 'hall_of_fame'
              ? `${allHonoredStudents.length} نجمًا ونجمة`
              : 'المرحلة الابتدائية'}
          </span>
        </div>
      </footer>
    </div>
  );
}
