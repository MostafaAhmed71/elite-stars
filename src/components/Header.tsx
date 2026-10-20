'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SchoolConfig, WeeklyEdition } from '@/types';
import { Search, Sparkles, Shield, Archive, Menu, X, BookOpen, Star, School } from 'lucide-react';
import DesignThemeToggle, { DesignTheme } from './DesignThemeToggle';

interface HeaderProps {
  school: SchoolConfig;
  activeEdition: WeeklyEdition;
  allEditions: WeeklyEdition[];
  currentTheme: DesignTheme;
  onToggleTheme: (theme: DesignTheme) => void;
  onSelectEdition: (editionId: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenArchive: () => void;
}

export default function Header({
  school,
  activeEdition,
  allEditions,
  currentTheme,
  onToggleTheme,
  onSelectEdition,
  onOpenSearch,
  onOpenAdmin,
  onOpenArchive,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#061325]/85 border-b border-[#EFC16C]/25 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* School Identity with Official Logo */}
        <div className="flex items-center gap-3">
          {/* Official School Logo in Glowing Golden Emblem Frame */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white p-1 border-2 border-[#FFD884] shadow-[0_0_18px_rgba(255,216,132,0.35)] shrink-0 overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/images/school-logo.jpg"
                alt="شعار مدارس نخبة الشمال"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD884] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD884]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#FFF8EA]">
                {school.name}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFD884]/15 text-[#FFD884] border border-[#FFD884]/30">
                نجوم الأسبوع
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#EFC16C]/90 font-medium">
              {school.slogan}
            </p>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher Toggle (School vs Space) */}
          <DesignThemeToggle
            currentTheme={currentTheme}
            onToggleTheme={onToggleTheme}
            variant="header"
          />

          {/* Week Selector */}
          <div className="relative flex items-center bg-[#071B37]/80 border border-[#EFC16C]/30 rounded-full px-3 py-1.5 text-xs text-[#FFF8EA]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD884] ml-1.5" />
            <select
              value={activeEdition.id}
              onChange={(e) => onSelectEdition(e.target.value)}
              className="bg-transparent text-xs text-[#FFF8EA] focus:outline-none cursor-pointer pr-1"
            >
              {allEditions.map((ed) => (
                <option key={ed.id} value={ed.id} className="bg-[#071B37] text-[#FFF8EA]">
                  {ed.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102D54]/60 hover:bg-[#102D54] border border-[#EFC16C]/30 hover:border-[#FFD884] text-xs text-[#FFF8EA] transition-all cursor-pointer"
            title="بحث عن طالب"
          >
            <Search className="w-3.5 h-3.5 text-[#FFD884]" />
            <span>بحث</span>
          </button>

          {/* Archive Trigger */}
          <button
            onClick={onOpenArchive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102D54]/60 hover:bg-[#102D54] border border-[#EFC16C]/30 hover:border-[#FFD884] text-xs text-[#FFF8EA] transition-all cursor-pointer"
            title="أرشيف الأسابيع"
          >
            <Archive className="w-3.5 h-3.5 text-[#FFD884]" />
            <span>الأرشيف</span>
          </button>

          {/* Admin Management Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FFD884]/20 to-[#EFC16C]/30 hover:from-[#FFD884]/30 hover:to-[#EFC16C]/40 border border-[#FFD884]/60 text-xs font-semibold text-[#FFD884] transition-all cursor-pointer shadow-[0_0_12px_rgba(255,216,132,0.2)]"
          >
            <Shield className="w-3.5 h-3.5 text-[#FFD884]" />
            <span>لوحة الإدارة</span>
          </button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick theme toggle on mobile */}
          <button
            onClick={() => onToggleTheme(currentTheme === 'school' ? 'space' : 'school')}
            className="p-2 rounded-lg bg-[#102D54]/80 border border-[#FFD884]/40 text-[#FFD884]"
            title={currentTheme === 'school' ? 'التحويل للتصميم الفضائي' : 'التحويل للتصميم المدرسي'}
          >
            {currentTheme === 'school' ? <Sparkles className="w-4 h-4" /> : <School className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-[#102D54]/80 border border-[#EFC16C]/30 text-[#FFD884]"
            aria-label="بحث"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#102D54]/80 border border-[#EFC16C]/30 text-[#FFD884]"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EFC16C]/20 bg-[#071B37]/95 backdrop-blur-2xl px-4 py-4 space-y-3 transition-all animate-in slide-in-from-top-2">
          <div className="text-xs text-[#EFC16C] font-semibold mb-1">
            الأسبوع الحالي المعروض:
          </div>
          <div className="text-sm font-bold text-[#FFF8EA] pb-2 border-b border-[#102D54]">
            {activeEdition.title}
          </div>

          {/* Theme Selector for Mobile */}
          <div className="pt-1">
            <div className="text-xs text-[#EFC16C] font-semibold mb-2">نمط التصميم:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onToggleTheme('school');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  currentTheme === 'school'
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] border-[#FFD884]'
                    : 'bg-[#102D54]/70 text-[#FFF8EA] border-[#EFC16C]/30'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>التصميم المدرسي</span>
              </button>

              <button
                onClick={() => {
                  onToggleTheme('space');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  currentTheme === 'space'
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] border-[#FFD884]'
                    : 'bg-[#102D54]/70 text-[#FFF8EA] border-[#EFC16C]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>كوكبة الفضاء</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenArchive();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#102D54]/70 border border-[#EFC16C]/30 text-xs font-medium text-[#FFF8EA]"
            >
              <Archive className="w-4 h-4 text-[#FFD884]" />
              <span>أرشيف الأسابيع</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FFD884]/20 to-[#EFC16C]/30 border border-[#FFD884]/60 text-xs font-semibold text-[#FFD884]"
            >
              <Shield className="w-4 h-4 text-[#FFD884]" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
