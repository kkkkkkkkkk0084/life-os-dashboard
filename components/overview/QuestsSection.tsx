'use client';

type Quest = {
  text: string;
  tags: { label: string; type: 'urgent' | 'academic' | 'finance' | 'goal' | 'life' }[];
  exp: number;
  status: 'urgent' | 'progress' | 'todo';
  source: 'issue' | 'calendar';
  time?: string;
};

const QUESTS: Quest[] = [
  {
    text: '商法総則レポート提出',
    tags: [{ label: 'urgent', type: 'urgent' }, { label: 'academic', type: 'academic' }],
    exp: 200,
    status: 'urgent',
    source: 'issue',
  },
  {
    text: '4月の固定費支払い確認',
    tags: [{ label: 'finance', type: 'finance' }],
    exp: 100,
    status: 'progress',
    source: 'issue',
  },
  {
    text: '英語Ⅰスクーリング申込',
    tags: [{ label: 'academic', type: 'academic' }],
    exp: 50,
    status: 'todo',
    source: 'issue',
  },
  {
    text: 'TOKIUMインターン',
    tags: [{ label: 'life', type: 'life' }],
    exp: 0,
    status: 'todo',
    source: 'calendar',
    time: '10:00 - 18:00',
  },
  {
    text: 'Life OS ゲーミフィケーション実装',
    tags: [{ label: 'goal', type: 'goal' }],
    exp: 300,
    status: 'todo',
    source: 'issue',
  },
];

const TAG_STYLES: Record<string, string> = {
  urgent: 'text-red bg-red/10',
  academic: 'text-blue bg-blue/10',
  finance: 'text-amber bg-amber/8',
  goal: 'text-accent bg-accent/10',
  life: 'text-text-2 bg-white/5',
};

const DOT_STYLES: Record<string, string> = {
  urgent: 'border-red',
  progress: 'border-amber',
  todo: 'border-text-3',
};

export default function QuestsSection() {
  return (
    <section className="mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="section-title font-[family-name:var(--font-display)]">Quests</h2>
        <span className="text-xs text-text-3 cursor-pointer hover:text-text-2 transition-colors duration-300">View all →</span>
      </div>
      <div className="card-flat">
        {QUESTS.map((quest, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 px-5 py-3 border-b border-card-border last:border-b-0 hover:bg-white/2 transition-all duration-200 cursor-default"
          >
            {/* Status dot */}
            <div className={`w-4 h-4 rounded-full border-[1.5px] ${DOT_STYLES[quest.status]} flex-shrink-0 relative`}>
              {(quest.status === 'urgent' || quest.status === 'progress') && (
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                    quest.status === 'urgent' ? 'bg-red' : 'bg-amber'
                  }`}
                />
              )}
            </div>

            {/* Source indicator */}
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 w-6 flex-shrink-0">
              {quest.source === 'calendar' ? 'CAL' : 'ISS'}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[15px] text-text-1 truncate">{quest.text}</div>
              <div className="flex items-center gap-1.5 mt-1">
                {quest.time && (
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 mr-1">{quest.time}</span>
                )}
                {quest.tags.map((tag) => (
                  <span key={tag.label} className={`text-[10px] font-medium px-1.5 py-px rounded ${TAG_STYLES[tag.type]}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* EXP */}
            {quest.exp > 0 && (
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-3 flex-shrink-0">+{quest.exp}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
