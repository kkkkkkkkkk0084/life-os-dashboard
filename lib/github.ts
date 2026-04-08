import { GitHubIssue, GitHubMilestone, IssueDetail } from './types';

const REPO = 'kkkkkkkkkk0084/life-os';
const API_BASE = `https://api.github.com/repos/${REPO}`;

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

/**
 * Open Issue 一覧を取得し、優先度順にソートして返す。
 *
 * - body から `Due: YYYY-MM-DD` をパースして dueDate を付与
 * - 並び順:
 *     1. 期限切れ（古い順）
 *     2. 期限が今日
 *     3. 期限が未来（近い順）
 *     4. 期限なし（Issue 番号の新しい順）
 */
export async function getOpenIssues(options?: { limit?: number }): Promise<GitHubIssue[]> {
  const limit = options?.limit ?? 100;
  const params = new URLSearchParams({ state: 'open', per_page: String(limit) });
  const res = await fetch(`${API_BASE}/issues?${params.toString()}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const issues: GitHubIssue[] = await res.json();
  return enrichAndSortIssues(issues);
}

/**
 * Issue 配列に dueDate を付与し、優先度順にソートする。
 */
export function enrichAndSortIssues(issues: GitHubIssue[]): GitHubIssue[] {
  const enriched = issues.map((issue) => ({
    ...issue,
    dueDate: parseIssueDueDate(issue.body),
  }));
  return sortIssuesByPriority(enriched);
}

/**
 * Issue body から `Due: YYYY-MM-DD` をパースする。
 * - 大文字小文字を区別しない（`due:` `DUE:` も OK）
 * - スペースは前後に許容
 * - 行頭でも行中でもマッチ
 *
 * 例:
 *   "Due: 2026-04-15"        → "2026-04-15"
 *   "  due:2026-04-15  "      → "2026-04-15"
 *   "メモ\nDue: 2026-12-31"   → "2026-12-31"
 */
export function parseIssueDueDate(body: string | null): string | null {
  if (!body) return null;
  const m = body.match(/^\s*due\s*:\s*(\d{4}-\d{2}-\d{2})\s*$/im);
  return m ? m[1] : null;
}

/**
 * Issue を優先度順にソートする。
 *
 * 優先度（priority value, 小さいほど上位）:
 *   - overdue: dueDate が今日より前
 *   - today:   dueDate が今日
 *   - future:  dueDate が今日より後
 *   - none:    dueDate なし
 */
export function sortIssuesByPriority(issues: GitHubIssue[]): GitHubIssue[] {
  return [...issues].sort((a, b) => {
    const da = a.dueDate ?? null;
    const db = b.dueDate ?? null;

    // 期限なしは末尾
    if (!da && !db) return b.number - a.number;
    if (!da) return 1;
    if (!db) return -1;

    // 両方期限あり: 古い順（過去 → 今日 → 未来）
    if (da < db) return -1;
    if (da > db) return 1;

    // 同じ日付なら Issue 番号の新しい順
    return b.number - a.number;
  });
}

/**
 * 期限の状態を分類する。UI 上の色分けに使う。
 */
export type DueStatus = 'overdue' | 'today' | 'soon' | 'future' | 'none';
export function classifyDueDate(dueDate: string | null | undefined): DueStatus {
  if (!dueDate) return 'none';
  const now = new Date();
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const today = `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}-${String(
    jst.getDate()
  ).padStart(2, '0')}`;

  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';

  // 3 日以内なら "soon"
  const due = new Date(dueDate + 'T00:00:00+09:00');
  const diffDays = Math.floor((due.getTime() - jst.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return 'soon';
  return 'future';
}

/**
 * 指定 Milestone に紐付く Issue 一覧。
 * Missions 階層の「Project → Tasks」表示に使う。
 */
export async function getIssuesByMilestone(
  milestoneNumber: number,
  state: 'open' | 'closed' | 'all' = 'open'
): Promise<GitHubIssue[]> {
  const res = await fetch(
    `${API_BASE}/issues?milestone=${milestoneNumber}&state=${state}&per_page=100`,
    {
      headers: authHeaders(),
      cache: 'no-store',
    }
  );
  if (!res.ok) return [];
  const issues: GitHubIssue[] = await res.json();
  return enrichAndSortIssues(issues);
}

/**
 * 単一 Issue の詳細を取得。
 * Missions 階層の「Task → Details（checkbox）」表示に使う。
 */
export async function getIssue(issueNumber: number): Promise<GitHubIssue | null> {
  const res = await fetch(`${API_BASE}/issues/${issueNumber}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const issue: GitHubIssue = await res.json();
  return { ...issue, dueDate: parseIssueDueDate(issue.body) };
}

