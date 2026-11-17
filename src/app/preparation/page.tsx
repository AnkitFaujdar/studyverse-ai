'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Check, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { MOCK_SUBJECTS_BY_EXAM, EXAM_OPTIONS } from '@/lib/data/mock-db';
import { ExamType } from '@/lib/types';

export default function PreparationPage() {
  const { profile, updateProfile, chapterProgressList, updateChapterStatus } = useStudyVerse();

  const [activeExam, setActiveExam] = useState<ExamType>(profile.targetExam);
  const subjects = MOCK_SUBJECTS_BY_EXAM[activeExam] || MOCK_SUBJECTS_BY_EXAM['JEE Main'];

  // Status mapping
  const statusLabels: Record<string, { label: string; color: string }> = {
    not_started: { label: 'Not Started', color: 'bg-slate-800 text-slate-400' },
    learning: { label: 'Learning', color: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60' },
    practicing: { label: 'Practicing', color: 'bg-purple-950/80 text-purple-300 border border-purple-800/60' },
    completed: { label: 'Completed', color: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' },
  };

  // Calculate subject progress %
  const getSubjectProgress = (subjectId: string, chaptersCount: number) => {
    const subjectProgresses = chapterProgressList.filter((p) => p.subjectId === subjectId);
    if (!subjectProgresses.length) return 0;
    const completed = subjectProgresses.filter((p) => p.status === 'completed').length;
    const practicing = subjectProgresses.filter((p) => p.status === 'practicing').length;
    const learning = subjectProgresses.filter((p) => p.status === 'learning').length;
    const totalScore = completed * 100 + practicing * 60 + learning * 30;
    return Math.min(100, Math.round(totalScore / (chaptersCount * 100) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>SYLLABUS BLUEPRINT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Exam Preparation Matrix</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track syllabus chapters across your target exam from initial theory to 100% mastery.
          </p>
        </div>

        {/* Exam Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40">
          <span className="text-xs text-slate-400 pl-2 font-medium">Exam:</span>
          <select
            value={activeExam}
            onChange={(e) => {
              const exam = e.target.value as ExamType;
              setActiveExam(exam);
              updateProfile({ targetExam: exam });
            }}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-purple-500"
          >
            {EXAM_OPTIONS.map((opt) => (
              <option key={opt.name} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Pillars & Chapter Progress */}
      <div className="space-y-6">
        {subjects.map((subject) => {
          const progressPercent = getSubjectProgress(subject.id, subject.chapters.length);

          return (
            <div
              key={subject.id}
              className="p-6 rounded-3xl glass-panel hud-corner space-y-5"
            >
              {/* Subject Title & Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-2xl border flex items-center justify-center text-white"
                    style={{ backgroundColor: `${subject.color}20`, borderColor: `${subject.color}60` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{subject.name}</h2>
                    <span className="text-xs text-slate-400">
                      {subject.chapters.length} Key Chapters • Code: {subject.code}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-64 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Mastery</span>
                    <span style={{ color: subject.color }}>{progressPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-3">
                {subject.chapters.map((chapter) => {
                  const currentProg = chapterProgressList.find((p) => p.chapterId === chapter.id);
                  const status = currentProg?.status || 'not_started';
                  const currentStatusConfig = statusLabels[status];

                  return (
                    <div
                      key={chapter.id}
                      className="p-4 rounded-2xl cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{chapter.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded font-extrabold uppercase bg-yellow-950/70 text-yellow-300 border border-yellow-800/50">
                            Weightage: {chapter.weightage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                          {chapter.summary}
                        </p>
                      </div>

                      {/* Status Selector & Quick Quiz Button */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <select
                          value={status}
                          onChange={(e) =>
                            updateChapterStatus(chapter.id, e.target.value as 'not_started' | 'learning' | 'practicing' | 'completed')
                          }
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold border focus:outline-none ${currentStatusConfig.color}`}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="learning">Learning</option>
                          <option value="practicing">Practicing</option>
                          <option value="completed">Completed (+100 XP)</option>
                        </select>

                        <Link
                          href={`/quiz?chapter=${encodeURIComponent(chapter.name)}&subject=${encodeURIComponent(subject.name)}`}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 transition flex items-center gap-1.5"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Quiz</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
