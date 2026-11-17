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
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#060814]/90 border-r border-indigo-500/20 backdrop-blur-2xl z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50">
      {/* Brand Logo */}
      <div className="p-5 border-b border-indigo-900/30 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-600/30 group-hover:shadow-cyan-500/40 transition duration-300">
            <div className="h-full w-full rounded-[10px] bg-[#0c1026] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider text-white">STUDYVERSE</span>
            <span className="text-[10px] font-bold text-gradient-cyber block tracking-widest -mt-1">AI EXPEDITION</span>
          </div>
        </Link>
      </div>

      {/* User Progress Mini Badge */}
      <div className="p-4 mx-3 my-3 rounded-2xl glass-panel hud-corner shadow-lg">
        <div className="flex items-center gap-3 mb-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-10 h-10 rounded-full border-2 border-purple-500/70 shadow-md shadow-purple-950/80 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{profile.fullName}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-gradient-gold">Lv {profile.currentLevel}</span>
              <span className="text-[10px] text-slate-400 truncate">{levelProgress.currentLevel.title}</span>
            </div>
          </div>
        </div>

        {/* Mini XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span className="uppercase tracking-wider text-[9px] text-slate-400">EXP GAUGE</span>
            <span className="text-cyan-300 font-bold">{profile.currentXp} XP</span>
          </div>
          <div className="h-2 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-indigo-900/60 shadow-inner">
            <div
              className="h-full rounded-full xp-shimmer transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-2 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {group.title}
            </h4>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/35 via-indigo-600/25 to-cyan-500/10 text-white border border-purple-500/40 shadow-md shadow-purple-950/70'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 hover:border-slate-700/50 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-purple-400 to-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  )}
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'text-slate-400'}`} />
                  <span className={isActive ? 'font-bold text-white' : ''}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Profile & Logout Footer */}
      <div className="p-3 border-t border-indigo-900/40 flex items-center justify-between bg-[#04060e]/60">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-300 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile & Settings</span>
        </Link>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
