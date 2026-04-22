# Codebase Concerns

**Analysis Date:** 2026-02-27

## Tech Debt

**Console logging in production code:**
- Issue: Extensive console.log/warn/error statements throughout codebase for debugging
- Files:
  - `components/cart/actions.ts` (32+ console.log calls in cleanupZeroQuantityItems and withCartCleanup functions)
  - `components/cart/cart-context.tsx` (10+ console.log calls in cartReducer)
  - `lib/shopify/logger.ts` (Logger doubles console output via shopifyLogger)
  - `app/api/contact/route.ts` (console.error)
  - `app/api/revalidate/route.ts` (console.error)
- Impact: Performance degradation in production, logs exposed to browser console, cluttered development experience
- Fix approach: Replace console statements with proper logging service (already has `shopifyLogger` but underutilized). Create centralized logging utility using `shopifyLogger` pattern for all modules. Remove debug statements from cart cleanup functions or gate them behind NODE_ENV checks.

**Large single file with multiple responsibilities:**
- Issue: `components/cart/actions.ts` contains 777 lines mixing cart operations, cleanup logic, error handling, and business logic
- Files: `components/cart/actions.ts`
- Impact: Difficult to test individual functions, high cognitive complexity, cart cleanup retry logic tightly coupled with operation execution
- Fix approach: Extract cleanup logic to separate file (`lib/cart/cleanup.ts`), extract operation wrappers to `lib/cart/wrappers.ts`, extract error formatting to `lib/utils/error.ts`. Create focused server actions that delegate to these utilities.

**Promise.all with null elements:**
- Issue: `components/cart/actions.ts` line 623-634 passes null to Promise.all in batchUpdateCart function
- Files: `components/cart/actions.ts`
- Impact: Null handling works but is non-idiomatic and reduces clarity
- Fix approach: Filter out null operations before Promise.all: `await Promise.all([...].filter(Boolean))` or use conditional execution pattern

**Inconsistent error handling patterns:**
- Issue: Multiple different error response formats across server actions
- Files:
  - `components/cart/actions.ts` returns plain strings in some functions (lines 299, 340, 465) but objects in others (lines 224-227)
  - `app/api/contact/route.ts` returns object structure but no input validation
  - `app/api/revalidate/route.ts` has any-typed error parameter (line 30)
- Impact: Client-side error handling fragile, difficult to build resilient UI, inconsistent error contract
- Fix approach: Create standardized error response type `{success: boolean; message: string; code?: string}`. Update all server actions to use this. Create error boundary utilities.

**Missing input validation:**
- Issue: `app/api/contact/route.ts` directly accesses request.json() without schema validation
- Files: `app/api/contact/route.ts` lines 13-26
- Impact: Malformed requests could create invalid Sanity documents, no protection against spam/injection, no field length limits
- Fix approach: Use zod schema (already used in contact-form component) to validate ContactForm type. Create shared schema file at `lib/schemas/contact.ts`. Implement rate limiting middleware.

## Security Considerations

**Exposed API tokens in config:**
- Risk: SHOPIFY_STOREFRONT_ACCESS_TOKEN exposed via non-null assertion without runtime check
- Files: `lib/shopify/config.ts` lines 15, 19-20
- Current mitigation: Token is read-only storefront access token, not sensitive
- Recommendations: Add runtime validation that environment variables exist. Create validation function `validateShopifyConfig()` at app startup.

**Missing CSRF protection on form submission:**
- Risk: Contact form POST endpoint has no CSRF tokens, could be vulnerable if used cross-domain
- Files: `app/api/contact/route.ts`, `components/contact-form/index.tsx`
- Current mitigation: None
- Recommendations: Add origin/referer validation on contact endpoint. Consider adding lightweight CSRF token if form is user-facing and sensitive.

**Unvalidated external data in error messages:**
- Risk: GraphQL error messages from Shopify directly exposed to users in toast (components/cart/actions.ts line 149)
- Files: `components/cart/actions.ts` line 148-149
- Current mitigation: Error truncation attempts to extract user-friendly portion
- Recommendations: Create error message sanitization/normalization layer. Map Shopify error codes to safe user messages.

