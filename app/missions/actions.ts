'use server';

import { revalidatePath } from 'next/cache';
import { createGoal, deleteGoal, updateGoal } from '@/lib/goals';
import { createIssue, toggleIssueCheckbox } from '@/lib/github';

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

/**
 * GitHub Issue を新規作成する。
 *
 * フォームフィールド:
 *   - title (必須)
 *   - dueDate (任意, YYYY-MM-DD)
 *   - milestone (任意, 数値)
 *   - labels (任意, カンマ区切り)
 */
export async function createTaskAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) {
    return { ok: false, error: 'タイトルを入力してください' };
  }

  const dueDateRaw = String(formData.get('dueDate') ?? '').trim();
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(dueDateRaw) ? dueDateRaw : null;

  const milestoneRaw = String(formData.get('milestone') ?? '').trim();
  const milestone = /^\d+$/.test(milestoneRaw) ? Number(milestoneRaw) : null;

  const labelsRaw = String(formData.get('labels') ?? '').trim();
  const labels = labelsRaw
    ? labelsRaw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const result = await createIssue({
    title,
    dueDate,
    milestone,
    labels,
  });

  if (!result) {
    return { ok: false, error: 'GitHub への作成に失敗しました' };
  }

  revalidatePath('/');
  revalidatePath('/missions');
  if (milestone) {
    revalidatePath(`/missions/project/${milestone}`);
  }
  return { ok: true };
}

/**
 * Issue body の N 番目の Markdown checkbox をトグル。
 * Missions の Detail (`/missions/task/[number]`) で 1 タップ完了を実現する。
 */
export async function toggleDetailAction(
  issueNumber: number,
  index: number,
  checked: boolean
): Promise<{ ok: boolean }> {
  const ok = await toggleIssueCheckbox(issueNumber, index, checked);
  if (ok) {
    revalidatePath(`/missions/task/${issueNumber}`);
  }
  return { ok };
}
