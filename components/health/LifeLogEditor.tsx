'use client';

import { useState, useTransition } from 'react';
import type { StatusData } from '@/lib/types';
import { updateStatusAction } from '@/app/health/actions';

type Props = {
  initial: StatusData;
};

type ItemType = 'time' | 'bool' | 'count';

const ITEMS: {
  key: keyof StatusData;
  label: string;
  action: 'wakeup' | 'sleep' | 'exercise' | 'outing' | 'return' | 'meal';
  type: ItemType;
}[] = [
  { key: 'wakeup', label: '起床', action: 'wakeup', type: 'time' },
  { key: 'sleep', label: '就寝', action: 'sleep', type: 'time' },
  { key: 'exercise', label: '運動', action: 'exercise', type: 'bool' },
  { key: 'meals', label: '食事', action: 'meal', type: 'count' },
  { key: 'outing', label: '外出', action: 'outing', type: 'time' },
  { key: 'return', label: '帰宅', action: 'return', type: 'time' },
];

export default function LifeLogEditor({ initial }: Props) {
  const [status, setStatus] = useState<StatusData>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function call(action: string, value?: string) {
    setPendingKey(action);
    startTransition(async () => {
      const updated = await updateStatusAction(action, value);
      if (updated) setStatus(updated);
      setPendingKey(null);
    });
  }

  function tap(action: string) {
    call(action);
  }

  function startEdit(key: string, currentVal: string) {
    setEditing(key);
    setEditValue(currentVal);
  }

  function commitEdit(action: string) {
    if (editValue.trim()) call(action, editValue.trim());
    setEditing(null);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {ITEMS.map(({ key, label, action, type }) => {
        const val = status[key];
        const isPending = pendingKey === action;
        const isEditing = editing === key;

        const timeVal = type === 'time' && typeof val === 'string' ? val : null;
        const boolActive = type === 'bool' && val === true;
        const mealCount = type === 'count' && Array.isArray(val) ? val.length : 0;

        const active = !!timeVal || boolActive || mealCount > 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => !isEditing && tap(action)}
            disabled={isPending}
            className={`card-flat p-4 text-left transition-colors disabled:opacity-50 ${
              active ? '' : 'opacity-70'
            }`}
            style={
              active
                ? { borderColor: 'rgba(132,140,208,0.4)' }
                : undefined
            }
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 uppercase tracking-widest">
                {label}
              </span>
              {isPending && (
                <span className="text-text-3 text-[10px]">...</span>
              )}
            </div>

            {/* Time field */}
            {type === 'time' && (
              <>
                {isEditing ? (
                  <input
                    type="time"
                    value={editValue}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(action)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit(action);
                      if (e.key === 'Escape') setEditing(null);
                    }}
                    className="bg-transparent border border-border-subtle rounded px-2 py-0.5 font-[family-name:var(--font-mono)] text-lg text-text-1 w-24 focus:outline-none focus:border-accent"
                  />
                ) : timeVal ? (
                  <span
                    role="button"
                    tabIndex={0}
                    className="font-[family-name:var(--font-mono)] text-lg font-semibold text-text-1 underline decoration-dotted underline-offset-2 cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(key, timeVal);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        startEdit(key, timeVal);
                      }
                    }}
                  >
                    {timeVal}
                  </span>
                ) : (
                  <span className="font-[family-name:var(--font-mono)] text-lg text-text-3">
                    --:--
                  </span>
                )}
              </>
            )}

            {/* Bool */}
            {type === 'bool' && (
              <span
                className={`font-[family-name:var(--font-mono)] text-lg font-semibold ${
                  boolActive ? 'text-text-1' : 'text-text-3'
                }`}
                style={boolActive ? { color: 'var(--color-green)' } : undefined}
              >
                {boolActive ? 'Done' : '—'}
              </span>
            )}

            {/* Count */}
            {type === 'count' && (
              <div className="flex items-center gap-2">
                <span
                  className={`font-[family-name:var(--font-mono)] text-lg font-semibold ${
                    mealCount > 0 ? 'text-text-1' : 'text-text-3'
                  }`}
                >
                  {mealCount} 回
                </span>
                {mealCount > 0 && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-text-3 hover:text-text-1 text-sm leading-none px-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      call('meal', 'decrement');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        call('meal', 'decrement');
                      }
                    }}
                    title="1 回減らす"
                  >
                    −
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
