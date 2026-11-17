'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Coins, 
  Menu, 
  X, 
  Sparkles, 
  ShoppingBag, 
  Gem, 
  Users, 
  Trophy, 
  Bot, 
  Calendar, 
  Award, 
  BarChart3, 
  BookOpen, 
  Swords, 
  Clock, 
  BrainCircuit, 
  Home, 
  User 
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { getLevelProgress } from '@/lib/gamification/levels';

const ALL_NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Daily Quests', href: '/quests', icon: Swords },
  { name: 'Focus Timer', href: '/timer', icon: Clock },
  { name: 'Monthly Planner', href: '/planner', icon: Calendar },
  { name: 'Exam Preparation', href: '/preparation', icon: BookOpen },
  { name: 'Quiz Arena', href: '/quiz', icon: BrainCircuit },
  { name: 'Battleground', href: '/battleground', icon: Swords },
  { name: 'AI Tutor', href: '/ai-tutor', icon: Bot },
  { name: 'Streaks', href: '/streaks', icon: Flame },
  { name: 'Study Guilds', href: '/guilds', icon: Users },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Study Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Reward Shop', href: '/reward-shop', icon: Gem },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile & Settings', href: '/profile', icon: User },
];

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const { profile, cart } = useStudyVerse();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const levelProgress = getLevelProgress(profile.currentXp);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-indigo-500/20 bg-[#060814]/85 px-4 md:px-6 backdrop-blur-xl shadow-lg shadow-black/40">
        {/* Left Side: Mobile Logo & Target Exam */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-md shadow-purple-600/30">
              <div className="h-full w-full rounded-[6px] bg-[#0c1026] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-sm text-white tracking-wide">STUDYVERSE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs shadow-inner shadow-cyan-950/40">
            <span className="text-slate-400 font-medium">Target:</span>
            <span className="font-extrabold text-gradient-cyber uppercase tracking-wider">{profile.targetExam}</span>
          </div>
        </div>

        {/* Right Side: Status Widgets */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          <Link
            href="/streaks"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-950/60 to-amber-950/40 border border-orange-500/40 hover:border-orange-400 transition text-xs font-bold text-orange-300 shadow-sm shadow-orange-950/50 group"
          >
            <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform fill-orange-400 animate-pulse" />
            <span>{profile.currentStreak}d</span>
          </Link>

          {/* Virtual Coins Badge */}
          <Link
            href="/reward-shop"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-500/40 hover:border-amber-400 transition text-xs font-bold text-amber-300 shadow-sm shadow-yellow-950/50 group"
          >
            <Coins className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform fill-yellow-400" />
            <span>{profile.coins}</span>
          </Link>

          {/* Level Pill */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-900/90 border border-purple-500/40 text-xs shadow-inner shadow-purple-950/50">
            <span className="font-extrabold text-gradient-gold">Lv {profile.currentLevel}</span>
            <div className="h-2 w-20 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-purple-900/60">
              <div
                className="h-full rounded-full xp-shimmer"
                style={{ width: `${levelProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Cart Icon */}
          <Link
            href="/shop"
            className="relative p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 transition border border-transparent hover:border-cyan-500/30"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-[10px] font-black text-white shadow-md shadow-pink-600/50">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-over Drawer for All Remaining Navigation Pages */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative ml-auto flex h-full w-4/5 max-w-sm flex-col bg-[#0b0e24] p-5 shadow-2xl border-l border-indigo-900/40 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-900/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-white text-base">StudyVerse Hub</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User details card in drawer */}
            <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-10 h-10 rounded-full border border-purple-500 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{profile.fullName}</p>
                <p className="text-xs text-purple-400">Level {profile.currentLevel} • {profile.targetExam}</p>
              </div>
            </div>

            {/* Navigation link list */}
            <div className="flex-1 space-y-1 overflow-y-auto pr-1">
              {ALL_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-purple-600/30 text-white border border-purple-500/40'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
