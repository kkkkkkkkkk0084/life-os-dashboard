import { NextResponse } from 'next/server';
import { getOpenIssues } from '@/lib/github';

export async function GET() {
  const issues = await getOpenIssues();
  return NextResponse.json(issues);
}
