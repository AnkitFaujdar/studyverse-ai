export interface LevelConfig {
  level: number;
  title: string;
  minXp: number;
  badge: string;
  rewardCoins: number;
  description: string;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, title: 'Novice Aspirant', minXp: 0, badge: '🌱', rewardCoins: 0, description: 'The journey of a thousand questions begins with a single concept.' },
  { level: 2, title: 'Apprentice Scholar', minXp: 100, badge: '📜', rewardCoins: 50, description: 'Grasping foundational formulas and core principles.' },
  { level: 3, title: 'Focus Warrior', minXp: 250, badge: '⚔️', rewardCoins: 50, description: 'Developing ironclad study habits and disciplined focus.' },
  { level: 4, title: 'Concept Knight', minXp: 450, badge: '🛡️', rewardCoins: 75, description: 'Conquering challenging subjects and defeating tricky problems.' },
  { level: 5, title: 'Syllabus Slayer', minXp: 700, badge: '⚡', rewardCoins: 100, description: 'Crushing chapters with speed, elegance, and precision.' },
  { level: 6, title: 'Chrono Master', minXp: 1000, badge: '⏳', rewardCoins: 120, description: 'Commander of deep work sprints and distraction elimination.' },
  { level: 7, title: 'Exam Tactician', minXp: 1400, badge: '🧭', rewardCoins: 150, description: 'Strategic test taker capable of high-accuracy blitzes.' },
  { level: 8, title: 'Grandmaster Sage', minXp: 1900, badge: '🔥', rewardCoins: 200, description: 'Commanding top tier percentiles across all subjects.' },
  { level: 9, title: 'Mythic Scholar', minXp: 2500, badge: '✨', rewardCoins: 250, description: 'Transcendent analytical intellect and mental endurance.' },
  { level: 10, title: '👑 LEGENDARY SCHOLAR', minXp: 3200, badge: '👑', rewardCoins: 500, description: 'Supreme zenith of scholarship. Untamable intellect and master of exams.' },
];

export interface LevelProgress {
  currentLevel: LevelConfig;
  nextLevel: LevelConfig | null;
  currentXpInLevel: number;
  xpNeededForNext: number;
  percentage: number;
}

export function getLevelProgress(totalXp: number): LevelProgress {
  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      break;
    }
  }

  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1) || null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      currentXpInLevel: totalXp - currentLevel.minXp,
      xpNeededForNext: 0,
      percentage: 100,
    };
  }

  const range = nextLevel.minXp - currentLevel.minXp;
  const currentXpInLevel = totalXp - currentLevel.minXp;
  const percentage = Math.min(100, Math.max(0, Math.round((currentXpInLevel / range) * 100)));

  return {
    currentLevel,
    nextLevel,
    currentXpInLevel,
    xpNeededForNext: nextLevel.minXp - totalXp,
    percentage,
  };
}

export function checkLevelUp(oldXp: number, newXp: number): { didLevelUp: boolean; oldLevel: LevelConfig; newLevel: LevelConfig; rewardCoins: number } | null {
  const oldProg = getLevelProgress(oldXp);
  const newProg = getLevelProgress(newXp);

  if (newProg.currentLevel.level > oldProg.currentLevel.level) {
    return {
      didLevelUp: true,
      oldLevel: oldProg.currentLevel,
      newLevel: newProg.currentLevel,
      rewardCoins: newProg.currentLevel.rewardCoins,
    };
  }

  return null;
}
