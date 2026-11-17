'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  UserProfile, 
  Quest, 
  FocusSession, 
  ChapterProgress, 
  QuizAttempt, 
  BattleResult, 
  Guild, 
  CartItem, 
  Order, 
  ProductItem, 
  RewardItem, 
  AchievementItem,
  ExamType,
  PreparationLevel
} from '../types';
import { 
  INITIAL_DEFAULT_QUESTS, 
  MOCK_GUILDS, 
  MOCK_ACHIEVEMENTS, 
  MOCK_REWARDS, 
  MOCK_SUBJECTS_BY_EXAM 
} from '../data/mock-db';
import { getLevelProgress, checkLevelUp, LevelConfig } from '../gamification/levels';
import { playLevelUpSound, playQuestCompleteSound } from '../gamification/sound';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export interface LevelUpEvent {
  oldLevel: LevelConfig;
  newLevel: LevelConfig;
  rewardCoins: number;
}

interface StudyVerseContextType {
  // Auth & Profile
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (onboardingData: {
    targetExam: ExamType;
    preparationLevel: PreparationLevel;
    dailyGoalMinutes: number;
    targetExamDate: string;
    selectedSubjects: string[];
    selectedChapters: string[];
  }) => void;

  // Quests
  quests: Quest[];
  addQuest: (questData: Omit<Quest, 'id' | 'userId' | 'createdAt' | 'status'>) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string) => { xp: number; coins: number } | null;

  // Focus Timer
  focusSessions: FocusSession[];
  todayFocusMinutes: number;
  recordFocusSession: (session: {
    durationMinutes: number;
    subject: string;
    chapter: string;
    questId?: string;
    interruptionsCount: number;
  }) => { xp: number; coins: number };

  // Preparation & Chapters
  chapterProgressList: ChapterProgress[];
  updateChapterStatus: (chapterId: string, status: 'not_started' | 'learning' | 'practicing' | 'completed') => void;

  // Quiz
  quizAttempts: QuizAttempt[];
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => void;

  // Battleground
  battleHistory: BattleResult[];
  recordBattleResult: (result: Omit<BattleResult, 'id' | 'completedAt'>) => void;

  // Guilds
  guilds: Guild[];
  userGuild: Guild | null;
  createGuild: (name: string, description: string, targetExam: string) => Guild;
  joinGuild: (inviteCodeOrId: string) => boolean;
  leaveGuild: () => void;

  // Study Shop
  cart: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (shippingAddress: { fullName: string; street: string; city: string; zipCode: string; phone: string }) => Order;

  // Reward Shop
  rewardItems: RewardItem[];
  purchasedRewardIds: string[];
  purchaseReward: (item: RewardItem) => boolean;
  equipReward: (itemId: string, category: string) => void;

  // Achievements
  achievements: AchievementItem[];

  // Celebrations & Modals
  levelUpEvent: LevelUpEvent | null;
  closeLevelUpModal: () => void;
  latestToast: { message: string; type?: 'success' | 'xp' | 'coin' | 'warning' } | null;
  clearToast: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-scholar-1',
  fullName: 'ANKIT FAUJDAR',
  email: 'ankitfaujdar2008@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  targetExam: 'JEE Main',
  preparationLevel: 'Intermediate',
  dailyGoalMinutes: 180, // 3 hours
  targetExamDate: '2026-12-10',
  currentLevel: 6,
  currentXp: 1050,
  coins: 480,
  battleRating: 1150,
  currentStreak: 17,
  longestStreak: 21,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studyHoursTotal: 42.5,
  completedChaptersCount: 4,
  equippedTheme: 'theme_cyber_purple',
  equippedBadge: 'badge_dragon_slayer',
  isOnboarded: true,
};

const StudyVerseContext = createContext<StudyVerseContextType | null>(null);

