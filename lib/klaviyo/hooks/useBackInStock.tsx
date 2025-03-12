import { useMutation } from '@tanstack/react-query';

interface BackInStockParams {
  email: string;
  variantId: string;
}

interface BackInStockResponse {
  data: {
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  };
}

export function useBackInStock() {
  return useMutation<BackInStockResponse, Error, BackInStockParams>({
    mutationFn: async ({ email, variantId }: BackInStockParams) => {
      const url = 'https://a.klaviyo.com/api/back-in-stock-subscriptions';

      // Prepare the request body
      const requestBody = {
        data: {
          type: 'back-in-stock-subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email
                }
              }
            }
          },
          relationships: {
            variant: {
              data: {
                type: 'catalog-variant',
                id: variantId
              }
            }
          }
        }
      };

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-01-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            'Failed to subscribe to back in stock notification'
        );
      }

      return response.json();
    }
  });
}
