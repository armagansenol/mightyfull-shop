import { MouseEvent } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Connection } from './shopify-test/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const breakpoints = {
  mobile: 800,
  tablet: 1024
};

export function lineBreak(text: string) {
  return text.replace('<br>', '\n');
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

export function capitalize(sentence: string): string {
  const words: string[] = sentence.split(' ');
  const capitalizedWords: string[] = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  const result: string = capitalizedWords.join(' ');
  return result;
}

export function shareOnSocialMedia(baseUrl: string) {
  const title = document.title;
  const text = 'Check this out!';
  const url = window.location.href;

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${location.pathname}`);
      console.log(
        'Content copied to clipboard',
        `${baseUrl}${location.pathname}`
      );
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (navigator.share !== undefined) {
    navigator
      .share({
        title,
        text,
        url
      })
      .then(() => console.log('Shared!'))
      .catch((err) => console.error(err));
  } else {
    // window.location.href = `mailto:?subject=${title}&body=${text}%0A${url}`
    copyContent();
  }
}

export function isEven(num: number) {
  if (num === 0) {
    return true;
  }

  if (num % 2 === 0) {
    return true;
  }

  return false;
}

export function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
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

export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

export function parseISOToDate(isoString: string): Date {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date string');
    }
    return date;
  } catch (error) {
    throw error;
  }
}

export function formatDate(
  inputDate: Date,
  thresholdDays: number = 10
): string {
  const now = new Date();
  const timeDifference = now.getTime() - inputDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  if (daysDifference === 0) {
    return 'Today';
  }

  if (daysDifference < thresholdDays) {
    return `${daysDifference} days ago`;
  }

  // Format as DD.MM.YYYY
  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = inputDate.getFullYear();
  return `${day}.${month}.${year}`;
}

export function extractShopifyId(gid: string): string {
  const matches = gid.match(/gid:\/\/shopify\/\w+\/(\d+)/);
  return matches?.[1] ?? '';
}
