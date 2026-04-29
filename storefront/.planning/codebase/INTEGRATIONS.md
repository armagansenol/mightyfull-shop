# External Integrations

**Analysis Date:** 2026-02-27

## APIs & External Services

**E-Commerce:**
- Shopify - Product catalog, shopping cart, inventory management
  - SDK/Client: `@shopify/storefront-api-client` 1.0.4, `@shopify/hydrogen-react` 2025.1.3
  - Auth: `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (public storefront token)
  - Endpoint: `SHOPIFY_STORE_DOMAIN` + GraphQL API v2024-10
  - Location: `lib/shopify/`
  - Operations: GraphQL queries/mutations for products, cart management, shop info

**Email Marketing & Notifications:**
- Klaviyo - Back-in-stock notifications and email marketing
  - SDK/Client: Direct fetch to `https://a.klaviyo.com/api/back-in-stock-subscriptions`
  - Auth: `KLAVIYO_PRIVATE_API_KEY` (server-side)
  - Revision: 2025-01-15 API version
  - Location: `lib/klaviyo/`
  - Operations: Server action in `lib/klaviyo/actions.ts` - `subscribeToBackInStock()`
  - Webhooks: Accepts back-in-stock subscription requests via POST

**Content Management:**
- Sanity - Headless CMS for content, pages, FAQs, testimonials
  - SDK/Client: `sanity` 3.61.0, `next-sanity` 9.8.36
  - Auth: `SANITY_API_TOKEN` (required for mutations via webhook)
  - Project: `SANITY_PROJECT_ID`
  - Dataset: `SANITY_DATASET` (typically "production")
  - API Version: `SANITY_API_VERSION` (2023-10-23)
  - Endpoint: `https://{projectId}.api.sanity.io/v{version}/data/mutate/{dataset}`
  - Location: `lib/sanity/`
  - Client config: `lib/sanity/client.ts` with caching strategy
  - Webhook secret: `SANITY_HOOK_SECRET` for validating incoming webhooks
  - Operations: Fetch queries cached, mutations for contact form submissions

**Reviews & Social Proof:**
- Okendo - Customer reviews and ratings widget
  - SDK/Client: `https://api.okendo.io/v1/stores/{userId}` API
  - Auth: Public store ID `NEXT_PUBLIC_OKENDO_USER_ID` (public, no secret required)
  - Subscriber ID: `OKENDO_USER_ID` (meta tag in layout)
  - Location: `lib/okendo/`
  - Widget: Embedded script from `https://cdn-static.okendo.io/reviews-widget-plus/js/okendo-reviews.js`
  - Operations: Fetch reviews by product ID via `getReviews()` in `lib/okendo/queries.ts`
  - Widget container: `components/okendo-widget/index.tsx`

## Data Storage

**Databases:**
- Sanity - Primary content database
  - Type: Headless CMS with JSON-based content
  - Connection: REST API via HTTP/HTTPS
  - Client: `@sanity/client` with TypeScript types
  - Caching: Development uses CDN (`useCdn: true`), Production uses live API (`useCdn: false`)
  - Query language: GROQ (Sanity Query Language)

**File Storage:**
- Sanity Media - Images and assets
  - Storage: Sanity CDN (`cdn.sanity.io`)
  - Access: Remote image pattern configured in Next.js
- Shopify CDN - Product images
  - Storage: Shopify product images (`cdn.shopify.com`)
  - Access: Remote image pattern configured in Next.js

**Caching:**
- Next.js Data Cache
  - Strategy: Tag-based revalidation for Shopify and Sanity content
  - Tags used: `products`, `cart`, document types from Sanity (`layout`, `faq`, etc.)
- TanStack React Query 5.59.20
  - Client-side caching and synchronization
  - Stale-while-revalidate patterns

## Authentication & Identity

**Auth Provider:**
- Custom/None - No unified auth system detected
- Shopify Storefront API authentication:
  - Public storefront token via header: `X-Shopify-Storefront-Access-Token`
  - No user login required (anonymous cart-based flow)
- Sanity authentication:
  - API token for server-side mutations only (`SANITY_API_TOKEN`)
  - Contact form submissions use token bearer authentication

