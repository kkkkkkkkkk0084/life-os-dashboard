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
 * Open Issue 一覧を取得。
 * 任意で `labels` を指定すると AND フィルタが効く（GitHub API の `labels=a,b` 仕様）。
 */
export async function getOpenIssues(options?: {
  labels?: string[];
  limit?: number;
}): Promise<GitHubIssue[]> {
  const limit = options?.limit ?? 30;
  const params = new URLSearchParams({ state: 'open', per_page: String(limit) });
  if (options?.labels?.length) {
    params.set('labels', options.labels.join(','));
  }
  const res = await fetch(`${API_BASE}/issues?${params.toString()}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Open Issue のうち、指定ラベルを **持たない** ものだけを返す。
 * GitHub API はネガティブフィルタを直接サポートしないため、
 * 全件取得してクライアント側で除外する。
 */
export async function getOpenIssuesWithoutLabel(
  excludeLabel: string,
  limit = 30
): Promise<GitHubIssue[]> {
  const all = await getOpenIssues({ limit });
  return all.filter((issue) => !issue.labels.some((l) => l.name === excludeLabel));
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
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * 単一 Issue の詳細を取得。
 * Missions 階層の「Task → Details（checkbox）」表示に使う。
 */
export async function getIssue(issueNumber: number): Promise<GitHubIssue | null> {
  const res = await fetch(`${API_BASE}/issues/${issueNumber}`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
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
