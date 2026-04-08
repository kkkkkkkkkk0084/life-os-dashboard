import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGoal } from '@/lib/goals';
import { getMilestone } from '@/lib/github';
import type { GitHubMilestone } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const goal = await getGoal(id);
  if (!goal) notFound();

  const milestones = (
    await Promise.all(goal.milestoneNumbers.map((n) => getMilestone(n)))
  ).filter((m): m is GitHubMilestone => m !== null);

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <nav className="text-text-3 text-xs mb-2 flex gap-2">
        <Link href="/missions" className="hover:text-text-2">
          Missions
        </Link>
        <span>/</span>
        <span className="text-text-2 truncate">{goal.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="section-title">{goal.title}</h1>
        {goal.description && (
          <p className="text-text-2 text-sm mt-2 max-w-2xl">{goal.description}</p>
        )}
      </header>

      <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">Projects</h2>

      {milestones.length === 0 ? (
        <div className="card-flat p-8 text-center">
          <p className="text-text-2 text-sm mb-2">この Goal に紐付く Project がありません</p>
          <p className="text-text-3 text-xs">
            GitHub で Milestone を作成し、Goal と紐付けてください（紐付け UI は次のステップで実装）
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {milestones.map((m) => {
            const total = m.open_issues + m.closed_issues;
            return (
              <li key={m.id}>
                <Link
                  href={`/missions/project/${m.number}`}
                  className="card block p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-text-1 text-base font-medium truncate">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-text-3 text-sm mt-1 line-clamp-2">
                          {m.description}
                        </p>
                      )}
                    </div>
                    <span className="text-text-3 text-xs shrink-0 mt-1">
                      {m.open_issues} / {total} tasks
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
