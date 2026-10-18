'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Student } from '@/types';
import { Search, X, Sparkles, ChevronLeft } from 'lucide-react';

interface SearchModalProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onClose: () => void;
}

export default function SearchModal({
  students,
  onSelectStudent,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = students.filter(
    (s) =>
      s.fullName.includes(query) ||
      s.className.includes(query) ||
      s.gradeLevel.includes(query) ||
      s.category.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#061325]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-[#071B37] border-2 border-[#EFC16C]/60 p-5 shadow-[0_0_40px_rgba(239,193,108,0.3)] z-10 text-right overflow-hidden">
        
        {/* Header with Search Input */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EFC16C]/25">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute right-3 w-5 h-5 text-[#FFD884]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم الطالب، الصف، أو الفئة..."
              className="w-full pr-11 pl-4 py-3 rounded-2xl bg-[#102D54]/70 border border-[#FFD884]/40 text-sm text-[#FFF8EA] placeholder-[#FFF8EA]/50 focus:outline-none focus:border-[#FFD884] focus:ring-2 focus:ring-[#FFD884]/30"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#102D54]/80 text-[#FFD884] hover:bg-[#102D54] transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
          {results.length === 0 ? (
            <div className="text-center py-10 text-[#FFF8EA]/60 text-sm">
              لا توجد نتائج مطابقة لـ &quot;{query}&quot;
            </div>
          ) : (
            results.map((student) => (
              <div
                key={student.id}
                onClick={() => {
                  onSelectStudent(student);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#102D54]/40 hover:bg-[#102D54]/80 border border-[#EFC16C]/30 hover:border-[#FFD884] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#FFD884] to-[#EFC16C] ring-2 ring-[#FFD884]/40 shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={student.avatarUrl}
                        alt={student.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#FFF8EA] group-hover:text-[#FFD884] transition-colors">
                      {student.fullName}
                    </h4>
                    <p className="text-xs text-[#EFC16C] mt-0.5">
                      {student.gradeLevel} • الفصل {student.className}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#061325]/80 text-[#FFD884] border border-[#FFD884]/30">
                    {student.category}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-[#FFD884] opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
