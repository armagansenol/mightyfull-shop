# Customer Dashboard — Native Next.js Implementation Plan

**Status:** In progress. Phases 1, 2, 3 (mostly), 4 (mostly), and 5 (partially) are shipped. Header and cancellation-policy links already point at the on-site `/account` tree. Remaining work is mostly Subscriptions advanced actions, a few Orders/Profile gaps, and launch polish.
**Drafted:** 2026-05-07 · **Last updated:** 2026-05-12

---

## Context

The storefront delegated all account functionality to Shopify's hosted New Customer Accounts portal. Two places pointed off-site:

- Header user icon: `storefront/components/header/index.tsx`
- Subscription cancellation copy: `storefront/components/cancellation-policy-dialog/index.tsx`

Both now link into the on-site account tree at `/account/*`. This plan describes the work to bring account, order, and subscription management on-site.

**Why we picked this up:** UX/brand consistency, deeper analytics ownership, and the ability to evolve the account UX without being constrained by Shopify's hosted UI.

---

## Stack decisions (locked in)

- **Auth:** Shopify Customer Account API (OAuth 2.0 + PKCE). Not Storefront API customer mutations — those are deprecated for headless accounts.
- **Subscriptions engine:** Shopify Subscriptions (confirmed). Read/write via Customer Account API `subscriptionContracts`.
- **Forms:** React Hook Form + Zod (matches existing repo conventions).
- **Data:** React Query for client; server actions where they fit.
- **Routing:** App Router. Top-level `account/` route group, separate from `(main)` because layout differs (sidebar nav, no marketing chrome).

## Out of scope

- Wishlist / saved items (not a Shopify primitive — would need custom KV)
- B2B / wholesale customer accounts
- Multi-currency / multi-locale account pages
- Custom shipment tracking beyond Shopify defaults
- Order returns / RMA flow
- Sanity-driven account banners / curated help links (dropped 2026-05-12 — not worth the lift without a clear marketing ask)

---

## Prerequisites

Owner: store admin.

- [x] Settings → Customer accounts → **New customer accounts** enabled
- [x] Settings → Apps and sales channels → **Headless** channel installed
- [x] Customer Account API credentials captured (client ID, authorize / token / logout endpoints)
- [x] Redirect URIs registered (`/account/callback` on localhost + prod + Vercel previews)
- [x] Shopify Subscriptions app installed
- [x] Env vars set in Vercel + `.env.local` (`SHOPIFY_CUSTOMER_ACCOUNT_*`, `NEXT_PUBLIC_SHOPIFY_SHOP_ID`)
- [ ] Subscription product in dev store for testing (verify still available for ongoing QA)

---

## Phase 1 — Auth foundation ✅

**Goal:** A logged-in customer can complete the OAuth round-trip; the session cookie protects `/account/*`.

### Tasks
- [x] PKCE implemented manually in `lib/shopify/customer-account/oauth.ts`
- [x] `lib/shopify/customer-account/`
  - [x] `client.ts` — GraphQL client targeting Customer Account API
  - [x] `oauth.ts` — PKCE helpers
  - [x] `session.ts` — encrypted httpOnly cookie session, refresh logic
  - [x] `tokens.ts` — access + refresh token rotation
  - [x] `cookies.ts`, `config.ts`, `types.ts`
- [x] Routes
  - [x] `app/account/login/route.ts`
  - [x] `app/account/callback/route.ts`
  - [x] `app/account/logout/route.ts`
- [x] `proxy.ts` (Next.js 16 routing middleware) — gates `/account/*` and redirects unauthed users to `/account/login` with `return_to`

The four remaining auth follow-ups (`use-customer` client hook, header logged-in avatar/dropdown, PKCE/refresh unit tests, auth round-trip contract test) have been moved to **Backlog** at the bottom of this doc. The current server-side-only implementation is considered good enough; revisit if a client surface forces a customer hook, or if auth becomes risky to refactor without tests.

### Known risk follow-ups
- Token refresh races on parallel requests — verify the per-session mutex behaves correctly under burst load (no incident yet)
- Vercel preview URL coverage — confirm each new preview's redirect URI is whitelisted

---

## Phase 2 — Account shell + dashboard ✅ (mostly)

