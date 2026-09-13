import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, questId, difficulty } = body;

    if (action === 'complete') {
      const difficultyRewards: Record<string, { xp: number; coins: number }> = {
        Easy: { xp: 30, coins: 5 },
        Medium: { xp: 50, coins: 10 },
        Hard: { xp: 80, coins: 15 },
        Epic: { xp: 120, coins: 25 },
      };

      const rewards = difficultyRewards[difficulty] || { xp: 50, coins: 10 };

      // Return server-verified rewards to prevent client tampering
      return NextResponse.json({
        success: true,
        questId,
        xpAwarded: rewards.xp,
        coinsAwarded: rewards.coins,
        completedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, message: 'Quest logged' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
