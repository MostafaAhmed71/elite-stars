'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Student, SchoolConfig } from '@/types';
import { X, Star, Share2, Download, Trophy, TrendingUp, Heart, Shield, Check, Award, Sparkles, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { generateStudentCardPNG } from '@/lib/cardGenerator';

interface SchoolCertificateModalProps {
  student: Student | null;
  school: SchoolConfig;
  onClose: () => void;
}

export default function SchoolCertificateModal({
  student,
  school,
  onClose,
}: SchoolCertificateModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Grand Celebration Fireworks & Confetti Sequence
  useEffect(() => {
    if (student) {
      // Wave 1: Central gold shower
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#D4A853', '#0B2545', '#F97316', '#FFF7E6', '#F3E5AB'],
      });

      // Wave 2: Left and Right celebratory cannon bursts
      const t1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.08, y: 0.65 },
          colors: ['#D4A853', '#F97316', '#0B2545', '#FFFDF9'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.92, y: 0.65 },
          colors: ['#D4A853', '#F97316', '#0B2545', '#FFFDF9'],
        });
      }, 200);

      // Wave 3: Fine golden sparkle dust
      const t2 = setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 100,
          origin: { y: 0.3 },
          colors: ['#D4A853', '#FFD700', '#FFFDF9'],
          ticks: 200,
          gravity: 0.7,
        });
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [student]);

  if (!student) return null;

  const handleShare = async () => {
    const shareText = `👑 وسام فخر وتكريم!\nنبارك للبطل المتميز: ${student.fullName}\nمن ${student.gradeLevel} (${student.className}) في مدارس نخبة الشمال الأهلية والعالمية لحصوله على وسام "نجم الأسبوع"! ✨`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `نجم الأسبوع: ${student.fullName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FAF6EC',
      });
      const link = document.createElement('a');
      link.download = `وسام_نجم_الأسبوع_${student.fullName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn('html-to-image fallback to canvas generator:', err);
      await generateStudentCardPNG(student, school);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-[430px] my-auto py-2"
        >
          {/* Top Bar with Stage & Close Button */}
          <div className="flex items-center justify-between mb-2 px-1 text-[#FFF7E6]">
            <div className="flex items-center gap-1.5 text-xs text-[#D4A853] font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />
              <span>منصة التكريم والاحتفاء الأسبوعي</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#0B2545] hover:bg-[#D4A853] text-[#D4A853] hover:text-[#0B2545] border border-[#D4A853]/80 transition-all cursor-pointer shadow-md"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* THE ROYAL CERTIFICATE CARD (MASTER ATELIER DESIGN)        */}
          {/* ======================================================== */}
          <div
            ref={cardRef}
            dir="rtl"
            className="relative w-full bg-[#FAF6EC] rounded-[24px] p-4 sm:p-5.5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] text-center overflow-hidden border-[3px] border-[#D4A853] select-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 40%, #FFFFFF 0%, #FAF6EC 60%, #F5ECE0 100%)
              `,
            }}
          >
            {/* Double Gilded Certificate Border */}
            <div className="absolute inset-2 border border-[#D4A853]/60 rounded-[18px] pointer-events-none" />

            {/* Corner Diamond Filigree */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-[#D4A853] rotate-45 pointer-events-none" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#D4A853] rotate-45 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-[#D4A853] rotate-45 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-[#D4A853] rotate-45 pointer-events-none" />

            {/* Top-Left Royal Navy & Gilded Wave Flourish */}
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0 0 L0 75 C24 68 48 48 65 26 C72 18 76 9 78 0 Z" fill="#0B2545" />
                <path d="M0 80 C26 72 52 51 70 28 C77 20 81 10 83 0" fill="none" stroke="#D4A853" strokeWidth="3.5" />
                <path d="M0 86 C30 77 57 54 76 30 C83 21 87 11 89 0" fill="none" stroke="#F3E5AB" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Bottom-Right Royal Navy & Gilded Wave Flourish */}
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none overflow-hidden rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0 0 L0 75 C24 68 48 48 65 26 C72 18 76 9 78 0 Z" fill="#0B2545" />
                <path d="M0 80 C26 72 52 51 70 28 C77 20 81 10 83 0" fill="none" stroke="#D4A853" strokeWidth="3.5" />
                <path d="M0 86 C30 77 57 54 76 30 C83 21 87 11 89 0" fill="none" stroke="#F3E5AB" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Top-Right Royal Navy Bookmark Ribbon with Gilded Star */}
            <div className="absolute top-0 right-5 sm:right-6 w-7 sm:w-8 h-12 sm:h-14 pointer-events-none drop-shadow-md z-10">
              <svg viewBox="0 0 32 56" className="w-full h-full">
                <path d="M0 0 L32 0 L32 46 L16 36 L0 46 Z" fill="#0B2545" stroke="#D4A853" strokeWidth="2" />
                <polygon points="16,15 18,21 24,21 19,25 21,31 16,27 11,31 13,25 8,21 14,21" fill="#D4A853" />
              </svg>
            </div>

            {/* ======================================================== */}
            {/* SECTION 1: OFFICIAL SCHOOL MEDALLION & TITLES            */}
            {/* ======================================================== */}
            <div className="relative z-10 flex flex-col items-center mt-1 mb-2">
              {/* School Logo in Round Medallion Frame (No raw square) */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 border-2 border-[#D4A853] shadow-[0_4px_12px_rgba(212,168,83,0.35)] flex items-center justify-center mb-1.5 overflow-hidden">
                <Image
                  src="/images/school-logo.jpg"
                  alt="شعار مدارس نخبة الشمال"
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>

              {/* School Names (Arabic & English) */}
              <h3 className="text-xs sm:text-sm font-black text-[#0B2545] tracking-tight leading-tight">
                مدارس نخبة الشمال الأهلية والعالمية بمحافظة رفحاء
              </h3>
              <p className="text-[8.5px] sm:text-[9.5px] text-[#1E5162] font-extrabold tracking-wide mt-0.5">
                Northern Elite Private and International Schools in Rafha
              </p>
            </div>

            {/* ======================================================== */}
            {/* SECTION 2: GILDED CALLIGRAPHIC TITLE: نجم الأسبوع        */}
            {/* ======================================================== */}
            <div className="relative z-10 flex flex-col items-center my-1.5">
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                {/* Left Gilded Laurel Branch */}
                <svg viewBox="0 0 50 25" className="w-8 sm:w-10 h-5 sm:h-6 text-[#D4A853] fill-current">
                  <path d="M46 16 C34 14 22 8 13 1 C16 8 24 14 32 17 Z M34 19 C24 19 16 13 7 6 C10 13 18 19 27 21 Z M24 22 C14 22 7 18 1 14 C5 20 12 23 20 23 Z" />
                </svg>

                {/* Grand Embossed Royal Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B2545] tracking-tight whitespace-nowrap drop-shadow-[0_2px_4px_rgba(212,168,83,0.25)] font-sans">
                  نجم الأسبوع
                </h1>

                {/* Right Gilded Laurel Branch (Mirrored) */}
                <svg viewBox="0 0 50 25" className="w-8 sm:w-10 h-5 sm:h-6 text-[#D4A853] fill-current scale-x-[-1]">
                  <path d="M46 16 C34 14 22 8 13 1 C16 8 24 14 32 17 Z M34 19 C24 19 16 13 7 6 C10 13 18 19 27 21 Z M24 22 C14 22 7 18 1 14 C5 20 12 23 20 23 Z" />
                </svg>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 3: STUDENT PORTRAIT & LUSH GILDED LAUREL WREATH  */}
            {/* ======================================================== */}
            <div className="relative z-10 flex flex-col items-center my-2 sm:my-3">
              <div className="relative w-36 h-36 sm:w-42 sm:h-42 flex items-center justify-center">
                
                {/* Majestic Sculpted Gold Laurel Wreath SVG */}
                <svg
                  viewBox="0 0 180 180"
                  className="absolute inset-0 w-full h-full pointer-events-none text-[#D4A853] fill-[#D4A853]"
                >
                  {/* Left Wreath Branch */}
                  <g>
                    <path d="M45 145 C24 120 20 85 34 52" fill="none" stroke="#D4A853" strokeWidth="2.5" />
                    <ellipse cx="28" cy="98" rx="8" ry="5" transform="rotate(-30 28 98)" />
                    <ellipse cx="32" cy="76" rx="8" ry="5" transform="rotate(-45 32 76)" />
                    <ellipse cx="44" cy="56" rx="8" ry="5" transform="rotate(-60 44 56)" />
                    <ellipse cx="60" cy="38" rx="8" ry="5" transform="rotate(-75 60 38)" />
                    <ellipse cx="40" cy="120" rx="8" ry="5" transform="rotate(-15 40 120)" />
                    <ellipse cx="38" cy="88" rx="6" ry="3.5" transform="rotate(20 38 88)" fill="#F3E5AB" />
                    <ellipse cx="48" cy="68" rx="6" ry="3.5" transform="rotate(10 48 68)" fill="#F3E5AB" />
                  </g>
                  {/* Right Wreath Branch */}
                  <g transform="translate(180, 0) scale(-1, 1)">
                    <path d="M45 145 C24 120 20 85 34 52" fill="none" stroke="#D4A853" strokeWidth="2.5" />
                    <ellipse cx="28" cy="98" rx="8" ry="5" transform="rotate(-30 28 98)" />
                    <ellipse cx="32" cy="76" rx="8" ry="5" transform="rotate(-45 32 76)" />
                    <ellipse cx="44" cy="56" rx="8" ry="5" transform="rotate(-60 44 56)" />
                    <ellipse cx="60" cy="38" rx="8" ry="5" transform="rotate(-75 60 38)" />
                    <ellipse cx="40" cy="120" rx="8" ry="5" transform="rotate(-15 40 120)" />
                    <ellipse cx="38" cy="88" rx="6" ry="3.5" transform="rotate(20 38 88)" fill="#F3E5AB" />
                    <ellipse cx="48" cy="68" rx="6" ry="3.5" transform="rotate(10 48 68)" fill="#F3E5AB" />
                  </g>
                </svg>

                {/* Circular Portrait Frame with Polished Gold Medal Bezel */}
                <div className="relative w-26 h-26 sm:w-30 sm:h-30 rounded-full p-1 bg-gradient-to-tr from-[#996515] via-[#F3E5AB] to-[#C59B27] shadow-[0_8px_25px_rgba(11,37,69,0.35)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-2 border-[#D4A853]">
                    <Image
                      src={student.avatarUrl || '/images/students/omar-ahmed.jpg'}
                      alt={student.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>



              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 4: ROYAL DIPLOMA NAME PLAQUE (براءة التكريم)      */}
            {/* ======================================================== */}
            <div className="relative z-10 max-w-[300px] sm:max-w-xs mx-auto mt-2 mb-2">
              <div className="relative rounded-2xl bg-white/95 border-2 border-[#D4A853] py-2.5 px-4 shadow-sm">
                
                {/* Plaque Classical Corner Filigree */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#0B2545]" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#0B2545]" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#0B2545]" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#0B2545]" />

                {/* Student Full Name */}
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight">
                  {student.fullName}
                </h2>

                {/* Gold Separator with Diamond */}
                <div className="flex items-center justify-center gap-2 my-1">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A853]" />
                  <div className="w-1.5 h-1.5 bg-[#D4A853] rotate-45" />
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A853]" />
                </div>

                {/* Grade and Class (e.g. الصف الثاني / أ) */}
                <p className="text-xs sm:text-sm font-extrabold text-[#0B2545]">
                  {student.gradeLevel} / {student.className.split('/')[1] || student.className}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 5: ACHIEVEMENT CHEVRON RIBBON                    */}
            {/* ======================================================== */}
            <div className="relative z-10 flex justify-center my-2">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-1.5 bg-[#0B2545] text-[#FFF7E6] rounded-xl border border-[#D4A853] shadow-sm">
                <GraduationCap className="w-4 h-4 text-[#D4A853]" />
                <span className="text-xs sm:text-sm font-black tracking-wide">
                  وسام {student.category || student.badges?.[0] || 'التميز والتفوق'}
                </span>
                <GraduationCap className="w-4 h-4 text-[#D4A853]" />
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 6: CONGRATULATORY CITATION PARCHMENT             */}
            {/* ======================================================== */}
            <div className="relative z-10 max-w-[340px] sm:max-w-sm mx-auto my-2">
              <div className="rounded-2xl bg-white/95 border border-[#D4A853]/70 p-3 shadow-sm text-center">
                <p className="text-xs sm:text-sm font-black text-[#0B2545] mb-1">
                  مبروك يا بطل.. فخورون بك!
                </p>
                <p className="text-[11px] sm:text-xs text-[#173331] font-bold leading-relaxed">
                  {student.recognitionReason || 'تقديراً لتميزك الاستثنائي، وانضباطك العالي، وكونك قدوة حسنة ومصدر فخر واعتزاز لأسرتك ومدرستك.'}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 7: 4 GILDED HONOR MEDALLIONS                     */}
            {/* ======================================================== */}
            <div className="relative z-10 grid grid-cols-4 gap-1.5 sm:gap-2 max-w-[360px] mx-auto mt-2.5">
              
              {/* Medallion 1: قدوة حسنة */}
              <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/95 border border-[#D4A853]/60 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B2545] text-[#D4A853] flex items-center justify-center mb-1 shadow-xs">
                  <Trophy className="w-3.5 h-3.5 text-[#D4A853]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-[#0B2545] truncate max-w-full">
                  قدوة حسنة
                </span>
              </div>

              {/* Medallion 2: مبادرة */}
              <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/95 border border-[#D4A853]/60 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B2545] text-[#D4A853] flex items-center justify-center mb-1 shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D4A853]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-[#0B2545] truncate max-w-full">
                  مبادرة
                </span>
              </div>

              {/* Medallion 3: سلوك مميز */}
              <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/95 border border-[#D4A853]/60 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B2545] text-[#D4A853] flex items-center justify-center mb-1 shadow-xs">
                  <Heart className="w-3.5 h-3.5 text-[#D4A853]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-[#0B2545] truncate max-w-full">
                  سلوك مميز
                </span>
              </div>

              {/* Medallion 4: الانضباط */}
              <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/95 border border-[#D4A853]/60 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B2545] text-[#D4A853] flex items-center justify-center mb-1 shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-[#D4A853]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-[#0B2545] truncate max-w-full">
                  الانضباط
                </span>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* EXTERNAL ACTION BUTTONS: DOWNLOAD & SHARE (OUTSIDE CARD) */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2.5 mt-3 px-1">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-3 rounded-2xl bg-[#0B2545] hover:bg-[#07172B] border-2 border-[#D4A853] text-xs font-bold text-[#FFF7E6] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>تم نسخ الرابط!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#D4A853]" />
                  <span>مشاركة الإنجاز</span>
                </>
              )}
            </button>

            {/* Download Certificate Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-[2] py-3 px-4 rounded-2xl bg-gradient-to-r from-[#C59B27] via-[#D4A853] to-[#C59B27] hover:brightness-110 text-[#0B2545] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,168,83,0.45)] transition-all cursor-pointer disabled:opacity-60 border border-white/60 active:scale-95"
            >
              <Download className="w-4 h-4 text-[#0B2545]" />
              <span>{isDownloading ? 'جاري تصدير الوسام...' : 'تحميل بطاقة التكريم'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
