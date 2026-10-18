'use client';

import React, { useState, useEffect } from 'react';
import StarfieldCanvas from '@/components/StarfieldCanvas';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Constellation from '@/components/Constellation';
import StudentRecognitionPanel from '@/components/StudentRecognitionPanel';
import SearchModal from '@/components/SearchModal';
import ArchiveModal from '@/components/ArchiveModal';
import AdminModal from '@/components/AdminModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Student, WeeklyEdition, SchoolConfig } from '@/types';
import {
  getStoredSchoolConfig,
  saveStoredSchoolConfig,
  getStoredEditions,
  getActiveEdition,
  setActiveEditionId,
  getStoredStudents,
  saveStoredStudents,
  createNewEdition,
  resetToDemo,
} from '@/lib/storage';
import { INITIAL_EDITION, INITIAL_STUDENTS, INITIAL_SCHOOL_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Core App State
  const [school, setSchool] = useState<SchoolConfig>(INITIAL_SCHOOL_CONFIG);
  const [editions, setEditions] = useState<WeeklyEdition[]>([INITIAL_EDITION]);
  const [activeEdition, setActiveEdition] = useState<WeeklyEdition>(INITIAL_EDITION);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Active Modals & Filters
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [mobileTab, setMobileTab] = useState<'home' | 'stars' | 'categories' | 'admin'>('home');

  // Load persisted state on mount
  useEffect(() => {
    setMounted(true);
    setSchool(getStoredSchoolConfig());
    const storedEditions = getStoredEditions();
    setEditions(storedEditions);
    setActiveEdition(getActiveEdition());
    setStudents(getStoredStudents());
  }, []);

  // Handlers for updating state
  const handleSelectEdition = (editionId: string) => {
    setActiveEditionId(editionId);
    const ed = editions.find((e) => e.id === editionId) || INITIAL_EDITION;
    setActiveEdition(ed);
  };

  const handleSaveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    saveStoredStudents(updatedStudents);
  };

  const handleSaveSchool = (updatedSchool: SchoolConfig) => {
    setSchool(updatedSchool);
    saveStoredSchoolConfig(updatedSchool);
  };

  const handleCreateEdition = (data: {
    title: string;
    weekNumber: number;
    academicYear: string;
  }) => {
    const newEd = createNewEdition(data);
    setEditions(getStoredEditions());
    setActiveEdition(newEd);
  };

  const handleResetDemo = () => {
    resetToDemo();
    setSchool(INITIAL_SCHOOL_CONFIG);
    setEditions([INITIAL_EDITION]);
    setActiveEdition(INITIAL_EDITION);
    setStudents(INITIAL_STUDENTS);
  };

  const handleMobileTabSelect = (tab: 'home' | 'stars' | 'categories' | 'admin') => {
    setMobileTab(tab);
    if (tab === 'admin') {
      setIsAdminOpen(true);
    } else if (tab === 'categories') {
      setIsSearchOpen(true);
    } else if (tab === 'stars') {
      window.scrollTo({ top: 280, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen pb-20 md:pb-12 overflow-x-hidden bg-[#061325]">
      {/* Dynamic Starfield Particles Engine */}
      <StarfieldCanvas />

      {/* Top Navigation Header */}
      <Header
        school={school}
        activeEdition={activeEdition}
        allEditions={editions}
        onSelectEdition={handleSelectEdition}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        school={school}
        edition={activeEdition}
        totalStudents={students.length}
      />

      {/* Interactive Constellation Arena (Centerpiece) */}
      <Constellation
        students={students}
        edition={activeEdition}
        selectedStudent={selectedStudent}
        onSelectStudent={(st) => setSelectedStudent(st)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
      />

      {/* Student Recognition Panel (Exclusive Award Modal matching reference) */}
      <StudentRecognitionPanel
        student={selectedStudent}
        school={school}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal
          students={students}
          onSelectStudent={(st) => setSelectedStudent(st)}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* Archive Modal */}
      {isArchiveOpen && (
        <ArchiveModal
          editions={editions}
          activeEditionId={activeEdition.id}
          onSelectEdition={handleSelectEdition}
          onClose={() => setIsArchiveOpen(false)}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminModal
          students={students}
          edition={activeEdition}
          school={school}
          allEditions={editions}
          onSaveStudents={handleSaveStudents}
          onSaveSchool={handleSaveSchool}
          onCreateEdition={handleCreateEdition}
          onResetDemo={handleResetDemo}
          onClose={() => {
            setIsAdminOpen(false);
            setMobileTab('home');
          }}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={mobileTab}
        onSelectTab={handleMobileTabSelect}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Footer Branding */}
      <footer className="mt-12 text-center text-xs text-[#FFF8EA]/50 py-6 border-t border-[#EFC16C]/15">
        <p className="font-medium text-[#EFC16C]">
          {school.name} • كوكبة التميز المدرسي
        </p>
        <p className="text-[11px] mt-1 text-[#FFF8EA]/40">
          جميع حقوق التكريم والتقدير محفوظة لأبنائنا وبناتنا النجوم © 1446هـ
        </p>
      </footer>
    </main>
  );
}
