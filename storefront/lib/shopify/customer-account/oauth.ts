import { createHash, randomBytes } from 'node:crypto';
import type { PKCEParams } from './types';

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeVerifier(): string {
  return base64UrlEncode(randomBytes(32));
}

export function generateCodeChallenge(verifier: string): string {
  return base64UrlEncode(createHash('sha256').update(verifier).digest());
}

export function generateState(): string {
  return base64UrlEncode(randomBytes(16));
}

export function generateNonce(): string {
  return base64UrlEncode(randomBytes(16));
}

export function generatePKCE(): PKCEParams {
  const codeVerifier = generateCodeVerifier();
  return {
    codeVerifier,
    codeChallenge: generateCodeChallenge(codeVerifier),
    state: generateState(),
    nonce: generateNonce()
  };
}
