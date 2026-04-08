import Link from 'next/link';
import { getOpenIssues } from '@/lib/github';

export default async function TodayTasks() {
  const issues = await getOpenIssues();

  return (
    <section className="card-flat p-5 h-full flex flex-col">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-text-1">
          Today&apos;s Tasks
        </h2>
        <Link href="/missions" className="text-text-3 text-xs hover:text-text-2">
          All →
        </Link>
      </header>

      {issues.length === 0 ? (
        <p className="text-text-3 text-sm">未完了タスクなし</p>
      ) : (
        <ul className="flex-1 overflow-y-auto -mx-2 pr-1">
          {issues.slice(0, 8).map((issue) => (
            <li key={issue.id}>
              <Link
                href={`/missions/task/${issue.number}`}
                className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-white/4 transition-colors"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-text-3 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-1 truncate">{issue.title}</p>
                  {issue.labels.length > 0 && (
                    <div className="flex gap-1.5 mt-0.5">
                      {issue.labels.map((label) => (
                        <span
                          key={label.name}
                          className="text-[10px] text-text-3"
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
