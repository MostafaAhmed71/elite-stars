'use client';

import React, { useState, useRef } from 'react';
import { SchoolConfig, WeeklyEdition, Student } from '@/types';
import { SchoolClassInfo, SCHOOL_CLASSES, DEMO_SCHOOL_STUDENTS } from '@/lib/schoolData';
import SchoolHero from './SchoolHero';
import SchoolClassesGrid from './SchoolClassesGrid';
import SchoolClassroomShowcase from './SchoolClassroomShowcase';
import SchoolCertificateModal from './SchoolCertificateModal';
import SchoolBottomBar from './SchoolBottomBar';
import SchoolCinematicIntro from './SchoolCinematicIntro';

interface SchoolViewProps {
  school: SchoolConfig;
  edition: WeeklyEdition;
  students: Student[];
}

export default function SchoolView({
  school,
  edition,
  students,
}: SchoolViewProps) {
  // Use loaded persisted students or fallback to DEMO_SCHOOL_STUDENTS
  const effectiveStudents = React.useMemo(() => {
    if (students && students.length > 0) {
      return students;
    }
    return DEMO_SCHOOL_STUDENTS;
  }, [students]);

  // View state: 'grid' (all classes) vs 'showcase' (single class stage)
  const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('grid');
  const [selectedClass, setSelectedClass] = useState<SchoolClassInfo>(SCHOOL_CLASSES[0]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCinematicOpen, setIsCinematicOpen] = useState(true);

  const classesSectionRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll down to classes section
  const handleExploreClick = () => {
    classesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Class selection handler
  const handleSelectClass = (cls: SchoolClassInfo) => {
    setSelectedClass(cls);
    setViewMode('showcase');
    classesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full relative z-10 pb-16">
      
      {/* 1. Hero Section (Clean & Responsive for all screens) */}
      <SchoolHero
        school={school}
        edition={edition}
        totalStudents={effectiveStudents.length}
        onExploreClick={handleExploreClick}
        onPlayCinematic={() => setIsCinematicOpen(true)}
      />

      {/* 2. Classes Section Anchor */}
      <div ref={classesSectionRef} className="scroll-mt-20" />

      {/* 3. Classes View: Grid View vs Classroom Showcase */}
      {viewMode === 'grid' ? (
        <SchoolClassesGrid
          classes={SCHOOL_CLASSES}
          students={effectiveStudents}
          onSelectClass={handleSelectClass}
          onSelectStudent={(st) => setSelectedStudent(st)}
        />
      ) : (
        <SchoolClassroomShowcase
          currentClass={selectedClass}
          classes={SCHOOL_CLASSES}
          students={effectiveStudents}
          onSelectClass={setSelectedClass}
          onSelectStudent={(st) => setSelectedStudent(st)}
          onBackToGrid={() => setViewMode('grid')}
        />
      )}

      {/* 4. Bottom Components: Search & Filter, Honored Students, Values We Honor, Mascot */}
      <SchoolBottomBar
        students={effectiveStudents}
        onSelectStudent={(st) => setSelectedStudent(st)}
      />

      {/* 5. Royal Award Certificate Modal */}
      <SchoolCertificateModal
        student={selectedStudent}
        school={school}
        onClose={() => setSelectedStudent(null)}
      />

      {/* 6. Grand Cinematic Opening Animation (Student by Student with Celebrations) */}
      <SchoolCinematicIntro
        school={school}
        edition={edition}
        students={effectiveStudents}
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
        onOpenCertificate={(st) => {
          setIsCinematicOpen(false);
          setSelectedStudent(st);
        }}
      />

    </div>
  );
}
