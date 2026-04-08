import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssue, parseIssueDetails } from '@/lib/github';

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

      <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">
        Details ({details.filter((d) => d.checked).length} / {details.length})
      </h2>

      {details.length === 0 ? (
        <div className="card-flat p-8 text-center">
          <p className="text-text-2 text-sm mb-2">Detail（チェックリスト）がありません</p>
          <p className="text-text-3 text-xs">
            GitHub の Issue body に <code className="font-mono">- [ ] 項目</code> 形式で追加してください
          </p>
        </div>
      ) : (
        <ul className="grid gap-1.5">
          {details.map((d, i) => (
            <li
              key={i}
              className="card-flat flex items-center gap-3 px-4 py-2.5"
            >
              <span
                className="w-4 h-4 rounded border shrink-0 flex items-center justify-center"
                style={
                  d.checked
                    ? { background: 'var(--color-green)', borderColor: 'var(--color-green)' }
                    : { borderColor: 'var(--color-text-3)' }
                }
              >
                {d.checked && (
                  <span className="text-bg text-[10px] leading-none">✓</span>
                )}
              </span>
              <span
                className={`text-sm ${
                  d.checked ? 'text-text-3 line-through' : 'text-text-1'
                }`}
              >
                {d.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
