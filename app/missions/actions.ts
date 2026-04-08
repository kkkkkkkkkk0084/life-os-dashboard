'use server';

import { revalidatePath } from 'next/cache';
import { createGoal, deleteGoal, updateGoal } from '@/lib/goals';

export async function createGoalAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!title) {
    return { ok: false, error: 'タイトルを入力してください' };
  }

  await createGoal({
    title,
    description: description || null,
  });

  revalidatePath('/missions');
  return { ok: true };
}

export async function deleteGoalAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteGoal(id);
  revalidatePath('/missions');
}

export async function updateGoalMilestonesAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const raw = String(formData.get('milestoneNumbers') ?? '');
  if (!id) return;

  const milestoneNumbers = raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

  await updateGoal(id, { milestoneNumbers });
  revalidatePath('/missions');
  revalidatePath(`/missions/goal/${id}`);
}
