import ProgressBar from './ProgressBar';
import { ACADEMIC } from '@/constants/academic';

export default function AcademicPanel() {
  const remaining = ACADEMIC.total - ACADEMIC.acquired;
  const yearsLeft = ACADEMIC.targetYear - ACADEMIC.currentYear;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-purple-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ ACADEMIC EXP</h2>
      <ProgressBar value={ACADEMIC.acquired} max={ACADEMIC.total} color="#a855f7" label="単位取得" />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="text-gray-400">残り単位: <span className="text-purple-400">{remaining}</span></div>
        <div className="text-gray-400">卒業まで: <span className="text-purple-400">{yearsLeft}年</span></div>
        <div className="text-gray-400">目標: <span className="text-purple-400">{ACADEMIC.targetYear}年</span></div>
        <div className="text-gray-400">進捗: <span className="text-purple-400">{Math.round((ACADEMIC.acquired/ACADEMIC.total)*100)}%</span></div>
      </div>
    </div>
  );
}
