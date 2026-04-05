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
    <section className="mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="section-title font-[family-name:var(--font-display)]">Today</h2>
        <span className="font-[family-name:var(--font-mono)] text-xs text-text-3">April 5, 2026</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {TODAY_ITEMS.map((item, i) => (
          <div key={item.label} className={`card p-5 cursor-pointer animate-fade-up delay-${i + 1}`}>
            <div className="mono-label font-[family-name:var(--font-mono)] mb-2.5">{item.label}</div>
            <div className={`font-[family-name:var(--font-mono)] text-2xl font-semibold leading-none mb-1.5 ${statusColor[item.status]}`}>
              {item.value}
            </div>
            <div className="text-[11px] text-text-3">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
