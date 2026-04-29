'use server';

import { revalidatePath } from 'next/cache';

export async function subscribeToBackInStock(
  email: string,
  variantId: string,
  revalidationPath?: string
) {
  try {
    const url = 'https://a.klaviyo.com/api/back-in-stock-subscriptions';

    // Extract just the numeric ID from the Shopify variant ID
    const numericId = variantId.split('/').pop() || '';

    // Use the $shopify:::$default::: format
    const klaviyoVariantId = `$shopify:::$default:::${numericId}`;

    const requestBody = {
      data: {
        type: 'back-in-stock-subscription',
        attributes: {
          channels: ['EMAIL'],
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
              id: klaviyoVariantId
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
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    };

    const response = await fetch(url, options);

    // Handle different response status codes
    if (response.status === 202) {
      // 202 Accepted - Request was successful but no content returned
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }

      return {
        success: true,
        message: 'Your back in stock request has been submitted successfully.'
      };
    } else if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => `Status code: ${response.status}`);
      throw new Error(`Klaviyo API error: ${errorText}`);
    } else {
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error('Error subscribing to back in stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
