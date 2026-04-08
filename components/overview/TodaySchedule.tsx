import Link from 'next/link';
import { getTodayEvents } from '@/lib/google-calendar';

function formatTime(iso: string): string {
  if (!iso) return '';
  // 終日イベント (date only) の場合
  if (!iso.includes('T')) return 'All day';
  return new Date(iso).toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function TodaySchedule() {
  const events = await getTodayEvents();

  return (
    <section className="card-flat p-5">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-text-1">
          Today&apos;s Schedule
        </h2>
        <Link href="/schedule" className="text-text-3 text-xs hover:text-text-2">
          All →
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="text-text-3 text-sm py-4">予定なし</p>
      ) : (
        <ul className="-mx-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-3 px-2 py-2"
            >
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-3 shrink-0 w-12">
                {formatTime(event.start)}
              </span>
              <span className="text-sm text-text-1 truncate">
                {event.summary}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
