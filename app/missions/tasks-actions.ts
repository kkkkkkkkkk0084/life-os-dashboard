'use server';

import { revalidatePath } from 'next/cache';
import { addLabel, removeLabel } from '@/lib/github';
import { TODAY_LABEL } from '@/lib/labels';

/**
 * Issue に `today` ラベルを付ける（= 今日のフォーカスタスクにする）。
 */
export async function markAsTodayAction(issueNumber: number): Promise<{ ok: boolean }> {
  const ok = await addLabel(issueNumber, TODAY_LABEL);
  if (ok) {
    revalidatePath('/');
    revalidatePath('/missions');
    revalidatePath(`/missions/task/${issueNumber}`);
  }
  return { ok };
}

/**
 * Issue から `today` ラベルを外す。
 */
export async function unmarkTodayAction(issueNumber: number): Promise<{ ok: boolean }> {
  const ok = await removeLabel(issueNumber, TODAY_LABEL);
  if (ok) {
    revalidatePath('/');
    revalidatePath('/missions');
    revalidatePath(`/missions/task/${issueNumber}`);
  }
  return { ok };
}
