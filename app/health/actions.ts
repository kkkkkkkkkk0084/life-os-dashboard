'use server';

import { revalidatePath } from 'next/cache';
import { updateTodayStatus } from '@/lib/kv';
import type { StatusData } from '@/lib/types';

const VALID_ACTIONS = new Set([
  'wakeup',
  'sleep',
  'exercise',
  'outing',
  'return',
  'meal',
]);

export async function updateStatusAction(
  action: string,
  value?: string
): Promise<StatusData | null> {
  if (!VALID_ACTIONS.has(action)) return null;
  const updated = await updateTodayStatus(action, value);
  revalidatePath('/health');
  revalidatePath('/');
  return updated;
}
