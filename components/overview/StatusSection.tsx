'use client';
import { useEffect, useRef } from 'react';

const STATS = [
  { name: '体力', rank: 'A', tag: 'Rank 3', value: 78, desc: '運動 22日連続', color: 'var(--color-green)' },
  { name: '学業', rank: 'C', tag: '36 / 124', value: 29, unit: '%', desc: '残 88単位 + 卒論8', color: 'var(--color-blue)' },
  { name: '習慣', rank: 'B', tag: 'Rank 3', value: 65, desc: '起床ブレ ±18min', color: 'var(--color-accent)' },
  { name: '財務', rank: 'B', tag: '4月', value: 119, prefix: '¥', unit: 'K', desc: '固定費 ¥87,700/月', color: 'var(--color-amber)' },
  { name: '健康', rank: 'B', tag: 'Rank 3', value: 72, desc: '食費 ¥6,200 / ¥8,000', color: 'var(--color-red)' },
  { name: '事業', rank: 'D', tag: '準備中', value: 12, desc: 'ポートフォリオ 12件', color: 'var(--color-text-3)' },
];

function Counter({ to, prefix, unit }: { to: number; prefix?: string; unit?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const el = ref.current;
          if (!el) return;
          const duration = 900;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = `${prefix || ''}${Math.round(to * ease)}`;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, prefix]);

  return (
    <>
      <span ref={ref} className="font-[family-name:var(--font-display)] text-2xl font-semibold text-text-1 leading-none"
        style={{ letterSpacing: '-1px' }}>
        {prefix || ''}0
      </span>
      {unit && <span className="text-sm font-normal text-text-3">{unit}</span>}
    </>
  );
}

export default function StatusSection() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const fill = el.querySelector('.bar-fill') as HTMLElement;
            if (fill) {
              setTimeout(() => {
                fill.style.width = fill.dataset.width || '0%';
              }, 200);
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    barsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="section-title font-[family-name:var(--font-display)] !text-lg">Status</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {STATS.map((stat, i) => (
          <div
            key={stat.name}
            className={`card p-3 animate-fade-up delay-${i + 1}`}
            ref={(el) => { barsRef.current[i] = el; }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-text-2">{stat.name}</span>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3">{stat.tag}</span>
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <Counter to={stat.value} prefix={stat.prefix} unit={stat.unit} />
            </div>
            <div className="text-[10px] text-text-3 mb-2 truncate">{stat.desc}</div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-[family-name:var(--font-mono)] text-[9px] text-text-3">Rank</span>
              <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-text-1">{stat.rank}</span>
            </div>
            <div className="progress-track">
              <div
                className="bar-fill progress-fill"
                data-width={`${stat.value}%`}
                style={{ width: 0, background: stat.color, opacity: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
