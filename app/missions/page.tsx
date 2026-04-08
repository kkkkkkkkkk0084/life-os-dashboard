import Link from 'next/link';
import { listGoals } from '@/lib/goals';
import { getMilestones, getOpenIssuesWithoutLabel } from '@/lib/github';
import NewGoalForm from '@/components/missions/NewGoalForm';
import TodayToggleButton from '@/components/missions/TodayToggleButton';
import { TODAY_LABEL } from '@/lib/labels';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
  const [goals, milestones, inbox] = await Promise.all([
    listGoals(),
    getMilestones('open'),
    getOpenIssuesWithoutLabel(TODAY_LABEL, 50),
  ]);

  const milestoneCountByGoal = new Map<string, number>(
    goals.map((g) => [g.id, g.milestoneNumbers.length])
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-text-3 text-sm mb-1">Missions</p>
          <h1 className="section-title">Goals</h1>
        </div>
        <NewGoalForm />
      </header>

      {goals.length === 0 ? (
        <div className="card-flat p-10 text-center">
          <p className="text-text-2 text-sm mb-2">まだ Goal がありません</p>
          <p className="text-text-3 text-xs">
            年単位の大目標を追加したくなったら、右上の「+ New Goal」から作成できます。
            <br />
            日々のタスクは Overview の Today&apos;s Tasks に表示されます。
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
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

      {/* Inbox: today ラベルがない open Issue 一覧 */}
      <section className="mt-12">
        <header className="flex items-baseline justify-between mb-3">
          <h2 className="text-text-3 text-xs uppercase tracking-widest">
            Inbox ({inbox.length})
          </h2>
          <span className="text-text-3 text-[10px]">
            「+ Today」で Overview に表示
          </span>
        </header>

        {inbox.length === 0 ? (
          <div className="card-flat p-6 text-center text-text-3 text-sm">
            Inbox は空です
          </div>
        ) : (
          <ul className="grid gap-2">
            {inbox.map((issue) => (
              <li key={issue.id}>
                <div className="card-flat px-4 py-3 flex items-center gap-3">
                  <Link
                    href={`/missions/task/${issue.number}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <span className="text-text-3 font-mono text-[10px] shrink-0">
                      #{issue.number}
                    </span>
                    <span className="text-text-1 text-sm truncate">{issue.title}</span>
                    {issue.labels.length > 0 && (
                      <div className="flex gap-1 shrink-0">
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
                  </Link>
                  <TodayToggleButton issueNumber={issue.number} initiallyToday={false} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Goal に紐付いていない Milestone があれば参考表示 */}
      {milestones.length > 0 && (
        <section className="mt-12">
          <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">
            All Open Projects (Milestones)
          </h2>
          <ul className="grid gap-2">
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