**Missing API key validation:**
- Risk: Sanity API token used directly in fetch without validation
- Files: `app/api/contact/route.ts` line 36
- Current mitigation: Token in environment variable
- Recommendations: Validate token format at startup, implement token refresh mechanism if token has expiration

## Performance Bottlenecks

**Cart cleanup retry mechanism with exponential polling:**
- Problem: cleanupZeroQuantityItems function implements retry with 500ms fixed delay (line 79), called for every cart operation
- Files: `components/cart/actions.ts` lines 76-81
- Cause: Synchronous delay blocks server action response, multiple retries multiply latency
- Improvement path: Implement exponential backoff (500ms, 1s, 2s). Better: defer cleanup to background job or use webhook-based verification. At minimum, batch cleanup checks into single post-operation call rather than per-item.

**Unbounded logging array in ShopifyLogger:**
- Problem: Logger stores all logs in memory without limit (line 40 in logger.ts)
- Files: `lib/shopify/logger.ts` line 40
- Cause: No array size limit or cleanup mechanism
- Improvement path: Implement circular buffer with max 100 entries, or implement log rotation. Only keep logs for current session.

**Duplicate API calls for existing cart:**
- Problem: createCartAndSetCookie calls cartService.get() to validate cart, then cartService.create() which may fetch cart again
- Files: `components/cart/actions.ts` lines 413-415, 425
- Cause: Two sequential API calls for cart validation
- Improvement path: Pass existingCart through to create operation to avoid double-fetch. Cache cart state more aggressively.

**Missing data pagination for collections:**
- Problem: Product queries via shopifyFetch don't implement cursor-based pagination
- Files: `lib/shopify/index.ts` line 237-245 (getProducts function), `lib/shopify/queries/product.ts`
- Cause: All products fetched in single query (likely limited to first 250)
- Improvement path: Implement cursor-based pagination for product listings. Add pagination parameters to API.

## Fragile Areas

**Cart context state calculation from incomplete data:**
- Files: `components/cart/cart-context.tsx` lines 53-84 (calculateItemCost, updateCartItem)
- Why fragile: Price calculations depend on item.quantity being present and numeric. No validation. String-to-number conversions (line 67, 126) could fail silently.
- Safe modification: Add type guards for numeric calculations. Create calculation utility with explicit type checking. Add unit tests for edge cases (0 quantity, negative prices, missing fields).
- Test coverage: No test files found for cart context logic. Cart math completely untested.

**Hardcoded product metadata:**
- Files: `app/(main)/shop/[slug]/page.tsx` line 59
- Why fragile: "1 PACK ( 12 COOKIES )" is hardcoded string, not tied to actual product data
- Safe modification: Move to Sanity document or Shopify product custom field. Query actual pack size from sanity schema.
- Test coverage: Product detail page has no tests

**Missing null safety in related products:**
- Files: `app/(main)/shop/[slug]/page.tsx` lines 102-105
- Why fragile: Accesses item.shopifyProduct?.variants[0] without checking if variants exist or if array is empty
- Safe modification: Add null coalescing operator. Create type guard function. Test with products that have no variants.

**Sanity client CDN toggle based on NODE_ENV:**
- Files: `lib/sanity/client.ts` line 8
- Why fragile: Development behavior differs from production (useCdn: true vs false). Could mask caching bugs.
- Safe modification: Use explicit environment variable for CDN control. Create tests that verify both modes. Document CDN behavior in README.

**WeakRef usage in cart cleanup without fallback:**
- Files: `components/cart/actions.ts` lines 102-138 (withCartCleanup)
- Why fragile: If cartId is falsy but supplied, cleanup still runs even with invalid ID
- Safe modification: Add early validation of cartId format before cleanup. Test with null, undefined, empty string, malformed IDs.

## Scaling Limits

**In-memory logger without cleanup:**
- Current capacity: Stores all logs for application lifetime (could be hundreds or thousands)
- Limit: Browser memory or server process memory exhaustion on long-running sessions
- Scaling path: Implement log rotation with max 100-500 entries. Export logs to external service (Sentry, LogRocket). Clear logs on session end.

