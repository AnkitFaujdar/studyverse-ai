'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  X, 
  LogOut,
  Trophy
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';

export default function GuildsPage() {
  const { guilds, userGuild, createGuild, joinGuild, leaveGuild } = useStudyVerse();

  const [searchQuery, setSearchQuery] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State for Create Guild
  const [guildName, setGuildName] = useState('');
  const [guildDesc, setGuildDesc] = useState('');
  const [guildExam, setGuildExam] = useState('JEE Main');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    joinGuild(inviteCodeInput.trim());
    setInviteCodeInput('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildName.trim()) return;
    createGuild(guildName, guildDesc, guildExam);
    setGuildName('');
    setGuildDesc('');
    setIsCreateOpen(false);
  };

  const filteredGuilds = guilds.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.targetExam.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>COLLECTIVE ALLIANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Study Guilds</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Band together with fellow scholars, compare weekly study XP, and conquer exams as an alliance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Found New Guild</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ACTIVE GUILD DASHBOARD */}
      {/* ========================================================================= */}
      {userGuild ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1029]/90 border border-indigo-900/50 space-y-6 shadow-2xl">
          {/* Guild Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  {userGuild.targetExam}
                </span>
                <span className="text-xs text-slate-400">Guild Level {userGuild.level}</span>
              </div>
              <h2 className="text-2xl font-black text-white">{userGuild.name}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {userGuild.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Invite Code Box */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Code:</span>
                <span className="font-mono font-bold text-cyan-400">{userGuild.inviteCode}</span>
                <button
                  onClick={() => handleCopyCode(userGuild.inviteCode)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy Invite Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={leaveGuild}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700/60 text-slate-400 hover:text-rose-300 transition text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>

          {/* Member Roster */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Guild Roster ({userGuild.members.length} Members)
            </h3>

            <div className="grid gap-2">
              {userGuild.members.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-500 w-4">#{idx + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="w-9 h-9 rounded-full border border-purple-500/50 object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{m.name}</span>
                        {m.role === 'leader' && (
                          <span className="text-[10px] px-2 py-0.2 rounded bg-amber-950 text-yellow-400 font-bold border border-amber-800">
                            Leader
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Level {m.level} Scholar</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <span className="flex items-center gap-1 text-orange-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      {m.streak}d
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-cyan-400 block">+{m.weeklyXp} XP</span>
                      <span className="text-[10px] text-slate-500">This Week</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-[#0d1029]/60 border border-slate-800 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h2 className="text-lg font-bold text-white">You are not in a guild yet</h2>
            <p className="text-xs text-slate-400 mt-1">
              Join an active guild below or input a private invite code to team up with friends.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIRECTORY & SEARCH */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">Discover Public Guilds</h3>

          {/* Quick Join By Code */}
          <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
            <input
              type="text"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value)}
              placeholder="Enter Invite Code..."
              className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition"
            >
              Join
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guilds by title or exam..."
            className="w-full rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Guilds Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuilds.map((g) => {
            const isMember = userGuild?.id === g.id;
            return (
              <div
                key={g.id}
                className="p-5 rounded-3xl bg-[#0e122e]/80 border border-indigo-900/40 hover:border-purple-500/50 flex flex-col justify-between space-y-4 transition"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      {g.targetExam}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {g.membersCount} Members
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-3">{g.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                    {g.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">{g.totalXp.toLocaleString()} Total XP</span>
                  {isMember ? (
                    <span className="text-xs font-bold text-emerald-400">Current Guild</span>
                  ) : (
                    <button
                      onClick={() => joinGuild(g.id)}
                      className="px-4 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 transition"
                    >
                      Join Guild
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CREATE GUILD MODAL */}
      {/* ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Found a Study Guild</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Guild Name</label>
                <input
                  type="text"
                  required
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  placeholder="e.g. Quantum Scholars Guild"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Creed</label>
                <textarea
                  rows={2}
                  value={guildDesc}
                  onChange={(e) => setGuildDesc(e.target.value)}
                  placeholder="Daily goals, mutual accountability standards..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Exam</label>
                <select
                  value={guildExam}
                  onChange={(e) => setGuildExam(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="UPSC">UPSC</option>
                  <option value="GATE">GATE</option>
                  <option value="CAT">CAT</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30"
                >
                  Establish Guild
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
