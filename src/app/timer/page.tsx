'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  BookOpen,
  Check
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { playTimerAlertSound } from '@/lib/gamification/sound';

export default function FocusTimerPage() {
  const { quests, recordFocusSession, profile } = useStudyVerse();

  // Timer configuration
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Subject / Chapter / Quest selection
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('Modern Physics');
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');

  // Timer run state
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Focus Interruption & Fullscreen
  const [interruptionCount, setInterruptionCount] = useState<number>(0);
  const [showInterruptionAlert, setShowInterruptionAlert] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Completion summary modal
  const [completedSummary, setCompletedSummary] = useState<{
    duration: number;
    xp: number;
    coins: number;
    interruptions: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Preset Change
  const handleSelectPreset = (mins: number) => {
    if (isActive) return;
    setIsCustom(false);
    setSelectedMinutes(mins);
    setTotalSeconds(mins * 60);
    setSecondsRemaining(mins * 60);
  };

  const handleApplyCustom = () => {
    if (isActive) return;
    setIsCustom(true);
    setSelectedMinutes(customMinutes);
    setTotalSeconds(customMinutes * 60);
    setSecondsRemaining(customMinutes * 60);
  };

  // Visibility and Tab change listener (Interruption detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && !isPaused) {
        setInterruptionCount((prev) => prev + 1);
        setShowInterruptionAlert(true);
      }
    };

    const handleWindowBlur = () => {
      if (isActive && !isPaused) {
        setInterruptionCount((prev) => prev + 1);
        setShowInterruptionAlert(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, isPaused]);

  // Finish Timer Handler
  const handleTimerFinished = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    if (soundEnabled) playTimerAlertSound();

    const actualDurationMinutes = Math.max(1, Math.round(totalSeconds / 60));
    const result = recordFocusSession({
      durationMinutes: actualDurationMinutes,
      subject: selectedSubject,
      chapter: selectedChapter,
      questId: selectedQuestId || undefined,
      interruptionsCount: interruptionCount,
    });

    setCompletedSummary({
      duration: actualDurationMinutes,
      xp: result.xp,
      coins: result.coins,
      interruptions: interruptionCount,
    });
  }, [
    soundEnabled, 
    totalSeconds, 
    recordFocusSession, 
    selectedSubject, 
    selectedChapter, 
    selectedQuestId, 
    interruptionCount
  ]);

  // Main countdown interval
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, handleTimerFinished]);

  // Timer controls
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setSecondsRemaining(totalSeconds);
    setInterruptionCount(0);
    setShowInterruptionAlert(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Formatting helpers
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>DEEP CHRONO PROTOCOL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Focus Sprint Timer</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Earn <strong className="text-cyan-400">2 XP per completed study minute</strong>. Eliminate tab switching to preserve your focus score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-purple-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      {!isActive && (
        <div className="p-4 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Choose Sprint Duration
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[25, 50, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectPreset(mins)}
                className={`py-3 px-4 rounded-2xl border font-bold text-sm transition text-center ${
                  selectedMinutes === mins && !isCustom
                    ? 'bg-purple-900/50 border-purple-500 text-white shadow-lg shadow-purple-950/60'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>{mins} Minutes</div>
                <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">+{mins * 2} XP</div>
              </button>
            ))}

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-slate-800">
              <input
                type="number"
                min={5}
                max={180}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-16 rounded-xl bg-slate-900 border border-slate-700 px-2 py-2 text-center text-xs text-white"
              />
              <button
                onClick={handleApplyCustom}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition ${
                  isCustom
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Custom Mins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Pre-Study Context */}
      {!isActive && (
        <div className="grid sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-[#0d1029]/80 border border-indigo-900/40">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
            <input
              type="text"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Link Daily Quest (Optional)</label>
            <select
              value={selectedQuestId}
              onChange={(e) => setSelectedQuestId(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">None / Freestyle Study</option>
              {quests.filter((q) => q.status === 'pending').map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚠️ FOCUS INTERRUPTED WARNING BANNER */}
      {/* ========================================================================= */}
      {showInterruptionAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-950/80 border border-rose-600/60 shadow-lg text-rose-200 flex items-start justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
            <div>
              <h4 className="font-black text-sm text-white">⚠️ FOCUS INTERRUPTED</h4>
              <p className="text-xs text-rose-200 mt-0.5">
                Tab or window switch detected. Interruption count: <strong className="text-white">{interruptionCount}</strong>.
                Lock back in to secure maximum XP!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInterruptionAlert(false)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white shrink-0"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CYBERPUNK TIMER DISPLAY */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#101333] via-[#090b1e] to-[#050714] p-8 sm:p-12 border border-purple-500/30 text-center shadow-2xl flex flex-col items-center justify-center">
        {/* Glowing Background Radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />

        {/* Current Target Header */}
        <div className="mb-6 z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 block">
            {selectedSubject}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
            {selectedChapter}
          </h2>
          {isActive && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Session In Progress • Interrupts: {interruptionCount}</span>
            </div>
          )}
        </div>

        {/* Circular Dial & Glowing Digits */}
        <div className="relative flex items-center justify-center my-4">
          <svg className="w-64 h-64 sm:w-80 sm:h-80 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              className="text-purple-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-1000 ease-linear"
              strokeDasharray={753.9}
              strokeDashoffset={753.9 - (753.9 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-white font-mono drop-shadow-md">
              {formattedTime}
            </span>
            <span className="text-xs font-bold text-cyan-400 mt-2 uppercase tracking-widest">
              +{Math.floor(selectedMinutes * 2)} XP AT COMPLETION
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center gap-4 z-10">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>ENGAGE FOCUS</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={handleResume}
                  className="px-6 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-6 py-3.5 rounded-2xl font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30 transition flex items-center gap-2"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-5 py-3.5 rounded-2xl font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETION MODAL */}
      {/* ========================================================================= */}
      {completedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#18163f] via-[#0d102c] to-[#070919] border border-purple-500/40 p-6 text-center shadow-2xl space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c1026]">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                SPRINT ACCOMPLISHED
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Deep Work Complete!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                You logged {completedSummary.duration} minutes of high-intensity study.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div>
                <span className="text-lg font-black text-purple-400">+{completedSummary.xp}</span>
                <span className="text-[10px] text-slate-400 block font-bold">XP EARNED</span>
              </div>
              <div>
                <span className="text-lg font-black text-yellow-400">+{completedSummary.coins}</span>
                <span className="text-[10px] text-slate-400 block font-bold">COINS</span>
              </div>
              <div>
                <span className="text-lg font-black text-rose-400">{completedSummary.interruptions}</span>
                <span className="text-[10px] text-slate-400 block font-bold">INTERRUPTS</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedSummary(null);
                handleReset();
              }}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition shadow-lg shadow-purple-600/30"
            >
              Collect Rewards & Return
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
