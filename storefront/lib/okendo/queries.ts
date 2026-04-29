import { okendoFetch } from '.';
import type { ReviewData } from './types';

export const DEFAULT_LIMIT = 10;
const DEFAULT_ORDER = 'date desc';

export const apiService = {
  getReviews: (
    productId: string,
    limit = DEFAULT_LIMIT,
    orderBy = DEFAULT_ORDER,
    offset = 0
  ) => {
    const params = new URLSearchParams({
      limit: String(limit),
      orderBy,
      ...(offset > 0 && { offset: String(offset) })
    });
    return okendoFetch<ReviewData>(
      `/products/shopify-${productId}/reviews?${params.toString()}`
    );
  }
};

export const getReviews = (
  productId: string,
  options?: { limit?: number; orderBy?: string; offset?: number }
) =>
  apiService.getReviews(
    productId,
    options?.limit,
    options?.orderBy,
    options?.offset
  );
