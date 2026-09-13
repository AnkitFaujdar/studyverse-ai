'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Flag, 
  X, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

interface PlannerEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'task' | 'session' | 'quiz' | 'exam';
  details?: string;
}

export default function PlannerPage() {
  const { quests, profile } = useStudyVerse();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'task' | 'session' | 'quiz' | 'exam'>('task');
  const [newDetails, setNewDetails] = useState('');

  // Sample planned events
  const [events, setEvents] = useState<PlannerEvent[]>([
    { id: 'ev-1', date: new Date().toISOString().split('T')[0], title: 'Physics Revision & Practice', type: 'task' },
    { id: 'ev-2', date: new Date().toISOString().split('T')[0], title: '2h Deep Focus Sprint', type: 'session' },
    { id: 'ev-3', date: '2026-09-18', title: 'Modern Physics Chapter Quiz', type: 'quiz' },
    { id: 'ev-4', date: profile.targetExamDate || '2026-12-10', title: `${profile.targetExam} Official Exam`, type: 'exam' },
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: PlannerEvent = {
      id: `ev-${Date.now()}`,
      date: selectedDateStr,
      title: newTitle,
      type: newType,
      details: newDetails,
    };
    setEvents([...events, newEv]);
    setNewTitle('');
    setNewDetails('');
    setIsAddModalOpen(false);
  };

  const selectedDateEvents = events.filter((e) => e.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>SYLLABUS CHRONOLOGY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Monthly Planner</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Schedule quests, deep work blocks, quizzes, and track crucial target exam milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Entry</span>
        </button>
      </div>

      {/* Main Calendar + Day Inspector Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 space-y-4">
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-black text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 py-1 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days tiles */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank tiles before 1st of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-950/20 border border-transparent" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => e.date === dateStr);
              const isSelected = selectedDateStr === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/50 border-purple-500 shadow-md shadow-purple-900/40'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-slate-400'}`}>
                    {dayNum}
                  </span>

                  {/* Badges/Dots for events */}
                  <div className="space-y-1 w-full overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] truncate px-1.5 py-0.5 rounded font-semibold ${
                          ev.type === 'task' ? 'bg-purple-950/90 text-purple-300 border border-purple-800/50' :
                          ev.type === 'session' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-800/50' :
                          ev.type === 'quiz' ? 'bg-amber-950/90 text-amber-300 border border-amber-800/50' :
                          'bg-rose-950/90 text-rose-300 border border-rose-800/50'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-bold block">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector (1 Col) */}
        <div className="p-6 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/40 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                DATE INSPECTOR
              </span>
              <span className="text-xs font-bold text-white">{selectedDateStr}</span>
            </div>

            <div className="mt-4 space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-medium">No events scheduled for this date.</p>
                </div>
              ) : (
                selectedDateEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                        ev.type === 'task' ? 'bg-purple-950 text-purple-300' :
                        ev.type === 'session' ? 'bg-cyan-950 text-cyan-300' :
                        ev.type === 'quiz' ? 'bg-yellow-950 text-yellow-300' :
                        'bg-rose-950 text-rose-300'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                    {ev.details && (
                      <p className="text-[11px] text-slate-400">{ev.details}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event to This Day</span>
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Schedule Calendar Entry</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics Formula Drill"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PlannerEvent['type'])}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    <option value="task">Study Task</option>
                    <option value="session">Focus Session</option>
                    <option value="quiz">Chapter Quiz</option>
                    <option value="exam">Official Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDateStr}
                    onChange={(e) => setSelectedDateStr(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Details</label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Additional reminders..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
