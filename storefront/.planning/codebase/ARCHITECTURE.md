# Architecture

**Analysis Date:** 2026-02-27

## Pattern Overview

**Overall:** Hybrid Server/Client Composition with Headless CMS and E-commerce Backend

**Key Characteristics:**
- Server-side rendering and data fetching via Next.js 16 App Router
- Dual-backend integration: Sanity CMS for content, Shopify Storefront API for products
- Client-side state management for cart (React Context + Zustand)
- Composable UI layer with heavy animation focus (GSAP, Motion, Embla Carousel)
- Modular component architecture with shared utilities and contexts
- Server actions (`'use server'`) for mutations and form submissions

## Layers

**Presentation Layer:**
- Purpose: Display UI components, handle user interactions, manage client state
- Location: `components/`, `app/(main)/`
- Contains: React components (both client and server), styles (SCSS modules + Tailwind), animations
- Depends on: Types, Utils, Hooks, Providers (Cart, ReactQuery), External UI libraries (Radix UI, Lucide)
- Used by: Pages, other components

**Data Fetching & Integration Layer:**
- Purpose: Query and transform data from Shopify and Sanity APIs
- Location: `lib/shopify/`, `lib/sanity/`, `lib/actions/`, `lib/okendo/`, `lib/klaviyo/`
- Contains: Query builders, mutations, transformers, API clients, fragments
- Depends on: API configs, external SDK clients (@shopify/storefront-api-client, sanity client)
- Used by: Pages, server actions, client components

**Business Logic & State Layer:**
- Purpose: Manage cart operations, form submissions, state updates
- Location: `components/cart/`, `lib/store/`, `context/`, `components/providers/`
- Contains: Cart actions, reducers, contexts, Zustand stores
- Depends on: Shopify cart service, form libraries (react-hook-form), validation (Zod)
- Used by: Components, pages

**Configuration & Constants Layer:**
- Purpose: Centralize configuration and define app constants
- Location: `lib/constants.ts`, `tailwind.config.ts`, `next.config.mjs`, `tsconfig.json`
- Contains: Route definitions, color themes, breakpoints, API endpoints, cache strategies
- Depends on: Environment variables
- Used by: All layers

## Data Flow

**Product Catalog:**

1. Next.js page renders with `sanityFetch` to Sanity CMS for product metadata
2. `getProductHighlight()` server action fetches highlighted products from Sanity
3. For each Sanity product, `getProduct(slug)` fetches detailed Shopify data
4. ShopifyTransformer reshapes GraphQL response into app types
5. Components render combined Sanity + Shopify data (metadata + pricing/variants)
6. On navigation, revalidate tags trigger cache invalidation via `updateTag()`

**Shopping Cart:**

1. RootLayout initializes cart via `cartService.get(cartId)` from Shopify
2. Cart ID stored in HTTP-only cookie (30-day expiration)
3. User actions trigger server actions in `components/cart/actions.ts`
4. Server actions call `cartService` (add/remove/update mutations)
5. After mutation, `updateTag(TAGS.cart)` invalidates cart cache
6. CartProvider context broadcasts cart updates to client components
7. Client renders updated cart items via CartContext

**Form Submissions:**

1. Contact form uses `react-hook-form` + Zod validation
2. `useMutation` from @tanstack/react-query manages submission state
3. Form data POSTs to `app/api/contact/route.ts`
4. API handler writes document to Sanity via REST API mutation endpoint
5. Success/error state triggers Sonner toast notification

**State Management:**

- **Server State:** Next.js cache + revalidation tags (TAGS.cart, TAGS.products)
- **Client State:** React Context (LayoutData, Cart), Zustand (Modal store)
- **Request State:** React Query for async operations (reviews, forms)

## Key Abstractions

**CartService:**
- Purpose: Encapsulate all Shopify cart GraphQL operations
- Examples: `lib/shopify/index.ts` (cartService methods: create, get, add, remove, update)
- Pattern: Service pattern with memoization for cart operations, exponential backoff for retries

**Sanity Client:**
- Purpose: Centralize Sanity data fetching with Next.js cache integration
- Examples: `lib/sanity/client.ts` (sanityFetch function)
- Pattern: Generic fetch wrapper with tags for ISR/on-demand revalidation

