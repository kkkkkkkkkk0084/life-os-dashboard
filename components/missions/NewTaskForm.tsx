'use client';

import { useState, useTransition, useRef } from 'react';
import { createTaskAction } from '@/app/missions/actions';

type Props = {
  /** 固定 Milestone を設定する場合（/missions/project/[number] で使う） */
  milestone?: number;
  /** デフォルトの期限。Overview から呼ぶ時に「今日」を入れる用 */
  defaultDueDate?: string;
  /** ボタンのラベル（デフォルト: "+ New Task"） */
  buttonLabel?: string;
};

function todayJst(): string {
  const now = new Date();
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  return `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}-${String(
    jst.getDate()
  ).padStart(2, '0')}`;
}

export default function NewTaskForm({
  milestone,
  defaultDueDate,
  buttonLabel = '+ New Task',
}: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    if (milestone) formData.set('milestone', String(milestone));
    startTransition(async () => {
      const result = await createTaskAction(formData);
      if (result.ok) {
        formRef.current?.reset();
        setOpen(false);
      } else {
        setError(result.error ?? '作成に失敗しました');
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn-secondary text-xs !py-1.5 !px-3"
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="card-flat p-4 w-full max-w-md flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-text-3 text-[10px] uppercase tracking-widest">
          Title
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          autoFocus
          placeholder="やることを書く"
          className="bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-text-3"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label
            htmlFor="task-due"
            className="text-text-3 text-[10px] uppercase tracking-widest"
          >
            Due (任意)
          </label>
          <input
            id="task-due"
            name="dueDate"
            type="date"
            defaultValue={defaultDueDate ?? ''}
            min={todayJst()}
            className="bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-text-3"
          />
        </div>

        {!milestone && (
          <div className="flex flex-col gap-1.5 flex-1">
            <label
              htmlFor="task-labels"
              className="text-text-3 text-[10px] uppercase tracking-widest"
            >
              Labels (カンマ区切り)
            </label>
            <input
              id="task-labels"
              name="labels"
              type="text"
              placeholder="task, urgent"
              className="bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-text-3"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-red)' }}>
          {error}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="btn-secondary text-xs !py-1.5 !px-3"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary text-xs !py-1.5 !px-3"
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
