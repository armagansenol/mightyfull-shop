import { customerAccountConfig } from './config';
import type { CustomerSession, ShopifyTokenResponse } from './types';

function getTokenEndpoint(): string {
  // Shopify's Customer Account API exposes /authorize and /token at the same
  // base URL. We derive token URL from the configured authorize URL.
  return customerAccountConfig.authUrl.replace(/\/authorize\/?$/, '/token');
}

function getLogoutEndpoint(): string {
  // Logout sits one level above /oauth/, e.g.:
  //   https://shopify.com/authentication/{shop_id}/oauth/authorize  ->
  //   https://shopify.com/authentication/{shop_id}/logout
  return customerAccountConfig.authUrl.replace(
    /\/oauth\/authorize\/?$/,
    '/logout'
  );
}

function tokenResponseToSession(data: ShopifyTokenResponse): CustomerSession {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    idToken: data.id_token
  };
}

export async function exchangeCodeForTokens(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<CustomerSession> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: customerAccountConfig.clientId,
    code: params.code,
    code_verifier: params.codeVerifier,
    redirect_uri: params.redirectUri
  });

  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${text}`);
  }

  return tokenResponseToSession((await response.json()) as ShopifyTokenResponse);
}

export async function refreshTokens(
  refreshToken: string
): Promise<CustomerSession> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: customerAccountConfig.clientId,
    refresh_token: refreshToken
  });

  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${text}`);
  }

  return tokenResponseToSession((await response.json()) as ShopifyTokenResponse);
}

export function buildLogoutUrl(idToken: string, postLogoutRedirect: string): string {
  const url = new URL(getLogoutEndpoint());
  url.searchParams.set('id_token_hint', idToken);
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirect);
  return url.toString();
}

const REFRESH_BUFFER_MS = 60_000;

export function isExpiringSoon(session: CustomerSession): boolean {
  return Date.now() >= session.expiresAt - REFRESH_BUFFER_MS;
}
