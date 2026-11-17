'use client';

import React, { useState, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Coins, 
  Check, 
  Layers, 
  HelpCircle,
  Trophy
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { MOCK_QUIZ_QUESTIONS, MOCK_SUBJECTS_BY_EXAM } from '@/lib/data/mock-db';
import { QuizQuestion } from '@/lib/types';

export default function QuizPage() {
  const { profile, chapterProgressList, recordQuizAttempt } = useStudyVerse();

  // Mode: 'config' | 'running' | 'result'
  const [stage, setStage] = useState<'config' | 'running' | 'result'>('config');
  const [configTab, setConfigTab] = useState<'chapter' | 'completed'>('chapter');

  // Chapter-based config
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('Modern Physics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Completed chapters checklist config
  const completedChapters = chapterProgressList.filter((p) => p.status === 'completed');
  const [selectedCompletedChapters, setSelectedCompletedChapters] = useState<string[]>(
    completedChapters.map((c) => c.chapterName)
  );

  // Quiz running state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Results state
  const [resultsData, setResultsData] = useState<{
    score: number;
    total: number;
    accuracy: number;
    timeSpent: number;
    xp: number;
    coins: number;
  } | null>(null);

  // Timer while quiz is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stage === 'running') {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  // Start Quiz
  const handleStartQuiz = () => {
    let pool = [...MOCK_QUIZ_QUESTIONS];
    if (configTab === 'chapter') {
      const match = pool.filter((q) => q.chapterName === selectedChapter);
      pool = match.length > 0 ? match : pool;
    } else {
      if (selectedCompletedChapters.length > 0) {
        const match = pool.filter((q) => q.chapterName && selectedCompletedChapters.includes(q.chapterName));
        pool = match.length > 0 ? match : pool;
      }
    }

    // Duplicate pool if count exceeds
    let selected = pool.slice(0, questionCount);
    if (selected.length < questionCount) {
      selected = pool;
    }

    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsElapsed(0);
    setStage('running');
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const total = activeQuestions.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const xpAwarded = correctCount * 20 + Math.floor(accuracy / 2);
    const coinsAwarded = correctCount * 5;

    setResultsData({
      score: correctCount,
      total,
      accuracy,
      timeSpent: secondsElapsed,
      xp: xpAwarded,
      coins: coinsAwarded,
    });

    recordQuizAttempt({
      quizTitle: `${selectedSubject} - ${configTab === 'chapter' ? selectedChapter : 'Completed Chapters Composite'}`,
      score: correctCount,
      totalQuestions: total,
      accuracyPercentage: accuracy,
      timeSpentSeconds: secondsElapsed,
      xpAwarded,
      coinsAwarded,
    });

    setStage('result');
  };

  const currentQ = activeQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. CONFIGURATION STAGE */}
      {/* ========================================================================= */}
      {stage === 'config' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>KNOWLEDGE VALIDATION ARENA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Quiz Arena</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Test your conceptual clarity, verify memory retention, and earn high XP payouts.
            </p>
          </div>

          {/* Config Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl glass-panel max-w-md">
            <button
              onClick={() => setConfigTab('chapter')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition text-center ${
                configTab === 'chapter'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chapter Trial
            </button>
            <button
              onClick={() => setConfigTab('completed')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition text-center ${
                configTab === 'completed'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mastery Blitz
            </button>
          </div>

          {/* CHAPTER SPECIFIC QUIZ */}
          {configTab === 'chapter' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel hud-corner space-y-6 max-w-3xl">
              <h2 className="text-base font-bold text-white">Configure Chapter Challenge</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Modern Physics">Modern Physics</option>
                    <option value="Semiconductor Electronics">Semiconductor Electronics</option>
                    <option value="Chemical Bonding & Molecular Structure">Chemical Bonding</option>
                    <option value="Differential Calculus & Limits">Differential Calculus</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          difficulty === diff
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Question Count</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          questionCount === count
                            ? 'bg-cyan-600 border-cyan-400 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {count} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/30 transition flex items-center gap-2"
                >
                  <span>Launch Chapter Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CREATE QUIZ FROM COMPLETED CHAPTERS */}
          {configTab === 'completed' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 space-y-6 max-w-3xl">
              <div>
                <h2 className="text-base font-bold text-white">Create Quiz From Completed Chapters</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Combine mastered syllabus topics into a rigorous multi-chapter composite challenge.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Available Completed Chapters ({completedChapters.length})
                </span>

                {completedChapters.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
                    No chapters currently marked as &ldquo;Completed&rdquo;. Visit Exam Preparation to update your status!
                  </div>
                ) : (
                  completedChapters.map((chap) => {
                    const isChecked = selectedCompletedChapters.includes(chap.chapterName);
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedCompletedChapters(selectedCompletedChapters.filter((c) => c !== chap.chapterName));
                          } else {
                            setSelectedCompletedChapters([...selectedCompletedChapters, chap.chapterName]);
                          }
                        }}
                        className={`w-full p-3.5 rounded-2xl text-left border transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-purple-950/40 border-purple-500 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-600'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">{chap.chapterName}</span>
                            <span className="text-[10px] text-slate-400">{chap.subjectName}</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold">100% Completed</span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  disabled={selectedCompletedChapters.length === 0}
                  onClick={handleStartQuiz}
                  className="px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 transition flex items-center gap-2"
                >
                  <span>Generate Composite Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUIZ RUNNING STAGE */}
      {/* ========================================================================= */}
      {stage === 'running' && currentQ && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Bar: Progress, Timer, Status */}
          <div className="p-4 rounded-2xl bg-[#0d1029]/90 border border-indigo-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-400">
                {answeredCount} Answered
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {Math.floor(secondsElapsed / 60)}:
                  {String(secondsElapsed % 60).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'bg-amber-950/80 border-amber-500 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Review</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1230]/90 border border-indigo-800/40 space-y-6 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-bold">
                {currentQ.subjectName} • {currentQ.chapterName}
              </span>
              <span className="text-slate-400 font-medium">{currentQ.difficulty}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-purple-900/50 border-purple-500 text-white shadow-lg shadow-purple-950/60'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-cyan-400 border-cyan-300 text-black' : 'border-slate-600 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Palette / Number Jumpers */}
          <div className="p-4 rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Question Navigator
            </span>
            <div className="flex flex-wrap gap-2">
              {activeQuestions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                const isFlagged = flaggedQuestions[idx];

                return (
                  <button
                    key={`palette-${idx}`}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                      isCurrent ? 'border-cyan-400 text-white shadow-md' :
                      isFlagged ? 'bg-amber-950 border-amber-600 text-yellow-300' :
                      isAnswered ? 'bg-purple-900/80 border-purple-500 text-white' :
                      'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-black text-white shadow-lg shadow-emerald-900/40 transition flex items-center gap-2"
              >
                <span>Submit & Calculate XP</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RESULTS & REVIEW STAGE */}
      {/* ========================================================================= */}
      {stage === 'result' && resultsData && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Result Hero Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#191542] via-[#0d102c] to-[#08091a] border border-purple-500/40 text-center shadow-2xl space-y-5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-1 shadow-lg shadow-purple-600/40">
              <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#0c1026]">
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                EVALUATION CONCLUDED
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {resultsData.accuracy >= 80 ? 'Mastery Unlocked!' : 'Study Sprint Complete!'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Completed in {Math.floor(resultsData.timeSpent / 60)}m {resultsData.timeSpent % 60}s
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-black text-white">{resultsData.score}/{resultsData.total}</span>
                <span className="text-[10px] text-slate-400 block font-bold">SCORE</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-black text-cyan-400">{resultsData.accuracy}%</span>
                <span className="text-[10px] text-slate-400 block font-bold">ACCURACY</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-black text-purple-400">+{resultsData.xp}</span>
                <span className="text-[10px] text-slate-400 block font-bold">XP AWARDED</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-black text-yellow-400">+{resultsData.coins}</span>
                <span className="text-[10px] text-slate-400 block font-bold">COINS</span>
              </div>
            </div>

            <div className="pt-3 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setStage('config')}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Quiz</span>
              </button>
            </div>
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Solution Review & Explanations</h3>

            {activeQuestions.map((q, qIndex) => {
              const userAns = userAnswers[qIndex];
              const isCorrect = userAns === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-[#0d1029]/80 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-white">
                      Q{qIndex + 1}. {q.questionText}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400 shrink-0">
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pl-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userAns === optIdx;
                      const isTargetCorrect = q.correctOptionIndex === optIdx;

                      return (
                        <div
                          key={opt}
                          className={`p-2 rounded-xl flex items-center gap-2 ${
                            isTargetCorrect
                              ? 'bg-emerald-950/50 border border-emerald-700/60 text-emerald-200'
                              : isUserChoice
                              ? 'bg-rose-950/50 border border-rose-700/60 text-rose-200'
                              : 'text-slate-400'
                          }`}
                        >
                          <span className="font-mono font-bold">[{String.fromCharCode(65 + optIdx)}]</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-400 block mb-1">Explanation:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
