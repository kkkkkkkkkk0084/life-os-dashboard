'use client';

export default function GoldSection() {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="section-title font-[family-name:var(--font-display)] !text-lg">Gold</h2>
        <span className="text-[10px] text-text-3 cursor-pointer hover:text-text-2 transition-colors duration-300">Details →</span>
      </div>
      <div className="card p-3">
        <div className="space-y-2">
          {/* Income */}
          <div className="flex items-baseline justify-between">
            <div className="mono-label font-[family-name:var(--font-mono)] !text-[9px]">Income</div>
            <div className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-1" style={{ letterSpacing: '-0.5px' }}>
              ¥200<span className="text-[11px] font-normal text-text-3">K</span>
            </div>
          </div>
          {/* Expenses */}
          <div className="flex items-baseline justify-between">
            <div className="mono-label font-[family-name:var(--font-mono)] !text-[9px]">Expenses</div>
            <div className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-1" style={{ letterSpacing: '-0.5px' }}>
              ¥87.7<span className="text-[11px] font-normal text-text-3">K</span>
            </div>
          </div>
          {/* Surplus */}
          <div className="flex items-baseline justify-between pt-1.5 border-t border-card-border">
            <div className="mono-label font-[family-name:var(--font-mono)] !text-[9px]">Surplus</div>
            <div className="font-[family-name:var(--font-display)] text-xl font-semibold text-green" style={{ letterSpacing: '-0.5px' }}>
              ¥112<span className="text-[11px] font-normal text-green/60">K</span>
            </div>
          </div>
        </div>

        {/* Next big expense */}
        <div className="mt-2 pt-2 border-t border-card-border">
          <div className="mono-label font-[family-name:var(--font-mono)] mb-1 !text-[9px]">Upcoming</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-2">賃貸更新</span>
            <span className="font-[family-name:var(--font-mono)] text-text-3">¥47,000</span>
          </div>
        </div>
      </div>
    </section>
  );
}
