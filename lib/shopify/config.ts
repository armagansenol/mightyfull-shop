import { ensureStartsWith } from 'lib/utils';
import { SHOPIFY_GRAPHQL_API_ENDPOINT } from 'lib/constants';

export enum CacheStrategy {
  NO_CACHE = 'no-cache',
  NO_STORE = 'no-store',
  FORCE_CACHE = 'force-cache'
}

export const SHOPIFY_CONFIG = {
  domain: process.env.SHOPIFY_STORE_DOMAIN
    ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
    : '',
  endpoint: `${process.env.SHOPIFY_STORE_DOMAIN ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://') : ''}${SHOPIFY_GRAPHQL_API_ENDPOINT}`,
  accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  defaultCache: CacheStrategy.NO_CACHE,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token':
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
  }
} as const;
