'use client';
import { useState } from 'react';
import { StatusData } from '@/lib/types';

const STATUS_ITEMS = [
  { key: 'wakeup', label: '起床', icon: '🌅', action: 'wakeup', type: 'time' },
  { key: 'exercise', label: '運動', icon: '💪', action: 'exercise', type: 'bool' },
  { key: 'meals', label: '食事', icon: '🍱', action: 'meal', type: 'count' },
  { key: 'outing', label: '外出', icon: '🚶', action: 'outing', type: 'time' },
  { key: 'return', label: '帰宅', icon: '🏠', action: 'return', type: 'time' },
  { key: 'sleep', label: '就寝', icon: '🌙', action: 'sleep', type: 'time' },
];

export default function StatusPanel({ status: initialStatus }: { status: StatusData }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const callWebhook = async (action: string, value?: string) => {
    const res = await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token: 'lifeos2026', value }),
    });
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
    }
  };

  const handleTap = async (action: string) => {
    setLoading(action);
    await callWebhook(action);
    setLoading(null);
  };

  const startEdit = (e: React.MouseEvent, key: string, currentVal: string) => {
    e.stopPropagation();
    setEditing(key);
    setEditValue(currentVal);
  };

  const commitEdit = async (action: string) => {
    if (editValue.trim()) {
      await callWebhook(action, editValue.trim());
    }
    setEditing(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-green-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ TODAY STATUS</h2>
      <div className="grid grid-cols-3 gap-2">
        {STATUS_ITEMS.map(({ key, label, icon, action, type }) => {
          const val = status[key as keyof StatusData];
          const active = Array.isArray(val) ? val.length > 0 : !!val;
          const timeVal = typeof val === 'string' ? val : null;
          const countVal = Array.isArray(val) ? val.length : null;
          const isLoading = loading === action;
          const isEditing = editing === key;

          return (
            <button
              key={key}
              onClick={() => !isEditing && handleTap(action)}
              disabled={isLoading}
              className={`flex flex-col items-center p-2 rounded border transition-all cursor-pointer ${
                active
                  ? 'border-green-500 bg-green-950 hover:bg-green-900'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              } disabled:opacity-50`}
            >
              <span className="text-xl">{isLoading ? '⏳' : icon}</span>
              <span className={`text-xs font-mono mt-1 ${active ? 'text-green-400' : 'text-gray-500'}`}>{label}</span>

              {/* Time field */}
              {type === 'time' && timeVal && (
                isEditing ? (
                  <input
                    type="time"
                    value={editValue}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(action)}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(action); if (e.key === 'Escape') setEditing(null); }}
                    className="text-xs font-mono bg-gray-700 text-white border border-green-500 rounded px-1 w-16 mt-0.5"
                  />
                ) : (
                  <span
                    className="text-xs text-gray-400 font-mono underline decoration-dotted cursor-text"
                    onClick={e => startEdit(e, key, timeVal)}
                    title="クリックで時間を編集"
                  >
                    {timeVal}
                  </span>
                )
              )}

              {/* Meal count */}
              {type === 'count' && countVal !== null && countVal > 0 && (
                <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
                  <button
                    className="text-gray-500 hover:text-red-400 font-mono text-xs leading-none px-0.5"
                    onClick={async (e) => { e.stopPropagation(); await callWebhook('meal', 'decrement'); }}
                    title="1回分削除"
                  >−</button>
                  <span className="text-xs text-gray-400 font-mono">{countVal}回</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
