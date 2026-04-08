import Link from 'next/link';
import { getOpenIssues, classifyDueDate, type DueStatus } from '@/lib/github';
import { OVERVIEW_TASK_LIMIT } from '@/lib/labels';
import NewTaskForm from '@/components/missions/NewTaskForm';

function todayJst(): string {
  const now = new Date();
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  return `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}-${String(
    jst.getDate()
  ).padStart(2, '0')}`;
}

const STATUS_STYLE: Record<DueStatus, { label: string; className: string }> = {
  overdue: { label: '期限切れ', className: 'text-red' },
  today: { label: '今日', className: 'text-amber' },
  soon: { label: '近日', className: 'text-text-2' },
  future: { label: '', className: 'text-text-3' },
  none: { label: '', className: 'text-text-3' },
};

function formatDueLabel(dueDate: string | null | undefined): string {
  if (!dueDate) return '';
  // YYYY-MM-DD → MM/DD
  const m = dueDate.match(/^\d{4}-(\d{2})-(\d{2})$/);
  return m ? `${parseInt(m[1])}/${parseInt(m[2])}` : dueDate;
}

export default async function TodayTasks() {
  const allIssues = await getOpenIssues({ limit: 100 });
  const issues = allIssues.slice(0, OVERVIEW_TASK_LIMIT);

  return (
    <section className="card-flat p-5">
      <header className="flex items-baseline justify-between mb-4 gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-text-1">
          Today&apos;s Tasks
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/missions" className="text-text-3 text-xs hover:text-text-2">
            All ({allIssues.length}) →
          </Link>
          <NewTaskForm defaultDueDate={todayJst()} buttonLabel="+ Task" />
        </div>
      </header>

      {issues.length === 0 ? (
        <p className="text-text-3 text-sm py-4">未完了タスクなし</p>
      ) : (
        <ul className="-mx-2">
          {issues.map((issue) => {
            const status = classifyDueDate(issue.dueDate);
            const style = STATUS_STYLE[status];
            return (
              <li key={issue.id}>
                <Link
                  href={`/missions/task/${issue.number}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/4 transition-colors"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-text-3 shrink-0" />
                  <span className="text-sm text-text-1 truncate flex-1 min-w-0">
                    {issue.title}
                  </span>
                  {issue.dueDate && (
                    <span
                      className={`font-[family-name:var(--font-mono)] text-[10px] shrink-0 ${style.className}`}
                      style={
                        status === 'overdue'
                          ? { color: 'var(--color-red)' }
                          : status === 'today'
                          ? { color: 'var(--color-amber)' }
                          : undefined
                      }
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
  );
}
