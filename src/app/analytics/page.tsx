'use client';

import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Flame, 
  TrendingUp, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export default function AnalyticsPage() {
  const { profile, quests, quizAttempts } = useStudyVerse();

  const totalQuestsCompleted = quests.filter((q) => q.status === 'completed').length;
  const avgAccuracy = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((s, a) => s + a.accuracyPercentage, 0) / quizAttempts.length)
    : 85;

  const weeklyHoursData = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.1 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 4.8 },
    { day: 'Sun', hours: 3.0 },
  ];

  const maxHours = Math.max(...weeklyHoursData.map((d) => d.hours));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>PERFORMANCE TELEMETRY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Study Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Quantified metrics tracking your daily focus time, accuracy rates, and subject strengths.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40">
          <Clock className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="text-2xl font-black text-white">{profile.studyHoursTotal} hrs</div>
          <span className="text-xs text-slate-400">Total Study Time</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40">
          <CheckCircle2 className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl font-black text-white">{totalQuestsCompleted}</div>
          <span className="text-xs text-slate-400">Tasks Completed</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40">
          <Target className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl font-black text-white">{avgAccuracy}%</div>
          <span className="text-xs text-slate-400">Quiz Accuracy</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40">
          <Flame className="w-5 h-5 text-orange-400 mb-2 fill-orange-400" />
          <div className="text-2xl font-black text-white">{profile.currentStreak} days</div>
          <span className="text-xs text-slate-400">Current Streak (Best: {profile.longestStreak}d)</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Hours Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Weekly Focus Distribution</h3>
            <span className="text-xs text-cyan-400 font-semibold">23.9 hrs logged</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyHoursData.map((d) => {
              const heightPercent = Math.round((d.hours / maxHours) * 100);

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-slate-400 font-mono">{d.hours}h</span>
                  <div className="w-full bg-slate-900 rounded-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-xl transition-all duration-500 hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Mastery / Strength & Weakness */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Subject Diagnostic Mastery</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Physics (Strong Subject)
                </span>
                <span className="text-emerald-400">85% Mastery</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Chemistry (Moderate Depth)
                </span>
                <span className="text-cyan-400">68% Mastery</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Mathematics (Needs Reinforcement)
                </span>
                <span className="text-amber-400">48% Mastery</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 mt-4">
            <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>AI Recommendation:</strong> Allocate 45 minutes of today&apos;s focus sprint to calculus and limits practice to bridge your mathematics gap before next week&apos;s mock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
