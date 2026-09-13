'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Medal, 
  Sparkles, 
  ArrowUp, 
  TrendingUp, 
  User 
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { MOCK_LEADERBOARDS } from '@/lib/data/mock-db';

export default function LeaderboardPage() {
  const { profile } = useStudyVerse();
  const [activeTab, setActiveTab] = useState<'WEEK' | 'MONTH' | 'ALL TIME'>('WEEK');

  const currentList = MOCK_LEADERBOARDS[activeTab];
  const topThree = currentList.slice(0, 3);
  const remainingList = currentList.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>GLOBAL SCHOLAR HIERARCHY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Leaderboard of Scholars</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time standings calibrated across study XP velocity, quest completion, and exam focus.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40">
          {(['WEEK', 'MONTH', 'ALL TIME'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP 3 PODIUM DISPLAY */}
      {/* ========================================================================= */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4">
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <div className="p-6 rounded-3xl bg-[#0d1029]/80 border border-slate-700/60 flex flex-col items-center text-center space-y-3 sm:order-1 sm:mt-6 shadow-xl">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={topThree[1].avatarUrl}
                alt={topThree[1].name}
                className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-black font-black text-xs">
                2
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{topThree[1].name}</h3>
              <span className="text-[10px] text-slate-400 font-semibold">
                Lv {topThree[1].level} • {topThree[1].targetExam}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 w-full text-center">
              <span className="text-base font-black text-cyan-400">{topThree[1].xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-400 block">+{topThree[1].streak}d Streak</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold Crown) */}
        {topThree[0] && (
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#1c183d] via-[#10122d] to-[#0a0d24] border-2 border-yellow-500/60 flex flex-col items-center text-center space-y-3 sm:order-2 shadow-2xl shadow-yellow-900/20">
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-1 animate-bounce" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={topThree[0].avatarUrl}
                alt={topThree[0].name}
                className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover shadow-xl shadow-yellow-500/20"
              />
              <div className="absolute -bottom-2 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-black font-black text-xs shadow-md">
                1
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-300 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>APEX SCHOLAR</span>
              </div>
              <h3 className="font-black text-base text-white">{topThree[0].name}</h3>
              <span className="text-xs text-purple-300 font-semibold">
                Lv {topThree[0].level} • {topThree[0].targetExam}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-yellow-500/30 w-full text-center">
              <span className="text-lg font-black text-yellow-400">{topThree[0].xp.toLocaleString()} XP</span>
              <span className="text-xs text-orange-400 font-bold block flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                {topThree[0].streak} Day Streak
              </span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <div className="p-6 rounded-3xl bg-[#0d1029]/80 border border-amber-900/40 flex flex-col items-center text-center space-y-3 sm:order-3 sm:mt-8 shadow-xl">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={topThree[2].avatarUrl}
                alt={topThree[2].name}
                className="w-16 h-16 rounded-full border-2 border-amber-600 object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white font-black text-xs">
                3
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{topThree[2].name}</h3>
              <span className="text-[10px] text-slate-400 font-semibold">
                Lv {topThree[2].level} • {topThree[2].targetExam}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 w-full text-center">
              <span className="text-base font-black text-cyan-400">{topThree[2].xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-400 block">+{topThree[2].streak}d Streak</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LEADERBOARD ROSTER TABLE */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Tier Ladder Rankings
        </h3>

        <div className="space-y-2">
          {remainingList.map((entry) => {
            const isUser = entry.id === 'user-demo';

            return (
              <div
                key={entry.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isUser
                    ? 'bg-purple-950/50 border-purple-500 shadow-md shadow-purple-900/30'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-slate-400 w-6">#{entry.rank}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.avatarUrl}
                    alt={entry.name}
                    className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{entry.name}</span>
                      {isUser && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-600 font-bold text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Level {entry.level} • {entry.targetExam}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <span className="flex items-center gap-1 text-orange-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" />
                    {entry.streak}d
                  </span>
                  <span className="font-mono font-black text-cyan-400 text-sm">
                    {entry.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