### Tasks
- [x] `app/account/layout.tsx` with desktop sidebar nav (Overview, Orders, Subscriptions, Addresses, Profile, Logout) — `components/account/account-sidebar.tsx`
- [x] Reuse existing header/footer
- [x] `app/account/page.tsx` (overview): greeting, recent order card, active subscription summary, default address card, quick links
- [x] Shared in `components/account/`
  - [x] `account-card.tsx`
  - [x] `account-empty-state.tsx`
  - [x] `account-skeleton.tsx` (+ per-route `loading.tsx` files)
  - [ ] `account-error-boundary.tsx`

---

## Phase 3 — Profile & addresses ✅ (mostly)

### Tasks
- [x] `app/account/profile/page.tsx` — edit first/last name, phone (`customerUpdate`)
- [ ] Email change with verification flow (Shopify sends email)
- [x] `app/account/addresses/page.tsx` — list, default badge, edit/delete
- [x] `app/account/addresses/new/page.tsx` — form
- [x] `app/account/addresses/[id]/edit/page.tsx` — form
- [x] `components/account/address-form.tsx` (RHF + Zod, country/region selects, "Set as default")
- [x] Mutations wired in `app/account/addresses/actions.ts` (`customerAddressCreate`, `customerAddressUpdate`, `customerAddressDelete`, `customerDefaultAddressUpdate`)
- [x] Defer Google Places autocomplete (no current ask)

---

## Phase 4 — Orders ✅ (mostly)

### Tasks
- [x] `app/account/orders/page.tsx` — list with status badge, date, total
- [x] `app/account/orders/[id]/page.tsx` — number, date, status, line items, fulfillment, addresses, totals
- [x] Status badge mapping (`order-status-badge.tsx`)
- [x] Empty state when no orders
- [ ] Cursor pagination (10/page)
- [ ] Status filter (open, fulfilled, cancelled)
- [ ] Search by order number
- [ ] Tracking number + carrier link in order detail
- [ ] Re-order CTA — push line items into the Hydrogen cart
- [ ] Invoice / receipt download link (Shopify provides the URL on the order)

---

## Phase 5 — Subscriptions ✅ (partial)

**Engine:** Shopify Subscriptions.

### Tasks
- [x] `app/account/subscriptions/page.tsx` — list of contracts with status, product, frequency, next billing date, amount
- [x] `app/account/subscriptions/[id]/page.tsx` — contract detail
- [x] Pause → `subscriptionContractPause`
- [x] Resume → `subscriptionContractActivate`
- [x] Cancel → confirmation dialog, mutation `subscriptionContractCancel` (no reason capture yet)
- [ ] Capture cancellation reason (radio + textarea) before firing the mutation
- [ ] Skip next cycle → `subscriptionBillingCycleSkip`
- [ ] Change frequency → `subscriptionContractUpdate`
- [ ] Edit shipping address (reuse address form from Phase 3)
- [ ] Edit payment method — redirect to Shopify-hosted payment update (PCI scope stays with Shopify)
- [ ] Pre-order edge case: surface ship date prominently when any line item is pre-order
- [x] `components/cancellation-policy-dialog/index.tsx` — "account dashboard" copy now links to `/account/subscriptions`

---

## Phase 6 — Polish, a11y, E2E, QA

### Tasks
- [x] Brand typography (`font-bomstad-display`, `font-poppins`) applied
- [x] Color / spacing tokens match existing components
- [x] GSAP/Lenis transitions consistent with rest of site
- [ ] Accessibility audit
  - [ ] Keyboard navigation through all flows
  - [ ] Focus management on modal open/close
  - [ ] ARIA labels on icon buttons
  - [ ] Color contrast ratios
  - [ ] Screen reader pass (VoiceOver)
- [ ] Cross-browser QA: Chrome, Safari, Firefox, mobile Safari, Chrome Android
- [x] Playwright E2E scaffolding (`tests/e2e/account.spec.ts`)
  - [ ] Confirm coverage: login → view orders → reorder; cancel subscription with reason; add address → set default; profile edit; logout
- [ ] Sentry / error monitoring wiring
- [ ] Analytics events: login, logout, order viewed, sub paused, sub cancelled, reorder

---

## Phase 7 — Migration & launch

