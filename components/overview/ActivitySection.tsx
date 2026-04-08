'use client';
import { useEffect, useRef } from 'react';

const LOG = [
  { time: '07:30', text: '起床', exp: 15 },
  { time: '08:15', text: '腕立て30回 / 腹筋20回 / スクワット30回', exp: 20 },
  { time: '10:00', text: '外出 → TOKIUMインターン', exp: 0 },
  { time: '12:30', text: '食事 1回目', exp: 5 },
  { time: '14:00', text: '商法総則 テキスト読み 2h', exp: 30 },
  { time: '18:00', text: '帰宅', exp: 0 },
  { time: '18:30', text: '食事 2回目', exp: 10 },
];

export default function ActivitySection() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          itemsRef.current.forEach((el, i) => {
            if (el) {
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
              }, i * 80);
            }
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    const section = document.getElementById('activity-section');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="activity-section">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="section-title font-[family-name:var(--font-display)] !text-lg">Activity</h2>
        <span className="text-[10px] text-text-3 cursor-pointer hover:text-text-2 transition-colors duration-300">View all →</span>
      </div>
      <div className="card-flat px-3 py-2 relative">
        <div className="absolute left-[18px] top-3 bottom-3 w-px bg-card-border" />
        {LOG.map((item, i) => (
          <div
            key={i}
            ref={(el) => { itemsRef.current[i] = el; }}
            className="relative flex items-center gap-3 py-1 pl-4 transition-all duration-400"
            style={{ opacity: 0, transform: 'translateX(-8px)' }}
          >
            <div className="absolute left-[3px] w-[7px] h-[7px] rounded-full bg-card border-[1.5px] border-text-3/40 hover:border-accent transition-colors duration-300" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-3 w-9 flex-shrink-0">{item.time}</span>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <div className="text-[12px] text-text-2 truncate">{item.text}</div>
              {item.exp > 0 && (
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-green/40 flex-shrink-0">+{item.exp}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
