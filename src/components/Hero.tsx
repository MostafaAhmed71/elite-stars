'use client';

import React from 'react';
import { SchoolConfig, WeeklyEdition } from '@/types';
import { Sparkles, Star } from 'lucide-react';

interface HeroProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  totalStudents: number;
}

export default function Hero({ school, edition, totalStudents }: HeroProps) {
  return (
    <section className="relative pt-6 pb-4 sm:pt-10 sm:pb-6 text-center overflow-hidden">
      {/* Radiant Celestial Halo Light Source */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-gradient-to-b from-[#FFD884]/20 via-[#102D54]/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Decorative Celestial Arch & Star sparkle */}
      <div className="relative inline-block mb-1 pt-3 pb-1 overflow-visible">
        {/* Glowing Star Sparkle on top right of the title */}
        <div className="absolute top-0 -right-4 sm:-right-7 text-[#FFD884] animate-pulse z-10">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-[#FFD884] drop-shadow-[0_0_15px_rgba(255,216,132,1)]" />
        </div>

        {/* Main Golden Title «نجوم الأسبوع» with generous line-height and padding so ascenders are never clipped */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.35] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF8EA] via-[#FFD884] to-[#C99632] drop-shadow-[0_4px_16px_rgba(239,193,108,0.45)] pt-2 pb-2 px-2">
          {school.heroTitle || 'نجوم الأسبوع'}
        </h2>
      </div>

      {/* Subtitle «كوكبة التميز لهذا الأسبوع» */}
      <p className="text-base sm:text-lg md:text-xl font-medium text-[#EFC16C]/90 tracking-wide mt-1">
        {school.heroSubtitle || 'كوكبة التميز لهذا الأسبوع'}
      </p>

      {/* Badge: «— 24 طالباً مكرّماً —» */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#EFC16C]/60 to-transparent" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102D54]/60 border border-[#FFD884]/40 text-xs sm:text-sm font-semibold text-[#FFF8EA] shadow-[0_0_15px_rgba(255,216,132,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD884]" />
          <span>{totalStudents} طالباً مكرّماً</span>
        </div>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#EFC16C]/60 to-transparent" />
      </div>

      {/* Inspirational Celestial Quote from reference */}
      <p className="mt-3 text-xs sm:text-sm text-[#FFF8EA]/75 max-w-md mx-auto italic px-4 font-light">
        &ldquo;{edition.celestialQuote || 'كل طالب يضيء بطريقته.. ومعاً نصنع كوكبة من التميز'}&rdquo;
      </p>
    </section>
  );
}
