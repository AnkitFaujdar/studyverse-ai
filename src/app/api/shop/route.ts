import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, items, shippingAddress, rewardItemId, userCoins } = body;

    if (action === 'order') {
      const orderNumber = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({
        success: true,
        orderNumber,
        status: 'confirmed',
        estimatedDelivery: '3-5 business days',
        createdAt: new Date().toISOString(),
      });
    }

    if (action === 'reward_purchase') {
      return NextResponse.json({
        success: true,
        rewardItemId,
        purchasedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
