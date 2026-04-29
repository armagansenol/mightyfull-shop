import { SHOPIFY_GRAPHQL_API_ENDPOINT } from 'lib/constants';
import { ensureStartsWith } from 'lib/utils';

export enum CacheStrategy {
  NO_CACHE = 'no-cache',
  NO_STORE = 'no-store',
  FORCE_CACHE = 'force-cache'
}

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error(
    'Missing SHOPIFY_STORE_DOMAIN environment variable. Your site will not work without it.'
  );
}

if (!accessToken) {
  throw new Error(
    'Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable. Your site will not work without it.'
  );
}

const shopifyDomain = ensureStartsWith(domain, 'https://');

export const SHOPIFY_CONFIG = {
  domain: shopifyDomain,
  endpoint: `${shopifyDomain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`,
  accessToken,
  defaultCache: CacheStrategy.NO_CACHE,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': accessToken
  }
} as const;
