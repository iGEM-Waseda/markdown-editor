import { NextResponse } from 'next/server';
import { encodeGithubPath, isValidTargetDir } from '@/lib/wiki';

const GITHUB_API = 'https://api.github.com';

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.WIKI_REPO_OWNER || 'iGEM-Waseda';
  const repo = process.env.WIKI_REPO_NAME || 'wiki_2026_manuscript';
  const branch = process.env.WIKI_REPO_BRANCH || 'main';

  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN が設定されていません' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') ?? '';

  if (!isValidTargetDir(path)) {
    return NextResponse.json({ error: '不正なパスです' }, { status: 400 });
  }

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeGithubPath(path)}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  );

  if (res.status === 404) {
    return NextResponse.json({ directories: [] });
  }
  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: `ディレクトリ一覧の取得に失敗しました: ${detail}` }, { status: 502 });
  }

  const data = await res.json();
  const directories = Array.isArray(data)
    ? data
        .filter((item: { type: string }) => item.type === 'dir')
        .map((item: { name: string }) => item.name)
    : [];

  return NextResponse.json({ directories });
}
