import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/shopify/customer-account/cookies';

export const config = {
  matcher: ['/account/((?!login|callback|logout).*)', '/account']
};

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE);

  if (!cookie?.value) {
    const loginUrl = new URL('/account/login', request.url);
    loginUrl.searchParams.set('return_to', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
