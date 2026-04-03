import { type ClassValue, clsx } from 'clsx';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    'SANITY_PROJECT_ID',
    'KLAVIYO_PRIVATE_API_KEY',
    'NEXT_PUBLIC_OKENDO_USER_ID'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them.\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

export function parseISOToDate(isoString: string): Date {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }
  return date;
}

export function formatDate(
  inputDate: Date,
  thresholdDays: number = 10
): string {
  const now = new Date();
  const timeDifference = now.getTime() - inputDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return 'Today';
  }

  if (daysDifference < thresholdDays) {
    return `${daysDifference} days ago`;
  }

  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  const year = inputDate.getFullYear();
  return `${day}.${month}.${year}`;
}

export function extractShopifyId(gid: string): string {
  const matches = gid.match(/gid:\/\/shopify\/\w+\/(\d+)/);
  return matches?.[1] ?? '';
}
