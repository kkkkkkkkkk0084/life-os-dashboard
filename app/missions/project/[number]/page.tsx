import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMilestone, getIssuesByMilestone } from '@/lib/github';
import NewTaskForm from '@/components/missions/NewTaskForm';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const milestoneNumber = Number(number);
  if (Number.isNaN(milestoneNumber)) notFound();

  const [milestone, issues] = await Promise.all([
    getMilestone(milestoneNumber),
    getIssuesByMilestone(milestoneNumber, 'all'),
  ]);
  if (!milestone) notFound();

  const openIssues = issues.filter((i) => i.state === 'open');
  const closedIssues = issues.filter((i) => i.state === 'closed');

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <nav className="text-text-3 text-xs mb-2 flex gap-2">
        <Link href="/missions" className="hover:text-text-2">
          Missions
        </Link>
        <span>/</span>
        <span className="text-text-2 truncate">{milestone.title}</span>
      </nav>

      <header className="mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="section-title">{milestone.title}</h1>
          {milestone.description && (
            <p className="text-text-2 text-sm mt-2 max-w-2xl">{milestone.description}</p>
          )}
        </div>
        <a
          href={milestone.html_url}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary text-sm shrink-0"
        >
          Open in GitHub
        </a>
      </header>

      <div className="flex items-baseline justify-between mb-3 gap-3">
        <h2 className="text-text-3 text-xs uppercase tracking-widest">
          Tasks ({openIssues.length} open / {issues.length} total)
        </h2>
        <NewTaskForm milestone={milestoneNumber} />
      </div>

      {issues.length === 0 ? (
        <div className="card-flat p-8 text-center">
          <p className="text-text-2 text-sm">この Milestone に Issue がありません</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {[...openIssues, ...closedIssues].map((issue) => {
            const isClosed = issue.state === 'closed';
            return (
              <li key={issue.id}>
                <Link
                  href={`/missions/task/${issue.number}`}
                  className="card-flat block px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className={`w-4 h-4 rounded-full border shrink-0 ${
                      isClosed
                        ? 'bg-green border-green'
                        : 'border-text-3'
                    }`}
                    style={
                      isClosed
                        ? { background: 'var(--color-green)', borderColor: 'var(--color-green)' }
                        : undefined
                    }
                  />
                  <span
                    className={`text-sm truncate ${
                      isClosed ? 'text-text-3 line-through' : 'text-text-1'
                    }`}
                  >
                    {issue.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
