# Customer Dashboard — Production Smoke Test

Run this before announcing the on-site account portal, or after any non-trivial change to `/account/*`.

Estimated time: **20–30 minutes**. Use a real test customer with a real order and at least one active subscription. Reference test account: `armagansnl@gmail.com`.

---

## 0. Pre-flight

- [ ] Latest deploy is **live on production** (not preview)
- [ ] `NEXT_PUBLIC_SHOPIFY_SHOP_ID` and `NEXT_PUBLIC_SHOPIFY_SUBSCRIPTION_PAGE_ID` env vars set in Vercel production
- [ ] Customer Account API redirect URIs include the production domain
- [ ] You can sign in to the test account on `shopify.com/{shopId}/account` (sanity check that the customer + subscription still exist)

---

## 1. Authentication

- [ ] Visit `/account` while logged out → redirects to `/account/login`
- [ ] Click login → Shopify OAuth screen → authorize → lands back on `/account`
- [ ] Refresh `/account` → still logged in (session cookie persisting)
- [ ] Visit `/account/orders` directly → loads (not redirected)
- [ ] Click "Log out" in sidebar → redirected away, `/account` blocked again

---

## 2. Overview (`/account`)

- [ ] Greeting shows the customer's name
- [ ] Most recent order card renders with status badge and total
- [ ] Active subscription summary renders (or empty state if none)
- [ ] Default address card renders (or empty state)
- [ ] Quick links navigate to the right pages

---

## 3. Orders

- [ ] `/account/orders` lists the customer's orders with status, date, total
- [ ] Status filter tabs (All / Open / Fulfilled / Cancelled) update the list
- [ ] Search by order number (e.g. `#1042`) returns the matching order
- [ ] Pagination "Next" / "Previous" works if more than 10 orders exist
- [ ] Click an order → detail page loads with line items, fulfillment, addresses, totals
- [ ] Tracking link (if fulfilled) opens carrier's tracking page in a new tab
- [ ] "View receipt" link opens Shopify's `statusPageUrl` in a new tab
- [ ] Click "Reorder" → items land in the cart; cart drawer shows the right quantities

---

## 4. Subscriptions

### List page (`/account/subscriptions`)

- [ ] All the customer's subscriptions render with SKU image, name × qty, frequency pill, next renewal pill, status badge, price, Manage button
- [ ] Status filter tabs animate the active background between selections
- [ ] Sort dropdown (Next renewal / Newest / Oldest) reorders the list
- [ ] URL search params persist filter + sort across refresh

### Detail page (`/account/subscriptions/[id]`)

- [ ] Header shows title, status badge, "Started …" date
- [ ] Upcoming-order banner shows the next billing date (matches the contract's `nextBillingDate`)
- [ ] "Skip order" button → opens confirmation dialog → confirms → date moves to the next cycle (verify by refreshing — the cycle is now marked `skipped` in `upcomingBillingCycles`)
- [ ] "Show upcoming orders" → modal lists the next 5 cycles; per-row Skip/Unskip toggles work and persist after refresh
- [ ] Pre-order banner appears for any pre-order line items (test by editing a product variantTitle to include "Pre-order" if needed)
- [ ] Right column shows frequency (read-only), shipping address, payment-method link
- [ ] "Update on Shopify" payment link opens the correct Shopify-hosted portal URL with the page UUID
- [ ] Manage card: Pause an active subscription → status flips to PAUSED, banner skip button hides
- [ ] Manage card: Resume → status flips back to ACTIVE
- [ ] Manage card: Cancel → reason dialog → submit → status flips to CANCELLED, manage actions hide

---

## 5. Addresses (`/account/addresses`)

- [ ] List shows all customer addresses with default badge on the right one
- [ ] "Add address" → form → submit → new address appears in the list
- [ ] Edit an address → save → values persist after refresh
- [ ] Set a non-default address as default → badge moves
- [ ] Delete a non-default address → it's gone
- [ ] Can't delete the only / default address (UX guard)

---

## 6. Profile (`/account/profile`)

- [ ] Form pre-fills with current first name, last name, phone
- [ ] Edit a field and save → success state shown
- [ ] Refresh → values persist
- [ ] Invalid phone format → inline validation error

---

## 7. Errors & edge cases

- [ ] Visit a non-existent subscription `/account/subscriptions/xxx` → 404 page renders, not a crash
- [ ] Visit a non-existent order `/account/orders/xxx` → 404 page renders
- [ ] Cause a token expiry (wait long enough or manually expire) → next request transparently refreshes the token, no log-out
- [ ] Open DevTools → Network → confirm `/account/*` HTML responses have appropriate `cache-control` (should be dynamic, not cached)

---

## 8. Crawlability

- [ ] `curl https://your-domain/robots.txt` → `/account/` is disallowed, `/account/login` is allowed
- [ ] Sitemap (if present) does not include `/account/*` URLs

---

## Sign-off

| Tester | Date | Pass/Fail | Notes |
|--------|------|-----------|-------|
|        |      |           |       |
