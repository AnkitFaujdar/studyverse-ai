'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Camera, 
  Image as ImageIcon, 
  Paperclip, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  FileText, 
  Layers, 
  BrainCircuit, 
  X, 
  AlertTriangle,
  CheckCircle2,
  User
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { AiChatMessage } from '@/lib/types';

const ACTION_CHIPS = [
  { id: 'explain', label: '⚡ Explain Concept', icon: Lightbulb },
  { id: 'solve', label: '📝 Solve Step-by-Step', icon: Sparkles },
  { id: 'hint', label: '💡 Give Me a Hint', icon: HelpCircle },
  { id: 'summarize', label: '📋 Summarize Chapter', icon: FileText },
  { id: 'notes', label: '📑 Revision Notes', icon: Layers },
  { id: 'quiz', label: '❓ Quick Practice Qs', icon: BrainCircuit },
  { id: 'flashcards', label: '🃏 Flashcard Drill', icon: Layers },
];

export default function AiTutorPage() {
  const { profile } = useStudyVerse();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      content: `Greetings, Scholar ${profile.fullName}! I am StudyVerse AI, calibrated for your target exam: **${profile.targetExam}**.\n\nYou can ask me to break down difficult physics problems, explain chemical mechanisms, or generate step-by-step calculus proofs. You can also upload textbook photos or problem screenshots!`,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('solve');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setAttachedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputPrompt.trim() && !selectedImage) return;

    const userMessage: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: inputPrompt.trim() || 'Please analyze this attached problem image.',
      actionType: selectedAction as any,
      imageUrl: selectedImage || undefined,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setAttachedFileName(null);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage.content,
          actionType: selectedAction,
          imageUrl: currentImage,
          targetExam: profile.targetExam,
          subject: 'General Prep',
        }),
      });

      const data = await res.json();
      if (!data.configured && data.notice) {
        setConfigNotice(data.notice);
      }

      const aiReply: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: data.reply || 'Analysis complete.',
        actionType: selectedAction as any,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          content: 'Unable to contact AI tutor service. Please check your network or API keys.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-0.5">
            <Bot className="w-4 h-4" />
            <span>NEURAL SCHOLAR ASSISTANT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">StudyVerse AI Tutor</h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Target Context:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
            {profile.targetExam}
          </span>
        </div>
      </div>

      {/* Configuration notice banner if unconfigured */}
      {configNotice && (
        <div className="p-3 rounded-2xl bg-amber-950/70 border border-amber-600/60 text-yellow-200 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>{configNotice}</span>
          </div>
          <button
            onClick={() => setConfigNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {ACTION_CHIPS.map((chip) => {
          const isSelected = selectedAction === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedAction(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-3xl bg-[#0b0e27]/80 border border-indigo-900/40 p-4 sm:p-6 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                isUser ? 'bg-purple-600 border-purple-400 text-white' : 'bg-cyan-950 border-cyan-500 text-cyan-300'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-sm space-y-2 leading-relaxed ${
                  isUser
                    ? 'bg-purple-950/60 border border-purple-700/50 text-white'
                    : 'bg-[#101435] border border-indigo-800/40 text-slate-200'
                }`}
              >
                {/* Image attachment in chat bubble if present */}
                {msg.imageUrl && (
                  <div className="mb-2 max-w-sm rounded-xl overflow-hidden border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.imageUrl} alt="Attached Problem" className="w-full object-contain max-h-60" />
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className={`text-[10px] pt-1 font-mono ${isUser ? 'text-purple-300' : 'text-slate-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-3xl bg-[#101435] border border-indigo-800/40 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Analyzing problem parameters and calculating solution...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image/File Preview Pill */}
      {selectedImage && (
        <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-purple-950/60 border border-purple-800/50 text-xs text-purple-200 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Attached: {attachedFileName || 'Image Question'}</span>
          </div>
          <button
            onClick={() => {
              setSelectedImage(null);
              setAttachedFileName(null);
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 rounded-2xl bg-[#0d1029]/90 border border-indigo-900/50 flex items-center gap-2 shrink-0">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,application/pdf"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Input Method Buttons */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach Image"
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Take Camera Photo"
          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 rounded-xl transition"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach File / Document"
          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800/60 rounded-xl transition"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask AI tutor about ${profile.targetExam}...`}
          className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!inputPrompt.trim() && !selectedImage) || isSending}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-30 text-white shadow-md shadow-purple-900/30 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
