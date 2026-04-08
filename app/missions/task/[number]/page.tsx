import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssue, parseIssueDetails } from '@/lib/github';
import DetailList from '@/components/missions/DetailList';

export const dynamic = 'force-dynamic';

export default async function TaskPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const issueNumber = Number(number);
  if (Number.isNaN(issueNumber)) notFound();

  const issue = await getIssue(issueNumber);
  if (!issue) notFound();

  const details = parseIssueDetails(issue.body);
  const isClosed = issue.state === 'closed';

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <nav className="text-text-3 text-xs mb-2 flex gap-2 items-center">
        <Link href="/missions" className="hover:text-text-2">
          Missions
        </Link>
        <span>/</span>
        {issue.milestone ? (
          <>
            <Link
              href={`/missions/project/${issue.milestone.number}`}
              className="hover:text-text-2 truncate"
            >
              {issue.milestone.title}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-text-2 truncate">{issue.title}</span>
      </nav>

      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className={`section-title ${isClosed ? 'line-through text-text-3' : ''}`}>
            {issue.title}
          </h1>
          <div className="flex gap-2 mt-3 flex-wrap">
            {issue.labels.map((label) => (
              <span
                key={label.name}
                className="text-xs px-2 py-0.5 rounded-full border border-border-subtle text-text-3"
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary text-sm shrink-0"
        >
          Edit in GitHub
        </a>
      </header>

      <DetailList issueNumber={issueNumber} initial={details} />
    </div>
  );
}
