'use client';

export default function GoldSection() {
  return (
    <section className="mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="section-title font-[family-name:var(--font-display)]">Gold</h2>
        <span className="text-xs text-text-3 cursor-pointer hover:text-text-2 transition-colors duration-300">Details →</span>
      </div>
      <div className="card p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Income */}
          <div>
            <div className="mono-label font-[family-name:var(--font-mono)] mb-2">Income</div>
            <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-text-1" style={{ letterSpacing: '-1px' }}>
              ¥200<span className="text-base font-normal text-text-3">K</span>
            </div>
            <div className="text-[11px] text-text-3 mt-1">TOKIUM インターン</div>
          </div>
          {/* Expenses */}
          <div>
            <div className="mono-label font-[family-name:var(--font-mono)] mb-2">Expenses</div>
            <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-text-1" style={{ letterSpacing: '-1px' }}>
              ¥87.7<span className="text-base font-normal text-text-3">K</span>
            </div>
            <div className="text-[11px] text-text-3 mt-1">固定費</div>
          </div>
          {/* Surplus */}
          <div>
            <div className="mono-label font-[family-name:var(--font-mono)] mb-2">Surplus</div>
            <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-green" style={{ letterSpacing: '-1px' }}>
              ¥112<span className="text-base font-normal text-green/60">K</span>
            </div>
            <div className="text-[11px] text-text-3 mt-1">今月の余剰</div>
          </div>
        </div>

        {/* Next big expense */}
        <div className="mt-6 pt-5 border-t border-card-border">
          <div className="mono-label font-[family-name:var(--font-mono)] mb-3">Upcoming</div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-2">賃貸更新</span>
            <span className="font-[family-name:var(--font-mono)] text-text-3">¥47,000</span>
            <span className="font-[family-name:var(--font-mono)] text-text-3">2026-04-24</span>
          </div>
        </div>
      </div>
    </section>
  );
}
