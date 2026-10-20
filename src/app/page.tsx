'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SchoolView from '@/components/school/SchoolView';
import { Student, WeeklyEdition, SchoolConfig } from '@/types';
import {
  getStoredSchoolConfig,
  getStoredEditions,
  getActiveEdition,
  getStoredStudents,
  saveStoredStudents,
} from '@/lib/storage';
import { fetchSupabaseData } from '@/lib/supabaseService';
import { INITIAL_EDITION, INITIAL_STUDENTS, INITIAL_SCHOOL_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Core App State
  const [school, setSchool] = useState<SchoolConfig>(INITIAL_SCHOOL_CONFIG);
  const [editions, setEditions] = useState<WeeklyEdition[]>([INITIAL_EDITION]);
  const [activeEdition, setActiveEdition] = useState<WeeklyEdition>(INITIAL_EDITION);
  const [students, setStudents] = useState<Student[]>([]);

  // Load real data from Supabase (strictly real data only, zero fake data)
  useEffect(() => {
    setMounted(true);
    // 1. Initial local cache
    setSchool(getStoredSchoolConfig());
    setEditions(getStoredEditions());
    setActiveEdition(getActiveEdition());
    setStudents(getStoredStudents());

    // 2. Fetch from Supabase (only real data)
    fetchSupabaseData().then((res) => {
      if (res.isRealData && res.students.length > 0) {
        setSchool(res.school);
        setEditions(res.editions);
        setActiveEdition(res.activeEdition);
        setStudents(res.students);
        saveStoredStudents(res.students);
      } else {
        setStudents(getStoredStudents());
      }
    });
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen pb-16 overflow-x-hidden bg-[#FFF7E6] text-[#173331]">
      


      {/* Main Responsive School Theme Page */}
      <SchoolView
        school={school}
        edition={activeEdition}
        students={students}
      />

      {/* Footer Branding in Petroleum & Warm Ivory */}
      <footer className="mt-16 text-center text-xs text-[#4B6B67] py-8 border-t border-[#0B3D3A]/10 bg-[#FAF4E6]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-extrabold text-sm text-[#0B3D3A] mb-1">
            {school.name || 'مدارس نخبة الشمال الأهلية والعالمية'} • منصة تكريم نجوم الأسبوع
          </p>
          <p className="text-xs text-[#4B6B67]">
            جميع حقوق التكريم والتقدير محفوظة لأبنائنا وبناتنا النجوم © 1448هـ
          </p>
        </div>
      </footer>

    </main>
  );
}
