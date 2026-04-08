import { getUpcomingEvents } from '@/lib/google-calendar';
import type { CalendarEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';

function formatDateKey(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function SchedulePage() {
  const events = await getUpcomingEvents(14);

  // 日付ごとにグループ化
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = formatDateKey(event.start);
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <header className="mb-8">
        <p className="text-text-3 text-sm mb-1">Schedule</p>
        <h1 className="section-title">Upcoming events</h1>
        <p className="text-text-3 text-xs mt-2">今日から 14 日先までの予定</p>
      </header>

      {groups.size === 0 ? (
        <div className="card-flat p-10 text-center">
          <p className="text-text-2 text-sm">予定がありません</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(groups.entries()).map(([dateKey, dayEvents]) => (
            <section key={dateKey}>
              <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">
                {dateKey}
              </h2>
              <ul className="grid gap-2">
                {dayEvents.map((event) => (
                  <li
                    key={event.id}
                    className="card-flat px-4 py-3 flex items-center gap-4"
                  >
                    <span className="text-text-3 font-mono text-xs shrink-0 w-12">
                      {formatTime(event.start)}
                    </span>
                    <span className="text-text-1 text-sm truncate">
                      {event.summary}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
