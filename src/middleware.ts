import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASIC_AUTH_USER = 'admin';

export function middleware(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  if (!password) {
    return new NextResponse('SITE_PASSWORD が設定されていません', { status: 503 });
  }

  const expected = 'Basic ' + Buffer.from(`${BASIC_AUTH_USER}:${password}`).toString('base64');
  const authHeader = request.headers.get('authorization');

  if (authHeader !== expected) {
    return new NextResponse('認証が必要です', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="markdown-editor"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