export const StudyVerseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_DEFAULT_QUESTS);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState<number>(135); // 2h 15m default
  const [chapterProgressList, setChapterProgressList] = useState<ChapterProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [battleHistory, setBattleHistory] = useState<BattleResult[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>(MOCK_GUILDS);
  const [userGuildId, setUserGuildId] = useState<string>('guild-1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARDS);
  const [purchasedRewardIds, setPurchasedRewardIds] = useState<string[]>([
    'theme_cyber_purple',
    'badge_dragon_slayer',
  ]);
  const [achievements, setAchievements] = useState<AchievementItem[]>(MOCK_ACHIEVEMENTS);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [latestToast, setLatestToast] = useState<{ message: string; type?: 'success' | 'xp' | 'coin' | 'warning' } | null>(null);

  // Initialize chapter progress based on exam subjects
  useEffect(() => {
    const subjects = MOCK_SUBJECTS_BY_EXAM[profile.targetExam] || MOCK_SUBJECTS_BY_EXAM['JEE Main'];
    const initialList: ChapterProgress[] = [];
    subjects.forEach((sub) => {
      sub.chapters.forEach((ch, idx) => {
        const isComp = idx === 0;
        const isLearn = idx === 1;
        initialList.push({
          id: `prog-${ch.id}`,
          chapterId: ch.id,
          chapterName: ch.name,
          subjectId: sub.id,
          subjectName: sub.name,
          status: isComp ? 'completed' : isLearn ? 'learning' : 'not_started',
          progressPercentage: isComp ? 100 : isLearn ? 45 : 0,
          revisionCount: isComp ? 2 : 0,
          lastStudiedAt: isComp ? '2 days ago' : undefined,
        });
      });
    });
    setChapterProgressList(initialList);
  }, [profile.targetExam]);

  // Load from local storage for persistence across reloads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProfile = localStorage.getItem('studyverse_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.fullName === 'Ankit Sharma' || !parsed.fullName) {
            parsed.fullName = 'ANKIT FAUJDAR';
          }
          setProfile(parsed);
        }
        const savedQuests = localStorage.getItem('studyverse_quests');
        if (savedQuests) setQuests(JSON.parse(savedQuests));
        const savedCart = localStorage.getItem('studyverse_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        const savedOrders = localStorage.getItem('studyverse_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        const savedPurchased = localStorage.getItem('studyverse_purchased_rewards');
        if (savedPurchased) setPurchasedRewardIds(JSON.parse(savedPurchased));
      } catch (e) {
        console.error('Failed reading localStorage', e);
      }
    }
  }, []);

  // Save profile to local storage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studyverse_profile', JSON.stringify(profile));
    }
  }, [profile]);

  // Check XP change for Level Up
  const awardXpAndCoins = useCallback((xp: number, coins: number, reason: string) => {
    setProfile((prev) => {
      const oldXp = prev.currentXp;
      const newXp = oldXp + xp;
      const newCoins = prev.coins + coins;
      
      const levelUp = checkLevelUp(oldXp, newXp);
      if (levelUp && levelUp.didLevelUp) {
        setLevelUpEvent({
          oldLevel: levelUp.oldLevel,
          newLevel: levelUp.newLevel,
          rewardCoins: levelUp.rewardCoins,
        });
        playLevelUpSound();
      }

      const updatedProgress = getLevelProgress(newXp);

      return {
        ...prev,
        currentXp: newXp,
        coins: newCoins + (levelUp ? levelUp.rewardCoins : 0),
        currentLevel: updatedProgress.currentLevel.level,
      };
    });

    setLatestToast({
      message: `+${xp} XP & +${coins} Coins earned! (${reason})`,
      type: 'xp',
    });
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        if (data.user) {
          const user = data.user;
          setProfile((prev) => ({
            ...prev,
            id: user.id,
            email: user.email || email,
          }));
        }
      } else {
        // Local simulation
        setProfile((prev) => ({ ...prev, email }));
      }
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setLatestToast({ message: errorMsg, type: 'warning' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.user) {
          const user = data.user;
          setProfile((prev) => ({
            ...prev,
            id: user.id,
            fullName: name,
            email,
            isOnboarded: false,
          }));
        }
      } else {
        setProfile((prev) => ({
          ...prev,
          fullName: name,
          email,
          isOnboarded: false,
        }));
      }
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      setLatestToast({ message: errorMsg, type: 'warning' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (onboardingData: {
    targetExam: ExamType;
    preparationLevel: PreparationLevel;
    dailyGoalMinutes: number;
    targetExamDate: string;
    selectedSubjects: string[];
    selectedChapters: string[];
  }) => {
    setProfile((prev) => ({
      ...prev,
      targetExam: onboardingData.targetExam,
      preparationLevel: onboardingData.preparationLevel,
      dailyGoalMinutes: onboardingData.dailyGoalMinutes,
      targetExamDate: onboardingData.targetExamDate,
      isOnboarded: true,
    }));
    setLatestToast({ message: '✨ Study Plan initialized! Welcome to StudyVerse AI.', type: 'success' });
  };

  // Quests CRUD
  const addQuest = (questData: Omit<Quest, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    const newQuest: Quest = {
      ...questData,
      id: `quest-${Date.now()}`,
      userId: profile.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newQuest, ...quests];
    setQuests(updated);
    if (typeof window !== 'undefined') localStorage.setItem('studyverse_quests', JSON.stringify(updated));
    setLatestToast({ message: '⚔️ New Quest forged!', type: 'success' });
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    const updated = quests.map((q) => (q.id === id ? { ...q, ...updates } : q));
    setQuests(updated);
    if (typeof window !== 'undefined') localStorage.setItem('studyverse_quests', JSON.stringify(updated));
  };

  const deleteQuest = (id: string) => {
    const updated = quests.filter((q) => q.id !== id);
    setQuests(updated);
    if (typeof window !== 'undefined') localStorage.setItem('studyverse_quests', JSON.stringify(updated));
    setLatestToast({ message: 'Quest eliminated.', type: 'warning' });
  };

  const completeQuest = (id: string) => {
    const targetQuest = quests.find((q) => q.id === id);
    if (!targetQuest || targetQuest.status === 'completed') {
      return null; // Prevent duplicate reward
    }

    const updated = quests.map((q) =>
      q.id === id ? { ...q, status: 'completed' as const, completedAt: new Date().toISOString() } : q
    );
    setQuests(updated);
    if (typeof window !== 'undefined') localStorage.setItem('studyverse_quests', JSON.stringify(updated));

    playQuestCompleteSound();
    awardXpAndCoins(targetQuest.xpReward, targetQuest.coinsReward, 'Quest Cleared');

    return { xp: targetQuest.xpReward, coins: targetQuest.coinsReward };
  };

  // Focus Timer
  const recordFocusSession = (sessionData: {
    durationMinutes: number;
    subject: string;
    chapter: string;
    questId?: string;
    interruptionsCount: number;
  }) => {
    // 2 XP per completed study minute
    const xp = sessionData.durationMinutes * 2;
    const coins = Math.floor(sessionData.durationMinutes / 2);

    const session: FocusSession = {
      id: `session-${Date.now()}`,
      userId: profile.id,
      startTime: new Date(Date.now() - sessionData.durationMinutes * 60000).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: sessionData.durationMinutes,
      subject: sessionData.subject,
      chapter: sessionData.chapter,
      questId: sessionData.questId,
      interruptionsCount: sessionData.interruptionsCount,
      xpAwarded: xp,
      coinsAwarded: coins,
      status: 'completed',
    };

    setFocusSessions((prev) => [session, ...prev]);
    setTodayFocusMinutes((prev) => prev + sessionData.durationMinutes);
    setProfile((prev) => ({
      ...prev,
      studyHoursTotal: Number((prev.studyHoursTotal + sessionData.durationMinutes / 60).toFixed(1)),
    }));

    awardXpAndCoins(xp, coins, `${sessionData.durationMinutes}m Deep Focus`);

    return { xp, coins };
  };

  // Chapter Status
  const updateChapterStatus = (
    chapterId: string,
    status: 'not_started' | 'learning' | 'practicing' | 'completed'
  ) => {
    setChapterProgressList((prev) => {
      const existing = prev.find((p) => p.chapterId === chapterId);
      if (!existing) return prev;

      const wasCompleted = existing.status === 'completed';
      const isNowCompleted = status === 'completed';

      if (!wasCompleted && isNowCompleted) {
        awardXpAndCoins(100, 40, 'Chapter Mastered');
        setProfile((p) => ({ ...p, completedChaptersCount: p.completedChaptersCount + 1 }));
      }

      return prev.map((p) =>
        p.chapterId === chapterId
          ? {
              ...p,
              status,
              progressPercentage: status === 'completed' ? 100 : status === 'practicing' ? 75 : status === 'learning' ? 40 : 0,
              lastStudiedAt: 'Just now',
            }
          : p
      );
    });
  };

  // Quiz Attempt
  const recordQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => {
    const attempt: QuizAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}`,
      userId: profile.id,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts((prev) => [attempt, ...prev]);
    awardXpAndCoins(attemptData.xpAwarded, attemptData.coinsAwarded, 'Quiz Result');
  };

  // Battle Result
  const recordBattleResult = (resultData: Omit<BattleResult, 'id' | 'completedAt'>) => {
    const result: BattleResult = {
      ...resultData,
      id: `battle-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setBattleHistory((prev) => [result, ...prev]);
    setProfile((prev) => ({
      ...prev,
      battleRating: Math.max(100, prev.battleRating + resultData.ratingDelta),
    }));
    awardXpAndCoins(resultData.xpAwarded, resultData.coinsAwarded, 'Battleground Arena');
  };

  // Guilds
  const userGuild = guilds.find((g) => g.id === userGuildId) || null;

  const createGuild = (name: string, description: string, targetExam: string): Guild => {
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name,
      description,
      targetExam,
      isPublic: true,
      inviteCode: name.slice(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900),
      leaderId: profile.id,
      leaderName: profile.fullName,
      totalXp: profile.currentXp,
      level: 1,
      membersCount: 1,
      members: [
        {
          id: `gm-${Date.now()}`,
          userId: profile.id,
          name: profile.fullName,
          avatarUrl: profile.avatarUrl,
          level: profile.currentLevel,
          currentXp: profile.currentXp,
          weeklyXp: 200,
          streak: profile.currentStreak,
          role: 'leader',
        },
      ],
    };
    setGuilds((prev) => [newGuild, ...prev]);
    setUserGuildId(newGuild.id);
    setLatestToast({ message: `🛡️ Guild "${name}" established!`, type: 'success' });
    return newGuild;
  };

  const joinGuild = (inviteCodeOrId: string): boolean => {
    const target = guilds.find(
      (g) => g.id === inviteCodeOrId || g.inviteCode.toUpperCase() === inviteCodeOrId.toUpperCase()
    );
    if (!target) {
      setLatestToast({ message: 'Invalid Guild invite code.', type: 'warning' });
      return false;
    }
    setUserGuildId(target.id);
    setLatestToast({ message: `⚔️ Joined guild "${target.name}"!`, type: 'success' });
    return true;
  };

  const leaveGuild = () => {
    setUserGuildId('');
    setLatestToast({ message: 'You left the guild.', type: 'warning' });
  };

  // Cart & Study Shop
  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setLatestToast({ message: `Added ${product.name} to cart!`, type: 'success' });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (shippingAddress: { fullName: string; street: string; city: string; zipCode: string; phone: string }): Order => {
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SV-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      totalAmount,
      shippingAddress,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    if (typeof window !== 'undefined') localStorage.setItem('studyverse_orders', JSON.stringify(updatedOrders));
    clearCart();
    setLatestToast({ message: `🎉 Order #${order.orderNumber} confirmed!`, type: 'success' });
    return order;
  };

  // Reward Shop
  const purchaseReward = (item: RewardItem): boolean => {
    if (profile.coins < item.coinPrice) {
      setLatestToast({ message: `Insufficient Coins! You need ${item.coinPrice} Coins.`, type: 'warning' });
      return false;
    }
    if (purchasedRewardIds.includes(item.id)) {
      setLatestToast({ message: 'You already own this reward!', type: 'warning' });
      return false;
    }

    setProfile((prev) => ({ ...prev, coins: prev.coins - item.coinPrice }));
    const updated = [...purchasedRewardIds, item.id];
    setPurchasedRewardIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('studyverse_purchased_rewards', JSON.stringify(updated));
    }
    setLatestToast({ message: `✨ Unlocked ${item.name}!`, type: 'coin' });
    return true;
  };

  const equipReward = (itemId: string, category: string) => {
    if (!purchasedRewardIds.includes(itemId)) return;
    if (category === 'Themes') {
      setProfile((prev) => ({ ...prev, equippedTheme: itemId }));
    } else if (category === 'Badges') {
      setProfile((prev) => ({ ...prev, equippedBadge: itemId }));
    } else if (category === 'Accessories') {
      setProfile((prev) => ({ ...prev, equippedFrame: itemId }));
    }
    setLatestToast({ message: `Equipped item!`, type: 'success' });
  };

  const closeLevelUpModal = () => setLevelUpEvent(null);
  const clearToast = () => setLatestToast(null);

  return (
    <StudyVerseContext.Provider
      value={{
        profile,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        completeOnboarding,
        quests,
        addQuest,
        updateQuest,
        deleteQuest,
        completeQuest,
        focusSessions,
        todayFocusMinutes,
        recordFocusSession,
        chapterProgressList,
        updateChapterStatus,
        quizAttempts,
        recordQuizAttempt,
        battleHistory,
        recordBattleResult,
        guilds,
        userGuild,
        createGuild,
        joinGuild,
        leaveGuild,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        rewardItems,
        purchasedRewardIds,
        purchaseReward,
        equipReward,
        achievements,
        levelUpEvent,
        closeLevelUpModal,
        latestToast,
        clearToast,
      }}
    >
      {children}
    </StudyVerseContext.Provider>
  );
};

export function useStudyVerse() {
  const context = useContext(StudyVerseContext);
  if (!context) {
    throw new Error('useStudyVerse must be used within a StudyVerseProvider');
  }
  return context;
}
