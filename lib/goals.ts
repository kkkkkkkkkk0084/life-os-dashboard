import { Goal } from './types';

/**
 * Goal は Missions 階層の最上位。Upstash KV に保存する。
 *
 * キー設計:
 * - `goals:list` → string[]（Goal ID の配列。一覧取得を 1 回の get で済ませるためのインデックス）
 * - `goals:{id}` → Goal（個別データ）
 *
 * MVP の編集スコープは「追加・編集・削除」のみ。Project/Task/Detail は GitHub 側で管理する。
 */

const LIST_KEY = 'goals:list';
const itemKey = (id: string) => `goals:${id}`;

async function getKv() {
  const { kv } = await import('@vercel/kv');
  return kv;
}

export async function listGoals(): Promise<Goal[]> {
  try {
    const kv = await getKv();
    const ids = (await kv.get<string[]>(LIST_KEY)) ?? [];
    if (ids.length === 0) return [];
    const goals = await Promise.all(ids.map((id) => kv.get<Goal>(itemKey(id))));
    return goals.filter((g): g is Goal => g !== null);
  } catch {
    return [];
  }
}

export async function getGoal(id: string): Promise<Goal | null> {
  try {
    const kv = await getKv();
    return (await kv.get<Goal>(itemKey(id))) ?? null;
  } catch {
    return null;
  }
}

export async function createGoal(input: {
  title: string;
  description?: string | null;
  milestoneNumbers?: number[];
}): Promise<Goal> {
  const goal: Goal = {
    id: crypto.randomUUID().slice(0, 8),
    title: input.title,
    description: input.description ?? null,
    milestoneNumbers: input.milestoneNumbers ?? [],
    createdAt: new Date().toISOString(),
  };

  const kv = await getKv();
  await kv.set(itemKey(goal.id), goal);
  const ids = (await kv.get<string[]>(LIST_KEY)) ?? [];
  await kv.set(LIST_KEY, [...ids, goal.id]);

  return goal;
}

export async function updateGoal(
  id: string,
  patch: Partial<Pick<Goal, 'title' | 'description' | 'milestoneNumbers'>>
): Promise<Goal | null> {
  const kv = await getKv();
  const current = await kv.get<Goal>(itemKey(id));
  if (!current) return null;

  const updated: Goal = {
    ...current,
    ...patch,
    description: patch.description !== undefined ? patch.description : current.description,
  };
  await kv.set(itemKey(id), updated);
  return updated;
}

export async function deleteGoal(id: string): Promise<boolean> {
  try {
    const kv = await getKv();
    await kv.del(itemKey(id));
    const ids = (await kv.get<string[]>(LIST_KEY)) ?? [];
    await kv.set(
      LIST_KEY,
      ids.filter((x) => x !== id)
    );
    return true;
  } catch {
    return false;
  }
}
