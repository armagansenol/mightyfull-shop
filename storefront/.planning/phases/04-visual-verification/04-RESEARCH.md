# Phase 4: Visual Verification - Research

**Researched:** 2026-02-28
**Domain:** Browser-based visual verification, live site comparison, interactive state testing
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Verification approach:**
- Live browser walkthrough comparing dev build against production baseline
- Baseline: https://mightyfull-shop.vercel.app/ (currently deployed production site)
- Claude performs verification using browser tools, comparing both sites
- Fix issues immediately as they're found (not log-then-fix)
- After each fix, re-verify the entire page to catch regressions

**Page priority & coverage:**
- Check every page on the site — full coverage
- Viewports: 1440px desktop and 375px mobile (as roadmapped)
- One product page is sufficient (shared template)
- Start with homepage first (most complex, highest confidence signal)

**Interaction testing scope:**
- GSAP animations and Lenis smooth scrolling: visual spot-check (fire, look smooth, no glitches)
- Cart operations: full end-to-end flow (add product, change quantity, remove, cart open/close)
- Contact form: full submission test (fill out, submit, verify success/error states)
- Hover states and transitions: spot-check key elements (buttons, nav links, product cards, CTAs)

**Pass/fail criteria:**
- Standard: functionally identical — layout, colors, typography, spacing must match
- Minor subpixel rendering differences are acceptable
- Blockers: broken layouts, missing elements, wrong colors, non-working interactions
- Acceptable: minor spacing tweaks (1-2px difference)
- Final gate: clean `pnpm build` must pass after all visual fixes are applied

### Claude's Discretion

- Order of pages after homepage
- How to structure fix commits
- Whether a difference is "minor spacing" vs "broken layout"

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VER-01 | All pages verified at desktop viewport (1440px+) — visual parity confirmed | Browser resize to 1440px, compare each page against production baseline |
| VER-02 | All pages verified at mobile viewport (375px) — visual parity confirmed | Browser resize to 375px, compare each page against production baseline |
| VER-03 | All GSAP animations, scroll triggers, and Lenis smooth scrolling work correctly | Scroll each page, observe animation triggers, check Lenis smooth scroll feel |
| VER-04 | All Embla carousels (product highlight, etc.) function correctly | Click carousel nav buttons, observe auto-scroll behavior, verify fade transitions |
| VER-05 | Cart operations (add, remove, update, open/close) work correctly | Full end-to-end cart flow via browser |
| VER-06 | Contact form submission works correctly | Fill and submit contact form, verify success/error states |
| VER-07 | All hover states and transitions work correctly | Hover over buttons, nav links, product cards, CTAs |

</phase_requirements>

---

## Summary

Phase 4 is a live browser comparison phase — no new code to write, no libraries to install. The plan is executed via browser tools (Playwright MCP), comparing the local dev build at `http://localhost:3000` against the production baseline at `https://mightyfull-shop.vercel.app/`. Fixes are applied immediately as issues are found, with a re-verification of the affected page after each fix. The final gate is a clean `pnpm build`.

The site has 8 unique page routes: `/` (homepage, aliased from `/home`), `/shop`, `/shop/[slug]` (one product page is sufficient), `/contact`, `/faq`, `/our-story`, `/privacy-policy`, and `/store-locator`. Each page must pass at two viewports (1440px and 375px). The most significant migration risk is the Tailwind v4 responsive variant regression documented in STATE.md — responsive `md:` and `xl:` variants were generating 0 rules at one point. Although `@source "../"` was added and STATE.md's Session Continuity reports the build as clean, the responsive layouts need direct browser verification as the first priority during the desktop sweep.

The verification approach is: start dev server, open both sites in side-by-side browser tabs, walk through each page at each viewport, fix issues inline, re-verify after each fix, and close with a clean build confirmation.

