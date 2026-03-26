import { GitHubIssue } from './types';

export async function getOpenIssues(): Promise<GitHubIssue[]> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(
    'https://api.github.com/repos/kkkkkkkkkk0084/life-os/issues?state=open&per_page=20',
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}