### Tasks
- [x] Header link swap → `/account`
- [x] Cancellation copy → internal `/account/subscriptions`
- [x] Audit other deep links to `shopify.com/<shop-id>/account` — none found
- [ ] Feature flag for soft launch (cookie-gated rollout or simple env flag)
- [ ] Klaviyo profile sync hooks: emit `Logged In`, `Order Viewed`, sub-state events
- [ ] `app/robots.ts` (or `public/robots.txt`) — disallow `/account/*` from indexing; keep `/account/login` indexable, account interior no-index
- [ ] Production smoke-test checklist
- [ ] FAQ / comms update if any copy still mentions Shopify-hosted login

---

## Built (file inventory)

### storefront — new
- `proxy.ts` — auth gate for `/account/*`
- `app/account/layout.tsx`
- `app/account/page.tsx`
- `app/account/loading.tsx`
- `app/account/login/route.ts`
- `app/account/callback/route.ts`
- `app/account/logout/route.ts`
- `app/account/orders/page.tsx`, `[id]/page.tsx`, `loading.tsx`
- `app/account/profile/page.tsx`, `actions.ts`, `loading.tsx`
- `app/account/addresses/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`, `actions.ts`, `loading.tsx`
- `app/account/subscriptions/page.tsx`, `[id]/page.tsx`, `actions.ts`, `loading.tsx`
- `lib/shopify/customer-account/{client,config,cookies,oauth,session,tokens,types}.ts`
- `components/account/{account-card,account-empty-state,account-sidebar,account-skeleton,account-theme-toggle,address-block,address-form,address-list,card-action-link,order-status-badge,page-header,profile-form,subscription-actions,subscription-status-badge}.tsx`
- `tests/e2e/account.spec.ts`

### storefront — modified
- `components/header/index.tsx` — external link replaced with internal `/account`
- `components/cancellation-policy-dialog/index.tsx` — "account dashboard" link updated
- `.env.local`, Vercel env — auth vars added

### still missing
- `components/account/account-error-boundary.tsx`
- `app/robots.ts`

---

## Backlog

Tasks that are not blocking and were intentionally deferred. Pull from here only if the listed trigger applies.

### Phase 1 auth follow-ups

Decision (2026-05-12): the current server-side-only auth implementation is considered good enough. Don't introduce client-side auth surfaces unless one of these tasks has a concrete forcing function.

- **`hooks/use-customer.ts` — client-side customer hook.** A React-Query-backed hook returning `{ customer, isLoading, error }`. Today every account screen reads the session server-side, so this isn't load-bearing. *Trigger to pick up:* a client surface outside `/account` needs to know the customer (e.g. a header avatar, gated content on a PDP, an interactive widget with optimistic updates that needs cache invalidation).
- **Header logged-in state (avatar / dropdown).** Replace the static user icon in `components/header/index.tsx` with an avatar showing the customer's initial when logged in, plus a Radix dropdown (Orders / Subscriptions / Profile / Logout). Best implemented as a server-component slot driven from layout data to avoid hydration flashes. *Trigger:* design wants stronger logged-in affordance, or a usability issue from customers not realising they're authed.
- **Unit tests: PKCE generation, token refresh.** Vitest tests in `tests/unit/customer-account-{oauth,tokens}.test.ts`. Cover code-verifier alphabet/length, S256 challenge vs an RFC 7636 test vector, authorize URL shape, token refresh fast-path, rotation, rejected-refresh error, and the per-session mutex (assert only one network call under burst). *Trigger:* meaningful refactor of `oauth.ts`/`tokens.ts`, or first auth-related production incident.
- **Contract test: auth round-trip mocked.** Vitest+msw integration test that drives `proxy.ts`, `/account/login`, `/account/callback`, and `/account/logout` against fake `accounts.shopify.com` endpoints. Covers the happy path plus state-mismatch, token-endpoint 4xx, and a fresh-but-soon-expired session. *Trigger:* before touching auth in a non-trivial way, or before swapping the OAuth library.

---

## Open questions

1. Email change flow: mirror Shopify's verification UX in our UI, or just show "check your email"?
2. Order returns: in-app return request flow (~2d extra) or keep Shopify-hosted?
3. Cancellation reason capture: free-form textarea, or fixed radio list + optional notes?
4. Soft-launch strategy: feature flag with cookie cohort, or just ship?

---

## References

- Shopify Customer Account API: https://shopify.dev/docs/api/customer
- New Customer Accounts (headless) overview: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api
- Shopify Subscriptions GraphQL: https://shopify.dev/docs/api/customer/latest/queries/customer
- OAuth 2.0 PKCE RFC: https://datatracker.ietf.org/doc/html/rfc7636
