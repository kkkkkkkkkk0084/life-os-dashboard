'use client';
import { useEffect, useRef } from 'react';

const DAYS = [
  { label: 'Mon', score: 82 },
  { label: 'Tue', score: 91 },
  { label: 'Wed', score: 58 },
  { label: 'Thu', score: 76 },
  { label: 'Fri', score: 34 },
  { label: 'Sat', score: null, today: true },
  { label: 'Sun', score: null },
];

export default function WeekSection() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          barsRef.current.forEach((el, i) => {
            if (el && DAYS[i].score !== null) {
              setTimeout(() => {
                el.style.width = `${DAYS[i].score}%`;
              }, 150 + i * 80);
            }
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const section = document.getElementById('week-section');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mb-16" id="week-section">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="section-title font-[family-name:var(--font-display)]">This Week</h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day, i) => (
          <div
            key={day.label}
            className={`card p-4 flex flex-col items-center gap-2.5 ${day.today ? '!border-accent/30' : ''}`}
          >
            <span className="text-xs font-medium text-text-3">{day.label}</span>
            <span className={`font-[family-name:var(--font-display)] text-2xl font-semibold ${
              day.score !== null ? 'text-text-1' : 'text-text-3'
            }`} style={{ letterSpacing: '-0.5px' }}>
              {day.score !== null ? day.score : '—'}
            </span>
            <div className="w-full progress-track">
              <div
                ref={(el) => { barsRef.current[i] = el; }}
                className="progress-fill"
                style={{
                  width: 0,
                  background: 'var(--color-accent)',
                  opacity: day.score !== null ? 0.6 : 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