**Primary recommendation:** Start by checking the homepage at 1440px desktop — it uses `md:` and `xl:` Tailwind classes most heavily (12 occurrences). If responsive variants render correctly there, the confidence signal for all other pages is very high.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Playwright MCP | (via mcp__playwright__*) | Browser automation for verification | Already available in this session — no install needed |
| pnpm | v10.24.0 | Run dev server and build | Already installed in this project |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| browser_resize | MCP tool | Set exact viewport width/height | Before every verification pass |
| browser_navigate | MCP tool | Open URLs in browser | Navigate to each page/baseline |
| browser_take_screenshot | MCP tool | Capture visual state | Document issues and before/after fixes |
| browser_snapshot | MCP tool | Capture accessibility tree | Verify element presence without full screenshot |
| browser_click | MCP tool | Interact with cart, forms, buttons | Cart ops, form submission, hover triggers |
| browser_type | MCP tool | Fill form inputs | Contact form submission test |
| browser_tabs | MCP tool | Manage dev vs production tabs | Side-by-side comparison workflow |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Live side-by-side comparison | Automated pixel-diff tools (Percy, Chromatic) | Automated tools require baseline setup and infrastructure; live comparison is faster for a one-time verification gate |
| Fix-as-you-go | Log-then-fix batch | Fix-as-you-go keeps context fresh and avoids accumulating fixes that interact; user explicitly chose this approach |

**Installation:**

No new packages to install. Dev server startup:
```bash
cd /Users/armagansenol/Desktop/justdesignfx/mightyfull-shop && pnpm dev
```

---

## Architecture Patterns

### Page Route Map

All 8 routes to verify:
```
/                     → app/(main)/home/page.tsx  (via rewrite from /)
/shop                 → app/(main)/shop/page.tsx
/shop/[slug]          → app/(main)/shop/[slug]/page.tsx  (one product sufficient)
/contact              → app/(main)/contact/page.tsx
/faq                  → app/(main)/faq/page.tsx
/our-story            → app/(main)/our-story/page.tsx
/privacy-policy       → app/(main)/privacy-policy/page.tsx
/store-locator        → app/(main)/store-locator/page.tsx
```

The `/home` route redirects to `/`, so always verify at `/`.

### Responsive Risk Map

Pages and components with the highest concentration of `md:` / `xl:` Tailwind classes (migration risk = highest):

| File | md:/xl: count | Risk |
|------|--------------|------|
| `app/(main)/home/page.tsx` | 12 | HIGH — homepage, most classes |
| `components/customer-reviews/index.tsx` | 11 | HIGH — visible on multiple pages |
| `app/(main)/shop/[slug]/page.tsx` | 7 | HIGH — product page |
| `components/header/index.tsx` | 6 | HIGH — every page |
| `components/purchase-panel/index.tsx` | 4 | MEDIUM |
| `components/product-images/index.tsx` | 4 | MEDIUM |
| `components/footer/index.tsx` | 4 | MEDIUM — every page |
| `app/(main)/our-story/page.tsx` | 4 | MEDIUM |
| `components/follow-us/index.tsx` | 3 | LOW |
| `app/(main)/contact/page.tsx` | 3 | LOW |

**Shared components** (header, footer) must be verified once — they propagate across all pages.

### Pattern 1: Verification Workflow Per Page

**What:** For each page, load dev site at viewport, screenshot key sections, compare against production baseline, fix any differences, re-verify.

**When to use:** Every page in the route map.

**Procedure:**
```
1. Set viewport: browser_resize(width, height)
2. Open dev build: browser_navigate("http://localhost:3000/{page}")
3. Open production in second tab: browser_navigate("https://mightyfull-shop.vercel.app/{page}")
4. Take screenshots of both (above fold, then scroll for full page)
5. Compare — identify blockers vs acceptable differences
6. Switch to dev tab, fix code files directly
7. Wait for HMR refresh
8. Re-verify the affected page end-to-end
9. Move to next page
```

### Pattern 2: Fix-as-You-Go with Build Gate

