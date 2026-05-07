import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/shopify/customer-account/cookies';

export const config = {
  matcher: ['/account/((?!login|callback|logout).*)', '/account']
};

export function proxy(request: NextRequest) {
  // Only gate top-level page navigations. Server-action POSTs hit the same
  // page URL but must reach the route handler so a missing/expired session
  // returns a graceful error instead of 307 -> /account/login -> 405.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE);

  if (!cookie?.value) {
    const loginUrl = new URL('/account/login', request.url);
    loginUrl.searchParams.set('return_to', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
