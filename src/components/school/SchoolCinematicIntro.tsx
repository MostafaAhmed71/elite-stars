'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, SchoolConfig, WeeklyEdition } from '@/types';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  GraduationCap,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface SchoolCinematicIntroProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate?: (student: Student) => void;
}

// Synthesizer for majestic golden celebratory fanfare
function playFanfareSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Royal Major Chord)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 1.25);
    });
  } catch {
    // Audio autoplay policy handled smoothly
  }
}

// Confetti blast helper
function launchCinematicConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#D4A853', '#F3E5AB', '#F97316', '#FFFFFF', '#0F766E'],
      zIndex: 99999,
    });
  } catch {
    // ignore
  }
}

export default function SchoolCinematicIntro({
  school,
  edition,
  students,
  isOpen,
  onClose,
  onOpenCertificate,
}: SchoolCinematicIntroProps) {
  // Stage state: 'intro' (title & school fanfare) | 'spotlight' (student by student) | 'finale' (all stars summary)
  const [stage, setStage] = useState<'intro' | 'spotlight' | 'finale'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveStudents = students && students.length > 0 ? students : [];
  const currentStudent = effectiveStudents[currentIndex] || effectiveStudents[0];

  // 1. Initial Intro Sequence on open
  useEffect(() => {
    if (!isOpen) return;

    setStage('intro');
    setCurrentIndex(0);
    setIsPlaying(true);
    setProgress(0);

    // Initial confetti & fanfare
    const introConfettiTimer = setTimeout(() => {
      launchCinematicConfetti();
      if (soundEnabled) playFanfareSound();
    }, 600);

    // Transition from Title Intro to Student Spotlight after 3.2s
    const introStageTimer = setTimeout(() => {
      setStage('spotlight');
      launchCinematicConfetti();
      if (soundEnabled) playFanfareSound();
    }, 3200);

    return () => {
      clearTimeout(introConfettiTimer);
      clearTimeout(introStageTimer);
    };
  }, [isOpen, soundEnabled]);

  // 2. Student Autoplay Cycle during 'spotlight'
  useEffect(() => {
    if (!isOpen || stage !== 'spotlight' || !isPlaying || effectiveStudents.length === 0) return;

    setProgress(0);
    const DURATION = 3800; // 3.8s per student
    const INTERVAL = 50;
    const step = 100 / (DURATION / INTERVAL);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + step;
      });
    }, INTERVAL);

    timerRef.current = setTimeout(() => {
      if (currentIndex < effectiveStudents.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        launchCinematicConfetti();
        if (soundEnabled) playFanfareSound();
      } else {
        // All students finished, move to finale
        setStage('finale');
        launchCinematicConfetti();
      }
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, stage, currentIndex, isPlaying, effectiveStudents.length, soundEnabled]);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < effectiveStudents.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      launchCinematicConfetti();
      if (soundEnabled) playFanfareSound();
    } else {
      setStage('finale');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      launchCinematicConfetti();
      if (soundEnabled) playFanfareSound();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#05131D] text-[#FFFBF2] select-none">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC AMBIENT BACKGROUND & LIGHT BEAMS            */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep petroleum radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0E334D] via-[#071D2C] to-[#040E16]" />

        {/* Top Centered Golden Spotlight Beam */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] sm:w-[650px] h-[750px] bg-gradient-to-b from-[#D4A853]/25 via-[#D4A853]/5 to-transparent blur-3xl transform -rotate-2 pointer-events-none" />

        {/* Floating golden sparkle dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4A853_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* ======================================================== */}
      {/* 2. TOP CINEMATIC BAR (Controls & Skip)                   */}
      {/* ======================================================== */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between border-b border-[#D4A853]/15 backdrop-blur-md bg-[#05131D]/60">
        
        {/* Right side: School Name & Week info */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 border border-[#D4A853] shadow-md overflow-hidden shrink-0">
            <Image
              src="/images/school-logo.jpg"
              alt="شعار المدرسة"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-[#D4A853] font-bold block">
              {school.name || 'مدارس نخبة الشمال الأهلية والعالمية'}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#FFFBF2]">
              {edition.title?.split('-')[0] || 'نجوم الأسبوع الحالي'}
            </span>
          </div>
        </div>

        {/* Center / Left: Audio & Close/Skip Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mute/Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#D4A853]/40 flex items-center justify-center text-[#D4A853] transition-all cursor-pointer"
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
          </button>

          {/* Skip Intro & Enter Platform Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-[#FFFBF2] text-xs sm:text-sm font-black shadow-lg transition-all cursor-pointer border border-white/20 active:scale-95"
          >
            <span>الدخول للمنصة</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. STAGE CONTENT                                         */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[500px]">
        
        {/* ---------------------------------------------------- */}
        {/* PHASE 1: THE GRAND OVERTURE INTRO                    */}
        {/* ---------------------------------------------------- */}
        {stage === 'intro' && (
          <motion.div
            key="stage-intro"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Medallions Halo */}
            <div className="relative flex items-center justify-center">
              {/* Rotating golden aura ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-[#D4A853]/60"
              />

              {/* School Logo */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-2 border-3 border-[#D4A853] shadow-[0_0_35px_rgba(212,168,83,0.5)] overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/school-logo.jpg"
                  alt="شعار المدرسة"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* School Name */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm font-extrabold text-[#D4A853] tracking-widest block uppercase"
              >
                {school.name || 'مدارس نخبة الشمال الأهلية والعالمية'}
              </motion.span>
              
              {/* Grand Gilded Title */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 12 }}
                className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#D4A853] to-[#F97316] drop-shadow-[0_4px_25px_rgba(212,168,83,0.4)] mt-2"
              >
                ✨ نجوم الأسبوع ✨
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs sm:text-base text-[#F5EAD4]/80 font-medium max-w-md mx-auto mt-2"
              >
                كوكبة التميز والتكريم لفرسان وفراشات مدارس نخبة الشمال
              </motion.p>
            </div>

            {/* Cinematic Start Trigger */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={() => {
                setStage('spotlight');
                launchCinematicConfetti();
                if (soundEnabled) playFanfareSound();
              }}
              className="mt-4 px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-[#D4A853] via-[#F97316] to-[#EA580C] text-[#05131D] font-black text-sm sm:text-base shadow-[0_0_25px_rgba(212,168,83,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>بدء عرض النجوم الآن</span>
            </motion.button>
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PHASE 2: INDIVIDUAL STUDENT SPOTLIGHT (طالب طالب)     */}
        {/* ---------------------------------------------------- */}
        {stage === 'spotlight' && currentStudent && (
          <div className="w-full flex flex-col items-center">
            
            {/* Student Count / Progress indicator at top */}
            <div className="w-full max-w-md mb-4 sm:mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#D4A853] mb-1.5 px-1">
                <span>نجم الأسبوع ({currentIndex + 1} من {effectiveStudents.length})</span>
                <span>{currentStudent.className}</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 bg-[#0E334D] rounded-full overflow-hidden border border-[#D4A853]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#D4A853] to-[#F97316] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Mini Stars dots navigation */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-3 overflow-x-auto py-1">
                {effectiveStudents.map((st, i) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setCurrentIndex(i);
                      launchCinematicConfetti();
                      if (soundEnabled) playFanfareSound();
                    }}
                    className={`transition-all rounded-full cursor-pointer ${
                      i === currentIndex
                        ? 'w-5 h-2.5 bg-[#F97316] ring-2 ring-[#D4A853]'
                        : i < currentIndex
                        ? 'w-2 h-2 bg-[#D4A853]'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={st.fullName}
                  />
                ))}
              </div>
            </div>

            {/* Student Showcase Spotlight Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudent.id}
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -20 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0A2538]/95 to-[#061824]/95 border-2 border-[#D4A853] p-5 sm:p-7 text-center shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              >
                {/* Golden corner flourishes */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4A853]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4A853]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4A853]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4A853]" />

                {/* Top Medal Ribbon */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A853]/20 border border-[#D4A853] text-[#D4A853] text-xs font-black mb-4 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#D4A853]" />
                  <span>{currentStudent.badges?.[0] || 'وسام التميز والتفوق'}</span>
                </div>

                {/* SQUARE STUDENT PORTRAIT (مربعة بإطار ملكي ذهبي) */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl p-1 bg-gradient-to-tr from-[#996515] via-[#F3E5AB] to-[#C59B27] shadow-[0_10px_30px_rgba(212,168,83,0.35)]">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-white border-2 border-[#D4A853]">
                    <Image
                      src={currentStudent.avatarUrl || '/images/students/omar-ahmed.jpg'}
                      alt={currentStudent.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Filigree corner brackets on square frame */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#D4A853]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#D4A853]" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#D4A853]" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#D4A853]" />
                </div>

                {/* Student Full Name */}
                <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#FFE6A3] tracking-tight drop-shadow-md">
                  {currentStudent.fullName}
                </h2>

                {/* Grade and Class Section */}
                <p className="mt-1 text-xs sm:text-sm font-extrabold text-[#F97316]">
                  {currentStudent.gradeLevel} • <span className="bg-[#F97316]/20 px-2.5 py-0.5 rounded-lg border border-[#F97316]/40">{currentStudent.className}</span>
                </p>

                {/* Praise Reason / Quote */}
                <p className="mt-3 text-xs sm:text-sm text-[#F5EAD4]/90 font-medium leading-relaxed italic bg-[#051824]/60 p-3 rounded-xl border border-white/10">
                  &ldquo;{currentStudent.recognitionReason || 'الانضباط والحرص الدائم والتميز بين زملائه في الفصل'}&rdquo;
                </p>

                {/* Open Full Certificate Button */}
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate(currentStudent)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#D4A853] text-xs font-bold text-[#D4A853] hover:text-[#FFFBF2] transition-all cursor-pointer shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>عرض شهادة التكريم الرسمية 🎓</span>
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Playback & Step Controls */}
            <div className="flex items-center gap-4 mt-6">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                  currentIndex === 0
                    ? 'opacity-30 border-white/10 cursor-not-allowed'
                    : 'bg-[#0E334D] hover:bg-[#133D5B] border-[#D4A853]/40 text-[#D4A853]'
                }`}
                title="النجم السابق"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Pause / Play Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2.5 rounded-2xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#D4A853] text-[#D4A853] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>متابعة العرض</span>
                  </>
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-2xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#D4A853]/40 text-[#D4A853] flex items-center justify-center transition-all cursor-pointer"
                title="النجم التالي"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PHASE 3: FINALE CELEBRATION                          */}
        {/* ---------------------------------------------------- */}
        {stage === 'finale' && (
          <motion.div
            key="stage-finale"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-5 max-w-lg"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#0E334D] border-2 border-[#D4A853] flex items-center justify-center text-[#D4A853] shadow-[0_0_30px_rgba(212,168,83,0.4)]">
              <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#D4A853] to-[#F97316]">
              مبارك لجميع نجوم الأسبوع!
            </h2>

            <p className="text-xs sm:text-sm text-[#F5EAD4]/80 leading-relaxed">
              فخورون بكل طالب وطالبة صنعوا هذا التميز، ونتطلع إلى رؤية المزيد من الإنجازات والنجاحات الأسبوع القادم بإذن الله.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setStage('spotlight');
                  launchCinematicConfetti();
                  if (soundEnabled) playFanfareSound();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0E334D] hover:bg-[#133D5B] border border-[#D4A853] text-[#D4A853] text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                إعادة العرض من البداية ↺
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-[#FFFBF2] text-xs sm:text-sm font-black shadow-lg transition-all cursor-pointer"
              >
                الدخول إلى منصة المدرسة
              </button>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
