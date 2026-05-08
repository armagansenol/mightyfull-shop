import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  CUSTOMER_ACCOUNT_SCOPES,
  customerAccountConfig
} from '@/lib/shopify/customer-account/config';
import { FORCE_REAUTH_COOKIE } from '@/lib/shopify/customer-account/cookies';
import { generatePKCE } from '@/lib/shopify/customer-account/oauth';
import { setFlowState } from '@/lib/shopify/customer-account/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('return_to') ?? '/account';
  const redirectUri = `${url.origin}/account/callback`;

  const pkce = generatePKCE();

  await setFlowState({
    codeVerifier: pkce.codeVerifier,
    state: pkce.state,
    nonce: pkce.nonce,
    returnTo
  });

  // If we just came out of /account/logout, force a fresh credential
  // prompt at Shopify even if their SSO cookie is still alive.
  const cookieStore = await cookies();
  const forceReauth = cookieStore.get(FORCE_REAUTH_COOKIE)?.value === '1';

  const authorizeUrl = new URL(customerAccountConfig.authUrl);
  authorizeUrl.searchParams.set('client_id', customerAccountConfig.clientId);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', CUSTOMER_ACCOUNT_SCOPES);
  authorizeUrl.searchParams.set('state', pkce.state);
  authorizeUrl.searchParams.set('nonce', pkce.nonce);
  authorizeUrl.searchParams.set('code_challenge', pkce.codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');
  if (forceReauth) {
    authorizeUrl.searchParams.set('prompt', 'login');
    authorizeUrl.searchParams.set('max_age', '0');
  }

  const response = NextResponse.redirect(authorizeUrl.toString());
  // One-shot consume — after this redirect we don't need the flag again.
  if (forceReauth) {
    response.cookies.delete(FORCE_REAUTH_COOKIE);
  }
  return response;
}
