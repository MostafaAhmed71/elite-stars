'use client';

import React from 'react';
import { Home, Star, LayoutGrid, Shield, Search } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'stars' | 'categories' | 'admin';
  onSelectTab: (tab: 'home' | 'stars' | 'categories' | 'admin') => void;
  onOpenSearch: () => void;
}

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  onOpenSearch,
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#061325]/90 backdrop-blur-2xl border-t border-[#EFC16C]/30 py-1.5 px-4 md:hidden shadow-[0_-5px_20px_rgba(6,19,37,0.8)]">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
        {/* الرئيسية (Home) */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-[#FFD884]'
              : 'text-[#FFF8EA]/60 hover:text-[#FFF8EA]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD884]" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">الرئيسية</span>
        </button>

        {/* النجوم (Stars) */}
        <button
          onClick={() => onSelectTab('stars')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'stars'
              ? 'text-[#FFD884]'
              : 'text-[#FFF8EA]/60 hover:text-[#FFF8EA]'
          }`}
        >
          <div className="relative">
            <Star className="w-5 h-5" />
            {activeTab === 'stars' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD884]" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">النجوم</span>
        </button>

        {/* الفئات (Categories) */}
        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'text-[#FFD884]'
              : 'text-[#FFF8EA]/60 hover:text-[#FFF8EA]'
          }`}
        >
          <div className="relative">
            <LayoutGrid className="w-5 h-5" />
            {activeTab === 'categories' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD884]" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">الفئات</span>
        </button>

        {/* الملف الشخصي / الإدارة (Admin / Profile) */}
        <button
          onClick={() => onSelectTab('admin')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'admin'
              ? 'text-[#FFD884]'
              : 'text-[#FFF8EA]/60 hover:text-[#FFF8EA]'
          }`}
        >
          <div className="relative">
            <Shield className="w-5 h-5" />
            {activeTab === 'admin' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD884]" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">الإدارة</span>
        </button>
      </div>
    </nav>
  );
}
