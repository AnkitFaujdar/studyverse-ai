'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Clock, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { ExamType, PreparationLevel } from '@/lib/types';
import { EXAM_OPTIONS, MOCK_SUBJECTS_BY_EXAM } from '@/lib/data/mock-db';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useStudyVerse();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State
  const [targetExam, setTargetExam] = useState<ExamType>('JEE Main');
  const [prepLevel, setPrepLevel] = useState<PreparationLevel>('Intermediate');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics', 'Chemistry', 'Mathematics']);
  const [selectedChapters, setSelectedChapters] = useState<string[]>(['Modern Physics', 'Semiconductor Electronics', 'Chemical Bonding & Molecular Structure']);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(180); // 3 hours
  const [targetExamDate, setTargetExamDate] = useState<string>('2026-12-10');

  // Subjects available for selected exam
  const availableSubjects = MOCK_SUBJECTS_BY_EXAM[targetExam] || MOCK_SUBJECTS_BY_EXAM['JEE Main'];

  const toggleSubject = (subName: string) => {
    if (selectedSubjects.includes(subName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subName]);
    }
  };

  const toggleChapter = (chapName: string) => {
    if (selectedChapters.includes(chapName)) {
      if (selectedChapters.length > 1) {
        setSelectedChapters(selectedChapters.filter((c) => c !== chapName));
      }
    } else {
      setSelectedChapters([...selectedChapters, chapName]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      completeOnboarding({
        targetExam,
        preparationLevel: prepLevel,
        dailyGoalMinutes,
        targetExamDate,
        selectedSubjects,
        selectedChapters,
      });
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/90 border border-indigo-700/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>ONBOARDING CEREMONY</span>
            </span>
            <span>STEP {step} OF {totalSteps}</span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
              initial={false}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Wizard Steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1: TARGET EXAM */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Target className="w-4 h-4" />
                  <span>OBJECTIVE DESIGNATION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  What examination are you preparing for?
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  StudyVerse AI will calibrate your syllabus chapters, question difficulty, and quests.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                {EXAM_OPTIONS.map((exam) => {
                  const isSelected = targetExam === exam.name;
                  return (
                    <button
                      key={exam.name}
                      type="button"
                      onClick={() => {
                        setTargetExam(exam.name);
                        const subjects = MOCK_SUBJECTS_BY_EXAM[exam.name] || MOCK_SUBJECTS_BY_EXAM['JEE Main'];
                        setSelectedSubjects(subjects.map((s) => s.name));
                        const chaps = subjects.flatMap((s) => s.chapters.map((c) => c.name)).slice(0, 4);
                        setSelectedChapters(chaps);
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm">{exam.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block">{exam.category}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: PREPARATION LEVEL */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>SCHOLAR TIER</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Current preparation depth:
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Helps our AI Tutor structure explanations and quiz baseline difficulty.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    level: 'Beginner' as PreparationLevel,
                    title: 'Novice Aspirant (Just Starting Out)',
                    desc: 'Focusing on building foundational concepts, core formulas, and NCERT theory.',
                  },
                  {
                    level: 'Intermediate' as PreparationLevel,
                    title: 'Active Practitioner (Midway Through)',
                    desc: 'Comfortable with standard theory, currently practicing medium numericals and PYQs.',
                  },
                  {
                    level: 'Advanced' as PreparationLevel,
                    title: 'Elite Finisher (Revision & Mock Blitz)',
                    desc: 'Full syllabus covered; striving for high speed, top percentiles, and tricky edge-cases.',
                  },
                ].map((tier) => {
                  const isSelected = prepLevel === tier.level;
                  return (
                    <button
                      key={tier.level}
                      type="button"
                      onClick={() => setPrepLevel(tier.level)}
                      className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="pr-4">
                        <div className="font-bold text-sm text-white mb-1">{tier.title}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{tier.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT SUBJECTS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>DISCIPLINES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Select your core study subjects
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  You can track daily quests and progress across each discipline.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubject(sub.name)}
                      className={`p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-900/40 border-purple-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{sub.name}</div>
                        <div className="text-xs text-slate-400">{sub.chapters.length} Key Chapters</div>
                      </div>
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-slate-600'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: SELECT CHAPTERS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Layers className="w-4 h-4" />
                  <span>CHAPTER FOCUS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Priority chapters to conquer first
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select key chapters to generate initial daily quests.
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {availableSubjects
                  .filter((s) => selectedSubjects.includes(s.name))
                  .flatMap((s) => s.chapters.map((c) => ({ ...c, subjectName: s.name })))
                  .map((chap) => {
                    const isSelected = selectedChapters.includes(chap.name);
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => toggleChapter(chap.name)}
                        className={`w-full p-3 rounded-xl text-left border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-900/30 border-purple-500/80 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="font-semibold text-xs text-white truncate">{chap.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {chap.subjectName} • Weightage: <span className="text-yellow-400">{chap.weightage}</span>
                          </div>
                        </div>
                        <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-600'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: DAILY TARGET */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>CHRONO DISCIPLINE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Target daily focus duration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  How many hours will you dedicate to deep, uninterrupted study each day?
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: '1 hour', minutes: 60 },
                  { label: '2 hours', minutes: 120 },
                  { label: '3 hours', minutes: 180 },
                  { label: '4 hours', minutes: 240 },
                  { label: '6+ hours', minutes: 360 },
                ].map((opt) => {
                  const isSelected = dailyGoalMinutes === opt.minutes;
                  return (
                    <button
                      key={opt.minutes}
                      type="button"
                      onClick={() => setDailyGoalMinutes(opt.minutes)}
                      className={`p-4 rounded-2xl text-center border transition ${
                        isSelected
                          ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Clock className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div className="font-bold text-sm">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {opt.minutes * 2} Potential XP / day
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 6: EXAM DATE */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>MOMENT OF TRUTH</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  When is your target exam date?
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  This will generate your real-time countdown clock and daily syllabus velocity pacing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                <input
                  type="date"
                  required
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-base text-white focus:outline-none focus:border-purple-500"
                />

                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-200">
                  Target Exam: <span className="font-bold text-white">{targetExam}</span> • Pacing:{' '}
                  <span className="font-bold text-cyan-400">{dailyGoalMinutes / 60} hrs/day</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-600/30 transition active:scale-95 flex items-center gap-2"
          >
            <span>{step === totalSteps ? 'Launch Command Dashboard' : 'Proceed'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
