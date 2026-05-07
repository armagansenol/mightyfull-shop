import { NextResponse } from 'next/server';
import {
  clearSession,
  getSession
} from '@/lib/shopify/customer-account/session';
import { buildLogoutUrl } from '@/lib/shopify/customer-account/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getSession();
  await clearSession();

  if (!session?.idToken) {
    return NextResponse.redirect(`${url.origin}/`);
  }

  const logoutUrl = buildLogoutUrl(session.idToken, `${url.origin}/`);
  return NextResponse.redirect(logoutUrl);
}
