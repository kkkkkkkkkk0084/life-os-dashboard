import Link from 'next/link';
import { listGoals } from '@/lib/goals';
import { getMilestones } from '@/lib/github';
import NewGoalForm from '@/components/missions/NewGoalForm';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
  const [goals, milestones] = await Promise.all([listGoals(), getMilestones('open')]);

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
            「+ New Goal」ボタンから追加できます（Goal 作成 UI は次のステップで実装）
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
