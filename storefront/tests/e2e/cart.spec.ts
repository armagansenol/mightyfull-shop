import { expect, test } from '@playwright/test';

const shouldRun = process.env.RUN_E2E === 'true';
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const variantId = process.env.TEST_SHOPIFY_VARIANT_ID;
const appBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL ??
  `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? 3100}`;

async function createShopifyCart() {
  if (!storeDomain || !accessToken) {
    throw new Error('Missing Shopify credentials for E2E cart setup.');
  }

  const domain = storeDomain.startsWith('https://')
    ? storeDomain
    : `https://${storeDomain}`;
  const response = await fetch(`${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken
    },
    body: JSON.stringify({
      query: `#graphql
        mutation createCart {
          cartCreate {
            cart {
              id
            }
          }
        }
      `
    })
  });
  const body = await response.json();

  if (!response.ok || body.errors?.length) {
    throw new Error(body.errors?.[0]?.message ?? 'Failed to create cart.');
  }

  return body.data.cartCreate.cart.id as string;
}

async function addShopifyCartLine(cartId: string) {
  if (!storeDomain || !accessToken || !variantId) {
    throw new Error('Missing Shopify credentials or variant for E2E setup.');
  }

  const domain = storeDomain.startsWith('https://')
    ? storeDomain
    : `https://${storeDomain}`;
  const response = await fetch(`${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken
    },
    body: JSON.stringify({
      query: `#graphql
        mutation addCartLine($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              totalQuantity
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }]
      }
    })
  });
  const body = await response.json();

  if (!response.ok || body.errors?.length) {
    throw new Error(body.errors?.[0]?.message ?? 'Failed to seed cart.');
  }
}

test.describe('cart flow', () => {
  test.skip(!shouldRun, 'Set RUN_E2E=true to run browser cart tests.');
  test.skip(!variantId, 'Set TEST_SHOPIFY_VARIANT_ID to seed the cart.');

  test('loads a seeded cart and exposes checkout', async ({ page }) => {
    const cartId = await createShopifyCart();
    await addShopifyCartLine(cartId);

    await page.context().addCookies([
      {
        name: 'cartId',
        value: cartId,
        url: appBaseUrl,
        sameSite: 'Strict',
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
      }
    ]);

    await page.goto('/faq', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const cartTrigger = page
      .locator('nav button[aria-label^="Open shopping cart"]')
      .first();

    await expect(cartTrigger).toBeVisible();
    try {
      await expect(cartTrigger).toHaveAccessibleName(/1 unique item/i, {
        timeout: 10_000
      });
    } catch {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      await expect(cartTrigger).toHaveAccessibleName(/1 unique item/i);
    }
    await page.waitForTimeout(1_000);
    await cartTrigger.click();

    await expect(page.getByText(/your cart/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /proceed to checkout/i })
    ).toBeVisible();
  });
});
