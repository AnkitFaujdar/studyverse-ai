import { NextRequest, NextResponse } from 'next/server';
import { getLevelProgress, checkLevelUp } from '@/lib/gamification/levels';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentXp, addXp, source, description } = body;

    const oldXp = Number(currentXp) || 0;
    const increment = Number(addXp) || 0;
    const newXp = Math.max(0, oldXp + increment);

    const levelProg = getLevelProgress(newXp);
    const levelUpCheck = checkLevelUp(oldXp, newXp);

    return NextResponse.json({
      success: true,
      previousXp: oldXp,
      newXp,
      source: source || 'general',
      description,
      level: levelProg.currentLevel.level,
      title: levelProg.currentLevel.title,
      didLevelUp: levelUpCheck?.didLevelUp || false,
      rewardCoins: levelUpCheck?.rewardCoins || 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
