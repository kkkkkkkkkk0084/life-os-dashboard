import { StatusData } from './types';

function getDefaultStatus(today: string): StatusData {
  return {
    date: today,
    wakeup: null,
    sleep: null,
    exercise: false,
    outing: null,
    return: null,
    meals: [],
  };
}

export async function getTodayStatus(): Promise<StatusData> {
  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-');
  const key = `status:${today}`;

  try {
    const { kv } = await import('@vercel/kv');
    const data = await kv.get<StatusData>(key);
    return data ?? getDefaultStatus(today);
  } catch {
    return getDefaultStatus(today);
  }
}

export async function updateTodayStatus(action: string, value?: string): Promise<StatusData> {
  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-');
  const key = `status:${today}`;
  const current = await getTodayStatus();
  const now = new Date().toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' });

  switch (action) {
    case 'wakeup': current.wakeup = now; break;
    case 'sleep': current.sleep = now; break;
    case 'exercise': current.exercise = true; break;
    case 'outing': current.outing = now; break;
    case 'return': current.return = now; break;
    case 'meal': current.meals = [...current.meals, now]; break;
  }

  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, current, { ex: 86400 * 2 });
  } catch {
    // KV not available (local dev without credentials)
  }

  return current;
}
