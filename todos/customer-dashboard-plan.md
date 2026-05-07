# Customer Dashboard — Native Next.js Implementation Plan

**Status:** Deferred. Currently using Shopify-hosted customer accounts (`https://shopify.com/67633938584/account`).
**Estimate when picked up:** 13–17 working days (~3 calendar weeks) with Claude Code Opus 4.7 paired.
**Drafted:** 2026-05-07

---

## Context

The storefront currently delegates all account functionality to Shopify's hosted New Customer Accounts portal. Two places point off-site today:

- Header user icon: `storefront/components/header/index.tsx:146`
- Subscription cancellation copy: `storefront/components/cancellation-policy-dialog/index.tsx:53`

This plan describes the work to bring account, order, and subscription management on-site so it lives on-brand and integrates with the rest of the Next.js storefront.

**Why it might be worth picking this up later:** UX/brand consistency, deeper analytics ownership, ability to embed Sanity content (announcements, help) inside account pages. Functionally the Shopify-hosted experience already covers the basics for free — this is a UX/brand investment, not a missing-feature fix.

---

## Stack decisions (locked in)

- **Auth:** Shopify Customer Account API (OAuth 2.0 + PKCE). Not Storefront API customer mutations — those are deprecated for headless accounts.
- **Subscriptions engine:** Shopify Subscriptions (confirmed). Read/write via Customer Account API `subscriptionContracts`.
- **Forms:** React Hook Form + Zod (matches existing repo conventions).
- **Data:** React Query for client; server actions where they fit.
- **Routing:** App Router. New top-level `account/` route group, separate from `(main)` because layout differs (sidebar nav, no marketing chrome).

## Out of scope

- Wishlist / saved items (not a Shopify primitive — would need custom KV)
- B2B / wholesale customer accounts
- Multi-currency / multi-locale account pages
- Custom shipment tracking beyond Shopify defaults
- Order returns / RMA flow

---

## Prerequisites (must happen before kickoff)

Owner: store admin. None of these are codeable on my side.

- [ ] Settings → Customer accounts → confirm **New customer accounts** is enabled
- [ ] Settings → Apps and sales channels → install **Headless** channel
- [ ] In Headless channel, capture:
  - [ ] Customer Account API client ID
  - [ ] Authorization endpoint URL
  - [ ] Token endpoint URL
  - [ ] Logout endpoint URL
- [ ] Add redirect URIs in Headless channel:
  - [ ] `http://localhost:3000/account/callback`
  - [ ] `https://<prod-domain>/account/callback`
  - [ ] Vercel preview pattern (verify exact wildcard support)
- [ ] Confirm Shopify Subscriptions app is installed
- [ ] Create at least one subscription product in dev store for testing
- [ ] Add env vars to Vercel + `.env.local`:
  - `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`
  - `SHOPIFY_CUSTOMER_ACCOUNT_API_URL`
  - `SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL`
  - `NEXT_PUBLIC_SHOPIFY_SHOP_ID=67633938584`

---

## Phase 1 — Auth foundation · 2–3 days

**Goal:** A logged-in customer can complete the OAuth round-trip; `useCustomer()` returns their identity.

### Tasks
- [ ] Implement PKCE manually (~150 LOC) — avoids adding NextAuth/Auth.js for one custom provider
- [ ] `lib/shopify/customer-account/`
  - [ ] `client.ts` — GraphQL client targeting Customer Account API
  - [ ] `oauth.ts` — PKCE helpers (code verifier, challenge, state)
  - [ ] `session.ts` — encrypted httpOnly cookie session, refresh logic
  - [ ] `tokens.ts` — access token + refresh token rotation (mutex per session to avoid races)
- [ ] New routes
  - [ ] `app/account/login/route.ts` — redirects to Shopify authorize URL
  - [ ] `app/account/callback/route.ts` — exchanges code, sets cookie, redirects to `/account`
  - [ ] `app/account/logout/route.ts` — clears cookie, calls Shopify logout
- [ ] `middleware.ts` — protect `/account/*`, redirect unauthed to `/account/login`
- [ ] `hooks/use-customer.ts` — React Query wrapper around `customer` query
- [ ] Header logged-in state (avatar/dropdown) — uses placeholder hook from Phase 0 if scaffolded earlier
- [ ] Tests
  - [ ] Unit: PKCE generation, token refresh
  - [ ] Contract: auth round-trip mocked

