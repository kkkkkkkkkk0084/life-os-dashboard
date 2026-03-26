import { NextResponse } from 'next/server';
import { getTodayEvents } from '@/lib/google-calendar';

export async function GET() {
  const events = await getTodayEvents();
  return NextResponse.json(events);
}
