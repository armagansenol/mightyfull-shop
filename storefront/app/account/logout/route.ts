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

  // Belt-and-suspenders: also delete the cookies on the response object.
  // In route handlers, cookies() modifications don't always merge into a
  // NextResponse.redirect(), so we attach them explicitly.
  const response = NextResponse.redirect(target);
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(FLOW_COOKIE);
  // Mark the next /account/login attempt as post-logout so it forces a
  // fresh credential prompt at Shopify regardless of SSO state.
  response.cookies.set(FORCE_REAUTH_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5
  });
  return response;
}
