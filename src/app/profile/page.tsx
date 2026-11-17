'use client';

import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Flame, 
  Coins, 
  Trophy, 
  Clock, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut, 
  Save, 
  Sparkles,
  Palette
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { getLevelProgress } from '@/lib/gamification/levels';
import { EXAM_OPTIONS } from '@/lib/data/mock-db';
import { ExamType } from '@/lib/types';

const MALE_AVATARS = [
  { id: 'male-1', name: 'Smart Scholar', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'male-2', name: 'Elite Strategist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'male-3', name: 'Disciplined Mind', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'male-4', name: '3D Cyber Cadet', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  { id: 'male-5', name: 'Grandmaster Apex', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'male-6', name: 'Tech Prodigy', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
];

export default function ProfilePage() {
  const { profile, updateProfile, logout, achievements, chapterProgressList } = useStudyVerse();

  const levelProgress = getLevelProgress(profile.currentXp);
  const completedChaptersCount = chapterProgressList.filter((c) => c.status === 'completed').length;
  const unlockedAchievementsCount = achievements.filter((a) => a.isUnlocked).length;

  // Edit form state
  const [fullName, setFullName] = useState(profile.fullName);
  const [targetExam, setTargetExam] = useState<ExamType>(profile.targetExam);
  const [dailyGoalHours, setDailyGoalHours] = useState(Math.round(profile.dailyGoalMinutes / 60));
  const [targetExamDate, setTargetExamDate] = useState(profile.targetExamDate || '2026-12-10');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl || MALE_AVATARS[0].url);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectAvatar = (url: string) => {
    setSelectedAvatar(url);
    updateProfile({ avatarUrl: url });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      targetExam,
      dailyGoalMinutes: dailyGoalHours * 60,
      targetExamDate,
      avatarUrl: selectedAvatar,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>SCHOLAR DOSSIER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Profile & Credentials</h1>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHARACTER SHEET HERO */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel hud-corner flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-24 h-24 rounded-3xl border-2 border-cyan-400 object-cover shadow-xl shadow-cyan-950/60"
          />
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400 text-xs font-black text-white shadow">
            LVL {profile.currentLevel}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-black text-white">{profile.fullName}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold w-fit mx-auto sm:mx-0">
              {profile.targetExam} Aspirant
            </span>
          </div>

          <p className="text-xs font-semibold text-gradient-gold">
            {levelProgress.currentLevel.title}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1 text-orange-400 font-bold">
              <Flame className="w-4 h-4 fill-orange-400" />
              {profile.currentStreak} Day Streak
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-yellow-400 font-bold">
              <Coins className="w-4 h-4 fill-yellow-400" />
              {profile.coins} Coins
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <Trophy className="w-4 h-4" />
              Rating: {profile.battleRating}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CAREER STATS SUMMARY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel text-center">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-xl font-black text-white">{profile.studyHoursTotal}h</div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Study Hours</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-center">
          <BookOpen className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-xl font-black text-white">{completedChaptersCount}</div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Chapters Done</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-center">
          <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-black text-white">{unlockedAchievementsCount}</div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Achievements</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-center">
          <Trophy className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-black text-white">{profile.battleRating}</div>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Battle Elo</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROFILE SETTINGS & EDITING */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel hud-corner space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-indigo-900/40">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Scholar Persona & Parameters</h3>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Male Scholar Avatar Picker */}
        <div className="space-y-3 pb-2">
          <label className="block text-xs font-bold text-gradient-cyber uppercase tracking-wider">
            Choose Male Scholar Avatar
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {MALE_AVATARS.map((av) => {
              const isSelected = profile.avatarUrl === av.url;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAvatar(av.url)}
                  className={`p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center group ${
                    isSelected
                      ? 'bg-purple-950/70 border-2 border-cyan-400 shadow-lg shadow-cyan-950/60 scale-105'
                      : 'bg-slate-950/50 border border-indigo-950 hover:border-purple-500/60'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={av.url}
                    alt={av.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition"
                  />
                  <span className={`text-[10px] font-bold truncate max-w-full ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {av.name}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-black uppercase text-purple-300 bg-purple-900/60 px-1.5 py-0.2 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scholar Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Examination</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value as ExamType)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {EXAM_OPTIONS.map((opt) => (
                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Study Target (Hours)</label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Exam Date</label>
              <input
                type="date"
                required
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 rounded-xl border border-rose-800/60 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow-lg shadow-purple-900/30 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
