'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export const Toast: React.FC = () => {
  const { latestToast, clearToast } = useStudyVerse();

  useEffect(() => {
    if (latestToast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [latestToast, clearToast]);

  if (!latestToast) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-5 right-5 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-xl shadow-purple-950/50 backdrop-blur-md text-white max-w-sm"
        >
          {latestToast.type === 'xp' && <Sparkles className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />}
          {latestToast.type === 'coin' && <Coins className="w-5 h-5 text-yellow-400 shrink-0" />}
          {latestToast.type === 'warning' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {(!latestToast.type || latestToast.type === 'success') && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}

          <p className="text-sm font-medium text-slate-200 flex-1">{latestToast.message}</p>

          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
