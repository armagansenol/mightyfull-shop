import { customerAccountConfig } from './config';
import { getSession, setSession } from './session';
import { isExpiringSoon, refreshTokens } from './tokens';
import type { CustomerSession } from './types';

export class CustomerAccountAPIError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CustomerAccountAPIError';
    this.status = status;
  }
}

async function tryPersistSession(session: CustomerSession): Promise<void> {
  // setSession only succeeds in contexts that can write cookies (server
  // actions, route handlers). In server components it throws. Either way
  // the in-memory refreshed token works for the current request — we just
  // can't always persist it across requests.
  try {
    await setSession(session);
  } catch {
    /* server component — cookie write not allowed; ignore */
  }
}

async function fetchAPI(
  accessToken: string,
  body: string
): Promise<Response> {
  return fetch(customerAccountConfig.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken
    },
    body
  });
}

export async function customerQuery<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
  accessToken?: string;
}): Promise<T> {
  const body = JSON.stringify({
    query: params.query,
    variables: params.variables ?? {}
  });

  let accessToken = params.accessToken;
  let currentSession: CustomerSession | null = null;

  if (!accessToken) {
    currentSession = await getSession();
    if (!currentSession) {
      throw new CustomerAccountAPIError('No active customer session', 401);
    }

    if (isExpiringSoon(currentSession)) {
      try {
        const refreshed = await refreshTokens(currentSession.refreshToken);
        await tryPersistSession(refreshed);
        currentSession = refreshed;
      } catch {
        /* refresh failed; fall through and let the API tell us 401 */
      }
    }

    accessToken = currentSession.accessToken;
  }

  let response = await fetchAPI(accessToken, body);

  if (response.status === 401 && !params.accessToken && currentSession) {
    try {
      const refreshed = await refreshTokens(currentSession.refreshToken);
      await tryPersistSession(refreshed);
      response = await fetchAPI(refreshed.accessToken, body);
    } catch {
      /* refresh failed; will throw below */
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new CustomerAccountAPIError(
      `Customer Account API ${response.status}: ${text}`,
      response.status
    );
  }

  const json = (await response.json()) as { data?: T; errors?: unknown };

  if (json.errors) {
    throw new CustomerAccountAPIError(
      `Customer Account GraphQL: ${JSON.stringify(json.errors)}`
    );
  }

  return json.data as T;
}
