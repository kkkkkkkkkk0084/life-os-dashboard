import { NextRequest, NextResponse } from 'next/server';
import { updateTodayStatus } from '@/lib/kv';

const VALID_ACTIONS = ['wakeup', 'sleep', 'exercise', 'outing', 'return', 'meal'];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, token, value } = body;

  if (token !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const updated = await updateTodayStatus(action, value);
  return NextResponse.json({ success: true, status: updated });
}
