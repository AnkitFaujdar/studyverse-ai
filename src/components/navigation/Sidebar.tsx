'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Swords, 
  Clock, 
  Calendar, 
  BookOpen, 
  BrainCircuit, 
  Flame, 
  Users, 
  Trophy, 
  Bot, 
  ShoppingBag, 
  Gem, 
  Award, 
  BarChart3, 
  User, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { getLevelProgress } from '@/lib/gamification/levels';

const NAV_GROUPS = [
  {
    title: 'CORE LOOP',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Daily Quests', href: '/quests', icon: Swords },
      { name: 'Focus Timer', href: '/timer', icon: Clock },
      { name: 'Monthly Planner', href: '/planner', icon: Calendar },
    ],
  },
  {
    title: 'ACADEMICS & ARENA',
    items: [
      { name: 'Preparation', href: '/preparation', icon: BookOpen },
      { name: 'Quiz Arena', href: '/quiz', icon: BrainCircuit },
      { name: 'Battleground', href: '/battleground', icon: Swords },
      { name: 'AI Tutor', href: '/ai-tutor', icon: Bot },
    ],
  },
  {
    title: 'COMMUNITY & GROWTH',
    items: [
      { name: 'Streaks', href: '/streaks', icon: Flame },
      { name: 'Guilds', href: '/guilds', icon: Users },
      { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
      { name: 'Achievements', href: '/achievements', icon: Award },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'MARKETPLACE',
    items: [
      { name: 'Study Shop', href: '/shop', icon: ShoppingBag },
      { name: 'Reward Shop', href: '/reward-shop', icon: Gem },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { profile, logout } = useStudyVerse();
  const levelProgress = getLevelProgress(profile.currentXp);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#080b1e]/90 border-r border-indigo-900/30 backdrop-blur-xl z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50">
      {/* Brand Logo */}
      <div className="p-5 border-b border-indigo-900/30 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-600/30">
            <div className="h-full w-full rounded-[10px] bg-[#0c1026] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider text-white">STUDYVERSE</span>
            <span className="text-[10px] font-bold text-cyan-400 block tracking-widest -mt-1">AI EXPEDITION</span>
          </div>
        </Link>
      </div>

      {/* User Progress Mini Badge */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-b from-[#141838] to-[#0f122d] border border-indigo-700/30 shadow-inner">
        <div className="flex items-center gap-3 mb-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-10 h-10 rounded-full border border-purple-500/50 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{profile.fullName}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-purple-300">Lv {profile.currentLevel}</span>
              <span className="text-[10px] text-slate-400 truncate">{levelProgress.currentLevel.title}</span>
            </div>
          </div>
        </div>

        {/* Mini XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>XP Progress</span>
            <span className="text-cyan-300 font-semibold">{profile.currentXp} XP</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-2 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {group.title}
            </h4>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/30 shadow-sm shadow-purple-950/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Profile & Logout Footer */}
      <div className="p-3 border-t border-indigo-900/30 flex items-center justify-between">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile & Settings</span>
        </Link>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
