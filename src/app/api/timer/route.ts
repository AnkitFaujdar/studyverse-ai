import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { durationMinutes, subject, chapter, interruptionsCount } = body;

    const mins = Math.max(1, Math.min(360, Number(durationMinutes) || 25));

    // Server-side calculation: 2 XP per completed study minute
    const xpAwarded = mins * 2;
    const coinsAwarded = Math.floor(mins / 2);

    return NextResponse.json({
      success: true,
      sessionId: `sess-${Date.now()}`,
      durationMinutes: mins,
      xpAwarded,
      coinsAwarded,
      subject,
      chapter,
      interruptionsCount: interruptionsCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
