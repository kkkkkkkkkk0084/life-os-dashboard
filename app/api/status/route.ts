import { NextResponse } from 'next/server';
import { getTodayStatus } from '@/lib/kv';

export async function GET() {
  const status = await getTodayStatus();
  return NextResponse.json(status);
}