**What:** Fixes applied immediately to CSS modules or TSX files, HMR picks them up, re-verify before moving to next page.

**Commit cadence (Claude's discretion):** Per-page commit batch makes sense — group all fixes for a single page into one commit with message like `fix(04): homepage visual parity - desktop/mobile`.

**Final gate:** After all pages pass, run `pnpm build` and confirm zero errors before closing the phase.

### Pattern 3: Interactive State Verification

**What:** Cart, form, animations, and hover states require active browser interaction, not just screenshot comparison.

**Cart flow:**
```
1. Navigate to /shop
2. Click a product to open /shop/[slug]
3. Add to cart → cart drawer opens
4. Verify cart item renders correctly
5. Update quantity → number updates
6. Remove item → cart empties or updates
7. Open/close cart drawer via trigger button
```

**Contact form flow:**
```
1. Navigate to /contact
2. Fill all fields (name, surname, email, phone, message)
3. Submit → verify success state (Sonner toast or success message)
4. Optionally test validation: submit empty → verify error messages appear
```

**GSAP/Lenis spot-check:**
```
1. Load homepage
2. Scroll down — observe FadeIn animations firing
3. Check smooth scroll feel (Lenis wraps all pages via Wrapper component)
4. Check PackageAnimation, Parallax, and HorizontalScroll components
5. On product page, observe any scroll-triggered section transitions
```

### Anti-Patterns to Avoid

- **Verifying only above-the-fold**: Many layout issues appear in lower page sections. Scroll through the full page.
- **Skipping mobile after desktop passes**: Desktop passing does not guarantee mobile — CSS module `@media (max-width: 768px)` and `md:` Tailwind are different axes. Verify both explicitly.
- **Accepting broken animations**: If GSAP animations don't fire at all, that is a blocker. If they fire slightly differently in timing, that may be acceptable.
- **Not re-verifying shared components after fixes**: Fixing `header.module.css` affects every page. Re-check header on at least 2 pages after a header fix.
- **Forgetting the build gate**: The final criterion is a clean `pnpm build` — HMR is not a substitute.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Side-by-side comparison | Custom diffing scripts | Browser tabs, screenshots, visual inspection | Manual comparison is faster and more reliable for one-time gate |
| CSS value inspection | DevTools scripts | browser_evaluate with getComputedStyle | Direct and precise |
| Cart interaction testing | Mock API calls | Real browser interactions against dev server with live Shopify connection | Tests the full stack including Shopify Storefront API |

**Key insight:** This is a one-time human-equivalent verification pass, not a repeatable automated test suite. The goal is to confirm migration correctness, not to build test infrastructure.

---

## Common Pitfalls

### Pitfall 1: TW v4 Responsive Variants Still Broken

**What goes wrong:** `md:` and `xl:` Tailwind utility classes render no CSS — all grid and flex responsive layouts are collapsed or single-column on desktop.

**Why it happens:** STATE.md documents this regression explicitly: TW v4 base utilities generated 742 rules but responsive variants = 0 rules at time of discovery. The `@source "../"` directive was added as a fix (commit `1f50f35`) but STATE.md also says this was "insufficient." This is the highest-risk finding going into Phase 4.

**How to avoid:** Verify responsive variants as the first check on the homepage at 1440px. Look at the grid layout of the intro section (`flex md:grid grid-cols-12`) — if it renders as a single-column stack on desktop, responsive variants are still broken and need to be fixed before continuing.

**Warning signs:** All sections stack vertically on desktop view; column layouts are absent; the layout looks identical at 1440px and 375px.

**Fix approach if broken:** Use browser DevTools (via `browser_evaluate`) to inspect computed CSS for an element with `md:grid` — if that class produces no rule, the @source path needs correction. Common TW v4 fix: ensure `@source` points to actual TSX file locations. The current `@source "../"` from global.css in `styles/` points to project root — verify this covers `app/` and `components/`.

### Pitfall 2: CSS Module Media Query Alignment

**What goes wrong:** CSS module `@media (max-width: 768px)` breakpoints and TW `md:` (768px min-width) fire at the same pixel but opposite directions — this is correct by design and is NOT a bug.

**Why it happens:** The breakpoint sync in Phase 03-02 aligned them to 768px, but the directions are intentionally different: CSS modules use `max-width` (mobile-first cutoff), Tailwind uses `min-width` (mobile-first addition).

**How to avoid:** Understand that at 768px exactly, both fire simultaneously — this is correct behavior, not a gap. Only flag if there's a visible layout jump between 767px and 769px that doesn't exist in production.

### Pitfall 3: Lenis Smooth Scroll Detection

**What goes wrong:** Lenis smooth scrolling appears absent — the page scrolls natively with no easing.

**Why it happens:** Lenis is initialized inside the `Wrapper` component and uses `ReactLenis` with `autoRaf: false` tied to Tempus. If Tempus or the Lenis ref initialization fails, native scroll is the fallback.

**How to avoid:** Scroll slowly on the homepage — smooth easing is subtle but visible. If scrolling feels jagged or instant with no easing, Lenis may not be running. Check browser console for Lenis errors.

**Warning signs:** `lenisRef.current?.lenis` is null; console errors from Tempus integration.

### Pitfall 4: Sanity/Shopify Data Not Loading

**What goes wrong:** Pages render without content — empty product grids, no testimonials, placeholder layouts.

**Why it happens:** The dev server requires `.env.local` with Sanity and Shopify API credentials. If the dev server was started without valid env vars, data fetches fail silently or with server-side errors.

**How to avoid:** Before starting verification, confirm the homepage loads with real content (product images, testimonials, navigation links from Sanity). If content is missing, the env is the issue, not the CSS migration.

**Warning signs:** Empty product cards; no navigation items from `LAYOUT_QUERY`; missing testimonials.

### Pitfall 5: Cart Operations Against Shopify Staging vs Production

**What goes wrong:** Add-to-cart fails with a Shopify API error, or the cart data is from a different store than what production uses.

**Why it happens:** The dev server uses `.env.local` which may point to a Shopify development store, while production uses a different storefront. Cart operations may behave differently.

**How to avoid:** Test that add-to-cart succeeds (any product) and the cart drawer renders correctly. The visual test is about UI correctness — whether the success toast fires, whether the cart drawer opens, whether item counts update. Exact product data differences are acceptable.

### Pitfall 6: Missing key prop Console Errors

**What goes wrong:** The browser console shows `Each child in a list should have a unique "key" prop` errors from `ProductHighlightCarousel`.

**Why it happens:** Already documented in the playwright-mcp console logs from Phase 3 verification. This is a pre-existing issue unrelated to the migration.

**How to avoid:** Do not fix this in Phase 4. It is a pre-existing bug (v2 tech debt scope). Only fix issues that are migration-caused regressions.

---

## Code Examples

### Starting the Dev Server

```bash
cd /Users/armagansenol/Desktop/justdesignfx/mightyfull-shop && pnpm dev
# Server starts at http://localhost:3000
```

### Viewport Setup (Playwright MCP)

```javascript
// Desktop verification
browser_resize(1440, 900)
browser_navigate("http://localhost:3000")

// Mobile verification
browser_resize(375, 812)
browser_navigate("http://localhost:3000")
```

### Checking Responsive Class CSS Generation

```javascript
// Via browser_evaluate — confirm md: classes produce CSS rules
browser_evaluate(`() => {
  const el = document.querySelector('.md\\\\:grid');
  if (!el) return 'Element not found';
  const styles = getComputedStyle(el);
  return {
    display: styles.display,
    gridTemplateColumns: styles.gridTemplateColumns
  };
}`)
// Expected at 1440px: display: 'grid', gridTemplateColumns shows columns
// Broken: display: 'flex' or 'block' (ignoring md:grid)
```

### CSS Module Fix Pattern

If a layout is broken, the fix is typically in the corresponding `.module.css` file:

```css
/* Example: if grid wasn't applying due to missing base class */
/* components/customer-reviews/customer-reviews.module.css */
.root {
  /* ... */
}

@media (max-width: 768px) {
  .root {
    /* mobile-specific overrides */
  }
}
```

Tailwind class fixes are in the TSX file directly:
```tsx
// If xl: was missing from a layout section
<div className="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
```

### Final Build Gate

```bash
cd /Users/armagansenol/Desktop/justdesignfx/mightyfull-shop && pnpm build
# Must exit 0 with no TypeScript or CSS errors
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Automated visual regression (Percy/Chromatic) | Manual live comparison | Project decision | No infrastructure overhead; appropriate for one-time migration gate |
| Log-then-fix batch | Fix-as-you-go | User decision in CONTEXT.md | Context stays fresh; regressions caught immediately |

**Known pre-existing issues (do NOT fix):**
- Missing `key` prop in `ProductHighlightCarousel` — documented in console logs, pre-migration bug
- Image `quality="100"` warnings — not configured in `images.qualities` — pre-migration config issue

---

## Open Questions

1. **Is the TW v4 responsive variant regression actually resolved?**
   - What we know: `@source "../"` was added (commit `1f50f35`), and STATE.md Session Continuity says build is clean. But STATE.md also says the `@source` fix was "insufficient" (commit `08a2abd` which came after).
   - What's unclear: The two STATE.md sections contradict each other. The "Session Continuity" section says "Ready for visual verification" but the "Current Position" section says "VERIFICATION BLOCKED" and `@source` was insufficient.
   - Recommendation: Treat this as the highest-priority first check. Verify homepage at 1440px before anything else. If `md:grid` renders correctly on the homepage intro section, the regression is resolved. If not, fix it first before continuing with any other page.

2. **Which product slug exists in the Sanity/Shopify data for the product page test?**
   - What we know: The product page exists at `/shop/[slug]` and requires a valid Sanity product with a linked Shopify product.
   - What's unclear: Which slug to use for the single product page test.
   - Recommendation: Navigate to `/shop` first, click any product — that will naturally land on a valid `/shop/[slug]` URL to use for verification.

---

## Verification Architecture

`nyquist_validation` is not present in `.planning/config.json` — skip this section per instructions.

---

## Sources

### Primary (HIGH confidence)

- Project codebase — `app/(main)/`, `components/`, `styles/global.css`, `package.json` — direct inspection
- `.planning/STATE.md` — project decision log, responsive regression documentation
- `.planning/phases/04-visual-verification/04-CONTEXT.md` — locked user decisions for this phase
- `.planning/ROADMAP.md` — phase plan structure (2 plans: 04-01 desktop/mobile sweep, 04-02 interactive state verification)
- `.planning/phases/03-tailwind-v4-migration/03-VERIFICATION.md` — Phase 3 items requiring human browser verification (direct input to Phase 4 scope)
- `.playwright-mcp/console-2026-02-28T16-20-04-264Z.log` — pre-existing console errors inventory

### Secondary (MEDIUM confidence)

- Git log analysis — commit sequence `1f50f35` → `08a2abd` → `85bc765` establishes timeline of responsive regression discovery and phase context capture

---

## Metadata

**Confidence breakdown:**
- Site structure and routes: HIGH — direct filesystem inspection
- Responsive regression risk: HIGH — documented in STATE.md with commit evidence
- Interaction scope: HIGH — locked in CONTEXT.md by user
- Pass/fail criteria: HIGH — explicitly defined in CONTEXT.md
- Fix patterns: MEDIUM — standard CSS/TSX patterns, no novel techniques required

**Research date:** 2026-02-28
**Valid until:** Phase 4 execution (research covers static site structure; valid as long as codebase is unchanged)
