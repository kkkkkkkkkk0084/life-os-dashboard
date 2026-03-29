import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { issueNumber } = await request.json();
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(
    `https://api.github.com/repos/kkkkkkkkkk0084/life-os/issues/${issueNumber}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: 'closed' }),
    }
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
