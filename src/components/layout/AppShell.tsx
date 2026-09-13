'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../navigation/Sidebar';
import { TopHeader } from '../navigation/TopHeader';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { Toast } from '../common/Toast';

const AUTH_PAGES = ['/login', '/signup', '/forgot-password', '/onboarding'];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060814] via-[#0b0e27] to-[#04060f] text-slate-100 flex flex-col justify-center">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        <TopHeader />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* Gamification Level-Up Modal */}
      <LevelUpModal />

      {/* Global Toast */}
      <Toast />
    </div>
  );
};
