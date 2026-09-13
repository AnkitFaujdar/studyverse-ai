'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Coins, Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export const LevelUpModal: React.FC = () => {
  const { levelUpEvent, closeLevelUpModal } = useStudyVerse();

  useEffect(() => {
    if (levelUpEvent) {
      // Fire confetti cannon
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ffffff'],
      });
    }
  }, [levelUpEvent]);

  if (!levelUpEvent) return null;

  const { oldLevel, newLevel, rewardCoins } = levelUpEvent;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#17153b] via-[#0d102b] to-[#08091a] p-6 text-center shadow-2xl shadow-purple-900/40"
        >
          {/* Close button */}
          <button
            onClick={closeLevelUpModal}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Aura Icon */}
          <div className="mx-auto my-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-1 shadow-lg shadow-purple-500/50 animate-bounce">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d102b]">
              <Crown className="h-12 w-12 text-yellow-400 drop-shadow-md" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>ASCENSION ACHIEVED</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              LEVEL UP!
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Your dedication and intellectual discipline bear fruit.
            </p>

            {/* Level Transition Pill */}
            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 mb-6">
              <div className="text-center">
                <span className="text-xs text-slate-400 block">From</span>
                <span className="text-lg font-bold text-slate-300">Level {oldLevel.level}</span>
                <span className="text-xs text-slate-400 block">{oldLevel.title}</span>
              </div>
              <div className="text-xl font-black text-purple-400">➔</div>
              <div className="text-center">
                <span className="text-xs text-purple-300 block">Promoted To</span>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  Level {newLevel.level}
                </span>
                <span className="text-xs font-semibold text-cyan-300 block">{newLevel.title}</span>
              </div>
            </div>

            {/* Unlocked Rewards List */}
            <div className="space-y-2 mb-6 text-left">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-sm">
                <Coins className="w-5 h-5 text-yellow-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-white">+{rewardCoins} Virtual Coins</span>
                  <p className="text-xs text-slate-400">Spend in the StudyVerse Reward Shop</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-sm">
                <Award className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-white">New Scholar Title & Badge</span>
                  <p className="text-xs text-slate-400">{newLevel.description}</p>
                </div>
              </div>
            </div>

            {/* Claim / Continue Button */}
            <button
              onClick={closeLevelUpModal}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-purple-600/30 active:scale-95"
            >
              CLAIM REWARDS & CONTINUE
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
