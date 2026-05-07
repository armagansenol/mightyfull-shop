function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const customerAccountConfig = {
  get clientId() {
    return requireEnv('SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID');
  },
  get authUrl() {
    return requireEnv('SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL');
  },
  get apiUrl() {
    return requireEnv('SHOPIFY_CUSTOMER_ACCOUNT_API_URL');
  },
  get sessionSecret() {
    return requireEnv('SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET');
  },
  get shopId() {
    return requireEnv('NEXT_PUBLIC_SHOPIFY_SHOP_ID');
  }
};

export const CUSTOMER_ACCOUNT_SCOPES = [
  'openid',
  'email',
  'customer-account-api:full'
].join(' ');

export const CUSTOMER_ACCOUNT_API_VERSION = '2025-10';
