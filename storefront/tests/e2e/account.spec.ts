import { expect, test } from '@playwright/test';

const shouldRun = process.env.RUN_E2E === 'true';

const protectedPaths = [
  '/account',
  '/account/profile',
  '/account/orders',
  '/account/addresses',
  '/account/subscriptions'
];

test.describe('account route protection (unauthenticated)', () => {
  test.skip(
    !shouldRun,
    'Set RUN_E2E=true to run account E2E tests'
  );

  test.beforeEach(async ({ context }) => {
    // Belt and suspenders: ensure the customer session cookie is absent.
    await context.clearCookies();
  });

  for (const path of protectedPaths) {
    test(`${path} bounces unauthed visitor through login → Shopify`, async ({
      page
    }) => {
      const response = await page.goto(path, { waitUntil: 'commit' });
      expect(response, `expected a navigation response for ${path}`).not.toBeNull();

      // Wait for the redirect chain (proxy -> /account/login -> Shopify).
      await page.waitForURL(/shopify\.com\/authentication\/.*\/oauth\/authorize/, {
        timeout: 15_000
      });

      const url = new URL(page.url());
      expect(url.host).toBe('shopify.com');
      expect(url.pathname).toMatch(
        /^\/authentication\/\d+\/oauth\/authorize$/
      );

      // Authorize URL should carry PKCE + return_to data.
      expect(url.searchParams.get('client_id')).toBeTruthy();
      expect(url.searchParams.get('code_challenge')).toBeTruthy();
      expect(url.searchParams.get('code_challenge_method')).toBe('S256');
      expect(url.searchParams.get('state')).toBeTruthy();
      expect(url.searchParams.get('redirect_uri')).toContain(
        '/account/callback'
      );
    });
  }

  test('/account/login redirects to Shopify directly', async ({ page }) => {
    await page.goto('/account/login', { waitUntil: 'commit' });
    await page.waitForURL(/shopify\.com\/authentication\/.*\/oauth\/authorize/, {
      timeout: 15_000
    });
    expect(new URL(page.url()).host).toBe('shopify.com');
  });

  test('/account/callback without code returns 400', async ({ request }) => {
    const response = await request.get('/account/callback', {
      maxRedirects: 0
    });
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('error');
  });
});

// Authenticated flow tests (login → orders, profile edit, address CRUD,
// subscription manage) require a Customer Account API session cookie and
// would run against a real Shopify customer. Enabling them needs:
//   1. A stable test customer email on the dev shop.
//   2. Either:
//      (a) Automating Shopify's email-code login in Playwright, fetching
//          the code from a test mailbox (Mailosaur/IMAP), saving the
//          storage state, and sharing it via tests/e2e/.auth/customer.json
//          + projects[].dependencies in playwright.config.ts; OR
//      (b) Encrypting a fresh CustomerSession ourselves with the project
//          SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET, then setting the
//          cookie via context.addCookies() before each test. Tokens still
//          have to come from a real OAuth dance; we'd refresh them in a
//          Playwright global-setup script.
// Tracking as Phase 6 follow-up — the route protection tests above
// already validate the proxy + middleware contract end-to-end, which is
// the part most likely to regress on a refactor.
