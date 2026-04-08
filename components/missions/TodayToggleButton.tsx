'use client';

import { useState, useTransition } from 'react';
import { markAsTodayAction, unmarkTodayAction } from '@/app/missions/tasks-actions';

type Props = {
  issueNumber: number;
  initiallyToday: boolean;
};

export default function TodayToggleButton({ issueNumber, initiallyToday }: Props) {
  const [isToday, setIsToday] = useState(initiallyToday);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const next = !isToday;
      // optimistic update
      setIsToday(next);
      const result = next
        ? await markAsTodayAction(issueNumber)
        : await unmarkTodayAction(issueNumber);
      if (!result.ok) {
        // 失敗したら戻す
        setIsToday(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50 ${
        isToday
          ? 'border-accent text-accent bg-accent-glow'
          : 'border-border-subtle text-text-3 hover:text-text-2 hover:border-text-3'
      }`}
      title={isToday ? '今日から外す' : '今日にする'}
    >
      {isPending ? '...' : isToday ? '★ Today' : '+ Today'}
    </button>
  );
}
