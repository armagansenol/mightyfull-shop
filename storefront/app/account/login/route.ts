import { NextResponse } from 'next/server';
import {
  CUSTOMER_ACCOUNT_SCOPES,
  customerAccountConfig
} from '@/lib/shopify/customer-account/config';
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

  const authorizeUrl = new URL(customerAccountConfig.authUrl);
  authorizeUrl.searchParams.set('client_id', customerAccountConfig.clientId);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', CUSTOMER_ACCOUNT_SCOPES);
  authorizeUrl.searchParams.set('state', pkce.state);
  authorizeUrl.searchParams.set('nonce', pkce.nonce);
  authorizeUrl.searchParams.set('code_challenge', pkce.codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  return NextResponse.redirect(authorizeUrl.toString());
}
