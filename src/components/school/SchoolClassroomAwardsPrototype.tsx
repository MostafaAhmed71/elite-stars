'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Student, WeeklyEdition, SchoolConfig } from '@/types';
import { isStudentInClass } from '@/lib/schoolData';
import { fetchSupabaseData } from '@/lib/supabaseService';

interface SchoolClassroomAwardsPrototypeProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  students: Student[];
  initialGradeName?: string;
  initialClassSection?: string;
  onComplete?: () => void;
  onClose?: () => void;
  autoPlay?: boolean;
}

export default function SchoolClassroomAwardsPrototype({
  school,
  edition,
  students,
  initialGradeName = 'الصف الثاني الابتدائي',
  initialClassSection = '2/ب',
  onComplete,
  onClose,
  autoPlay = true,
}: SchoolClassroomAwardsPrototypeProps) {
  // 1. Ceremonial Opening Music (/Ascending_the_Stage.mp3)
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [needsUserTap, setNeedsUserTap] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and play ceremonial opening soundtrack
  useEffect(() => {
    const audio = new Audio('/Ascending_the_Stage.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.8;
    audioRef.current = audio;

    // Attempt autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingMusic(true);
          setIsMuted(false);
          setNeedsUserTap(false);
        })
        .catch(() => {
          // Browser autoplay restriction before user interaction
          setIsPlayingMusic(false);
          setIsMuted(true);
          setNeedsUserTap(true);
        });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // Function to start music and begin/advance presentation immediately
  const startMusicAndShow = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setIsMuted(false);
          setNeedsUserTap(false);
          if (currentStep === 0) {
            setCurrentStep(1);
          }
        })
        .catch(() => {
          setNeedsUserTap(false);
          if (currentStep === 0) setCurrentStep(1);
        });
    } else {
      setNeedsUserTap(false);
      if (currentStep === 0) setCurrentStep(1);
    }
  };

  // Global screen tap handler to unlock audio anywhere
  const handleGlobalScreenTap = () => {
    if (audioRef.current && (audioRef.current.paused || isMuted)) {
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setIsMuted(false);
          setNeedsUserTap(false);
          if (currentStep === 0) {
            setCurrentStep(1);
          }
        })
        .catch(() => {});
    } else if (needsUserTap && currentStep === 0) {
      startMusicAndShow();
    }
  };

  // Toggle Mute / Unmute
  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isMuted || audioRef.current.paused) {
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setIsMuted(false);
        })
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlayingMusic(false);
      setIsMuted(true);
    }
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingMusic(true);
          setIsMuted(false);
        })
        .catch(() => {});
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (onClose) onClose();
  };

  // Optional subtle fanfare chime helper
  const playChime = (_freq?: number, _type?: string) => {};

  // Local students state with dynamic fetch fallback
  const [localStudents, setLocalStudents] = useState<Student[]>(students || []);

  useEffect(() => {
    if (students && students.length > 0) {
      setLocalStudents(students);
    } else {
      fetchSupabaseData().then((res) => {
        if (res.isRealData && res.students && res.students.length > 0) {
          setLocalStudents(res.students);
        }
      });
    }
  }, [students]);

  // Filter students for this classroom & deduplicate by name
  const classStudents = useMemo(() => {
    const list = localStudents && localStudents.length > 0 ? localStudents : students || [];
    if (list.length === 0) return [];

    // Try target section first
    const rawMatches = list.filter((s) =>
      isStudentInClass(s, initialClassSection, initialGradeName)
    );

    const uniqueMap = new Map<string, Student>();
    rawMatches.forEach((s) => {
      const key = s.fullName.trim();
      if (!uniqueMap.has(key)) uniqueMap.set(key, s);
    });

    let res = Array.from(uniqueMap.values());

    // If target section has fewer than 2 students, find any class with >= 2 students
    if (res.length < 2) {
      const candidates = ['2/ب', '1/ب', '2/أ', '3/أ', '3/ب', '1/أ'];
      for (const sec of candidates) {
        const secMatches = list.filter((s) => isStudentInClass(s, sec));
        const secMap = new Map<string, Student>();
        secMatches.forEach((s) => secMap.set(s.fullName.trim(), s));
        if (secMap.size >= 2) {
          res = Array.from(secMap.values());
          break;
        }
      }
    }

    // If still < 2, take unique real students from the database
    if (res.length < 2) {
      const allMap = new Map<string, Student>();
      list.forEach((s) => allMap.set(s.fullName.trim(), s));
      res = Array.from(allMap.values()).slice(0, 4);
    }

    return res;
  }, [localStudents, students, initialClassSection, initialGradeName]);

  const activeGradeName = classStudents[0]?.gradeLevel || initialGradeName;
  const activeClassSection = classStudents[0]?.className || initialClassSection;
  const totalStudents = classStudents.length;

  // Step state: 0 = Intro, 1..N = Spotlight on each student, N+1 = Group Celebration Moment
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);

  // Read URL step parameter if provided for instant verification (e.g. ?step=group or ?step=1)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam === 'group') {
      setCurrentStep(totalStudents > 0 ? totalStudents + 1 : 1);
      setIsPlaying(false);
    } else if (stepParam === 'intro' || stepParam === '0') {
      setCurrentStep(0);
      setIsPlaying(false);
    } else if (stepParam && !isNaN(Number(stepParam))) {
      setCurrentStep(Number(stepParam));
      setIsPlaying(false);
    }
  }, [totalStudents]);

  // Auto-advance choreography
  useEffect(() => {
    if (!isPlaying || totalStudents === 0) return;

    let timer: NodeJS.Timeout;

    if (currentStep === 0) {
      // If browser blocked autoplay, wait for user tap so stars are never revealed in silence!
      if (needsUserTap) return;

      // Intro stage hold for 2s then advance to student 1
      timer = setTimeout(() => {
        setCurrentStep(1);
      }, 2000);
    } else if (currentStep >= 1 && currentStep <= totalStudents) {
      // Hold each student spotlight for 2.6s
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
      }, 2600);
    } else if (currentStep > totalStudents) {
      // Final group hold for 4.5s then onComplete
      timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4500);
    }

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, totalStudents, needsUserTap]);

  const isGroupMoment = currentStep > totalStudents;

  return (
    <div
      dir="rtl"
      onClick={handleGlobalScreenTap}
      className="fixed inset-0 w-full h-[100dvh] z-[99999] overflow-hidden bg-[#031312] select-none font-sans flex flex-col justify-between cursor-pointer"
    >
      {/* 1. ULTRA HIGH FIDELITY STAGE BACKDROP */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/images/theme-school/awards_stage_backdrop.png"
          alt="مسرح جوائز نجوم النخبة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.005]"
        />

        {/* Ambient Dark petroleum vignette for cinematic contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />

        {/* Overhead Spotlights Beam Animation */}
        <div className="absolute top-0 inset-x-0 h-2/3 pointer-events-none overflow-hidden opacity-75">
          <div className="absolute top-0 left-1/4 w-32 h-[800px] bg-gradient-to-b from-[#FFF2B2]/30 via-[#D4A853]/10 to-transparent -rotate-12 blur-xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-32 h-[800px] bg-gradient-to-b from-[#FFF2B2]/30 via-[#D4A853]/10 to-transparent rotate-12 blur-xl animate-pulse delay-700" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[800px] bg-gradient-to-b from-[#FFF7E6]/40 via-[#F97316]/15 to-transparent blur-2xl" />
        </div>

        {/* Sparkling Golden Star Dust */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Left Hanging Emerald/Petroleum Banner (Desktop Only) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-28 sm:top-36 left-3 sm:left-8 z-25 pointer-events-none hidden md:flex flex-col items-center py-4 px-2.5 rounded-2xl bg-gradient-to-b from-[#062420]/90 to-[#021310]/95 border border-[#D4A853]/60 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-center"
      >
        <div className="space-y-1.5 text-xs font-black text-[#FFD884] drop-shadow-sm tracking-wider">
          <p>تطلّع ..</p>
          <p>تميّز ..</p>
          <p>نبدّع</p>
        </div>
        <Star className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316] mt-3" />
      </motion.div>

      {/* Right Hanging Emerald/Petroleum Banner (Desktop Only) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-28 sm:top-36 right-3 sm:right-8 z-25 pointer-events-none hidden md:flex flex-col items-center py-4 px-2.5 rounded-2xl bg-gradient-to-b from-[#062420]/90 to-[#021310]/95 border border-[#D4A853]/60 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-center"
      >
        <div className="space-y-1 text-xs font-black text-[#FFD884] drop-shadow-sm tracking-wider">
          <p>نجوم اليوم</p>
          <p>صُناع</p>
          <p>مستقبل</p>
          <p>أكثر إشراقاً</p>
        </div>
        <Star className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316] mt-3" />
      </motion.div>

      {/* 2. TOP STAGE ORNAMENTS */}
      {/* MOBILE-ONLY COMPACT UNIFIED TOP BAR (< sm) - ZERO OVERLAPPING */}
      <div className="sm:hidden relative z-30 w-full pt-2 px-2.5 flex items-center justify-between gap-1.5 shrink-0 pointer-events-auto">
        {/* Right: Trophy & Edition */}
        <div className="flex items-center gap-1.5 bg-[#052623]/95 border border-[#D4A853]/70 px-2 py-1 rounded-xl shadow-md shrink-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#996515] to-[#FFD884] p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[6px] bg-[#0A3430] flex items-center justify-center text-[#FFD884]">
              <Trophy className="w-3.5 h-3.5 fill-[#FFD884]" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-black text-[#FFF8EA]">نجوم النخبة</div>
            <div className="text-[8.5px] font-bold text-[#FFD884]">{edition.title?.split('-')[0] || 'الأسبوع الأول'}</div>
          </div>
        </div>

        {/* Center: School Brand Crest */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#062824]/95 border border-[#D4A853]/70 shadow-md min-w-0 max-w-[160px]">
          <div className="relative w-5 h-5 rounded-full bg-white p-0.5 border border-[#D4A853] shrink-0 overflow-hidden">
            <Image
              src={school.logoUrl || '/images/school-logo.jpg'}
              alt={school.name}
              fill
              className="object-contain p-0.5"
            />
          </div>
          <span className="text-[10px] font-black text-[#FFF8EA] truncate">
            {school.name || 'مدارس نخبة الشمال'}
          </span>
        </div>

        {/* Left: Class Badge */}
        <div className="flex items-center gap-1 bg-[#052623]/95 border border-[#D4A853]/70 px-2 py-1 rounded-xl shadow-md shrink-0">
          <Star className="w-3 h-3 text-[#F97316] fill-[#F97316]" />
          <span className="text-[10px] font-black text-[#FFF8EA]">
            فصل {activeClassSection}
          </span>
        </div>
      </div>

      {/* DESKTOP FLOATING PLAQUES (>= sm) */}
      <div className="hidden sm:block">
        {/* TOP LEFT: Classroom Plaque */}
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ direction: 'rtl' }}
          className="absolute top-4 sm:top-5 left-4 sm:left-8 z-30 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-[#052623]/95 border-2 border-[#D4A853] shadow-[0_6px_25px_rgba(212,168,83,0.4)] backdrop-blur-md text-right pointer-events-auto"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base md:text-lg font-black text-[#FFF8E7] drop-shadow-[0_2px_8px_rgba(212,168,83,0.6)]">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] fill-[#F97316]" />
            <span>نجوم {activeGradeName}</span>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] fill-[#F97316]" />
          </div>
          <div className="text-xs font-bold text-[#E5C158] mt-0.5 tracking-wider">
            فصل {activeClassSection}
          </div>
        </motion.div>

        {/* TOP CENTER: Royal School Shield */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center px-6 sm:px-8 py-2 rounded-b-3xl bg-[#062824]/95 border-b-2 border-x-2 border-[#D4A853] shadow-[0_8px_30px_rgba(212,168,83,0.45)] backdrop-blur-md text-center max-w-sm sm:max-w-md pointer-events-auto"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 border border-[#D4A853] shadow-md overflow-hidden mb-1">
            <Image
              src={school.logoUrl || '/images/school-logo.jpg'}
              alt={school.name}
              fill
              className="object-contain p-0.5"
            />
          </div>
          <h1 className="text-sm md:text-base font-black text-[#FFF8EA] leading-tight tracking-wide drop-shadow-sm">
            {school.name}
          </h1>
          <span className="text-[10px] text-[#FFD884] font-medium tracking-tight">
            Northern Elite Private and International Schools
          </span>
        </motion.div>

        {/* TOP RIGHT: Trophy & Edition Plaque */}
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ direction: 'rtl' }}
          className="absolute top-4 sm:top-5 right-4 sm:right-8 z-30 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-[#052623]/95 border-2 border-[#D4A853] shadow-[0_6px_25px_rgba(212,168,83,0.4)] backdrop-blur-md text-right flex items-center gap-2.5 pointer-events-auto"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#996515] to-[#FFD884] p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[10px] bg-[#0A3430] flex items-center justify-center text-[#FFD884]">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFD884]" />
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-[#FFF8EA]">
              نجوم النخبة
            </div>
            <div className="text-[10px] sm:text-xs text-[#FFD884] font-bold">
              {edition.title?.split('-')[0] || 'الأسبوع الأول'}
            </div>
            <div className="text-[9px] text-[#FFF8EA]/60 font-medium">
              العام الدراسي {edition.academicYear || '1448 هـ'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Celebratory Banner: "نجوم هذا الفصل المتميزون" */}
      <AnimatePresence>
        {isGroupMoment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-30 mt-2 sm:absolute sm:top-28 inset-x-0 mx-auto w-fit px-4 sm:px-10 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FFF2B2] via-[#FFD884] to-[#F59E0B] text-[#05211E] border-2 border-white shadow-[0_0_35px_rgba(255,216,132,0.9)] flex items-center gap-2 font-black text-xs sm:text-lg md:text-xl shrink-0 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#B45309] fill-[#B45309] animate-spin" />
            <span>✨ نجوم هذا الفصل المتميزون ✨</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#B45309] fill-[#B45309] animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. STAGE CENTRAL HERO: STUDENTS STANDING ON STAGE (Vertically budgeted to never collide) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center sm:justify-end pb-2 sm:pb-5 min-h-0 w-full px-2 sm:px-8">
        
        {/* Step 0: Grand Opening Stage Prologue & Official Leadership Patronage */}
        <AnimatePresence>
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.6 }}
              className="my-auto max-w-sm sm:max-w-md w-full px-3 text-center z-30"
            >
              <div className="rounded-3xl bg-gradient-to-b from-[#052623]/95 via-[#093530]/95 to-[#041A18]/95 border-2 border-[#D4A853] p-5 sm:p-6 shadow-[0_0_40px_rgba(212,168,83,0.35)] backdrop-blur-md">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-white p-1 border-2 border-[#D4A853] shadow-md mb-2.5 overflow-hidden">
                  <Image
                    src={school.logoUrl || '/images/school-logo.jpg'}
                    alt={school.name}
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                
                <h2 className="text-sm sm:text-lg font-black text-[#FFF8EA] drop-shadow-sm mb-1">
                  حفل تكريم نجوم {activeGradeName}
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-[#FFD884] mb-3.5">
                  فصل {activeClassSection} • {edition.title?.split('-')[0] || 'الأسبوع الأول'}
                </p>

                {/* Patronage Signatories */}
                <div className="pt-3 border-t border-[#D4A853]/40 flex items-center justify-around gap-2 text-[#FFF8EA]">
                  <div>
                    <span className="text-[9.5px] sm:text-[10px] text-[#FFD884] font-bold block">المدير التنفيذي</span>
                    <span className="text-xs sm:text-sm font-black text-white">أ. عيد بن قيران العنزي</span>
                  </div>
                  <div className="w-[1px] h-7 bg-[#D4A853]/40" />
                  <div>
                    <span className="text-[9.5px] sm:text-[10px] text-[#FFD884] font-bold block">رائد النشاط</span>
                    <span className="text-xs sm:text-sm font-black text-white">أ. طه شوقي</span>
                  </div>
                </div>

                {/* Prominent Golden Button to Start Ceremony with Music */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startMusicAndShow();
                  }}
                  className="mt-4 w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-[#FFF2B2] via-[#FFD884] to-[#F59E0B] hover:brightness-110 text-[#05211E] text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(255,216,132,0.85)] animate-bounce flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-white"
                >
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>اضغط لبدء الحفل مع الموسيقى 🎵</span>
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Students Row on the Golden Circular Podium */}
        <div className={`relative w-full max-w-6xl mx-auto flex items-end justify-center gap-2.5 sm:gap-8 md:gap-12 ${currentStep === 0 ? 'hidden' : 'flex'}`}>
          {classStudents.map((student, index) => {
            const studentStep = index + 1;
            const isRevealed = currentStep >= studentStep;
            const isCurrentSpotlight = currentStep === studentStep;

            // On mobile, hide non-active students during single-spotlight steps so active student is 100% centered
            const hideOnMobile = !isGroupMoment && !isCurrentSpotlight;

            return (
              <motion.div
                key={student.id || index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{
                  opacity: isRevealed ? 1 : 0.05,
                  y: isRevealed ? 0 : 30,
                  scale: isCurrentSpotlight ? 1.04 : isRevealed ? 1 : 0.92,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex-col items-center transition-all ${
                  hideOnMobile ? 'hidden sm:flex' : 'flex'
                } ${
                  isGroupMoment && classStudents.length > 2
                    ? 'flex-1 max-w-[115px] sm:max-w-[240px] md:max-w-[280px]'
                    : isGroupMoment && classStudents.length === 2
                    ? 'flex-1 max-w-[155px] sm:max-w-[260px] md:max-w-[300px]'
                    : 'w-full max-w-[200px] sm:max-w-[270px] md:max-w-[310px]'
                } ${!isRevealed ? 'pointer-events-none' : ''}`}
              >
                {/* Spotlight Cone on Current Revealed Student */}
                <AnimatePresence>
                  {isCurrentSpotlight && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-28 sm:-top-36 inset-x-0 mx-auto w-44 sm:w-72 h-[450px] sm:h-[600px] bg-gradient-to-b from-[#FFF2B2]/40 via-[#F97316]/20 to-transparent blur-2xl pointer-events-none -z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Behind Student: Radiant Golden Halo */}
                {isRevealed && (
                  <div
                    className={`absolute -top-4 w-28 h-28 sm:w-52 sm:h-52 rounded-full blur-2xl pointer-events-none transition-opacity ${
                      isCurrentSpotlight
                        ? 'bg-[#F97316]/40 opacity-100'
                        : isGroupMoment
                        ? 'bg-[#D4A853]/35 opacity-90'
                        : 'bg-[#0F766E]/20 opacity-30'
                    }`}
                  />
                )}

                {/* STUDENT PORTRAIT (Arched Dome with Golden Hairline, Grounded on Stage) */}
                <div
                  className={`relative flex items-end justify-center ${
                    isGroupMoment && classStudents.length > 2
                      ? 'w-24 h-36 sm:w-48 sm:h-64 md:w-56 md:h-76'
                      : isGroupMoment && classStudents.length === 2
                      ? 'w-32 h-44 sm:w-52 sm:h-68 md:w-60 md:h-80'
                      : 'w-36 h-48 sm:w-56 sm:h-72 md:w-64 md:h-84'
                  }`}
                >
                  <div
                    className="relative w-full h-full rounded-t-[55px] sm:rounded-t-[90px] md:rounded-t-[110px] overflow-hidden border-t-2 border-x-2 border-[#D4A853]/70 shadow-[0_0_30px_rgba(212,168,83,0.35)] bg-[#041413]"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
                    }}
                  >
                    <Image
                      src={student.avatarUrl || '/images/students/omar-ahmed.jpg'}
                      alt={student.fullName}
                      fill
                      sizes="(max-width: 640px) 150px, (max-width: 1024px) 240px, 310px"
                      className="object-cover object-top scale-[1.02]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041A18]/80 via-transparent to-black/20 pointer-events-none" />
                  </div>
                </div>

                {/* ROYAL NAME PODIUM PLAQUE */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    y: isRevealed ? 0 : 15,
                  }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="relative -mt-3 sm:-mt-4 w-full z-20 flex flex-col items-center"
                >
                  {/* Top Golden 3D Star on Plaque */}
                  <div className="relative -mb-2.5 sm:-mb-3 z-30 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#8B5E00] via-[#FFD884] to-[#FFF7E6] p-0.5 shadow-[0_0_15px_rgba(255,216,132,0.8)] flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#8B5E00] fill-[#8B5E00]" />
                  </div>

                  {/* Deep Petroleum Plaque with Beveled Golden Border */}
                  <div className="w-full pt-2.5 pb-1.5 sm:pt-3 sm:pb-2.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#052623] via-[#093530] to-[#041A18] border-2 border-[#D4A853] shadow-[0_8px_25px_rgba(0,0,0,0.85)] text-center">
                    {/* Student Full Name */}
                    <h3 className="text-[11px] sm:text-base md:text-lg font-black text-[#FFF8EA] tracking-wide drop-shadow-[0_2px_10px_rgba(212,168,83,0.5)] truncate w-full">
                      {student.fullName}
                    </h3>
                    {/* Class & Section Subtitle */}
                    <p className="text-[9px] sm:text-xs text-[#FFD884] font-bold mt-0.5 truncate w-full">
                      {activeGradeName} - {activeClassSection}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Fallback indicator */}
        {classStudents.length === 0 && (
          <div className="my-auto py-16 text-center text-[#FFD884] font-bold text-base sm:text-lg">
            جاري تحضير وتكريم نجوم هذا الفصل قريباً ✨
          </div>
        )}
      </main>

      {/* 4. BOTTOM FLOATING CONTROLLER BAR (Budgeted inside dynamic viewport, never cut off) */}
      <footer className="relative z-40 w-full px-2.5 sm:px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 shrink-0 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Step Indicator & Replay */}
        <div className="flex items-center gap-1 sm:gap-2 bg-[#041B18]/90 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-[#D4A853]/40 shadow-lg">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#FFD884] hover:text-white transition-colors cursor-pointer p-0.5"
            title="إعادة العرض"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">إعادة</span>
          </button>

          <span className="text-[#D4A853]/40 text-xs">|</span>

          {/* Stepper Buttons for Prototype Review */}
          <button
            disabled={currentStep <= 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            className="p-1 rounded text-[#FFD884] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            title="السابق"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span className="text-[10px] sm:text-xs font-bold text-white px-0.5 whitespace-nowrap">
            {currentStep === 0
              ? 'افتتاح'
              : currentStep <= totalStudents
              ? `طالب ${currentStep}/${totalStudents}`
              : 'لقطة جماعية'}
          </span>
          <button
            disabled={currentStep > totalStudents}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(totalStudents + 1, p + 1));
            }}
            className="p-1 rounded text-[#FFD884] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            title="التالي"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Audio Mute/Unmute & Skip */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-[#041B18]/90 backdrop-blur-md border border-[#D4A853]/40 text-[10px] sm:text-xs font-bold text-[#FFD884] hover:text-white transition-all shadow-lg cursor-pointer"
            title={isMuted ? 'تشغيل موسيقى الافتتاح' : 'كتم الصوت'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">
              {isMuted ? 'تشغيل الموسيقى' : 'موسيقى الافتتاح 🎵'}
            </span>
          </button>

          {onClose && (
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-[#FFF8EA] text-[11px] sm:text-xs font-black transition-all shadow-[0_4px_15px_rgba(249,115,22,0.4)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>تخطي العرض</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