**Session Management:**
- Cart ID persisted in cookies: `cartId` cookie (managed in `components/cart/actions.ts`)
- No user authentication layer detected

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or equivalent configured

**Logging:**
- Console logging (standard `console.log`, `console.error`)
- Custom logger for Shopify: `lib/shopify/logger.ts` with performance metrics
- Error boundaries: Implicit via Next.js error handling

**Analytics:**
- Okendo integration includes analytics via reviews widget
- No explicit Google Analytics, Mixpanel, or similar detected

## CI/CD & Deployment

**Hosting:**
- Vercel-optimized (Next.js native support)
- Self-hosted Node.js compatible (standard Next.js app)

**CI Pipeline:**
- Not detected in configuration files
- ESLint linting available via `npm run lint`
- TypeScript checking available via `npm run tsc`

**Revalidation Webhooks:**
- Sanity webhook at `POST /api/revalidate`
  - Signature validation via `SANITY_HOOK_SECRET`
  - Tag-based revalidation of Next.js cached content
  - Document type detection from webhook payload

## Environment Configuration

**Required env vars:**

**Shopify:**
- `SHOPIFY_STORE_DOMAIN` - Store domain (e.g., `store.example.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Public API token for GraphQL queries
- `SHOPIFY_REVALIDATION_SECRET` - Webhook secret (optional, commented out in code)

**Sanity:**
- `SANITY_PROJECT_ID` - Sanity project identifier
- `SANITY_DATASET` - Dataset name (typically "production")
- `SANITY_API_VERSION` - API version date (e.g., "2023-10-23")
- `SANITY_API_TOKEN` - Bearer token for mutations and webhooks
- `SANITY_HOOK_SECRET` - Webhook signature validation key

**Klaviyo:**
- `KLAVIYO_PRIVATE_API_KEY` - Server-side API key for back-in-stock subscriptions

**Okendo:**
- `NEXT_PUBLIC_OKENDO_USER_ID` - Public store ID (safe for client-side)
- `OKENDO_USER_ID` - Optional, same as above (used in meta tag)

**Build/Runtime:**
- `NODE_ENV` - Environment mode (development/production)

**Secrets location:**
- `.env` file (Git-ignored, contains secrets) - Present
- `.env.local` file (local overrides) - Present
- Variables NOT in version control (standard .gitignore)

## Webhooks & Callbacks

**Incoming:**
- Sanity Webhook: `POST /api/revalidate`
  - Triggered on: Document create/update/delete in Sanity CMS
  - Payload: Document type and slug
  - Validation: HMAC signature with `SANITY_HOOK_SECRET`
  - Response: Revalidates Next.js cache by tag
  - Location: `app/api/revalidate/route.ts`

**Outgoing:**
- None detected
- Commented-out Shopify webhook revalidation code in `lib/shopify/index.ts` (lines 252-290)
  - Would handle: Collection and product updates from Shopify
  - Secret validation: `SHOPIFY_REVALIDATION_SECRET`
  - Status: Currently disabled (commented code)

## Data Flow

**Product Display:**
1. Shopify GraphQL Query → `lib/shopify/index.ts` → Transformed to Product type → Components
2. Product metadata (description, specs) → Sanity GROQ Query → `lib/sanity/productDetail.ts` → Components

**Content Pages:**
1. Sanity GROQ Query → `lib/sanity/client.ts` sanityFetch() → Next.js cache with tags → Page components
2. Revalidation: Sanity webhook → `/api/revalidate` → `revalidateTag()` → Cache bust

**Shopping Cart:**
1. Create cart: Shopify mutation → Cookie store (`cartId`) → Client cache via React Query
2. Add/Remove items: Shopify mutation → Cart ID from cookie → Updated cart returned

**Contact Form:**
1. Form submission → `POST /api/contact` → Sanity mutation → Document created in CMS
2. Response: Success/error to client via JSON

**Back-in-Stock:**
1. User email submission → `subscribeToBackInStock()` action → Klaviyo API POST
2. Klaviyo variant ID format: `$shopify:::$default:::{numericVariantId}`

**Reviews Display:**
1. Product page load → `lib/okendo/queries.ts` getReviews() → API call to `api.okendo.io`
2. Widget embed: Script tag loads Okendo widget with subscriber ID from meta tag

---

*Integration audit: 2026-02-27*
