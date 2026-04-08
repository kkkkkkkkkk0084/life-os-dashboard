import { CalendarEvent } from '@/lib/types';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' });
}

export default function CalendarPanel({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-blue-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ TODAY SCHEDULE</h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm font-mono">予定なし</p>
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <div key={event.id} className="flex items-center gap-2 text-sm">
              <span className="text-blue-400 font-mono text-xs w-12">{formatTime(event.start)}</span>
              <span className="text-gray-300 font-mono">{event.summary}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
