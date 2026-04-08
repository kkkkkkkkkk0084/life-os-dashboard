'use client';

import { useState, useTransition } from 'react';
import type { IssueDetail } from '@/lib/types';
import { toggleDetailAction } from '@/app/missions/actions';

type Props = {
  issueNumber: number;
  initial: IssueDetail[];
};

export default function DetailList({ issueNumber, initial }: Props) {
  const [items, setItems] = useState(initial);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function toggle(index: number) {
    if (pendingIndex !== null) return;
    const next = !items[index].checked;
    // optimistic update
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, checked: next } : it)));
    setPendingIndex(index);
    startTransition(async () => {
      const result = await toggleDetailAction(issueNumber, index, next);
      if (!result.ok) {
        // rollback
        setItems((prev) =>
          prev.map((it, i) => (i === index ? { ...it, checked: !next } : it))
        );
      }
      setPendingIndex(null);
    });
  }

  const completed = items.filter((d) => d.checked).length;

  if (items.length === 0) {
    return (
      <div className="card-flat p-8 text-center">
        <p className="text-text-2 text-sm mb-2">Detail（チェックリスト）がありません</p>
        <p className="text-text-3 text-xs">
          GitHub の Issue body に <code className="font-mono">- [ ] 項目</code>{' '}
          形式で追加してください
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-text-3 text-xs uppercase tracking-widest mb-3">
        Details ({completed} / {items.length})
      </h2>
      <ul className="grid gap-1.5">
        {items.map((d, i) => {
          const isPending = pendingIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                disabled={pendingIndex !== null && !isPending}
                className="card-flat w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/4 disabled:opacity-50"
              >
                <span
                  className="w-4 h-4 rounded border shrink-0 flex items-center justify-center"
                  style={
                    d.checked
                      ? { background: 'var(--color-green)', borderColor: 'var(--color-green)' }
                      : { borderColor: 'var(--color-text-3)' }
                  }
                >
                  {d.checked && <span className="text-bg text-[10px] leading-none">✓</span>}
                </span>
                <span
                  className={`text-sm flex-1 ${
                    d.checked ? 'text-text-3 line-through' : 'text-text-1'
                  }`}
                >
                  {d.text}
                </span>
                {isPending && <span className="text-text-3 text-[10px]">...</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
