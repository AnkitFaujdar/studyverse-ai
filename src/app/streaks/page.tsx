'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Award, 
  Coins, 
  Palette, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export default function StreaksPage() {
  const { profile, updateProfile, purchaseReward } = useStudyVerse();

  const [claimedRewards, setClaimedRewards] = useState<string[]>(['reward_7d']);

  const streakDays = profile.currentStreak || 17;
  const longestStreak = profile.longestStreak || 21;

  const handleClaimReward = (id: string, coinsReward: number) => {
    if (claimedRewards.includes(id)) return;
    setClaimedRewards([...claimedRewards, id]);
    updateProfile({ coins: profile.coins + coinsReward });
  };

  // Generate 30 days matrix
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // Active if <= streakDays
    const isActive = dayNum <= streakDays;
    return {
      day: dayNum,
      active: isActive,
      hours: isActive ? (1.5 + (dayNum % 3) * 0.8).toFixed(1) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4 fill-orange-400" />
          <span>DAILY HABIT DISCIPLINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Study Streaks & Milestones</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Maintain study momentum by completing at least 1 meaningful session or quest every day.
        </p>
      </div>

      {/* Hero Streak Flame Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel hud-corner border-orange-500/40 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-400 p-1 shadow-xl shadow-orange-600/40 animate-pulse">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#0c1026]">
              <Flame className="w-14 h-14 text-orange-400 fill-orange-400" />
            </div>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 block">
              ACTIVE STUDY STREAK
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-1 flex items-center gap-3">
              <span>{streakDays} DAYS</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/50 text-orange-300">
                1.2x XP Buff Active
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-2">
              Personal Record: <strong className="text-white">{longestStreak} consecutive days</strong>
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center md:text-right">
          <span className="text-xs text-slate-400 block">Today&apos;s Status</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center justify-center md:justify-end gap-1 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            Streak Protected Today
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Resets daily at 00:00 UTC
          </span>
        </div>
      </div>

      {/* Streak Milestone Rewards */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
          Streak Milestone Unlocks
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* 7 Days Reward */}
          <div className="p-5 rounded-3xl cyber-card flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-800/40 text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                Unlocked
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">7-Day Scholar Badge</h4>
              <p className="text-xs text-slate-400 mt-1">
                &ldquo;Week Warrior&rdquo; crest awarded for completing a full continuous 7-day study cycle.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="font-bold text-yellow-400">+50 Coins</span>
              <span className="font-semibold text-emerald-400">Claimed</span>
            </div>
          </div>

          {/* 14 Days Reward */}
          <div className="p-5 rounded-3xl cyber-card flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800/40 text-yellow-400">
                <Coins className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                Unlocked
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">14-Day Iron Will Bounty</h4>
              <p className="text-xs text-slate-400 mt-1">
                Generous cache of 150 Virtual Coins and the &ldquo;Iron Will&rdquo; profile title.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="font-bold text-yellow-400">+150 Coins</span>
              {claimedRewards.includes('reward_14d') ? (
                <span className="font-semibold text-emerald-400">Claimed</span>
              ) : (
                <button
                  onClick={() => handleClaimReward('reward_14d', 150)}
                  className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 font-bold text-black"
                >
                  Claim Bounty
                </button>
              )}
            </div>
          </div>

          {/* 30 Days Reward */}
          <div className="p-5 rounded-3xl cyber-card flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/40 text-cyan-400">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {streakDays}/30 Days
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">30-Day Cyber Aurora Theme</h4>
              <p className="text-xs text-slate-400 mt-1">
                Rare holographic aesthetic skin for your StudyVerse UI, dashboard, and public profile.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="font-bold text-cyan-400">Exclusive Theme</span>
              <span className="text-slate-500 font-medium">13 days to go</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Grid (30-day heatmap) */}
      <div className="p-6 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">30-Day Habit Matrix</h3>
          </div>
          <span className="text-xs text-slate-400">Current Month Velocity</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 pt-2">
          {daysInMonth.map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-2xl border text-center transition ${
                item.active
                  ? 'bg-gradient-to-b from-orange-950/70 to-slate-900 border-orange-500/50 text-white shadow-sm shadow-orange-900/30'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] block text-slate-400 font-bold">D{item.day}</span>
              <Flame
                className={`w-4 h-4 mx-auto my-1 ${
                  item.active ? 'text-orange-400 fill-orange-400' : 'text-slate-700'
                }`}
              />
              <span className="text-[10px] font-mono">
                {item.active ? `${item.hours}h` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