### Risks
- Token refresh races on parallel requests — handle with per-session mutex
- Cookie size if storing both tokens — encrypt + keep refresh-only in cookie + access in memory cache
- Vercel preview URLs — verify wildcard redirect URI support; may need per-deploy registration

---

## Phase 2 — Account shell + dashboard · 1–1.5 days

**Goal:** Logged-in customer lands on a branded `/account` page with nav to all sub-areas.

### Tasks
- [ ] `app/account/layout.tsx`
  - [ ] Desktop sidebar nav (Overview, Orders, Subscriptions, Addresses, Profile, Logout)
  - [ ] Mobile: bottom tab bar or drawer
  - [ ] Reuse existing header/footer
- [ ] `app/account/page.tsx` (overview)
  - [ ] Greeting with first name
  - [ ] Recent order card with reorder CTA
  - [ ] Active subscriptions summary (count + next renewal)
  - [ ] Default shipping address card
  - [ ] Quick links to FAQ, contact
- [ ] Shared in `components/account/`
  - [ ] `account-card.tsx` — base card primitive
  - [ ] `account-empty-state.tsx`
  - [ ] `account-loading-skeleton.tsx`
  - [ ] `account-error-boundary.tsx`
- [ ] Sanity schemas (`studio/schema/`)
  - [ ] `accountAnnouncement` — optional banner: title, body, CTA, expiry
  - [ ] `accountHelpLinks` — curated help articles for sidebar

---

## Phase 3 — Profile & addresses · 1.5–2 days

### Tasks
- [ ] `app/account/profile/page.tsx`
  - [ ] Edit first/last name, phone (`customerUpdate`)
  - [ ] Email change with verification flow (Shopify sends email)
  - [ ] Read-only fields where customer can't change client-side
- [ ] `app/account/addresses/page.tsx` — list, default badge, edit/delete
- [ ] `app/account/addresses/new/page.tsx` — form
- [ ] `app/account/addresses/[id]/edit/page.tsx` — form
- [ ] `components/account/address-form.tsx`
  - [ ] RHF + Zod (country code, postal validation per country)
  - [ ] Country/region selects (Shopify `Country` enum)
  - [ ] "Set as default" toggle
- [ ] Mutations: `customerAddressCreate`, `customerAddressUpdate`, `customerAddressDelete`, `customerDefaultAddressUpdate`
- [ ] Defer Google Places autocomplete unless asked

---

## Phase 4 — Orders · 2–2.5 days

### Tasks
- [ ] `app/account/orders/page.tsx`
  - [ ] Cursor-paginated list (10/page)
  - [ ] Status filter (open, fulfilled, cancelled)
  - [ ] Search by order number
  - [ ] Row: number, date, total, status badge
- [ ] `app/account/orders/[id]/page.tsx`
  - [ ] Header: number, date, status
  - [ ] Line items with product images linking back to PDP
  - [ ] Fulfillment timeline (placed → fulfilled → delivered)
  - [ ] Tracking number + carrier link
  - [ ] Shipping + billing addresses
  - [ ] Order totals breakdown (subtotal, shipping, tax, discounts, total)
  - [ ] Re-order CTA — push line items into Hydrogen cart
  - [ ] Invoice/receipt download link (Shopify provides URL)
- [ ] Status badge mapping (financial + fulfillment status → user-friendly labels)
- [ ] Empty state when no orders

---

## Phase 5 — Subscriptions · 2.5–3.5 days

**Engine:** Shopify Subscriptions.

### Tasks
- [ ] `app/account/subscriptions/page.tsx`
  - [ ] List of contracts with status (active, paused, cancelled)
  - [ ] Row: product, frequency, next billing date, amount
- [ ] `app/account/subscriptions/[id]/page.tsx`
  - [ ] Detail view of full contract
  - [ ] Action buttons: Pause / Resume / Skip next / Cancel / Edit
- [ ] Mutation flows
  - [ ] **Pause** — confirmation modal → `subscriptionContractPause`
  - [ ] **Resume** — `subscriptionContractActivate`
  - [ ] **Skip next** — `subscriptionBillingCycleSkip` for next cycle
  - [ ] **Cancel** — confirmation with reason capture (radio + textarea) → `subscriptionContractCancel`
  - [ ] **Change frequency** — select dropdown → `subscriptionContractUpdate`
  - [ ] **Edit shipping address** — reuse address form from Phase 3
  - [ ] **Edit payment method** — redirect to Shopify-hosted payment update (PCI scope stays with Shopify; this is the one piece that intentionally remains hosted)
