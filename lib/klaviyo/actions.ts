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

    console.log('Sending request to Klaviyo:', JSON.stringify(requestBody));

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

    // Log request details (excluding sensitive info)
    console.log('Request URL:', url);
    console.log('Request headers:', {
      accept: options.headers.accept,
      revision: options.headers.revision,
      'content-type': options.headers['content-type'],
      // Don't log the full Authorization header
      Authorization: 'Klaviyo-API-Key [REDACTED]'
    });

    const response = await fetch(url, options);

    console.log('Response status:', response.status);
    console.log(
      'Response headers:',
      Object.fromEntries([...response.headers.entries()])
    );

    // Handle different response status codes
    if (response.status === 202) {
      // 202 Accepted - Request was successful but no content returned
      console.log('Back in stock subscription request accepted by Klaviyo');

      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }

      return {
        success: true,
        message: 'Your back in stock request has been submitted successfully.'
      };
    } else if (!response.ok) {
      // Handle error responses
      let errorText = '';
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch {
        errorText =
          (await response.text()) || `Status code: ${response.status}`;
      }

      throw new Error(`Klaviyo API error: ${errorText}`);
    } else {
      // Handle other successful responses (200 OK, etc.)
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
