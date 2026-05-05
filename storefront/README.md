# Mightyfull Storefront

The customer-facing ecommerce site for Mightyfull, a protein cookie brand.

This app owns the buying experience: homepage, shop listing, product detail pages, cart, checkout handoff, reviews, contact, FAQs, and policies.

## Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Shopify Storefront API for products, cart, checkout, and selling plans
- Sanity for editorial content, page content, product enrichment, FAQs, specs, and layout data
- Okendo for product reviews
- Klaviyo for marketing/contact integrations
- Tailwind CSS 4 plus CSS modules
- Vercel for deployment

## Repo Shape

This app lives inside a pnpm workspace.

```txt
mightyfull-shop/
  storefront/   Next.js storefront
  studio/       Sanity Studio
```

The storefront should be treated as the production web app. The studio is the content operating system behind it.

## Local Development

Install dependencies from the workspace root:

```bash
pnpm install
```

Run the storefront:

```bash
pnpm dev:storefront
```

Run Sanity Studio in a separate terminal when content editing is needed:

```bash
pnpm dev:studio
```

## Environment

The storefront needs Shopify, Sanity, Okendo, and Klaviyo configuration.

Expected variables:

```bash
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_REVALIDATION_SECRET=

SANITY_PROJECT_ID=
SANITY_PROJECT_TITLE=
SANITY_HOOK_SECRET=
SANITY_API_VERSION=
SANITY_DATASET=
SANITY_API_TOKEN=

OKENDO_USER_ID=
NEXT_PUBLIC_OKENDO_USER_ID=

KLAVIYO_PRIVATE_API_KEY=
```

Local env files currently live in `storefront/.env` and `storefront/.env.local`.

## Commands

From the workspace root:

```bash
pnpm dev:storefront
pnpm build:storefront
pnpm dev:studio
pnpm build:studio
pnpm deploy:studio
```

From this directory:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm tsc
```

## Testing

The storefront has a modern test spine with three layers:

- Vitest for unit and component tests
- React Testing Library for user-facing component behavior
- Playwright for browser cart flows
- MSW for reusable API mocks

Run the fast suite:

```bash
pnpm test:unit
```

Run TypeScript, unit/component tests, and the gated browser smoke:

```bash
pnpm test:ci
```

Run browser cart tests against a real product:

```bash
RUN_E2E=true E2E_PRODUCT_SLUG=your-product-handle pnpm test:e2e
```

Run Shopify Storefront API cart contract tests against a real test product:

```bash
TEST_SHOPIFY_VARIANT_ID=gid://shopify/ProductVariant/... \
TEST_SHOPIFY_SELLING_PLAN_ID=gid://shopify/SellingPlan/... \
pnpm test:contract:shopify
```

`TEST_SHOPIFY_SELLING_PLAN_ID` is optional. If it is not set, the subscription-specific contract is skipped.

## Runtime Responsibilities

Shopify is the source of truth for:

- Product commerce data
- Variants
- Availability
- Cart mutations
- Checkout
- Selling plans/subscriptions

Sanity is the source of truth for:

- Homepage and layout content
- Product page editorial content
- Product imagery and specs
- FAQs
- Testimonials
- Policy content
- Contact submissions

Next.js composes those systems into the storefront and handles cache revalidation through `app/api/revalidate`.

## Deployment

The workspace deploys the storefront to Vercel. The root `vercel.json` builds this package with:

```bash
pnpm --filter storefront build
```

Output directory:

```txt
storefront/.next
```