**No rate limiting on API endpoints:**
- Current capacity: Unlimited concurrent contact form submissions
- Limit: Potential abuse, spam, DOS vectors on public endpoints
- Scaling path: Implement rate limiting middleware (IP-based for contact form). Use service like Vercel Rate Limiting or implement custom middleware.

**Cart state stored only in cookies:**
- Current capacity: Cart data size limited by cookie size (4KB typical)
- Limit: Complex carts with many items or large variant selections may exceed cookie limits
- Scaling path: Move cart to server-side session store or use Shopify cart persistence. Implement cart compression or summary-only approach in cookies.

## Dependencies at Risk

**Next.js version pinned at 16.1.6:**
- Risk: Major version with breaking changes likely to be released
- Impact: Will need migration path for app router changes, middleware changes, or new features
- Migration plan: Monitor Next.js releases. Create upgrade branch quarterly. Test with canary versions.

**React 19 with experimental features:**
- Risk: React 19 still stabilizing, some features may change
- Impact: Server component behavior, use-server directives might evolve
- Migration plan: Stay updated on React 19 releases. Keep dependencies current.

**Sanity CMS API version 2023-10-23:**
- Risk: Older API version may lose support, new schemas may not be compatible
- Impact: Future Sanity upgrades require API version updates
- Migration plan: Quarterly review of Sanity API updates. Test with latest API version before sunset date.

## Test Coverage Gaps

**No tests for cart operations:**
- What's not tested: All server actions in `components/cart/actions.ts` (addItem, removeItem, updateItemQuantity, batchUpdateCart, etc.)
- Files: `components/cart/actions.ts`
- Risk: Cart logic completely unprotected from regressions. Edge cases (zero quantity, duplicate items, missing IDs) never verified.
- Priority: **High** - cart is core business logic

**No tests for cart context reducers:**
- What's not tested: cartReducer function, updateCartItem logic, price calculations
- Files: `components/cart/cart-context.tsx` lines 157-303
- Risk: Client-side state mutations untested. Cart math could be incorrect and undetected.
- Priority: **High** - affects checkout experience

**No tests for contact form submission:**
- What's not tested: ContactForm component, form validation, API integration, error handling
- Files: `components/contact-form/index.tsx`, `app/api/contact/route.ts`
- Risk: Form could silently fail, validation could be bypassed, error messages malformed
- Priority: **Medium** - public-facing but not revenue-critical

**No tests for Shopify integration:**
- What's not tested: shopifyFetch, cart service methods, product queries, error handling
- Files: `lib/shopify/index.ts`
- Risk: Integration with Shopify could fail undetected. API changes could break silently.
- Priority: **High** - core to product display and checkout

**No e2e tests for user flows:**
- What's not tested: Product browsing to checkout flow, add-to-cart flow, product variant selection
- Files: All components and pages
- Risk: Critical user flows completely untested end-to-end
- Priority: **High** - affects revenue

## Missing Critical Features

**No webhook validation on revalidate endpoint:**
- Problem: Revalidate endpoint validates Sanity webhook signature but doesn't log attempts or rate-limit
- Blocks: Can't monitor for abuse or debug webhook failures
- Impact: If webhook fails, content staleness undetected

**No product search/filtering:**
- Problem: No search capability, only browse all products
- Blocks: Users with many products can't find specific items efficiently
- Impact: Poor discoverability, lost sales on large catalogs

**No inventory management UI:**
- Problem: Out-of-stock logic exists but no way for admins to update stock from dashboard
- Blocks: Can't manage inventory without direct Shopify access
- Impact: Manual processes, inventory inconsistencies

**No analytics tracking:**
- Problem: No page view tracking, no event tracking, no conversion tracking
- Blocks: Can't measure user behavior or ROI
- Impact: Blind to what's working or broken

**No email notifications:**
- Problem: Contact form creates Sanity documents but doesn't send notification emails
- Blocks: Admin may miss contact form submissions
- Impact: Poor customer service responsiveness

---

*Concerns audit: 2026-02-27*
