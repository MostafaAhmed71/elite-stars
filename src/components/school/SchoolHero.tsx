'use client';

import React from 'react';
import Image from 'next/image';
import { SchoolConfig, WeeklyEdition } from '@/types';
import { Calendar, Users, ChevronDown, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolHeroProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  totalStudents: number;
  onExploreClick: () => void;
  onPlayCinematic?: () => void;
}

export default function SchoolHero({
  school,
  edition,
  totalStudents,
  onExploreClick,
  onPlayCinematic,
}: SchoolHeroProps) {
  return (
    <section className="relative w-full overflow-hidden text-center pt-6 pb-8 px-4">
      {/* Background Ambience with Soft Petrol & Warm Ivory Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#E6F4F1] via-[#FFF7E6]/40 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* ULTRA-PROMINENT & RESPONSIVE TITLE: [شعار المدرسة] نجوم الأسبوع [شعار المنصة] */}
        <div className="mb-4 flex flex-col items-center w-full max-w-full px-2">
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-3xl mx-auto">
            {/* School Logo on Right (RTL first child) */}
            <div className="relative w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-1 border-2 border-[#D4A853] shadow-md hover:scale-105 transition-transform">
              <Image
                src="/images/school-logo.jpg"
                alt="شعار مدارس نخبة الشمال"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title in Center with fluid responsive size */}
            <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0B3D3A] tracking-tight leading-none text-center whitespace-nowrap">
              نجوم الأسبوع
            </h1>

            {/* Platform Logo on Left (RTL last child) */}
            <div className="relative w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-1 border-2 border-[#D4A853] shadow-md hover:scale-105 transition-transform">
              <Image
                src="/Elite Stars Emblem with Arabic Wordmark.png"
                alt="شعار منصة نجوم النخبة"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Subtitle Badge before the quote */}
          <div className="mt-2.5 sm:mt-3">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-[#E6F4F1] border border-[#0F766E]/20 text-[#0B3D3A] text-[11px] sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>المرحلة الابتدائية • منصة التكريم والاحتفاء الأسبوعي</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            </span>
          </div>

          {/* Inspiring Quote */}
          <p className="mt-2 text-xs sm:text-base text-[#4B6B67] font-semibold max-w-lg mx-auto px-2">
            &ldquo; لأن كل طفل مميز .. وكل إنجاز يستحق الاحتفاء والفخر &rdquo;
          </p>
        </div>

        {/* Celebratory Visual Arch / School Gateway Showcase */}
        <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-[#D4A853]/40 shadow-xl bg-white mb-6">
          <div className="relative h-60 sm:h-72 md:h-80 w-full">
            <Image
              src="/images/theme-school/hero_school.jpg"
              alt="مدارس نخبة الشمال - مدخل الاحتفال"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Elegant Gradient Overlay with Petroleum and Warm Ivory */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A]/90 via-[#0B3D3A]/30 to-transparent" />

            {/* School Tag inside image */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#0B3D3A]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4A853]/60 shadow-md">
              <Award className="w-3.5 h-3.5 text-[#D4A853]" />
              <span className="text-xs font-bold text-[#FFF7E6]">
                {school.name || 'مدارس نخبة الشمال الأهلية'}
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-[#FFF7E6]">
              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#D4A853] block">
                  لوحة الشرف والتكريم
                </span>
                <span className="text-sm sm:text-base font-black">
                  فصول المرحلة الابتدائية المتميزة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Card with CTA in Ivory & Soft Petroleum - Placed cleanly below image without overlap */}
        <div className="w-full max-w-xl bg-white/95 border-2 border-[#0B3D3A]/10 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md relative z-10">
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Current Week Box */}
            <div className="flex items-center gap-3 bg-[#E6F4F1] border border-[#0F766E]/20 rounded-2xl p-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#0F766E]/30 flex items-center justify-center shrink-0 text-[#0F766E] shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#4B6B67] font-semibold block">
                  الأسبوع الحالي
                </span>
                <span className="text-xs sm:text-sm font-black text-[#0B3D3A]">
                  {edition.title?.split('-')[0] || '12 - 18 أكتوبر 2026'}
                </span>
              </div>
            </div>

            {/* Total Honored Students Box */}
            <div className="flex items-center gap-3 bg-[#FFF7E6] border border-[#D4A853]/30 rounded-2xl p-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F97316]/30 flex items-center justify-center shrink-0 text-[#F97316] shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#4B6B67] font-semibold block">
                  نجوم الأسبوع
                </span>
                <span className="text-xs sm:text-sm font-black text-[#F97316]">
                  {totalStudents === 0
                    ? 'سيتم إعلان النجوم قريباً'
                    : totalStudents === 1
                    ? 'طالب واحد متميز'
                    : totalStudents === 2
                    ? 'طالبان متميزان'
                    : `${totalStudents} طالباً متميزاً`}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Action Buttons: Explore & Cinematic Replay */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onExploreClick}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-[#FFF7E6] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(249,115,22,0.35)] transition-all cursor-pointer border-2 border-white/40"
            >
              <span>استعرض الفصول والنجوم</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>

            {onPlayCinematic && (
              <button
                onClick={onPlayCinematic}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#0B3D3A] hover:bg-[#072523] text-[#D4A853] hover:text-[#FFF7E6] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(11,61,58,0.25)] border-2 border-[#D4A853] transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#D4A853] group-hover:rotate-12 transition-transform" />
                <span>إعادة مشاهدة حفل التكريم 🎬</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
