'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Coins, 
  Sparkles, 
  Clock, 
  Swords, 
  BrainCircuit, 
  Bot, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  Target, 
  Trophy, 
  Zap, 
  BookOpen, 
  Check, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { getLevelProgress } from '@/lib/gamification/levels';
import { MOCK_LEADERBOARDS } from '@/lib/data/mock-db';

export default function DashboardPage() {
  const { 
    profile, 
    quests, 
    completeQuest, 
    todayFocusMinutes, 
    chapterProgressList 
  } = useStudyVerse();

  const levelProgress = getLevelProgress(profile.currentXp);
  const [completedQuestAnimationId, setCompletedQuestAnimationId] = useState<string | null>(null);

  // Calculate days left to exam
  const calculateDaysLeft = () => {
    if (!profile.targetExamDate) return 87;
    const target = new Date(profile.targetExamDate).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const daysLeft = calculateDaysLeft();

  // Calculate today's goal progress
  const targetMinutes = profile.dailyGoalMinutes || 180;
  const goalPercentage = Math.min(100, Math.round((todayFocusMinutes / targetMinutes) * 100));
  const hoursSpent = Math.floor(todayFocusMinutes / 60);
  const minsSpent = todayFocusMinutes % 60;
  const targetHours = Math.floor(targetMinutes / 60);

  // Character Stats (Dynamic calculations)
  const completedChapters = chapterProgressList.filter((c) => c.status === 'completed').length;
  const prepScore = Math.min(99, 50 + completedChapters * 8);
  const focusScore = Math.min(99, 60 + Math.floor(profile.studyHoursTotal / 2));
  const consistencyScore = Math.min(99, 65 + profile.currentStreak * 2);
  const knowledgeScore = Math.min(99, 70 + profile.currentLevel * 3);

  // Handle Quick Quest Completion
  const handleToggleQuest = (id: string, isCompleted: boolean) => {
    if (isCompleted) return;
    setCompletedQuestAnimationId(id);
    completeQuest(id);
    setTimeout(() => {
      setCompletedQuestAnimationId(null);
    }, 1500);
  };

  const todayQuests = quests.slice(0, 4);
  const topScholars = MOCK_LEADERBOARDS.WEEK.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP RPG HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141238] via-[#0f1433] to-[#0a1b38] p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Profile Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-purple-400/80 object-cover shadow-lg shadow-purple-950/60"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-purple-600 border border-purple-400 text-[10px] font-black text-white shadow">
                LVL {profile.currentLevel}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile.fullName}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 font-semibold">
                  {profile.targetExam}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-cyan-300 mt-0.5">
                {levelProgress.currentLevel.title}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-orange-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  {profile.currentStreak} Day Streak
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Coins className="w-3.5 h-3.5 fill-yellow-400" />
                  {profile.coins} Coins
                </span>
              </div>
            </div>
          </div>

          {/* Level & XP Gauge */}
          <div className="w-full md:w-80 p-4 rounded-2xl bg-slate-950/50 border border-indigo-800/40 backdrop-blur-md">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-black tracking-wider text-purple-300 uppercase">
                LEVEL {profile.currentLevel}
              </span>
              <span className="text-xs font-bold text-slate-200">
                <span className="text-cyan-400">{profile.currentXp}</span>
                {levelProgress.nextLevel ? ` / ${levelProgress.nextLevel.minXp} XP` : ' (MAX LEVEL)'}
              </span>
            </div>

            {/* Glowing XP Progress Bar */}
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-xp-glow"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>{levelProgress.percentage}% to Next Ascension</span>
              {levelProgress.nextLevel && (
                <span>{levelProgress.xpNeededForNext} XP required</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHARACTER STATS MATRIX */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0e122e]/80 border border-indigo-900/40 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
            <span>🧠 KNOWLEDGE</span>
            <span className="text-white font-mono">{knowledgeScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${knowledgeScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Calculated from quiz scores & accuracy</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e122e]/80 border border-indigo-900/40 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
            <span>📚 PREPARATION</span>
            <span className="text-white font-mono">{prepScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${prepScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Completed syllabus chapters weightage</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e122e]/80 border border-indigo-900/40 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-xs font-bold text-yellow-400 mb-1">
            <span>⚡ FOCUS</span>
            <span className="text-white font-mono">{focusScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${focusScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Cumulative deep work timer hours</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e122e]/80 border border-indigo-900/40 hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between text-xs font-bold text-orange-400 mb-1">
            <span>🔥 CONSISTENCY</span>
            <span className="text-white font-mono">{consistencyScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${consistencyScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Daily streak & quest fulfillment rate</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TODAY'S PROGRESS + EXAM COUNTDOWN + QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Goal Ring */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-800/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Today&apos;s Focus Goal</h3>
            <span className="text-xs text-purple-400 font-bold">{goalPercentage}% Met</span>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-cyan-400"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 - (351.8 * goalPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">
                  {hoursSpent}h {minsSpent}m
                </span>
                <span className="text-[11px] text-slate-400 block font-semibold">
                  / {targetHours}h Goal
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/timer"
            className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 text-center transition flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Launch Focus Sprint (+2 XP/min)</span>
          </Link>
        </div>

        {/* Exam Countdown & Pace */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-800/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                EXAM COUNTDOWN
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-700/50 text-[10px] font-bold text-cyan-300">
                {profile.targetExam}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-5xl font-black text-white tracking-tight">
                {daysLeft}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-orange-400 mt-1">
                DAYS REMAINING
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Target Date: <span className="text-slate-200 font-semibold">{profile.targetExamDate}</span>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>Velocity requirement: <strong>{targetHours} hrs/day</strong> to complete remaining chapters.</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-800/30 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Quick Command Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/timer"
              className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 hover:border-purple-500/80 hover:bg-purple-900/40 transition group flex flex-col items-center text-center"
            >
              <Clock className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-white">START FOCUS</span>
              <span className="text-[10px] text-slate-400">Pomodoro / Deep</span>
            </Link>

            <Link
              href="/quests"
              className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 hover:border-indigo-500/80 hover:bg-indigo-900/40 transition group flex flex-col items-center text-center"
            >
              <Plus className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-white">ADD QUEST</span>
              <span className="text-[10px] text-slate-400">Forge Objective</span>
            </Link>

            <Link
              href="/quiz"
              className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500/80 hover:bg-cyan-900/40 transition group flex flex-col items-center text-center"
            >
              <BrainCircuit className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-white">TAKE QUIZ</span>
              <span className="text-[10px] text-slate-400">Chapter Tests</span>
            </Link>

            <Link
              href="/ai-tutor"
              className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/80 hover:bg-emerald-900/40 transition group flex flex-col items-center text-center"
            >
              <Bot className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-white">ASK AI</span>
              <span className="text-[10px] text-slate-400">Instant Solver</span>
            </Link>
          </div>

          <Link
            href="/battleground"
            className="mt-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-600/30 text-xs font-bold text-cyan-300 text-center hover:text-white transition flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>Enter AI Battleground Arena</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY'S QUESTS + LEADERBOARD PREVIEW */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Quests (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-800/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Today&apos;s Active Quests</h3>
              <p className="text-xs text-slate-400">Check off quests to claim instant XP and coins</p>
            </div>
            <Link
              href="/quests"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>View All ({quests.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayQuests.map((quest) => {
              const isCompleted = quest.status === 'completed';
              const isAnimating = completedQuestAnimationId === quest.id;

              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    isCompleted
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      : 'bg-slate-900/70 border-indigo-900/40 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      disabled={isCompleted}
                      onClick={() => handleToggleQuest(quest.id, isCompleted)}
                      className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'border-slate-600 hover:border-purple-400 text-transparent hover:text-purple-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm truncate ${
                            isCompleted ? 'text-slate-400 line-through' : 'text-white'
                          }`}
                        >
                          {quest.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          quest.difficulty === 'Easy' ? 'bg-emerald-950/80 text-emerald-300' :
                          quest.difficulty === 'Medium' ? 'bg-cyan-950/80 text-cyan-300' :
                          quest.difficulty === 'Hard' ? 'bg-yellow-950/80 text-yellow-300' :
                          'bg-purple-950/80 text-purple-300'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {quest.subject} • {quest.chapter}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-purple-400">+{quest.xpReward} XP</span>
                    <span className="text-[10px] text-yellow-400 block font-semibold">+{quest.coinsReward} Coins</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guild / Leaderboard Preview (1 col) */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-800/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold text-white">Top Scholars (This Week)</h3>
              </div>
              <Link href="/leaderboard" className="text-xs text-purple-400 hover:underline">
                Full Board
              </Link>
            </div>

            <div className="space-y-3">
              {topScholars.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-black text-xs ${
                      entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-slate-300' : 'text-amber-600'
                    }`}>
                      #{entry.rank}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full border border-purple-500/40 object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{entry.name}</span>
                      <span className="text-[10px] text-slate-400">Lv {entry.level} • {entry.targetExam}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-cyan-400">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Your Current Rank:</span>
            <span className="font-bold text-purple-300">#6 • Level {profile.currentLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
