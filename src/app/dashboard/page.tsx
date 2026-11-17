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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181447] via-[#11163d] to-[#0c1f45] p-6 sm:p-8 border border-purple-500/40 shadow-2xl shadow-purple-950/50 hud-corner">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* User Profile Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-purple-400 object-cover shadow-xl shadow-purple-900/60 ring-2 ring-cyan-400/40"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300 text-[10px] font-black text-white shadow-md shadow-purple-900/50">
                LVL {profile.currentLevel}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gradient-cyber tracking-tight">{profile.fullName}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/70 border border-purple-400/50 text-purple-200 font-bold shadow-sm">
                  {profile.targetExam}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{levelProgress.currentLevel.title}</span>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-orange-400 font-black px-2 py-0.5 rounded-md bg-orange-950/60 border border-orange-700/50 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
                  {profile.currentStreak} Day Streak
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-yellow-300 font-black px-2 py-0.5 rounded-md bg-yellow-950/60 border border-yellow-700/50 shadow-sm">
                  <Coins className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {profile.coins} Coins
                </span>
              </div>
            </div>
          </div>

          {/* Level & XP Gauge */}
          <div className="w-full md:w-84 p-4 rounded-2xl bg-[#090c24]/80 border border-purple-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-black tracking-wider text-purple-300 uppercase flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                LEVEL {profile.currentLevel}
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                <span className="text-cyan-300 font-black">{profile.currentXp}</span>
                {levelProgress.nextLevel ? ` / ${levelProgress.nextLevel.minXp} XP` : ' (MAX LEVEL)'}
              </span>
            </div>

            {/* Glowing XP Progress Bar */}
            <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-purple-900/60 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full xp-shimmer shadow-xp-glow"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-medium">
              <span className="text-purple-300 font-bold">{levelProgress.percentage}% to Next Ascension</span>
              {levelProgress.nextLevel && (
                <span className="text-cyan-400 font-mono font-semibold">{levelProgress.xpNeededForNext} XP required</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHARACTER STATS MATRIX */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl cyber-card">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
            <span>🧠 KNOWLEDGE</span>
            <span className="text-white font-mono font-black">{knowledgeScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-2 p-0.5 border border-purple-950">
            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${knowledgeScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Calculated from quiz scores & accuracy</span>
        </div>

        <div className="p-4 rounded-2xl cyber-card">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
            <span>📚 PREPARATION</span>
            <span className="text-white font-mono font-black">{prepScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-2 p-0.5 border border-cyan-950">
            <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${prepScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Completed syllabus chapters weightage</span>
        </div>

        <div className="p-4 rounded-2xl cyber-card">
          <div className="flex items-center justify-between text-xs font-bold text-yellow-400 mb-1">
            <span>⚡ FOCUS</span>
            <span className="text-white font-mono font-black">{focusScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-2 p-0.5 border border-amber-950">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${focusScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Cumulative deep work timer hours</span>
        </div>

        <div className="p-4 rounded-2xl cyber-card">
          <div className="flex items-center justify-between text-xs font-bold text-orange-400 mb-1">
            <span>🔥 CONSISTENCY</span>
            <span className="text-white font-mono font-black">{consistencyScore}</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-2 p-0.5 border border-orange-950">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: `${consistencyScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Daily streak & quest fulfillment rate</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TODAY'S PROGRESS + EXAM COUNTDOWN + QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Goal Ring */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40">
            <h3 className="text-sm font-black text-slate-200 tracking-wide uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Today&apos;s Focus Goal</span>
            </h3>
            <span className="text-xs text-cyan-300 font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 shadow-sm">{goalPercentage}% Met</span>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="11"
                  className="text-slate-900/90"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="11"
                  className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.65)]"
                  strokeDasharray={402.1}
                  strokeDashoffset={402.1 - (402.1 * goalPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white tracking-tight font-mono drop-shadow-md">
                  {hoursSpent}h {minsSpent}m
                </span>
                <span className="text-[11px] text-cyan-300/80 block font-bold uppercase tracking-wider mt-0.5">
                  / {targetHours}h Goal
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/timer"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-cyan-600/40 hover:from-purple-600 hover:to-cyan-500 border border-purple-500/50 text-xs font-black text-white text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 hover:shadow-purple-600/30 hover:scale-[1.02]"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Launch Focus Sprint (+2 XP/min)</span>
          </Link>
        </div>

        {/* Exam Countdown & Pace */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40 mb-4">
              <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>EXAM COUNTDOWN</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-600/60 text-[10px] font-black text-purple-300 shadow-sm">
                {profile.targetExam}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-6xl font-black text-white tracking-tight font-mono text-gradient-gold drop-shadow-lg">
                {daysLeft}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-orange-400 mt-1.5 flex items-center justify-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>DAYS REMAINING</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 font-medium">
                Target Date: <span className="text-cyan-300 font-bold font-mono">{profile.targetExamDate}</span>
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-900/40 text-xs text-slate-300 flex items-center gap-2.5 shadow-inner">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-bounce" />
            <span>Pacing requirement: <strong className="text-yellow-300">{targetHours} hrs/day</strong> to master remaining syllabus.</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider pb-2 border-b border-indigo-900/40 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Command Actions</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/timer"
              className="p-3.5 rounded-2xl bg-[#0a0d26]/80 border border-purple-800/40 hover:border-purple-400 hover:bg-purple-900/30 transition-all duration-200 group flex flex-col items-center text-center hover:scale-105 hover:shadow-lg hover:shadow-purple-900/40"
            >
              <Clock className="w-6 h-6 text-purple-400 mb-1.5 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-black text-white">START FOCUS</span>
              <span className="text-[10px] text-slate-400">Deep Work</span>
            </Link>

            <Link
              href="/quests"
              className="p-3.5 rounded-2xl bg-[#0a0d26]/80 border border-indigo-800/40 hover:border-indigo-400 hover:bg-indigo-900/30 transition-all duration-200 group flex flex-col items-center text-center hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/40"
            >
              <Plus className="w-6 h-6 text-indigo-400 mb-1.5 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-black text-white">ADD QUEST</span>
              <span className="text-[10px] text-slate-400">Forge Task</span>
            </Link>

            <Link
              href="/quiz"
              className="p-3.5 rounded-2xl bg-[#0a0d26]/80 border border-cyan-800/40 hover:border-cyan-400 hover:bg-cyan-900/30 transition-all duration-200 group flex flex-col items-center text-center hover:scale-105 hover:shadow-lg hover:shadow-cyan-900/40"
            >
              <BrainCircuit className="w-6 h-6 text-cyan-400 mb-1.5 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-black text-white">TAKE QUIZ</span>
              <span className="text-[10px] text-slate-400">Test Retention</span>
            </Link>

            <Link
              href="/ai-tutor"
              className="p-3.5 rounded-2xl bg-[#0a0d26]/80 border border-emerald-800/40 hover:border-emerald-400 hover:bg-emerald-900/30 transition-all duration-200 group flex flex-col items-center text-center hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/40"
            >
              <Bot className="w-6 h-6 text-emerald-400 mb-1.5 group-hover:scale-110 transition duration-200" />
              <span className="text-xs font-black text-white">ASK AI</span>
              <span className="text-[10px] text-slate-400">Instant Solver</span>
            </Link>
          </div>

          <Link
            href="/battleground"
            className="mt-3 py-3 rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-cyan-900/50 border border-cyan-500/40 text-xs font-black text-cyan-200 text-center hover:text-white hover:border-cyan-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-950/60"
          >
            <Swords className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Enter AI Battleground Arena</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY'S QUESTS + LEADERBOARD PREVIEW */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Quests (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-purple-400" />
                <span>Today&apos;s Active Quests</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Check off quests to claim instant XP and coins</p>
            </div>
            <Link
              href="/quests"
              className="text-xs text-cyan-300 hover:text-white font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-700/50 hover:bg-purple-900/50 transition"
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
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    isCompleted
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                      : 'cyber-card hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-950/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      type="button"
                      disabled={isCompleted}
                      onClick={() => handleToggleQuest(quest.id, isCompleted)}
                      className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : 'border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10 text-transparent hover:text-cyan-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm truncate ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-white'
                          }`}
                        >
                          {quest.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          quest.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                          quest.difficulty === 'Medium' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' :
                          quest.difficulty === 'Hard' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' :
                          'bg-purple-950 text-purple-300 border border-purple-800/60'
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
                    <span className="text-xs font-black text-cyan-300 font-mono block">+{quest.xpReward} XP</span>
                    <span className="text-[10px] text-yellow-400 block font-bold">+{quest.coinsReward} Coins</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guild / Leaderboard Preview (1 col) */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Top Scholars</h3>
              </div>
              <Link href="/leaderboard" className="text-xs text-purple-400 hover:text-purple-300 font-bold hover:underline">
                Full Board
              </Link>
            </div>

            <div className="space-y-2.5">
              {topScholars.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-2xl bg-[#090c24]/90 border border-indigo-900/40 hover:border-purple-500/40 transition flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-black text-xs font-mono ${
                      entry.rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : entry.rank === 2 ? 'text-slate-300' : 'text-amber-500'
                    }`}>
                      #{entry.rank}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full border border-purple-500/60 object-cover shadow-sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{entry.name}</span>
                      <span className="text-[10px] text-slate-400">Lv {entry.level} • {entry.targetExam}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-cyan-300">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Your Current Rank:</span>
            <span className="font-black text-purple-300 font-mono">#6 • Level {profile.currentLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
