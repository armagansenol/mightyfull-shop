import { NextResponse } from 'next/server';
import {
  clearFlowState,
  getFlowState,
  setSession
} from '@/lib/shopify/customer-account/session';
import { exchangeCodeForTokens } from '@/lib/shopify/customer-account/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  if (error) {
    const message = errorDescription ?? error;
    return NextResponse.redirect(
      `${url.origin}/account/login?error=${encodeURIComponent(message)}`
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: 'Missing code or state' },
      { status: 400 }
    );
  }

  const flow = await getFlowState();
  if (!flow || flow.state !== state) {
    return NextResponse.json(
      { error: 'Invalid OAuth state' },
      { status: 400 }
    );
  }

  try {
    const session = await exchangeCodeForTokens({
      code,
      codeVerifier: flow.codeVerifier,
      redirectUri: `${url.origin}/account/callback`
    });

    await setSession(session);
    await clearFlowState();

    return NextResponse.redirect(`${url.origin}${flow.returnTo ?? '/account'}`);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Authentication failed';
    return NextResponse.redirect(
      `${url.origin}/account/login?error=${encodeURIComponent(message)}`
    );
  }
}
