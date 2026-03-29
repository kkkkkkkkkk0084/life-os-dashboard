import { ACADEMIC } from '@/constants/academic';
import ProgressBar from '@/components/ProgressBar';

export default function AcademicPage() {
  const pct = Math.round((ACADEMIC.acquired / ACADEMIC.total) * 100);
  const remaining = ACADEMIC.total - ACADEMIC.acquired;

  return (
    <div>
      <h2 className="text-purple-400 font-mono text-lg font-bold tracking-widest mb-6">▶ ACADEMIC STATUS</h2>

      {/* 進捗概要 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
        <h3 className="text-purple-400 font-mono text-sm font-bold mb-4 tracking-widest">単位取得進捗</h3>
        <ProgressBar value={ACADEMIC.acquired} max={ACADEMIC.total} color="#a855f7" label={`取得単位 (目標: ${ACADEMIC.total})`} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: '取得済み', value: `${ACADEMIC.acquired}単位`, color: 'text-purple-400' },
            { label: '残り', value: `${remaining}単位`, color: 'text-red-400' },
            { label: '進捗', value: `${pct}%`, color: 'text-purple-400' },
            { label: '卒業目標', value: `${ACADEMIC.targetYear}年`, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 font-mono text-xs mb-1">{label}</p>
              <p className={`font-mono text-lg font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 科目別進捗 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
        <h3 className="text-purple-400 font-mono text-sm font-bold mb-4 tracking-widest">科目区分別</h3>
        <div className="space-y-4">
          <ProgressBar value={6} max={ACADEMIC.required.general} color="#a855f7" label={`総合教育科目 (必要: ${ACADEMIC.required.general})`} />
          <ProgressBar value={30} max={ACADEMIC.required.specialized} color="#7c3aed" label={`専門教育科目 (必要: ${ACADEMIC.required.specialized})`} />
          <ProgressBar value={0} max={ACADEMIC.required.thesis} color="#6d28d9" label={`卒業論文 (必要: ${ACADEMIC.required.thesis})`} />
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
        <h3 className="text-red-400 font-mono text-xs font-bold mb-2 tracking-widest">⚠ WARNINGS</h3>
        <ul className="space-y-1 text-xs font-mono text-gray-400">
          <li>• 2027年度から大幅改訂予定（レポート提出制限・学費値上げ）</li>
          <li>• 慶應通信Wiki: 2026年度までの卒業推奨</li>
          <li>• 卒論指導: 年2回×最低3回 = 最短1.5年必要</li>
        </ul>
      </div>
    </div>
  );
}
