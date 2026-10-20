'use client';

import React, { useState } from 'react';
import { Sparkles, Info, Trophy, X, CheckCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolNavigationTabsProps {
  activeTab: 'classes' | 'features' | 'about';
  onSelectTab: (tab: 'classes' | 'features' | 'about') => void;
}

export default function SchoolNavigationTabs({
  activeTab,
  onSelectTab,
}: SchoolNavigationTabsProps) {
  const [modalType, setModalType] = useState<'features' | 'about' | null>(null);

  const handleTabClick = (tab: 'classes' | 'features' | 'about') => {
    onSelectTab(tab);
    if (tab === 'features' || tab === 'about') {
      setModalType(tab);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-center py-4 px-4">
        {/* Ivory & Petroleum Segmented Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-[#0B3D3A]/15 shadow-md max-w-md w-full justify-between">
          
          {/* Tab 1: عن المبادرة */}
          <button
            onClick={() => handleTabClick('about')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#0B3D3A] text-[#FFF7E6] font-black shadow-sm'
                : 'text-[#4B6B67] hover:text-[#0B3D3A] hover:bg-[#E6F4F1]'
            }`}
          >
            عن المبادرة
          </button>

          {/* Tab 2: مميزاتنا */}
          <button
            onClick={() => handleTabClick('features')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
              activeTab === 'features'
                ? 'bg-[#0B3D3A] text-[#FFF7E6] font-black shadow-sm'
                : 'text-[#4B6B67] hover:text-[#0B3D3A] hover:bg-[#E6F4F1]'
            }`}
          >
            مميزاتنا
          </button>

          {/* Tab 3: الصفوف (Active / Primary) */}
          <button
            onClick={() => handleTabClick('classes')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-[#F97316] text-[#FFF7E6] font-black shadow-[0_2px_10px_rgba(249,115,22,0.35)]'
                : 'text-[#4B6B67] hover:text-[#0B3D3A] hover:bg-[#E6F4F1]'
            }`}
          >
            فصول النجوم
          </button>

        </div>
      </div>

      {/* Info Modal for "عن المبادرة" and "مميزاتنا" */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border-2 border-[#0B3D3A]/20 rounded-3xl p-6 shadow-2xl text-right overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#0B3D3A]/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#0F766E]">
                    {modalType === 'about' ? <Info className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B3D3A]">
                    {modalType === 'about' ? 'عن مبادرة نجوم الأسبوع' : 'مميزات منصة نخبة الشمال'}
                  </h3>
                </div>

                <button
                  onClick={() => setModalType(null)}
                  className="p-1 rounded-full bg-[#E6F4F1] text-[#0B3D3A] hover:bg-[#0B3D3A] hover:text-[#FFF7E6] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="py-4 space-y-4 text-xs sm:text-sm text-[#173331] leading-relaxed">
                {modalType === 'about' ? (
                  <>
                    <p className="font-semibold">
                      مبادرة <strong className="text-[#0F766E]">نجوم الأسبوع</strong> بمدارس نخبة الشمال الأهلية والعالمية تهدف إلى تعزيز السلوك الإيجابي والتميز الأكاديمي والانضباط لدى أبنائنا وبناتنا الطلاب.
                    </p>
                    <div className="bg-[#FFF7E6] border border-[#D4A853]/40 p-3.5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[#0B3D3A] font-bold">
                        <Award className="w-4 h-4 text-[#D4A853]" />
                        <span>رؤية المبادرة:</span>
                      </div>
                      <p className="text-xs text-[#4B6B67]">
                        بناء جيل واثق من قدراته، ومتحفز للإنجاز، يشعر بتقدير أسرته ومدرسته ومجتمعه في كل خطوة نحو التفوق.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                        <span><strong>تكريم أسبوعي تفاعلي:</strong> إبراز طالبين متميزين من كل فصل كل أسبوع.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                        <span><strong>شهادات شكر رسمية:</strong> إمكانية تحميل وطباعة شهادة تقدير ملكية بدقة عالية.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                        <span><strong>مشاركة رقمية سهلة:</strong> مشاركة الإنجاز مع العائلة والأصدقاء بضغطة زر.</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-2.5 rounded-xl bg-[#0B3D3A] text-[#FFF7E6] font-bold text-xs sm:text-sm hover:bg-[#0F766E] transition-all"
                >
                  حسناً، فهمت
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
