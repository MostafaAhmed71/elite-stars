'use client';

import React from 'react';
import { WeeklyEdition } from '@/types';
import { Archive, X, Check, Calendar, Users, Sparkles } from 'lucide-react';

interface ArchiveModalProps {
  editions: WeeklyEdition[];
  activeEditionId: string;
  onSelectEdition: (editionId: string) => void;
  onClose: () => void;
}

export default function ArchiveModal({
  editions,
  activeEditionId,
  onSelectEdition,
  onClose,
}: ArchiveModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061325]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-[#071B37] border-2 border-[#EFC16C]/60 p-6 shadow-[0_0_40px_rgba(239,193,108,0.3)] z-10 text-right overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFC16C]/25">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#102D54] border border-[#FFD884]/40 flex items-center justify-center text-[#FFD884]">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FFF8EA]">أرشيف كوكبة التميز</h3>
              <p className="text-xs text-[#EFC16C]">استعرض أسابيع نجوم المدرسة السابقة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#102D54]/80 text-[#FFD884] hover:bg-[#102D54] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editions List */}
        <div className="mt-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {editions.map((edition) => {
            const isActive = edition.id === activeEditionId;
            return (
              <div
                key={edition.id}
                onClick={() => {
                  onSelectEdition(edition.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-[#102D54] border-[#FFD884] shadow-[0_0_15px_rgba(255,216,132,0.25)]'
                    : 'bg-[#102D54]/40 border-[#EFC16C]/30 hover:border-[#FFD884]/70 hover:bg-[#102D54]/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#FFF8EA]">
                      {edition.title}
                    </h4>
                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD884] text-[#061325] font-bold">
                        الحالي
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-[#EFC16C]/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD884]" />
                      {edition.publishedAt || '1446هـ'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#FFD884]" />
                      {edition.totalStudents} طالباً
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#FFD884]/40">
                  {isActive ? (
                    <Check className="w-4 h-4 text-[#FFD884]" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#FFF8EA]/40" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
