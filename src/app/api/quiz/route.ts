import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { score, totalQuestions, accuracyPercentage, timeSpentSeconds, quizTitle } = body;

    const validatedScore = Math.max(0, Number(score) || 0);
    const validatedTotal = Math.max(1, Number(totalQuestions) || 5);
    const accuracy = Math.round((validatedScore / validatedTotal) * 100);

    const xpAwarded = validatedScore * 20 + Math.floor(accuracy / 2);
    const coinsAwarded = validatedScore * 5;

    return NextResponse.json({
      success: true,
      attemptId: `att-${Date.now()}`,
      quizTitle,
      score: validatedScore,
      totalQuestions: validatedTotal,
      accuracyPercentage: accuracy,
      timeSpentSeconds,
      xpAwarded,
      coinsAwarded,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
