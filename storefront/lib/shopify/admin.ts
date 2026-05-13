const SHOPIFY_API_VERSION = '2026-04';

export class AdminAPIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'AdminAPIError';
  }
}

export async function adminQuery<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

  if (!shopDomain || !adminToken) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN');
  }

  const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new AdminAPIError(response.status, text);
  }

  const json = (await response.json()) as { data?: T; errors?: unknown };

  if (json.errors) {
    throw new Error(`Admin API errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}
