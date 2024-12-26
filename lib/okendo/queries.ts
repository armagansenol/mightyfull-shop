import { okendoFetch } from '.';
import { ReviewData } from './types';

export const DEFAULT_LIMIT = 1;
const DEFAULT_ORDER = 'date desc';

export const apiService = {
  getReviews: (
    productId: string,
    limit = DEFAULT_LIMIT,
    orderBy = DEFAULT_ORDER,
  ) =>
    okendoFetch<ReviewData>(
      `/products/shopify-${productId}/reviews?limit=${limit}&orderBy=${encodeURIComponent(orderBy)}`,
    ),
};

export const getReviews = (
  productId: string,
  options?: { limit?: number; orderBy?: string },
) => apiService.getReviews(productId, options?.limit, options?.orderBy);
