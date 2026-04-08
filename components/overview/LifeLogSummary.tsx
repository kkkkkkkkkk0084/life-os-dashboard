import Link from 'next/link';
import { getTodayStatus } from '@/lib/kv';

export default async function LifeLogSummary() {
  const status = await getTodayStatus();

  const items: {
    label: string;
    value: string;
    active: boolean;
  }[] = [
    {
      label: '起床',
      value: status.wakeup ?? '--:--',
      active: !!status.wakeup,
    },
    {
      label: '就寝',
      value: status.sleep ?? '--:--',
      active: !!status.sleep,
    },
    {
      label: '運動',
      value: status.exercise ? 'Done' : '—',
      active: status.exercise,
    },
    {
      label: '食事',
      value: status.meals.length > 0 ? `${status.meals.length} 回` : '0 回',
      active: status.meals.length > 0,
    },
  ];

  return (
    <section className="card-flat p-5">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-text-1">
          生活ログ
        </h2>
        <Link href="/health" className="text-text-3 text-xs hover:text-text-2">
          Edit →
        </Link>
      </header>

      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 uppercase tracking-widest">
              {item.label}
            </span>
            <span
              className={`font-[family-name:var(--font-mono)] text-lg font-semibold leading-none ${
                item.active ? 'text-text-1' : 'text-text-3'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
