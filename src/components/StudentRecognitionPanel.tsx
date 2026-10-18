'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Student, SchoolConfig } from '@/types';
import { X, Star, Share2, Download, Check, Sparkles, Users, BookOpen, Award, Heart, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateStudentCardPNG } from '@/lib/cardGenerator';

interface StudentRecognitionPanelProps {
  student: Student | null;
  school: SchoolConfig;
  onClose: () => void;
}

export default function StudentRecognitionPanel({
  student,
  school,
  onClose,
}: StudentRecognitionPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Celebratory golden confetti burst on opening
  useEffect(() => {
    if (student) {
      // Primary burst
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FFD884', '#FFE8A3', '#EFC16C', '#D4AF37', '#FFF8EA', '#38BDF8'],
      });

      // Secondary delayed sparkle burst
      const timer = setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors: ['#FFD884', '#FFFFFF'],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors: ['#FFD884', '#FFFFFF'],
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [student]);

  if (!student) return null;

  // Handle Share
  const handleShare = async () => {
    const shareText = `🌟 نفخر ونعتز بنجم الأسبوع الطالب المتميز: ${student.fullName} من ${student.gradeLevel} (${student.className}) في ${school.name}!\n\nنبارك له هذا التميز والتألق الدائم.`;
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
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // Handle Download PNG
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateStudentCardPNG(student, school);
    } catch (err) {
      console.error('Failed to generate student card PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Trait sub-labels for emotional resonance
  const getBadgeSubtitle = (index: number) => {
    if (index === 0) return 'سلوك رفيع';
    if (index === 1) return 'روح التعاون';
    return 'شغف علمي';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#030B17]/88 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* The Cinematic Digital Honor Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] rounded-[32px] p-[1.5px] bg-gradient-to-b from-[#FFE8A3] via-[#EFC16C]/60 to-[#B8861E]/40 shadow-[0_0_80px_rgba(255,216,132,0.35),0_25px_60px_rgba(0,0,0,0.9)] z-10 text-center overflow-hidden animate-in zoom-in-95 duration-300 my-auto"
      >
        {/* Inner Card Container */}
        <div className="relative w-full rounded-[31px] bg-gradient-to-b from-[#081B38] via-[#061427] to-[#040C1A] px-5 py-6 sm:px-7 sm:py-7 overflow-hidden text-center">
          
          {/* Layered Cosmic Dust & Radial Nebula Bloom */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-[#FFD884]/25 via-[#1E4D8C]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#102D54]/40 rounded-full blur-2xl pointer-events-none" />

          {/* Luxury Filigree Corner Accents */}
          <div className="absolute top-3.5 right-3.5 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 2h14c3.3 0 6 2.7 6 6v14" stroke="#FFD884" strokeWidth="1.5" />
              <path d="M6 6h10c1.1 0 2 .9 2 2v10" stroke="#EFC16C" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="2" cy="2" r="1.5" fill="#FFE8A3" />
            </svg>
          </div>
          <div className="absolute top-3.5 left-3.5 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-270">
              <path d="M2 2h14c3.3 0 6 2.7 6 6v14" stroke="#FFD884" strokeWidth="1.5" />
              <path d="M6 6h10c1.1 0 2 .9 2 2v10" stroke="#EFC16C" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="2" cy="2" r="1.5" fill="#FFE8A3" />
            </svg>
          </div>
          <div className="absolute bottom-3.5 right-3.5 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-90">
              <path d="M2 2h14c3.3 0 6 2.7 6 6v14" stroke="#FFD884" strokeWidth="1.5" />
              <path d="M6 6h10c1.1 0 2 .9 2 2v10" stroke="#EFC16C" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="2" cy="2" r="1.5" fill="#FFE8A3" />
            </svg>
          </div>
          <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
              <path d="M2 2h14c3.3 0 6 2.7 6 6v14" stroke="#FFD884" strokeWidth="1.5" />
              <path d="M6 6h10c1.1 0 2 .9 2 2v10" stroke="#EFC16C" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="2" cy="2" r="1.5" fill="#FFE8A3" />
            </svg>
          </div>

          {/* Close Button `×` */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#102D54]/50 hover:bg-[#102D54] border border-[#FFD884]/40 flex items-center justify-center text-[#FFD884] transition-all cursor-pointer z-30 shadow-md group"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {/* Header Title: School Logo Emblem & Honor Badge */}
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#FFD884]/70" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#102D54]/70 border border-[#FFD884]/50 shadow-sm">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white p-0.5 shrink-0 border border-[#FFD884]">
                <Image
                  src="/images/school-logo.jpg"
                  alt="شعار مدارس نخبة الشمال"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] font-black text-[#FFF8EA] tracking-wide">
                {school.name}
              </span>
            </div>
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#FFD884]/70" />
          </div>

          {/* HERO PORTRAIT ARENA WITH RADIANT SUNBURST & 3D GOLDEN RIBBON */}
          <div className="relative mx-auto w-48 h-48 sm:w-52 sm:h-52 my-3 flex items-center justify-center">
            
            {/* Top 3D Faceted Diamond-Cut Crown Star */}
            <div className="absolute -top-4 z-30 filter drop-shadow-[0_0_15px_rgba(255,216,132,1)] animate-bounce-slow">
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="starFacetLight2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#FFE8A3" />
                    <stop offset="100%" stopColor="#FFD884" />
                  </linearGradient>
                  <linearGradient id="starFacetDark2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EFC16C" />
                    <stop offset="70%" stopColor="#C99632" />
                    <stop offset="100%" stopColor="#8A6014" />
                  </linearGradient>
                </defs>
                {/* 5-point faceted diamond star */}
                <polygon points="24,2 29,17 45,17 32,27 37,42 24,32" fill="url(#starFacetLight2)" />
                <polygon points="24,2 24,32 11,42 16,27 3,17 19,17" fill="url(#starFacetDark2)" />
                {/* Center sparkling jewel node */}
                <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Rotating Celestial Sunburst Rays (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -z-10 animate-spin-slow"
              viewBox="0 0 220 220"
            >
              <defs>
                <linearGradient id="celestialRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE8A3" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#FFD884" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#EFC16C" stopOpacity="0" />
                </linearGradient>
              </defs>
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i * 360) / 32;
                return (
                  <line
                    key={i}
                    x1="110"
                    y1="110"
                    x2={110 + Math.cos((angle * Math.PI) / 180) * 105}
                    y2={110 + Math.sin((angle * Math.PI) / 180) * 105}
                    stroke="url(#celestialRayGrad)"
                    strokeWidth={i % 2 === 0 ? '2' : '1'}
                  />
                );
              })}
            </svg>

            {/* Outer Concentric Orbit Ring with Mini Star Sparkles */}
            <div className="absolute inset-2 rounded-full border border-[#FFD884]/30 pointer-events-none -z-10">
              <span className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-[#FFE8A3] shadow-[0_0_8px_#FFE8A3]" />
              <span className="absolute bottom-4 left-3 w-1.5 h-1.5 rounded-full bg-[#FFE8A3] shadow-[0_0_8px_#FFE8A3]" />
            </div>

            {/* Multi-Tier Metallic Gold Beveled Medal Frame */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full p-[3.5px] bg-gradient-to-tr from-[#996515] via-[#FFD884] to-[#FFF9E6] shadow-[0_0_40px_rgba(255,216,132,0.7),inset_0_0_20px_rgba(255,216,132,0.5)]">
              {/* Inner Midnight Bezel Ring */}
              <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-b from-[#071B37] to-[#040C1A]">
                {/* Portrait Image Holder */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-[2.5px] border-[#FFE8A3]/80">
                  <Image
                    src={student.avatarUrl}
                    alt={student.fullName}
                    fill
                    className="object-cover object-center scale-105"
                    priority
                  />
                  {/* Subtle inner shadow rim for cinematic depth */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.55)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dimensional Sculpted Gold Award Ribbon «نجم الأسبوع» */}
            <div className="absolute -bottom-3.5 z-20 w-[235px] sm:w-[250px] flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <svg
                viewBox="0 0 280 62"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Main Banner Gradient */}
                  <linearGradient id="goldRibbonSurface" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A67C1E" />
                    <stop offset="15%" stopColor="#D4AF37" />
                    <stop offset="35%" stopColor="#FFE8A3" />
                    <stop offset="50%" stopColor="#FFF9E6" />
                    <stop offset="65%" stopColor="#FFE8A3" />
                    <stop offset="85%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#A67C1E" />
                  </linearGradient>

                  {/* Fold Tails Gradient */}
                  <linearGradient id="goldRibbonTails" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8A6314" />
                    <stop offset="100%" stopColor="#4A3408" />
                  </linearGradient>
                </defs>

                {/* Left Ribbon Tail (Swallow-tail) */}
                <path
                  d="M 6 15 L 38 15 L 38 48 L 6 48 L 20 31.5 Z"
                  fill="url(#goldRibbonTails)"
                />
                {/* Left Deep Fold Shadow */}
                <polygon points="38,42 38,54 52,42" fill="#3D2905" />

                {/* Right Ribbon Tail (Swallow-tail) */}
                <path
                  d="M 274 15 L 242 15 L 242 48 L 274 48 L 260 31.5 Z"
                  fill="url(#goldRibbonTails)"
                />
                {/* Right Deep Fold Shadow */}
                <polygon points="242,42 242,54 228,42" fill="#3D2905" />

                {/* Main Curved Banner Body */}
                <rect
                  x="34"
                  y="8"
                  width="212"
                  height="42"
                  rx="6"
                  fill="url(#goldRibbonSurface)"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />

                {/* Subtle Inner Highlight Line on Banner */}
                <line x1="42" y1="12" x2="238" y2="12" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1" />

                {/* Center Calligraphic Title «نجم الأسبوع» */}
                <text
                  x="140"
                  y="36"
                  textAnchor="middle"
                  fill="#071B37"
                  fontSize="22"
                  fontWeight="900"
                  fontFamily="'Cairo', sans-serif"
                  style={{ letterSpacing: '0.6px' }}
                >
                  نجم الأسبوع
                </text>
              </svg>
            </div>
          </div>

          {/* STUDENT NAME & CLASS (Celebratory Typography) */}
          <div className="mt-5 mb-3">
            <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF9E6] via-[#FFD884] to-[#EFC16C] tracking-tight drop-shadow-[0_4px_16px_rgba(255,216,132,0.4)]">
              {student.fullName}
            </h3>

            {/* Class & Grade Tag */}
            <div className="inline-flex items-center gap-2 mt-1.5 px-3.5 py-1 rounded-full bg-[#102D54]/50 border border-[#EFC16C]/40 text-xs font-bold text-[#FFD884] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD884]" />
              <span>{student.gradeLevel} • الفصل {student.className}</span>
            </div>
          </div>

          {/* CONGRATULATORY CITATION CARTOUCHE (Honored Statement) */}
          <div className="relative my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0F2D54]/60 to-[#081B34]/80 border-[1.2px] border-[#FFD884]/40 text-center shadow-[inset_0_0_20px_rgba(16,45,84,0.4)]">
            {/* Top-Right Golden Quotation Mark */}
            <span className="absolute -top-3 right-5 text-2xl font-serif text-[#FFD884] bg-[#071B37] px-2 rounded-full leading-none shadow-sm">
              &rdquo;
            </span>

            <p className="text-xs sm:text-sm text-[#FFF8EA] font-semibold leading-relaxed px-1">
              {student.recognitionReason}
            </p>

            {/* Bottom-Left Golden Quotation Mark */}
            <span className="absolute -bottom-3 left-5 text-2xl font-serif text-[#FFD884] bg-[#071B37] px-2 rounded-full leading-none shadow-sm">
              &ldquo;
            </span>
          </div>

          {/* THREE LUXURY ACHIEVEMENT MEDALLIONS (Structured Honors) */}
          <div className="grid grid-cols-3 gap-2 my-4 pt-1">
            {student.badges.map((badge, idx) => {
              let IconComponent = Award;
              if (idx === 0) IconComponent = Star;
              if (idx === 1) IconComponent = Users;
              if (idx === 2) IconComponent = BookOpen;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-[#102D54]/40 to-[#071B37]/60 border border-[#FFD884]/30 hover:border-[#FFD884]/70 transition-all group"
                >
                  {/* Glowing Medallion Token */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C99632] via-[#FFD884] to-[#FFF9E6] p-[1.5px] shadow-[0_0_12px_rgba(255,216,132,0.4)] mb-1.5 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#081B38] flex items-center justify-center text-[#FFD884]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Badge Label */}
                  <span className="text-[11px] sm:text-xs font-bold text-[#FFF8EA] leading-tight text-center">
                    {badge}
                  </span>

                  {/* Subtitle */}
                  <span className="text-[9px] text-[#EFC16C]/75 font-medium mt-0.5">
                    {getBadgeSubtitle(idx)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS (HIGH-IMPACT CTAs) */}
          <div className="space-y-2.5 mt-5">
            {/* Primary Action: Download PNG Award Card */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FFD884] via-[#FFE29A] to-[#EFC16C] hover:from-[#FFF9E6] hover:via-[#FFD884] hover:to-[#EFC16C] text-[#061325] text-xs sm:text-sm font-black shadow-[0_0_30px_rgba(255,216,132,0.45),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#061325] stroke-[2.5]" />
              <span>
                {isDownloading ? 'جارِ تجهيز وتحميل وسام التكريم...' : 'تحميل بطاقة التكريم النهائية (PNG)'}
              </span>
            </button>

            {/* Secondary Action: Share Achievement */}
            <button
              onClick={handleShare}
              className="w-full py-2.5 px-4 rounded-xl bg-[#102D54]/50 hover:bg-[#102D54]/90 border border-[#FFD884]/50 text-xs font-bold text-[#FFD884] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                  <span className="text-emerald-300">تم نسخ رابط وسام التكريم بنجاح!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#FFD884]" />
                  <span>مشاركة إنجاز الطالب مع الأهل والأصدقاء</span>
                </>
              )}
            </button>
          </div>

          {/* Certificate Footer Watermark */}
          <div className="mt-4 pt-3 border-t border-[#EFC16C]/15 flex items-center justify-between text-[10px] text-[#EFC16C]/70">
            <span>شهادة فخر واعتزاز رقمية</span>
            <span>العام الدراسي 1446هـ</span>
          </div>

        </div>
      </div>
    </div>
  );
}
