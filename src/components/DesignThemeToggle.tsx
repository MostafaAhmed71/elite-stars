'use client';

import React from 'react';
import { School, Sparkles, Moon, Sun, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export type DesignTheme = 'school' | 'space';

interface DesignThemeToggleProps {
  currentTheme: DesignTheme;
  onToggleTheme: (theme: DesignTheme) => void;
  variant?: 'header' | 'floating';
}

export default function DesignThemeToggle({
  currentTheme,
  onToggleTheme,
  variant = 'header',
}: DesignThemeToggleProps) {
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-20 left-4 z-40 hidden sm:block">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 p-1 rounded-full bg-[#071b37]/95 border-2 border-[#FFD884] shadow-[0_0_20px_rgba(255,216,132,0.35)] backdrop-blur-xl"
        >
          <button
            onClick={() => onToggleTheme('school')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentTheme === 'school'
                ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-md'
                : 'text-[#FFF8EA]/70 hover:text-[#FFD884]'
            }`}
            title="التصميم المدرسي الجديد (الصفوف والطلاب)"
          >
            <School className="w-3.5 h-3.5" />
            <span>التصميم المدرسي</span>
          </button>

          <button
            onClick={() => onToggleTheme('space')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentTheme === 'space'
                ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-md'
                : 'text-[#FFF8EA]/70 hover:text-[#FFD884]'
            }`}
            title="التصميم الفضائي الأصلي (الكوكبة والنجوم)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>كوكبة الفضاء</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Header variant
  return (
    <div className="flex items-center bg-[#071B37]/90 border border-[#FFD884]/60 rounded-full p-1 text-xs">
      <button
        onClick={() => onToggleTheme('school')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
          currentTheme === 'school'
            ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-sm'
            : 'text-[#FFF8EA]/70 hover:text-[#FFD884]'
        }`}
        title="التصميم المدرسي البديل"
      >
        <School className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">مدرسي</span>
      </button>

      <button
        onClick={() => onToggleTheme('space')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
          currentTheme === 'space'
            ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-sm'
            : 'text-[#FFF8EA]/70 hover:text-[#FFD884]'
        }`}
        title="التصميم الفضائي الأصلي"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">فضائي</span>
      </button>
    </div>
  );
}
