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
    <section className="mb-16" id="activity-section">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="section-title font-[family-name:var(--font-display)]">Activity</h2>
        <span className="text-xs text-text-3 cursor-pointer hover:text-text-2 transition-colors duration-300">View all →</span>
      </div>
      <div className="relative pl-7">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-px bg-card-border" />

        {LOG.map((item, i) => (
          <div
            key={i}
            ref={(el) => { itemsRef.current[i] = el; }}
            className="relative flex items-start gap-4 py-2.5 transition-all duration-400"
            style={{ opacity: 0, transform: 'translateX(-8px)' }}
          >
            {/* Dot */}
            <div className="absolute -left-[21px] top-[15px] w-[9px] h-[9px] rounded-full bg-card border-[1.5px] border-text-3/40 hover:border-accent transition-colors duration-300" />

            <span className="font-[family-name:var(--font-mono)] text-[13px] text-text-3 w-11 flex-shrink-0">{item.time}</span>
            <div className="flex-1">
              <div className="text-sm text-text-2 hover:text-text-1 transition-colors duration-300">{item.text}</div>
              {item.exp > 0 && (
                <div className="font-[family-name:var(--font-mono)] text-xs text-green/40 mt-0.5">+{item.exp} exp</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