**ShopifyTransformer:**
- Purpose: Reshape raw GraphQL responses into app-specific types
- Examples: `lib/shopify/transformers.ts`
- Pattern: Static transformer class with validation and reshaping methods

**Server Actions:**
- Purpose: Secure client→server bridge for mutations
- Examples: `components/cart/actions.ts` (addItem, removeItem, batchUpdateCart)
- Pattern: 'use server' functions with error handling, validation, and cleanup wrappers

**Component Providers:**
- Purpose: Setup global context and state management
- Examples: `components/providers/cart/`, `components/providers/react-query/`
- Pattern: Provider pattern wrapping children with context/query client

**Animation Wrappers:**
- Purpose: Manage GSAP timeline and scroll-trigger interactions
- Examples: `components/gsap/`, `components/letter-swap-forward/`
- Pattern: useGSAP hook with cleanup, ref-based DOM manipulation

## Entry Points

**App Root:**
- Location: `app/layout.tsx`
- Triggers: Server startup
- Responsibilities: Initialize RootLayout with Providers (ReactQuery, Cart, LayoutData), hydrate layout data from Sanity, setup error boundary

**Page Routes:**
- Location: `app/(main)/home/page.tsx`, `app/(main)/shop/[slug]/page.tsx`, etc.
- Triggers: Route navigation
- Responsibilities: Fetch page-specific data (Sanity + Shopify), render page layout within Wrapper component, pass data to child components

**API Routes:**
- Location: `app/api/contact/route.ts`, `app/api/revalidate/route.ts`
- Triggers: HTTP POST/GET requests
- Responsibilities: Handle form submissions, manage revalidation requests, persist data to Sanity

**Server Actions:**
- Location: `components/cart/actions.ts` (all exported async functions)
- Triggers: Client form submissions, button clicks
- Responsibilities: Validate input, call Shopify API, update cache, return success/error response

## Error Handling

**Strategy:** Multi-layer error handling with fallbacks and user-facing feedback

**Patterns:**

- **API Errors:** Try-catch blocks in server actions, format errors for toast display via `formatErrorForToast()`
- **Cart Operations:** `withCartCleanup()` wrapper ensures cart integrity; retry logic for transient failures (max 2 retries with 500ms delay)
- **GraphQL Errors:** `handleShopifyError()` extracts error messages from GraphQL response, logs via `shopifyLogger`
- **Validation Errors:** Zod schemas in forms validate before submission; errors surface in `<FormMessage>` components
- **Data Fetching:** Pages can handle undefined data gracefully (e.g., `if (!data) return null`)
- **Component-level:** Suspense boundaries for async components, Loading states (Loader2 spinner)

## Cross-Cutting Concerns

**Logging:**
- `lib/shopify/logger.ts` logs API calls with duration and variables for monitoring
- Console.error/log for development debugging, production error tracking via error boundaries

**Validation:**
- Server actions validate cart ID and item data before mutations
- Forms use Zod schema validation with react-hook-form integration
- API routes validate request body structure

**Authentication:**
- Shopify cart accessed via cartId cookie (no user auth required)
- Sanity API writes use environment variable token (Bearer auth in API routes)
- No user login system; anonymous cart-based shopping

**Caching:**
- Next.js default cache strategy with revalidation tags
- Development: `no-store` (no caching)
- Production: `force-cache` with ISR via tags
- Shopify requests: `no-store` (no caching) for cart operations, force-cache for product queries

**Styling:**
- Global SCSS in `styles/global.scss` + Tailwind via `styles/tailwind-initial.css`
- Module SCSS for component scoping (BEM naming convention)
- CSS custom properties for theme colors (--primary, --secondary, --tertiary)
- Dynamic color theme inheritance via Wrapper context consumer

**Performance:**
- Image optimization via Next.js Image component with remote CDN patterns
- Embla Carousel for touch-optimized product carousels
- GSAP ScrollTrigger for viewport-based animations
- Lenis for smooth scrolling
- React Query for client-side data caching and deduplication

---

*Architecture analysis: 2026-02-27*
