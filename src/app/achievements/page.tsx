'use client';

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Clock, 
  BookOpen, 
  Target, 
  Swords, 
  Crown, 
  Sparkles,
  Coins
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { AchievementItem } from '@/lib/types';

export default function AchievementsPage() {
  const { achievements, profile } = useStudyVerse();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2': return CheckCircle2;
      case 'Flame': return Flame;
      case 'Clock': return Clock;
      case 'BookOpen': return BookOpen;
      case 'Target': return Target;
      case 'Swords': return Swords;
      case 'Crown': return Crown;
      default: return Award;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>HALL OF TRIUMPHS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Scholar Achievements</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Commemorate key academic and habit milestones throughout your study campaign.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="p-3 rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
            {unlockedCount}/{achievements.length}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Unlocked Medals</span>
            <span className="text-[10px] text-slate-400">
              {Math.round((unlockedCount / achievements.length) * 100)}% Completed
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.icon);

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl flex flex-col justify-between space-y-4 shadow-xl transition relative overflow-hidden ${
                ach.isUnlocked
                  ? 'cyber-card'
                  : 'bg-slate-950/50 border border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-2xl border flex items-center justify-center ${
                      ach.isUnlocked
                        ? 'bg-purple-900/50 border-purple-500 text-purple-300 shadow-md shadow-purple-900/40'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      ach.isUnlocked
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {ach.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {ach.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Progress bar if applicable */}
                {ach.targetProgress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Progress</span>
                      <span>{ach.currentProgress || 0} / {ach.targetProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round(((ach.currentProgress || 0) / ach.targetProgress) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold pt-1">
                  <span className="text-purple-400">+{ach.rewardXp} XP</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    +{ach.rewardCoins}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