- [ ] Pre-order edge case: if any line item is pre-order, surface ship date prominently
- [ ] Update `storefront/components/cancellation-policy-dialog/index.tsx:53` — link "account dashboard" to `/account/subscriptions`

---

## Phase 6 — Polish, a11y, E2E, QA · 2.5–3.5 days

### Tasks
- [ ] Design pass
  - [ ] GSAP/Lenis transitions consistent with rest of site
  - [ ] Brand typography (`font-bomstad-display`, `font-poppins`) applied
  - [ ] Color/spacing tokens match existing components
- [ ] Accessibility audit
  - [ ] Keyboard navigation through all flows
  - [ ] Focus management on modal open/close
  - [ ] ARIA labels on icon buttons
  - [ ] Color contrast ratios
  - [ ] Screen reader pass (VoiceOver)
- [ ] Cross-browser QA: Chrome, Safari, Firefox, mobile Safari, Chrome Android
- [ ] Playwright E2E
  - [ ] Login → view orders → reorder
  - [ ] Login → cancel subscription with reason
  - [ ] Login → add address → set default
  - [ ] Login → edit profile → email change verification
  - [ ] Logout
- [ ] Sentry / error monitoring wiring
- [ ] Analytics events: login, logout, order viewed, sub paused, sub cancelled, reorder

---

## Phase 7 — Migration & launch · 1–1.5 days

### Tasks
- [ ] Header link swap: `storefront/components/header/index.tsx:146` → `/account`
- [ ] Cancellation copy update: `storefront/components/cancellation-policy-dialog/index.tsx:53` → internal link
- [ ] Audit any other deep links to `shopify.com/67633938584/account` across repo + Sanity content
- [ ] Feature flag for soft launch
  - [ ] Cookie-gated rollout (10% → 50% → 100%) or simple env flag
- [ ] Klaviyo profile sync hooks: emit `Logged In`, `Order Viewed` events
- [ ] Sitemap/robots
  - [ ] `robots.txt` — disallow `/account/*` from indexing
  - [ ] Login page indexable, account interior no-index
- [ ] Production smoke-test checklist
- [ ] Comms: update FAQ if it mentions Shopify-hosted login

---

## Files that will change

### New (storefront)
- `app/account/layout.tsx`
- `app/account/page.tsx`
- `app/account/login/route.ts`
- `app/account/callback/route.ts`
- `app/account/logout/route.ts`
- `app/account/orders/page.tsx`
- `app/account/orders/[id]/page.tsx`
- `app/account/profile/page.tsx`
- `app/account/addresses/page.tsx`
- `app/account/addresses/new/page.tsx`
- `app/account/addresses/[id]/edit/page.tsx`
- `app/account/subscriptions/page.tsx`
- `app/account/subscriptions/[id]/page.tsx`
- `middleware.ts`
- `lib/shopify/customer-account/{client,oauth,session,tokens}.ts`
- `hooks/use-customer.ts`
- `components/account/{account-card,account-empty-state,account-loading-skeleton,account-error-boundary,address-form}.tsx`
- `tests/e2e/account.spec.ts`

### Modified (storefront)
- `components/header/index.tsx` — replace external link with internal `/account` + logged-in state
- `components/cancellation-policy-dialog/index.tsx` — update "account dashboard" link
- `.env.local`, Vercel env — new auth vars

### New (studio)
- `schema/documents/accountAnnouncement.ts`
- `schema/documents/accountHelpLinks.ts`

---

## Open questions to revisit before starting

1. Email change flow: mirror Shopify's verification UX in our UI, or just show "check your email"?
2. Order returns: in-app return request flow (~2d extra) or keep Shopify-hosted?
3. Wishlist: confirmed out of scope, or worth adding (~3d)?
4. Multi-language: storefront is single-locale today — confirm before launch
5. SSR-streamed `/account` or fully client-side after auth check? (SSR likely better for perceived perf)
6. When this is picked up, re-verify estimates — Shopify Customer Account API or Subscriptions schema may have changed

---

## References

- Shopify Customer Account API: https://shopify.dev/docs/api/customer
- New Customer Accounts (headless) overview: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api
- Shopify Subscriptions GraphQL: https://shopify.dev/docs/api/customer/latest/queries/customer
- OAuth 2.0 PKCE RFC: https://datatracker.ietf.org/doc/html/rfc7636
