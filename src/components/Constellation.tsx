'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Student, WeeklyEdition, CategoryType } from '@/types';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Filter,
  Orbit,
  GraduationCap,
  Compass,
  Lightbulb,
  Sprout,
  Heart,
  Search,
} from 'lucide-react';

interface ConstellationProps {
  students: Student[];
  edition: WeeklyEdition;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

export default function Constellation({
  students,
  edition,
  selectedStudent,
  onSelectStudent,
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
}: ConstellationProps) {
  // Mobile / Desktop Cluster State: 1 to 4
  const [activeCluster, setActiveCluster] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'cluster' | 'universe'>('cluster');

  // Filter students based on search and grade
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.fullName.includes(searchQuery) ||
        s.className.includes(searchQuery) ||
        s.category.includes(searchQuery);

      const matchGrade = !selectedGrade || s.gradeLevel === selectedGrade;

      return matchSearch && matchGrade;
    });
  }, [students, searchQuery, selectedGrade]);

  // Current cluster students (approx 6 students)
  const currentClusterRaw = useMemo(() => {
    return filteredStudents.filter((s) => s.clusterGroup === activeCluster);
  }, [filteredStudents, activeCluster]);

  // Available grades for filter pill
  const availableGrades = useMemo(() => {
    const set = new Set(students.map((s) => s.gradeLevel));
    return Array.from(set);
  }, [students]);

  // Handle Cluster Navigation (RTL: التالي goes to cluster + 1, السابق goes to cluster - 1)
  const handleNextCluster = () => {
    setActiveCluster((prev) => (prev >= 4 ? 1 : prev + 1));
  };

  const handlePrevCluster = () => {
    setActiveCluster((prev) => (prev <= 1 ? 4 : prev - 1));
  };

  // Art-directed Clockwise Perimeter layout for Cluster View (6 students)
  // Perfectly spaced to guarantee ZERO collisions
  const clusterDisplayStudents = useMemo(() => {
    if (viewMode === 'universe') {
      // 24 Students Universe Coordinates across 4 cosmic quadrants
      return filteredStudents.map((student) => {
        const clusterId = student.clusterGroup; // 1, 2, 3, 4
        // Quad centers:
        // Cluster 1 (Top-Right): { cx: 74, cy: 30 }
        // Cluster 2 (Top-Left):  { cx: 26, cy: 30 }
        // Cluster 3 (Bottom-Right): { cx: 74, cy: 72 }
        // Cluster 4 (Bottom-Left):  { cx: 26, cy: 72 }
        let cx = 74;
        let cy = 30;
        if (clusterId === 2) {
          cx = 26;
          cy = 30;
        } else if (clusterId === 3) {
          cx = 74;
          cy = 72;
        } else if (clusterId === 4) {
          cx = 26;
          cy = 72;
        }

        if (student.isFeatured) {
          return { ...student, displayPos: { x: cx, y: cy } };
        }

        // Orbiting around quad center
        const clusterStudents = filteredStudents.filter(
          (s) => s.clusterGroup === clusterId && !s.isFeatured
        );
        const idx = clusterStudents.findIndex((s) => s.id === student.id);
        const count = clusterStudents.length || 5;
        const angle = (idx * (2 * Math.PI)) / count - Math.PI / 2;
        const radiusX = 16;
        const radiusY = 14;

        return {
          ...student,
          displayPos: {
            x: Math.max(6, Math.min(94, cx + Math.cos(angle) * radiusX)),
            y: Math.max(8, Math.min(92, cy + Math.sin(angle) * radiusY)),
          },
        };
      });
    }

    // Single Cluster View: 1 Center + 5 Clockwise Outer Nodes
    const featured = currentClusterRaw.find((s) => s.isFeatured) || currentClusterRaw[0];
    const outer = currentClusterRaw.filter((s) => s.id !== featured?.id);

    // Exact clockwise perimeter positions:
    // 0: Top Center, 1: Top Right, 2: Bottom Right, 3: Bottom Left, 4: Top Left
    const clockwiseSlots = [
      { x: 50, y: 16 }, // Top
      { x: 80, y: 32 }, // Top Right
      { x: 74, y: 72 }, // Bottom Right
      { x: 26, y: 72 }, // Bottom Left
      { x: 20, y: 32 }, // Top Left
    ];

    const result = [];
    if (featured) {
      result.push({ ...featured, displayPos: { x: 50, y: 50 } });
    }

    outer.forEach((st, idx) => {
      const slot = clockwiseSlots[idx % clockwiseSlots.length];
      result.push({ ...st, displayPos: slot });
    });

    return result;
  }, [filteredStudents, currentClusterRaw, viewMode]);

  // Distinct Center Student for line drawing
  const centerNode = clusterDisplayStudents.find((s) => s.isFeatured) || clusterDisplayStudents[0];
  const outerNodes = clusterDisplayStudents.filter((s) => s.id !== centerNode?.id);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 select-none">
      
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
        
        {/* Cluster Tabs / Mode Switcher */}
        <div className="flex items-center flex-wrap gap-1.5 bg-[#071B37]/85 backdrop-blur-md border border-[#EFC16C]/30 rounded-2xl p-1.5 shadow-inner">
          {edition.clusters.map((cluster) => {
            const isActive = viewMode === 'cluster' && activeCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => {
                  setViewMode('cluster');
                  setActiveCluster(cluster.id);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-[0_0_15px_rgba(255,216,132,0.45)]'
                    : 'text-[#FFF8EA]/75 hover:text-[#FFF8EA] hover:bg-[#102D54]/60'
                }`}
              >
                <span>{cluster.name}</span>
                <span className="text-[11px] opacity-75 mr-1.5">
                  ({students.filter((s) => s.clusterGroup === cluster.id).length})
                </span>
              </button>
            );
          })}

          {/* Universe View Toggle (All 24 stars) */}
          <button
            onClick={() => setViewMode(viewMode === 'universe' ? 'cluster' : 'universe')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'universe'
                ? 'bg-gradient-to-r from-[#FFD884] to-[#EFC16C] text-[#061325] shadow-[0_0_15px_rgba(255,216,132,0.45)]'
                : 'text-[#FFF8EA]/75 hover:text-[#FFF8EA] hover:bg-[#102D54]/60'
            }`}
            title="عرض جميع الـ 24 نجماً معاً في السماء الكونية"
          >
            <Orbit className="w-4 h-4" />
            <span>كوكبة كاملة (24)</span>
          </button>
        </div>

        {/* Grade Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-[#071B37]/85 border border-[#EFC16C]/35 rounded-2xl px-3.5 py-1.5 text-xs sm:text-sm text-[#FFF8EA] shadow-sm">
            <Filter className="w-4 h-4 text-[#FFD884] ml-2" />
            <select
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#FFF8EA] focus:outline-none cursor-pointer pr-1"
            >
              <option value="" className="bg-[#071B37] text-[#FFF8EA]">
                جميع الصفوف الدراسية
              </option>
              {availableGrades.map((grade) => (
                <option key={grade} value={grade} className="bg-[#071B37] text-[#FFF8EA]">
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Constellation Arena */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3.8] md:aspect-[16/10] min-h-[480px] md:min-h-[560px] rounded-3xl overflow-hidden border border-[#EFC16C]/40 bg-[#061325] shadow-[0_0_50px_rgba(16,45,84,0.7),inset_0_0_30px_rgba(6,19,37,0.8)]">
        
        {/* Deep Cosmic Nebula Image Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nebula/celestial-nebula.jpg"
            alt="Celestial Nebula"
            fill
            className="object-cover object-center opacity-80 mix-blend-screen scale-105"
            priority
          />
          {/* Subtle Radial Vignette Gradient to focus center */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#061325]/30 to-[#061325]/90 pointer-events-none" />
        </div>

        {/* 5 Distinct School Pillars / Category Labels (Positioned in Dedicated Celestial Spaces with ZERO overlap) */}
        {viewMode === 'cluster' && (
          <div className="absolute inset-0 pointer-events-none z-10 text-[10px] sm:text-xs font-bold text-[#FFD884]">
            {/* 1. Top Right Flank: التفوق الأكاديمي */}
            <div className="absolute top-[8%] right-[5%] sm:right-[7%] flex items-center gap-2 p-1.5 rounded-full bg-[#071B37]/80 border border-[#FFD884]/40 backdrop-blur-md shadow-md">
              <div className="w-6 h-6 rounded-full bg-[#102D54] flex items-center justify-center text-[#FFD884]">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#FFF8EA] pl-2 text-[10px] sm:text-[11px]">التفوق الأكاديمي</span>
            </div>

            {/* 2. Top Left Flank: القيادة والمبادرة */}
            <div className="absolute top-[8%] left-[5%] sm:left-[7%] flex items-center gap-2 p-1.5 rounded-full bg-[#071B37]/80 border border-[#FFD884]/40 backdrop-blur-md shadow-md">
              <span className="text-[#FFF8EA] pr-2 text-[10px] sm:text-[11px]">القيادة والمبادرة</span>
              <div className="w-6 h-6 rounded-full bg-[#102D54] flex items-center justify-center text-[#FFD884]">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Bottom Right Flank: الإبداع والابتكار */}
            <div className="absolute bottom-[8%] right-[5%] sm:right-[7%] flex items-center gap-2 p-1.5 rounded-full bg-[#071B37]/80 border border-[#FFD884]/40 backdrop-blur-md shadow-md">
              <div className="w-6 h-6 rounded-full bg-[#102D54] flex items-center justify-center text-[#FFD884]">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#FFF8EA] pl-2 text-[10px] sm:text-[11px]">الإبداع والابتكار</span>
            </div>

            {/* 4. Bottom Left Flank: خدمة المجتمع */}
            <div className="absolute bottom-[8%] left-[5%] sm:left-[7%] flex items-center gap-2 p-1.5 rounded-full bg-[#071B37]/80 border border-[#FFD884]/40 backdrop-blur-md shadow-md">
              <span className="text-[#FFF8EA] pr-2 text-[10px] sm:text-[11px]">خدمة المجتمع</span>
              <div className="w-6 h-6 rounded-full bg-[#102D54] flex items-center justify-center text-[#FFD884]">
                <Sprout className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 5. Center Bottom: الأخلاق والقيم */}
            <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071B37]/80 border border-[#FFD884]/40 backdrop-blur-md shadow-md">
              <Heart className="w-3.5 h-3.5 text-[#FFD884] fill-[#FFD884]/40" />
              <span className="text-[#FFF8EA] text-[10px] sm:text-[11px]">الأخلاق والقيم</span>
            </div>
          </div>
        )}

        {/* SVG Geometry Connecting Lines (Golden Constellation Polygon with ZERO criss-cross) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldConstellationLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE8A3" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#EFC16C" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFD884" stopOpacity="0.85" />
            </linearGradient>

            <filter id="goldLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* CLUSTER VIEW: Radial Lines from Center to Outer 5 Nodes */}
          {viewMode === 'cluster' && centerNode && (
            outerNodes.map((student) => (
              <g key={`radial-line-${student.id}`}>
                <line
                  x1={centerNode.displayPos.x}
                  y1={centerNode.displayPos.y}
                  x2={student.displayPos.x}
                  y2={student.displayPos.y}
                  stroke="url(#goldConstellationLine)"
                  strokeWidth="0.4"
                  strokeDasharray="2.5 1.5"
                  filter="url(#goldLineGlow)"
                />
                {/* Glowing Star Sparkle at line midpoint */}
                <circle
                  cx={(centerNode.displayPos.x + student.displayPos.x) / 2}
                  cy={(centerNode.displayPos.y + student.displayPos.y) / 2}
                  r="0.5"
                  fill="#FFE8A3"
                  className="animate-pulse"
                />
              </g>
            ))
          )}

          {/* CLUSTER VIEW: Clockwise Perimeter Polygon connecting outer 5 nodes in clean ring */}
          {viewMode === 'cluster' && outerNodes.length >= 3 && (
            outerNodes.map((student, i, arr) => {
              const nextStudent = arr[(i + 1) % arr.length];
              return (
                <line
                  key={`perimeter-line-${student.id}`}
                  x1={student.displayPos.x}
                  y1={student.displayPos.y}
                  x2={nextStudent.displayPos.x}
                  y2={nextStudent.displayPos.y}
                  stroke="#FFD884"
                  strokeWidth="0.3"
                  strokeOpacity="0.4"
                  filter="url(#goldLineGlow)"
                />
              );
            })
          )}

          {/* UNIVERSE VIEW: Lines connecting each quadrant's stars */}
          {viewMode === 'universe' && (
            [1, 2, 3, 4].map((cId) => {
              const qStudents = clusterDisplayStudents.filter((s) => s.clusterGroup === cId);
              const qCenter = qStudents.find((s) => s.isFeatured) || qStudents[0];
              const qOuter = qStudents.filter((s) => s.id !== qCenter?.id);

              return (
                <g key={`quad-lines-${cId}`}>
                  {qCenter &&
                    qOuter.map((s) => (
                      <line
                        key={`qline-${s.id}`}
                        x1={qCenter.displayPos.x}
                        y1={qCenter.displayPos.y}
                        x2={s.displayPos.x}
                        y2={s.displayPos.y}
                        stroke="#FFD884"
                        strokeWidth="0.25"
                        strokeOpacity="0.35"
                      />
                    ))}
                </g>
              );
            })
          )}
        </svg>

        {/* Student Nodes (Real DOM Interactive Golden Elements) */}
        <div className="absolute inset-0 z-20">
          {clusterDisplayStudents.map((student) => {
            const isSelected = selectedStudent?.id === student.id;
            const isCenter = student.isFeatured && viewMode === 'cluster';

            // Distinct node sizing
            const sizeClass = isCenter
              ? 'w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24'
              : 'w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18';

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                style={{
                  left: `${student.displayPos.x}%`,
                  top: `${student.displayPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex flex-col items-center cursor-pointer group"
              >
                {/* Outer Glow Halo & Frame */}
                <div className="relative">
                  {/* Decorative 4-Point Star Sparkle on top corner */}
                  <span className="absolute -top-1.5 -right-1.5 z-30 text-[#FFD884] animate-spin-slow">
                    <Sparkles className="w-3.5 h-3.5 fill-[#FFD884] drop-shadow-[0_0_8px_rgba(255,216,132,1)]" />
                  </span>

                  {/* Golden Glowing Multi-Ring Frame */}
                  <div
                    className={`${sizeClass} rounded-full p-[2.5px] transition-all duration-300 transform group-hover:scale-110 ${
                      isSelected
                        ? 'active-ring-glow ring-4 ring-[#FFD884]'
                        : 'gold-ring-glow ring-2 ring-[#FFD884]/80 group-hover:ring-[#FFD884]'
                    } bg-gradient-to-tr from-[#996515] via-[#FFD884] to-[#FFF9E6] shadow-[0_0_25px_rgba(255,216,132,0.45)]`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#061325]">
                      <Image
                        src={student.avatarUrl}
                        alt={student.fullName}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 70px, 95px"
                      />
                    </div>
                  </div>

                  {/* Active Selection Glow Ring */}
                  {isSelected && (
                    <div className="absolute -inset-2.5 rounded-full border-2 border-[#FFD884] animate-ping pointer-events-none opacity-40" />
                  )}
                </div>

                {/* Name & Class Label Tag (Clean, Non-overlapping, High-Contrast) */}
                <div className="mt-2 px-3 py-1 rounded-full bg-[#071B37]/95 border border-[#FFD884]/50 backdrop-blur-md text-center max-w-[110px] sm:max-w-[140px] shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105">
                  <p className="text-[11px] sm:text-xs font-bold text-[#FFF8EA] truncate leading-tight">
                    {student.fullName}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#FFD884] font-semibold leading-none mt-0.5">
                    {student.className}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State when no students are added yet */}
        {clusterDisplayStudents.length === 0 && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-text">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#102D54] to-[#071B37] border-2 border-[#FFD884]/60 flex items-center justify-center text-[#FFD884] mb-3 shadow-[0_0_25px_rgba(255,216,132,0.35)] animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF8EA] to-[#FFD884] mb-2">
              في انتظار نجوم هذا الأسبوع ✨
            </h3>
            <p className="text-xs sm:text-sm text-[#EFC16C]/90 max-w-md font-medium leading-relaxed">
              لم يتم إدراج طلاب مكرّمين لهذا الأسبوع بعد. يمكن للمشرفين البدء بإضافة طلاب المدرسة وصورهم عبر لوحة الإدارة أعلاه.
            </p>
          </div>
        )}
      </div>

      {/* Dedicated Bottom Cluster Navigation Bar (Clean, Separated from Canvas) */}
      {viewMode === 'cluster' && (
        <div className="mt-4 flex items-center justify-between gap-3 px-2">
          {/* Previous Button (RTL: Chevron Right → moves to previous cluster) */}
          <button
            onClick={handlePrevCluster}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#071B37]/90 hover:bg-[#102D54] border border-[#FFD884]/50 text-xs sm:text-sm font-bold text-[#FFF8EA] hover:text-[#FFD884] shadow-md transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-[#FFD884]" />
            <span>الكوكبة السابقة</span>
          </button>

          {/* Current Cluster Indicator & Count */}
          <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#071B37]/90 border border-[#EFC16C]/60 text-xs sm:text-sm font-black text-[#FFD884] shadow-[0_0_15px_rgba(255,216,132,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD884]" />
            <span>
              {edition.clusters.find((c) => c.id === activeCluster)?.name} ({activeCluster}/4)
            </span>
          </div>

          {/* Next Button (RTL: Chevron Left ← moves to next cluster) */}
          <button
            onClick={handleNextCluster}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#071B37]/90 hover:bg-[#102D54] border border-[#FFD884]/50 text-xs sm:text-sm font-bold text-[#FFF8EA] hover:text-[#FFD884] shadow-md transition-all cursor-pointer"
          >
            <span>الكوكبة التالية</span>
            <ChevronLeft className="w-4 h-4 text-[#FFD884]" />
          </button>
        </div>
      )}

      {/* Footer Info Notice */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#FFF8EA]/70 px-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD884]" />
          <span>انقر على أي نجم لعرض وسام التكريم الملكي ومشاركته</span>
        </div>
        <div className="text-[#FFD884] font-bold">
          {filteredStudents.length} نجم معروض
        </div>
      </div>
    </div>
  );
}
