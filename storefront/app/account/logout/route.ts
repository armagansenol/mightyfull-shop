import { NextResponse } from 'next/server';
import {
  clearSession,
  FLOW_COOKIE,
  FORCE_REAUTH_COOKIE,
  getSession,
  SESSION_COOKIE
} from '@/lib/shopify/customer-account/session';
import { buildLogoutUrl } from '@/lib/shopify/customer-account/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const isProd = process.env.NODE_ENV === 'production';

// Browsers will only delete a cookie when the Set-Cookie deletion header
// matches the original write attributes (path, domain, secure, sameSite).
// `response.cookies.delete(name)` doesn't always echo all of those, so we
// expire the cookie explicitly with the exact attributes used at set time.
const EXPIRE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
  expires: new Date(0)
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getSession();

  // Clear via the cookies() API (covers most cases).
  await clearSession();

  // If Shopify SSO is still alive when /account/login fires next, the IdP
  // would silently re-authorize us. Sending the user through Shopify's
  // logout endpoint with id_token_hint kills that SSO session — but only
  // if post_logout_redirect_uri is allowlisted on the Customer Account app.
  const target = session?.idToken
    ? buildLogoutUrl(session.idToken, `${url.origin}/`)
    : `${url.origin}/`;

  const response = NextResponse.redirect(target);
  // Force-expire the auth cookies with full attribute match.
  response.cookies.set(SESSION_COOKIE, '', EXPIRE_OPTIONS);
  response.cookies.set(FLOW_COOKIE, '', EXPIRE_OPTIONS);
  // Mark the next /account/login attempt as post-logout so it forces a
  // fresh credential prompt at Shopify regardless of SSO state.
  response.cookies.set(FORCE_REAUTH_COOKIE, '1', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5
  });
  return response;
}
