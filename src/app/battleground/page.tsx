'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Swords, 
  ShieldAlert, 
  Trophy, 
  Clock, 
  Crown, 
  RotateCcw, 
  ArrowRight, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Zap
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { BattleMode, QuizQuestion } from '@/lib/types';
import { MOCK_QUIZ_QUESTIONS } from '@/lib/data/mock-db';

interface OpponentProfile {
  name: string;
  rating: number;
  avatarUrl: string;
  accuracyRate: number; // 0.6 to 0.95
}

export default function BattlegroundPage() {
  const { profile, recordBattleResult } = useStudyVerse();

  // Mode & Match State
  const [selectedMode, setSelectedMode] = useState<BattleMode>('quick_10');
  const [stage, setStage] = useState<'lobby' | 'battle' | 'result'>('lobby');

  // Active match data
  const [opponent, setOpponent] = useState<OpponentProfile>({
    name: 'Vikram Mehta',
    rating: 1180,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    accuracyRate: 0.75,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [questionTimer, setQuestionTimer] = useState<number>(15); // 15s per question
  const [battleResultData, setBattleResultData] = useState<{
    isVictory: boolean;
    ratingDelta: number;
    xp: number;
    coins: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getQuestionCountForMode = (mode: BattleMode) => {
    if (mode === 'quick_10') return 10;
    if (mode === 'standard_30') return 30;
    return 50;
  };

  // Launch Battle Match
  const handleStartBattle = (mode: BattleMode) => {
    setSelectedMode(mode);

    // Pick opponent according to mode
    if (mode === 'boss_50') {
      setOpponent({
        name: 'Grand Proctor AI',
        rating: 1450,
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120',
        accuracyRate: 0.88,
      });
    } else if (mode === 'standard_30') {
      setOpponent({
        name: 'Ananya Ray',
        rating: 1220,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
        accuracyRate: 0.8,
      });
    } else {
      setOpponent({
        name: 'Vikram Mehta',
        rating: 1140,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        accuracyRate: 0.7,
      });
    }

    const count = getQuestionCountForMode(mode);
    const pool = [...MOCK_QUIZ_QUESTIONS];
    // repeat pool to match count
    const active: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      active.push(pool[i % pool.length]);
    }

    setQuestions(active);
    setCurrentIdx(0);
    setUserScore(0);
    setOpponentScore(0);
    setQuestionTimer(15);
    setStage('battle');
  };

  // Finalize Match Handler
  const handleFinalizeMatch = useCallback((finalUser: number, finalOpp: number) => {
    const isVictory = finalUser >= finalOpp;
    const ratingDelta = isVictory ? +24 : -14;
    const xp = isVictory ? 150 : 50;
    const coins = isVictory ? 30 : 10;

    setBattleResultData({
      isVictory,
      ratingDelta,
      xp,
      coins,
    });

    recordBattleResult({
      mode: selectedMode,
      opponentName: opponent.name,
      opponentRating: opponent.rating,
      userScore: finalUser,
      opponentScore: finalOpp,
      isVictory,
      ratingDelta,
      xpAwarded: xp,
      coinsAwarded: coins,
    });

    setStage('result');
  }, [selectedMode, opponent.name, opponent.rating, recordBattleResult]);

  // Next Question or End
  const advanceQuestion = useCallback((userGotCorrect: boolean) => {
    const newScore = userGotCorrect ? userScore + 1 : userScore;
    setUserScore(newScore);

    // Opponent simulated answer
    const oppGotCorrect = Math.random() < opponent.accuracyRate;
    const newOppScore = oppGotCorrect ? opponentScore + 1 : opponentScore;
    setOpponentScore(newOppScore);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setQuestionTimer(15);
    } else {
      handleFinalizeMatch(newScore, newOppScore);
    }
  }, [userScore, opponent.accuracyRate, opponentScore, currentIdx, questions.length, handleFinalizeMatch]);

  // Per-question countdown
  useEffect(() => {
    if (stage === 'battle') {
      timerRef.current = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            // Time expired for this question
            advanceQuestion(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, advanceQuestion]);

  const currentQ = questions[currentIdx];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
          <Swords className="w-4 h-4" />
          <span>COMPETITIVE GLADIATOR ARENA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Study Battleground</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter timed head-to-head intellectual duels against AI scholars to increase your Battle Rating.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. LOBBY STAGE */}
      {/* ========================================================================= */}
      {stage === 'lobby' && (
        <div className="space-y-6">
          {/* Battle Rating Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#161033] to-[#0a1532] border border-rose-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-rose-600/20 border border-rose-500/50 text-rose-400">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                  SEPARATE COMPETITIVE ELO
                </span>
                <h2 className="text-3xl font-black text-white">
                  Rating: {profile.battleRating}
                </h2>
                <p className="text-xs text-slate-400">Tier: Gold Scholar Division</p>
              </div>
            </div>

            <div className="text-center sm:text-right text-xs text-slate-400">
              <span className="block font-semibold text-slate-300">PvP Matchmaking:</span>
              <span>Fast AI Challenger Engine Ready</span>
            </div>
          </div>

          {/* Battle Modes */}
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Mode 1: Quick */}
            <div className="p-6 rounded-3xl bg-[#0e1230]/90 border border-indigo-800/40 hover:border-purple-500/50 flex flex-col justify-between space-y-4 shadow-xl transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    Fast Pace
                  </span>
                  <span className="text-xs font-mono text-cyan-400">10 Qs</span>
                </div>
                <h3 className="text-lg font-black text-white mt-3">Quick Battle</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  10 rapid-fire questions against a matched student AI avatar. Perfect for warmups.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Win Reward:</span>
                  <span className="font-bold text-white">+150 XP • +24 Rating</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartBattle('quick_10')}
                  className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition active:scale-95"
                >
                  Enter Quick Battle
                </button>
              </div>
            </div>

            {/* Mode 2: Standard */}
            <div className="p-6 rounded-3xl bg-[#0e1230]/90 border border-indigo-800/40 hover:border-cyan-500/50 flex flex-col justify-between space-y-4 shadow-xl transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Championship
                  </span>
                  <span className="text-xs font-mono text-cyan-400">30 Qs</span>
                </div>
                <h3 className="text-lg font-black text-white mt-3">Standard Battle</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Comprehensive 30-question endurance arena against high-accuracy student opponents.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Win Reward:</span>
                  <span className="font-bold text-white">+300 XP • +32 Rating</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartBattle('standard_30')}
                  className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 transition active:scale-95"
                >
                  Enter Standard Battle
                </button>
              </div>
            </div>

            {/* Mode 3: Boss */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#18112c] to-[#0e1026] border border-rose-600/40 hover:border-rose-500 flex flex-col justify-between space-y-4 shadow-xl transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    Apex Boss
                  </span>
                  <span className="text-xs font-mono text-rose-400">50 Qs</span>
                </div>
                <h3 className="text-lg font-black text-white mt-3 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span>Grand Proctor Boss</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Unforgiving 50-question gauntlet against the Grand Proctor AI. Only true masters survive.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Win Reward:</span>
                  <span className="font-bold text-yellow-400">+600 XP • +50 Rating</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartBattle('boss_50')}
                  className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 transition active:scale-95"
                >
                  Challenge Boss AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE BATTLE MATCH */}
      {/* ========================================================================= */}
      {stage === 'battle' && currentQ && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Head to Head Scoreboard */}
          <div className="grid grid-cols-3 gap-2 p-4 rounded-3xl bg-[#0d1029]/95 border border-indigo-900/60 items-center text-center">
            {/* User */}
            <div className="flex items-center gap-3 justify-start pl-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block truncate">{profile.fullName}</span>
                <span className="text-[10px] text-cyan-400 font-bold">Rating: {profile.battleRating}</span>
              </div>
            </div>

            {/* Split Scoreboard */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-widest">
                <span className="text-purple-400">{userScore}</span> : <span className="text-rose-400">{opponentScore}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>{questionTimer}s</span>
              </div>
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-3 justify-end pr-2">
              <div className="text-right">
                <span className="text-xs font-bold text-white block truncate">{opponent.name}</span>
                <span className="text-[10px] text-rose-400 font-bold">Rating: {opponent.rating}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opponent.avatarUrl}
                alt={opponent.name}
                className="w-10 h-10 rounded-full border-2 border-rose-400 object-cover"
              />
            </div>
          </div>

          {/* Question Index indicator */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span className="text-purple-400">{currentQ.chapterName}</span>
          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1230]/90 border border-indigo-800/40 space-y-5 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const isCorrect = optIdx === currentQ.correctOptionIndex;
                    advanceQuestion(isCorrect);
                  }}
                  className="w-full p-4 rounded-2xl text-left border border-slate-800/80 bg-slate-950/60 hover:border-purple-500 hover:bg-purple-900/30 text-slate-200 transition flex items-center gap-3 active:scale-[0.99]"
                >
                  <div className="h-6 w-6 rounded-full border border-slate-700 flex items-center justify-center font-mono text-xs font-bold shrink-0 text-slate-400">
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MATCH RESULT BANNER */}
      {/* ========================================================================= */}
      {stage === 'result' && battleResultData && (
        <div className="space-y-6 max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-8 rounded-3xl border text-center shadow-2xl space-y-5 ${
              battleResultData.isVictory
                ? 'bg-gradient-to-b from-[#191542] via-[#0d102c] to-[#08091a] border-purple-500/50'
                : 'bg-gradient-to-b from-[#2e101b] via-[#140b12] to-[#090608] border-rose-600/50'
            }`}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-1 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#0c1026]">
                {battleResultData.isVictory ? (
                  <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
                ) : (
                  <ShieldAlert className="w-10 h-10 text-rose-400" />
                )}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">
                {battleResultData.isVictory ? 'VICTORY' : 'DEFEAT'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Final Score: <strong className="text-white">{userScore}</strong> vs <strong className="text-white">{opponentScore}</strong> ({opponent.name})
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div>
                <span className={`text-base font-black ${
                  battleResultData.ratingDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {battleResultData.ratingDelta > 0 ? `+${battleResultData.ratingDelta}` : battleResultData.ratingDelta}
                </span>
                <span className="text-[10px] text-slate-400 block font-bold">RATING</span>
              </div>
              <div>
                <span className="text-base font-black text-purple-400">+{battleResultData.xp}</span>
                <span className="text-[10px] text-slate-400 block font-bold">XP</span>
              </div>
              <div>
                <span className="text-base font-black text-yellow-400">+{battleResultData.coins}</span>
                <span className="text-[10px] text-slate-400 block font-bold">COINS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('lobby')}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30"
            >
              Return to Arena Lobby
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
