'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Clock, BrainCircuit, User } from 'lucide-react';

const MOBILE_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Quests', href: '/quests', icon: Swords },
  { name: 'Timer', href: '/timer', icon: Clock },
  { name: 'Quiz', href: '/quiz', icon: BrainCircuit },
  { name: 'Profile', href: '/profile', icon: User },
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080b1e]/95 backdrop-blur-xl border-t border-indigo-900/40 px-3 py-2">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isActive
                  ? 'text-purple-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive ? 'bg-purple-600/20 text-purple-400 shadow-sm shadow-purple-500/30' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
