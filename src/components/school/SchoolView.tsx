'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SchoolConfig, WeeklyEdition, Student } from '@/types';
import { SchoolClassInfo, SCHOOL_CLASSES } from '@/lib/schoolData';
import SchoolHero from './SchoolHero';
import SchoolClassesGrid from './SchoolClassesGrid';
import SchoolClassroomShowcase from './SchoolClassroomShowcase';
import SchoolCertificateModal from './SchoolCertificateModal';
import SchoolBottomBar from './SchoolBottomBar';
import SchoolCinematicShow from './SchoolCinematicShow';
import SchoolClassroomAwardsPrototype from './SchoolClassroomAwardsPrototype';

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
  // Only real students; empty array if no students are published yet
  const effectiveStudents = React.useMemo(() => {
    return students || [];
  }, [students]);

  // View state: 'grid' (all classes) vs 'showcase' (single class stage)
  const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('grid');
  const [selectedClass, setSelectedClass] = useState<SchoolClassInfo>(SCHOOL_CLASSES[0]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Awards stage prototype state (matching reference image)
  const [isPrototypeOpen, setIsPrototypeOpen] = useState(true);
  const [isCinematicOpen, setIsCinematicOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get('scene');
    if (sceneParam === 'none') {
      setIsPrototypeOpen(false);
      setIsCinematicOpen(false);
      return;
    }
  }, []);

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
        onPlayCinematic={() => setIsPrototypeOpen(true)}
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

      {/* 6. Grand Awards Stage Prototype (Matching media_1792482192746.jpg) */}
      {isPrototypeOpen && (
        <SchoolClassroomAwardsPrototype
          school={school}
          edition={edition}
          students={effectiveStudents}
          onClose={() => setIsPrototypeOpen(false)}
        />
      )}

      {/* 7. Grand Cinematic Classroom Awards Ceremony Show */}
      <SchoolCinematicShow
        school={school}
        edition={edition}
        students={effectiveStudents}
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
      />

    </div>
  );
}
