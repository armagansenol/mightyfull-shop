import { customerAccountConfig } from './config';
import { getSession } from './session';

export class CustomerAccountAPIError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CustomerAccountAPIError';
    this.status = status;
  }
}

export async function customerQuery<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
  accessToken?: string;
}): Promise<T> {
  let accessToken = params.accessToken;

  if (!accessToken) {
    const session = await getSession();
    if (!session) {
      throw new CustomerAccountAPIError('No active customer session', 401);
    }
    accessToken = session.accessToken;
  }

  const response = await fetch(customerAccountConfig.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken
    },
    body: JSON.stringify({
      query: params.query,
      variables: params.variables ?? {}
    })
  });

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
