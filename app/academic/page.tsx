import { ACADEMIC } from '@/constants/academic';

type CategoryRow = {
  label: string;
  acquired: number;
  required: number;
};

const CATEGORIES: CategoryRow[] = [
  { label: '総合教育科目', acquired: 6, required: ACADEMIC.required.general },
  { label: '専門教育科目', acquired: 30, required: ACADEMIC.required.specialized },
  { label: '卒業論文', acquired: 0, required: ACADEMIC.required.thesis },
];

function ProgressRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-text-2">{label}</span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-text-3">
          {value} / {max}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-[#a4abdf]"
          style={{ width: `${pct.toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}

export default function AcademicPage() {
  const pct = Math.round((ACADEMIC.acquired / ACADEMIC.total) * 100);
  const remaining = ACADEMIC.total - ACADEMIC.acquired;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-8">
        <p className="text-text-3 text-sm mb-1">Academic</p>
        <h1 className="section-title">単位取得進捗</h1>
      </header>

      {/* 概要カード */}
      <section className="card-flat p-6 mb-4">
        <ProgressRow label={`卒業まで（目標 ${ACADEMIC.total} 単位）`} value={ACADEMIC.acquired} max={ACADEMIC.total} />

        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: '取得済み', value: `${ACADEMIC.acquired}` },
            { label: '残り', value: `${remaining}` },
            { label: '進捗', value: `${pct}%` },
            { label: '卒業目標', value: `${ACADEMIC.targetYear}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-medium text-text-1 leading-none">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 科目区分別 */}
      <section className="card-flat p-6">
        <h2 className="text-text-3 text-xs uppercase tracking-widest mb-4">科目区分別</h2>
        <div className="space-y-4">
          {CATEGORIES.map((c) => (
            <ProgressRow key={c.label} label={c.label} value={c.acquired} max={c.required} />
          ))}
        </div>
      </section>
    </div>
  );
}
