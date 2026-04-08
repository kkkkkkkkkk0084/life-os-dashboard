import Link from 'next/link';
import { listGoals } from '@/lib/goals';
import { getMilestones, getOpenIssues, classifyDueDate, type DueStatus } from '@/lib/github';
import NewGoalForm from '@/components/missions/NewGoalForm';
import NewTaskForm from '@/components/missions/NewTaskForm';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<DueStatus, { label: string; color?: string }> = {
  overdue: { label: '期限切れ', color: 'var(--color-red)' },
  today: { label: '今日', color: 'var(--color-amber)' },
  soon: { label: '近日' },
  future: { label: '' },
  none: { label: '' },
};

function formatDueLabel(dueDate: string | null | undefined): string {
  if (!dueDate) return '';
  const m = dueDate.match(/^\d{4}-(\d{2})-(\d{2})$/);
  return m ? `${parseInt(m[1])}/${parseInt(m[2])}` : dueDate;
}

export default async function MissionsPage() {
  const [goals, milestones, allIssues] = await Promise.all([
    listGoals(),
    getMilestones('open'),
    getOpenIssues({ limit: 100 }),
  ]);

  const milestoneCountByGoal = new Map<string, number>(
    goals.map((g) => [g.id, g.milestoneNumbers.length])
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <p className="text-text-3 text-sm mb-1">Missions</p>
        <h1 className="section-title">Goals</h1>
      </header>

      <div className="mb-6 flex justify-end">
        <NewGoalForm />
      </div>

      {goals.length === 0 ? (
        <div className="card-flat p-10 text-center">
          <p className="text-text-2 text-sm mb-2">まだ Goal がありません</p>
          <p className="text-text-3 text-xs">
            年単位の大目標を追加したくなったら、右上の「+ New Goal」から作成できます。
            <br />
            日々のタスクは下の Tasks セクションで確認できます。
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {goals.map((goal) => (
            <li key={goal.id}>
              <Link
                href={`/missions/goal/${goal.id}`}
                className="card block p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-text-1 text-lg font-medium tracking-tight truncate">
                      {goal.title}
                    </h2>
                    {goal.description && (
                      <p className="text-text-3 text-sm mt-1 line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <span className="text-text-3 text-xs shrink-0 mt-1">
                    {milestoneCountByGoal.get(goal.id) ?? 0} projects
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* All Tasks: 全 Open Issue を期限優先順で一覧表示 */}
      <section className="mt-12">
        <header className="flex items-baseline justify-between mb-3 gap-3">
          <h2 className="text-text-3 text-xs uppercase tracking-widest">
            Tasks ({allIssues.length})
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-text-3 text-[10px]">期限が近い順</span>
            <NewTaskForm />
          </div>
        </header>

        {allIssues.length === 0 ? (
          <div className="card-flat p-6 text-center text-text-3 text-sm">
            未完了タスクなし
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2">
            {allIssues.map((issue) => {
              const status = classifyDueDate(issue.dueDate);
              const badge = STATUS_BADGE[status];
              return (
                <li key={issue.id} className="min-w-0">
                  <Link
                    href={`/missions/task/${issue.number}`}
                    className="card-flat px-4 py-3 flex items-center gap-3 min-w-0"
                  >
                    <span className="text-text-3 font-mono text-[10px] shrink-0 w-8">
                      #{issue.number}
                    </span>
                    <span className="text-text-1 text-sm truncate flex-1 min-w-0">
                      {issue.title}
                    </span>
                    {/* labels はモバイルで非表示（情報過多 + overflow 防止） */}
                    {issue.labels.length > 0 && (
                      <div className="hidden md:flex gap-1 shrink-0">
                        {issue.labels.slice(0, 3).map((label) => (
                          <span
                            key={label.name}
                            className="text-[10px] text-text-3"
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {issue.dueDate && (
                      <span
                        className="font-[family-name:var(--font-mono)] text-[10px] shrink-0 px-1.5 py-0.5 rounded border border-border-subtle"
                        style={badge.color ? { color: badge.color, borderColor: badge.color + '40' } : undefined}
                      >
                        {formatDueLabel(issue.dueDate)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Goal に紐付いていない Milestone があれば参考表示 */}
      {milestones.length > 0 && (
        <section className="mt-12">
          <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">
            All Open Projects (Milestones)
          </h2>
          <ul className="grid grid-cols-1 gap-2">
            {milestones.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/missions/project/${m.number}`}
                  className="card-flat block px-4 py-3 text-sm flex items-center justify-between"
                >
                  <span className="text-text-2 truncate">{m.title}</span>
                  <span className="text-text-3 text-xs shrink-0 ml-3">
                    {m.open_issues} open
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
