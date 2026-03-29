import ProgressBar from './ProgressBar';
import { ACADEMIC } from '@/constants/academic';

export default function AcademicPanel() {
  const remaining = ACADEMIC.total - ACADEMIC.acquired;
  const pct = Math.round((ACADEMIC.acquired / ACADEMIC.total) * 100);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-6">
      <span className="text-purple-400 font-mono text-xs font-bold tracking-widest whitespace-nowrap">▶ ACADEMIC</span>
      <div className="flex-1">
        <ProgressBar value={ACADEMIC.acquired} max={ACADEMIC.total} color="#a855f7" />
      </div>
      <div className="flex gap-4 text-xs font-mono whitespace-nowrap">
        <span className="text-gray-400">残り <span className="text-purple-400">{remaining}</span>単位</span>
        <span className="text-gray-400"><span className="text-purple-400">{pct}%</span></span>
        <span className="text-gray-400">卒業 <span className="text-purple-400">{ACADEMIC.targetYear}</span>年</span>
      </div>
    </div>
  );
}
