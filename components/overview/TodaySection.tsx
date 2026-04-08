'use client';

const TODAY_ITEMS = [
  { label: 'Wake up', value: '07:30', sub: '目標 07:00', status: 'ok' as const },
  { label: 'Workout', value: 'Done', sub: '腕立て・腹筋・スクワット', status: 'ok' as const },
  { label: 'Meals', value: '2 / 2', sub: '¥650', status: 'neutral' as const },
  { label: 'Study', value: '2.0h', sub: '商法総則', status: 'ok' as const },
  { label: 'Spending', value: '¥1,200', sub: '予算 ¥3,000/日', status: 'ok' as const },
  { label: 'Screen time', value: '42m', sub: '上限 30min', status: 'bad' as const },
  { label: 'Go out', value: '10:00', sub: '外出', status: 'neutral' as const },
  { label: 'Return', value: '18:00', sub: '帰宅', status: 'neutral' as const },
  { label: 'Sleep', value: '--:--', sub: '目標 24:00', status: 'pending' as const },
];

const statusColor = {
  ok: 'text-green',
  bad: 'text-red',
  neutral: 'text-text-1',
  pending: 'text-text-3',
};

export default function TodaySection() {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="section-title font-[family-name:var(--font-display)] !text-lg">Today</h2>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3">April 5, 2026</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {TODAY_ITEMS.map((item, i) => (
          <div key={item.label} className={`card p-2.5 cursor-pointer animate-fade-up delay-${i + 1}`}>
            <div className="mono-label font-[family-name:var(--font-mono)] mb-1 !text-[9px]">{item.label}</div>
            <div className={`font-[family-name:var(--font-mono)] text-base font-semibold leading-none mb-0.5 ${statusColor[item.status]}`}>
              {item.value}
            </div>
            <div className="text-[10px] text-text-3 truncate">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
