import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

function buildFileName(originalName: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const safeName = (originalName || 'manuscript.md').replace(/[\\/:*?"<>|]/g, '_');
  return `${timestamp}_${safeName}`;
}

export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.WIKI_REPO_OWNER || 'iGEM-Waseda';
  const repo = process.env.WIKI_REPO_NAME || 'wiki_2026_manuscript';
  const branch = process.env.WIKI_REPO_BRANCH || 'main';

  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN が設定されていません' }, { status: 500 });
  }

  const { fileName, content } = (await request.json()) as { fileName?: string; content?: string };
  if (typeof content !== 'string' || content.length === 0) {
    return NextResponse.json({ error: '原稿の内容が空です' }, { status: 400 });
  }

  const path = buildFileName(fileName ?? 'manuscript.md');
  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  const commitRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({
        message: `原稿追加: ${path}`,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        branch,
      }),
    }
  );

  if (!commitRes.ok) {
    const detail = await commitRes.text();
    return NextResponse.json({ error: `GitHubへのpushに失敗しました: ${detail}` }, { status: 502 });
  }
  const commitData = await commitRes.json();
  const fileUrl: string = commitData.content?.html_url ?? '';

  const issueRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: ghHeaders,
    body: JSON.stringify({
      title: `原稿確認済み: ${fileName || path}`,
      body: `プレビューサイトで確認済みの原稿です。\n\n- ファイル: ${fileUrl}`,
    }),
  });

  if (!issueRes.ok) {
    const detail = await issueRes.text();
    return NextResponse.json(
      { error: `pushは成功しましたが、Issue作成に失敗しました: ${detail}`, fileUrl },
      { status: 502 }
    );
  }
  const issueData = await issueRes.json();

  return NextResponse.json({ fileUrl, issueUrl: issueData.html_url as string });
}
