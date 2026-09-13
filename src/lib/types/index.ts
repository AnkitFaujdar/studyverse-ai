export type ExamCategory = 
  | 'Engineering' 
  | 'Medical' 
  | 'Civil Services' 
  | 'Government' 
  | 'Management' 
  | 'University' 
  | 'Custom';

export type ExamType = 
  | 'JEE Main'
  | 'JEE Advanced'
  | 'NEET'
  | 'UPSC'
  | 'SSC'
  | 'GATE'
  | 'CAT'
  | 'CUET'
  | 'University Exam'
  | 'Custom Exam';

export type PreparationLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  targetExam: ExamType;
  preparationLevel: PreparationLevel;
  dailyGoalMinutes: number; // e.g. 180 for 3 hours
  targetExamDate: string; // YYYY-MM-DD
  currentLevel: number; // 1 to 10
  currentXp: number;
  coins: number;
  battleRating: number; // Elo-style (e.g. 1000)
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  studyHoursTotal: number;
  completedChaptersCount: number;
  equippedTheme?: string;
  equippedBadge?: string;
  equippedFrame?: string;
  isOnboarded: boolean;
}

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';
export type QuestStatus = 'pending' | 'completed' | 'rescheduled';

export interface Quest {
  id: string;
  userId: string;
  title: string;
  subject: string;
  chapter: string;
  description: string;
  difficulty: QuestDifficulty;
  estimatedDurationMinutes: number;
  dueDate: string; // YYYY-MM-DD
  xpReward: number;
  coinsReward: number;
  status: QuestStatus;
  completedAt?: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  subject: string;
  chapter: string;
  questId?: string;
  interruptionsCount: number;
  xpAwarded: number;
  coinsAwarded: number;
  status: 'completed' | 'interrupted';
}

export interface ChapterProgress {
  id: string;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  subjectName: string;
  status: 'not_started' | 'learning' | 'practicing' | 'completed';
  progressPercentage: number;
  revisionCount: number;
  lastStudiedAt?: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  totalChapters: number;
  chapters: ChapterItem[];
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  name: string;
  orderIndex: number;
  weightage: 'Low' | 'Medium' | 'High' | 'Crucial';
  estimatedHours: number;
  summary: string;
}

export interface QuizQuestion {
  id: string;
  chapterId?: string;
  chapterName?: string;
  subjectName?: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  xpAwarded: number;
  coinsAwarded: number;
  completedAt: string;
}

export type BattleMode = 'quick_10' | 'standard_30' | 'boss_50';

export interface BattleResult {
  id: string;
  mode: BattleMode;
  opponentName: string;
  opponentRating: number;
  userScore: number;
  opponentScore: number;
  isVictory: boolean;
  ratingDelta: number;
  xpAwarded: number;
  coinsAwarded: number;
  completedAt: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  targetExam: string;
  isPublic: boolean;
  inviteCode: string;
  bannerUrl?: string;
  leaderId: string;
  leaderName: string;
  totalXp: number;
  level: number;
  membersCount: number;
  members: GuildMember[];
}

export interface GuildMember {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  level: number;
  currentXp: number;
  weeklyXp: number;
  streak: number;
  role: 'leader' | 'officer' | 'member';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string;
  targetExam: string;
  level: number;
  xp: number;
  streak: number;
  badge?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Books' | 'Pens' | 'Pencils' | 'Notebooks' | 'Geometry' | 'Highlighters' | 'Bags' | 'Calculators' | 'Study Essentials';
  description: string;
  price: number; // in USD or cents/rupees
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  imageUrl: string;
  badge?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface RewardItem {
  id: string;
  name: string;
  category: 'Themes' | 'Badges' | 'Accessories' | 'Backgrounds' | 'Effects';
  description: string;
  coinPrice: number;
  icon: string;
  isEquipped?: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'Quests' | 'Streaks' | 'Focus' | 'Mastery' | 'Combat';
  icon: string;
  rewardXp: number;
  rewardCoins: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  targetProgress?: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  actionType?: 'explain' | 'solve' | 'hint' | 'summarize' | 'notes' | 'quiz' | 'flashcards';
  imageUrl?: string;
  createdAt: string;
}
