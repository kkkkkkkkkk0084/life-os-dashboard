import Link from 'next/link';
import { getOpenIssues } from '@/lib/github';
import { TODAY_LABEL } from '@/lib/labels';
import TodayToggleButton from '@/components/missions/TodayToggleButton';

export default async function TodayTasks() {
  const issues = await getOpenIssues({ labels: [TODAY_LABEL] });

  return (
    <section className="card-flat p-5 h-full flex flex-col">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-text-1">
          Today&apos;s Tasks
        </h2>
        <Link href="/missions" className="text-text-3 text-xs hover:text-text-2">
          Inbox →
        </Link>
      </header>

      {issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-text-2 text-sm mb-2">今日のタスクはまだありません</p>
          <p className="text-text-3 text-xs">
            <Link href="/missions" className="underline decoration-dotted hover:text-text-2">
              Inbox
            </Link>{' '}
            から「+ Today」ボタンで追加できます
          </p>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto -mx-2 pr-1">
          {issues.map((issue) => (
            <li key={issue.id}>
              <Link
                href={`/missions/task/${issue.number}`}
                className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-white/4 transition-colors group"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-text-3 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-1 truncate">{issue.title}</p>
                  {issue.labels.length > 0 && (
                    <div className="flex gap-1.5 mt-0.5">
                      {issue.labels
                        .filter((l) => l.name !== TODAY_LABEL)
                        .map((label) => (
                          <span key={label.name} className="text-[10px] text-text-3">
                            {label.name}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <TodayToggleButton issueNumber={issue.number} initiallyToday={true} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
