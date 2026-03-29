'use client';
import { useState } from 'react';
import { StatusData } from '@/lib/types';

const STATUS_ITEMS = [
  { key: 'wakeup', label: '起床', icon: '🌅', action: 'wakeup' },
  { key: 'exercise', label: '運動', icon: '💪', action: 'exercise' },
  { key: 'meals', label: '食事', icon: '🍱', action: 'meal' },
  { key: 'outing', label: '外出', icon: '🚶', action: 'outing' },
  { key: 'return', label: '帰宅', icon: '🏠', action: 'return' },
  { key: 'sleep', label: '就寝', icon: '🌙', action: 'sleep' },
];

export default function StatusPanel({ status: initialStatus }: { status: StatusData }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState<string | null>(null);

  const handleTap = async (action: string) => {
    setLoading(action);
    const res = await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token: 'lifeos2026' }),
    });
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
    }
    setLoading(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-green-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ TODAY STATUS</h2>
      <div className="grid grid-cols-3 gap-2">
        {STATUS_ITEMS.map(({ key, label, icon, action }) => {
          const val = status[key as keyof StatusData];
          const active = Array.isArray(val) ? val.length > 0 : !!val;
          const display = Array.isArray(val) ? `${val.length}回` : typeof val === 'string' ? val : null;
          const isLoading = loading === action;
          return (
            <button
              key={key}
              onClick={() => handleTap(action)}
              disabled={isLoading}
              className={`flex flex-col items-center p-2 rounded border transition-all cursor-pointer ${
                active
                  ? 'border-green-500 bg-green-950 hover:bg-green-900'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              } disabled:opacity-50`}
            >
              <span className="text-xl">{isLoading ? '⏳' : icon}</span>
              <span className={`text-xs font-mono mt-1 ${active ? 'text-green-400' : 'text-gray-500'}`}>{label}</span>
              {display && <span className="text-xs text-gray-400 font-mono">{display}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
