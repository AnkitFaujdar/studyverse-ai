'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Swords, Clock, BrainCircuit, Users, Bot, ArrowRight, ShieldCheck, Flame, Crown } from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export default function HomePage() {
  const { profile } = useStudyVerse();

  return (
    <div className="relative overflow-hidden py-12 lg:py-20 flex flex-col items-center justify-center text-center">
      {/* Background Cyber Aura Grid */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-[#060814]" />
      
      {/* Top Banner Tag */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-600/40 text-xs font-semibold text-purple-300 shadow-lg shadow-purple-900/30 mb-6"
      >
        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
        <span>GAMIFIED EXAM PREPARATION PLATFORM</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-tight"
      >
        Prepare. Compete.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
          Level Up.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed"
      >
        Transform the grueling exam grind into an epic RPG adventure. Complete daily quests, 
        master focus sprints, challenge peers in AI battlegrounds, and achieve syllabus supremacy.
      </motion.p>

      {/* Primary Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Enter Command Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-semibold text-base transition hover:scale-105 active:scale-95"
        >
          <span>Target Exam Setup</span>
        </Link>
      </motion.div>

      {/* Hero Stats Ribbon */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full"
      >
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-900/30 backdrop-blur-md">
          <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">10 RPG Levels</div>
          <div className="text-xs text-slate-400">Non-linear progression</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-900/30 backdrop-blur-md">
          <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">2 XP / Min</div>
          <div className="text-xs text-slate-400">Validated focus timer</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-900/30 backdrop-blur-md">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{profile.currentStreak} Day Streak</div>
          <div className="text-xs text-slate-400">Daily habit multiplier</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-900/30 backdrop-blur-md">
          <Bot className="w-6 h-6 text-purple-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-white">AI Tutor</div>
          <div className="text-xs text-slate-400">Multimodal assistance</div>
        </div>
      </motion.div>

      {/* Feature Pillar Highlights */}
      <div className="mt-16 text-left max-w-5xl w-full space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 text-center">
          CORE PRODUCT ARSENAL
        </h3>

        <div className="grid sm:grid-cols-3 gap-5">
          <Link href="/quests" className="p-5 rounded-2xl bg-[#0e122b]/80 border border-indigo-800/30 hover:border-purple-500/50 transition group">
            <Swords className="w-7 h-7 text-purple-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="text-base font-bold text-white mb-1">Daily Study Quests</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Break monolithic syllabi into bite-sized objectives with real XP and virtual coin bounties.
            </p>
          </Link>

          <Link href="/battleground" className="p-5 rounded-2xl bg-[#0e122b]/80 border border-indigo-800/30 hover:border-cyan-500/50 transition group">
            <BrainCircuit className="w-7 h-7 text-cyan-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="text-base font-bold text-white mb-1">Exam Battleground</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step into head-to-head timed arenas against AI scholars and raise your Battle Rating.
            </p>
          </Link>

          <Link href="/guilds" className="p-5 rounded-2xl bg-[#0e122b]/80 border border-indigo-800/30 hover:border-emerald-500/50 transition group">
            <Users className="w-7 h-7 text-emerald-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="text-base font-bold text-white mb-1">Study Guilds & Clans</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Form competitive study guilds with fellow aspirants, monitor weekly XP, and climb the tiers.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
