import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from 'node:crypto';
import { cookies } from 'next/headers';
import { customerAccountConfig } from './config';
import { FLOW_COOKIE, SESSION_COOKIE } from './cookies';
import type { AuthorizationFlowState, CustomerSession } from './types';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export { FLOW_COOKIE, SESSION_COOKIE };

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const FLOW_MAX_AGE = 60 * 10;

function getKey(): Buffer {
  const buf = Buffer.from(customerAccountConfig.sessionSecret, 'hex');
  if (buf.length !== 32) {
    throw new Error(
      'SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET must be 32 bytes (64 hex characters). Generate with `openssl rand -hex 32`.'
    );
  }
  return buf;
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Buffer {
  const padding = (4 - (str.length % 4)) % 4;
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding);
  return Buffer.from(padded, 'base64');
}

function encrypt<T>(payload: T): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return base64UrlEncode(Buffer.concat([iv, tag, ciphertext]));
}

function decrypt<T>(token: string): T | null {
  try {
    const key = getKey();
    const buf = base64UrlDecode(token);
    const iv = buf.subarray(0, IV_LENGTH);
    const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const ciphertext = buf.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
    return JSON.parse(decrypted.toString('utf8')) as T;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return decrypt<CustomerSession>(cookie.value);
}

export async function setSession(session: CustomerSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encrypt(session), {
    ...baseCookieOptions,
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getFlowState(): Promise<AuthorizationFlowState | null> {
  const store = await cookies();
  const cookie = store.get(FLOW_COOKIE);
  if (!cookie?.value) return null;
  return decrypt<AuthorizationFlowState>(cookie.value);
}

export async function setFlowState(state: AuthorizationFlowState): Promise<void> {
  const store = await cookies();
  store.set(FLOW_COOKIE, encrypt(state), {
    ...baseCookieOptions,
    maxAge: FLOW_MAX_AGE
  });
}

export async function clearFlowState(): Promise<void> {
  const store = await cookies();
  store.delete(FLOW_COOKIE);
}
