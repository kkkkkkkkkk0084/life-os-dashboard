'use client';

import { useState, useTransition, useRef } from 'react';
import { createGoalAction } from '@/app/missions/actions';

export default function NewGoalForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createGoalAction(formData);
      if (result?.ok) {
        formRef.current?.reset();
        setOpen(false);
      } else if (result?.error) {
        setError(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn-primary text-sm"
        onClick={() => setOpen(true)}
      >
        + New Goal
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="card-flat p-5 w-full max-w-md flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-title" className="text-text-3 text-xs uppercase tracking-widest">
          Title
        </label>
        <input
          id="goal-title"
          name="title"
          type="text"
          required
          autoFocus
          placeholder="e.g. 2026 年に新規事業を立ち上げる"
          className="bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-text-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="goal-description"
          className="text-text-3 text-xs uppercase tracking-widest"
        >
          Description (optional)
        </label>
        <textarea
          id="goal-description"
          name="description"
          rows={3}
          placeholder="この Goal の背景や狙いをメモ"
          className="bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-text-3 resize-none"
        />
      </div>

      {error && <p className="text-red text-xs" style={{ color: 'var(--color-red)' }}>{error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={isPending}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary text-sm" disabled={isPending}>
          {isPending ? 'Saving...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