/**
 * Milestone 一覧を取得。
 * Missions 階層の「Project」に対応する。
 */
export async function getMilestones(
  state: 'open' | 'closed' | 'all' = 'open'
): Promise<GitHubMilestone[]> {
  const res = await fetch(
    `${API_BASE}/milestones?state=${state}&per_page=100&sort=due_on&direction=asc`,
    {
      headers: authHeaders(),
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * 単一 Milestone の詳細を取得。
 */
export async function getMilestone(milestoneNumber: number): Promise<GitHubMilestone | null> {
  const res = await fetch(`${API_BASE}/milestones/${milestoneNumber}`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * 新しい Issue を作成する。
 *
 * - dueDate を渡すと body 先頭に `Due: YYYY-MM-DD` 行を自動付与する
 * - milestone は number で指定（GitHub API 仕様）
 */
export async function createIssue(input: {
  title: string;
  body?: string | null;
  dueDate?: string | null;
  labels?: string[];
  milestone?: number | null;
}): Promise<GitHubIssue | null> {
  // body 構築: Due: 行 + 元 body
  const lines: string[] = [];
  if (input.dueDate) lines.push(`Due: ${input.dueDate}`);
  if (input.body && input.body.trim()) {
    if (lines.length > 0) lines.push('');
    lines.push(input.body.trim());
  }
  const body = lines.length > 0 ? lines.join('\n') : null;

  const payload: Record<string, unknown> = { title: input.title };
  if (body !== null) payload.body = body;
  if (input.labels && input.labels.length > 0) payload.labels = input.labels;
  if (input.milestone) payload.milestone = input.milestone;

  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  const issue: GitHubIssue = await res.json();
  return { ...issue, dueDate: parseIssueDueDate(issue.body) };
}

/**
 * リポジトリにラベルが存在しなければ作成する。
 * 既存ラベルがある場合は何もしない。
 */
export async function ensureLabel(name: string, color = '848CD0'): Promise<void> {
  // 存在チェック
  const checkRes = await fetch(`${API_BASE}/labels/${encodeURIComponent(name)}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (checkRes.ok) return;

  // 作成
  await fetch(`${API_BASE}/labels`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color, description: '' }),
  });
}

/**
 * Issue にラベルを追加する。
 * 同名ラベルが既に付いていても GitHub 側で冪等に処理される。
 */
export async function addLabel(issueNumber: number, label: string): Promise<boolean> {
  await ensureLabel(label);
  const res = await fetch(`${API_BASE}/issues/${issueNumber}/labels`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ labels: [label] }),
  });
  return res.ok;
}

/**
 * Issue から特定のラベルを削除する。
 * ラベルが付いていない場合は 404 が返るが、エラーとはしない。
 */
export async function removeLabel(issueNumber: number, label: string): Promise<boolean> {
  const res = await fetch(
    `${API_BASE}/issues/${issueNumber}/labels/${encodeURIComponent(label)}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  );
  return res.ok || res.status === 404;
}

/**
 * Issue body の Markdown checkbox を Detail として抽出する。
 * - `- [ ] foo` → { text: 'foo', checked: false }
 * - `- [x] bar` / `- [X] bar` → { text: 'bar', checked: true }
 *
 * 行頭の空白・タブにも対応（ネストされた checkbox 含む）。
 * 配列の順番が toggleIssueCheckbox の index と一致する。
 */
export function parseIssueDetails(body: string | null): IssueDetail[] {
  if (!body) return [];
  const pattern = /^[ \t]*[-*+]\s+\[([ xX])\]\s+(.+)$/gm;
  const details: IssueDetail[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) !== null) {
    details.push({
      checked: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
  }
  return details;
}

/**
 * Issue body の N 番目の Markdown checkbox を切り替える。
 *
 * - `parseIssueDetails` と同じ正規表現を使うので index は一致する
 * - body 内の他の部分（Due 行・本文・改行）は触らない
 * - 該当 index がなければ false
 */
export async function toggleIssueCheckbox(
  issueNumber: number,
  index: number,
  checked: boolean
): Promise<boolean> {
  const issue = await getIssue(issueNumber);
  if (!issue || !issue.body) return false;

  const pattern = /^([ \t]*[-*+]\s+\[)([ xX])(\]\s+.+)$/gm;
  let i = 0;
  let found = false;
  const newBody = issue.body.replace(pattern, (match, prefix, _state, suffix) => {
    if (i++ === index) {
      found = true;
      return `${prefix}${checked ? 'x' : ' '}${suffix}`;
    }
    return match;
  });

  if (!found) return false;

  const res = await fetch(`${API_BASE}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: newBody }),
  });
  return res.ok;
}
