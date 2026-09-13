'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Coins, 
  X, 
  Check, 
  Filter,
  Layers
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { Quest, QuestDifficulty } from '@/lib/types';

export default function QuestsPage() {
  const { quests, addQuest, updateQuest, deleteQuest, completeQuest, profile } = useStudyVerse();

  // Filters
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [reschedulingQuest, setReschedulingQuest] = useState<Quest | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');

  // Celebration state
  const [rewardCelebration, setRewardCelebration] = useState<{ questTitle: string; xp: number; coins: number } | null>(null);

  // Form State for Create
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Modern Physics');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [duration, setDuration] = useState(45);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const difficultyRewards: Record<QuestDifficulty, { xp: number; coins: number }> = {
    Easy: { xp: 30, coins: 5 },
    Medium: { xp: 50, coins: 10 },
    Hard: { xp: 80, coins: 15 },
    Epic: { xp: 120, coins: 25 },
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const rewards = difficultyRewards[difficulty];
    addQuest({
      title,
      subject,
      chapter,
      description,
      difficulty,
      estimatedDurationMinutes: duration,
      dueDate,
      xpReward: rewards.xp,
      coinsReward: rewards.coins,
    });

    setTitle('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const handleUpdateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuest) return;

    const rewards = difficultyRewards[editingQuest.difficulty];
    updateQuest(editingQuest.id, {
      ...editingQuest,
      xpReward: rewards.xp,
      coinsReward: rewards.coins,
    });

    setEditingQuest(null);
  };

  const handleComplete = (quest: Quest) => {
    const reward = completeQuest(quest.id);
    if (reward) {
      setRewardCelebration({
        questTitle: quest.title,
        xp: reward.xp,
        coins: reward.coins,
      });
    }
  };

  const handleReschedule = () => {
    if (!reschedulingQuest || !rescheduleDate) return;
    updateQuest(reschedulingQuest.id, {
      dueDate: rescheduleDate,
      status: 'rescheduled',
    });
    setReschedulingQuest(null);
  };

  // Filtered quests
  const filteredQuests = quests.filter((q) => {
    if (filterTab === 'pending' && q.status === 'completed') return false;
    if (filterTab === 'completed' && q.status !== 'completed') return false;
    if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
    return true;
  });

  const subjectsList = Array.from(new Set(quests.map((q) => q.subject)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4" />
            <span>DAILY EXPEDITIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Daily Study Quests</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Conquer syllabus objectives to earn XP, virtual coins, and advance your rank.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Forge New Quest</span>
        </button>
      </div>

      {/* Filter Tabs & Subject Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                filterTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid gap-3">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[#0d1029]/50 border border-slate-800/80 space-y-3">
            <Swords className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No quests found in this category.</p>
            <p className="text-xs text-slate-500">Click &ldquo;Forge New Quest&rdquo; to create your first objective!</p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const isCompleted = quest.status === 'completed';

            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border transition relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    : 'bg-[#0e122e]/80 border-indigo-900/40 hover:border-purple-500/50 shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <button
                    type="button"
                    disabled={isCompleted}
                    onClick={() => handleComplete(quest)}
                    className={`mt-1 h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 transition ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'border-slate-600 hover:border-purple-400 hover:bg-purple-600/20 text-transparent hover:text-purple-400'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-base font-bold truncate ${
                          isCompleted ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {quest.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                        quest.difficulty === 'Easy' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/50' :
                        quest.difficulty === 'Medium' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-800/50' :
                        quest.difficulty === 'Hard' ? 'bg-amber-950/90 text-amber-300 border border-amber-800/50' :
                        'bg-purple-950/90 text-purple-300 border border-purple-800/50'
                      }`}>
                        {quest.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {quest.description || 'No detailed instructions provided.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="font-semibold text-purple-400">{quest.subject}</span>
                      <span>•</span>
                      <span>{quest.chapter}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {quest.estimatedDurationMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Due: {quest.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Rewards & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-sm font-black text-purple-400 block">+{quest.xpReward} XP</span>
                    <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 md:justify-end">
                      <Coins className="w-3 h-3" />
                      +{quest.coinsReward} Coins
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!isCompleted && (
                      <>
                        <button
                          onClick={() => {
                            setReschedulingQuest(quest);
                            setRescheduleDate(quest.dueDate);
                          }}
                          title="Reschedule Due Date"
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingQuest(quest)}
                          title="Edit Quest"
                          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deleteQuest(quest.id)}
                      title="Delete Quest"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* ⚔️ QUEST COMPLETED CELEBRATION MODAL */}
      {/* ========================================================================= */}
      {rewardCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#18163f] via-[#0d102c] to-[#070919] border border-purple-500/40 p-6 text-center shadow-2xl space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c1026]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                ⚔️ QUEST COMPLETED!
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {rewardCelebration.questTitle}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-center">
                <span className="text-lg font-black text-purple-400">+{rewardCelebration.xp} XP</span>
                <span className="text-[10px] text-slate-400 block">Ascension</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <span className="text-lg font-black text-yellow-400">+{rewardCelebration.coins} Coins</span>
                <span className="text-[10px] text-slate-400 block">Bounty</span>
              </div>
            </div>

            <button
              onClick={() => setRewardCelebration(null)}
              className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30"
            >
              Continue Grinding
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE QUEST MODAL */}
      {/* ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Forge New Study Quest</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Physics PYQ Blitz"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
                  <input
                    type="text"
                    required
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Semiconductor"
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Goals</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Formulas to revise, specific exercises to solve..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Easy">Easy (+30 XP)</option>
                    <option value="Medium">Medium (+50 XP)</option>
                    <option value="Hard">Hard (+80 XP)</option>
                    <option value="Epic">Epic (+120 XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min={10}
                    max={360}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  Forge Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT QUEST MODAL */}
      {/* ========================================================================= */}
      {editingQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Quest Objective</h3>
              <button
                onClick={() => setEditingQuest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuest} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  value={editingQuest.title}
                  onChange={(e) => setEditingQuest({ ...editingQuest, title: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingQuest.description}
                  onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={editingQuest.difficulty}
                    onChange={(e) => setEditingQuest({ ...editingQuest, difficulty: e.target.value as QuestDifficulty })}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={editingQuest.estimatedDurationMinutes}
                    onChange={(e) => setEditingQuest({ ...editingQuest, estimatedDurationMinutes: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingQuest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULE MODAL */}
      {/* ========================================================================= */}
      {reschedulingQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reschedule Quest</h3>
            <p className="text-xs text-slate-400 mb-4">{reschedulingQuest.title}</p>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReschedulingQuest(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
