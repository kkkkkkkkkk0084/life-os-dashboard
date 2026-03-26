'use client';
import { StatusData } from '@/lib/types';

const STATUS_ITEMS = [
  { key: 'wakeup', label: '起床', icon: '🌅' },
  { key: 'exercise', label: '運動', icon: '💪' },
  { key: 'meals', label: '食事', icon: '🍱' },
  { key: 'outing', label: '外出', icon: '🚶' },
  { key: 'return', label: '帰宅', icon: '🏠' },
  { key: 'sleep', label: '就寝', icon: '🌙' },
];

export default function StatusPanel({ status }: { status: StatusData }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-green-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ TODAY STATUS</h2>
      <div className="grid grid-cols-3 gap-2">
        {STATUS_ITEMS.map(({ key, label, icon }) => {
          const val = status[key as keyof StatusData];
          const active = Array.isArray(val) ? val.length > 0 : !!val;
          const display = Array.isArray(val) ? `${val.length}回` : typeof val === 'string' ? val : null;
          return (
            <div key={key} className={`flex flex-col items-center p-2 rounded border ${active ? 'border-green-500 bg-green-950' : 'border-gray-700 bg-gray-800'}`}>
              <span className="text-xl">{icon}</span>
              <span className={`text-xs font-mono mt-1 ${active ? 'text-green-400' : 'text-gray-500'}`}>{label}</span>
              {display && <span className="text-xs text-gray-400 font-mono">{display}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
