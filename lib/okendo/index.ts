const okendoUserId = process.env.NEXT_PUBLIC_OKENDO_USER_ID;
const BASE_URL = `https://api.okendo.io/v1/stores/${okendoUserId}`;

type FetchOptions = RequestInit & {
  cache?: RequestCache;
};

export async function okendoFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_OKENDO_USER_ID) {
    throw new Error('NEXT_PUBLIC_OKENDO_USER_ID is not configured');
  }

  const defaultOptions: FetchOptions = {
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, mergedOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Okendo API error:', error);
    throw error instanceof Error
      ? error
      : new Error('Unknown error occurred while fetching from Okendo API');
  }
}
