---
phase: 04-visual-verification
plan: 01
subsystem: ui
tags: [tailwind-v4, css-modules, css-layers, visual-regression, responsive, playwright]

# Dependency graph
requires:
  - phase: 03-tailwind-v4-migration
    provides: TW v4 CSS pipeline, @layer utilities, responsive md:/xl: variants
  - phase: 02-scss-to-css-modules
    provides: CSS modules for all components, global.css with custom reset
provides:
  - Visual parity confirmed for all 8 pages at 1440px desktop and 375px mobile
  - Critical TW v4 CSS cascade layer regression identified and fixed
  - Before/after screenshots for all 8 pages at both viewports
affects: [04-02-interactive-verification, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS layer isolation: custom CSS resets must be in @layer base to allow @layer utilities to override"
    - "TW v4 layered CSS: unlayered CSS always wins over all @layer blocks regardless of specificity"

key-files:
  created:
    - ".planning/phases/04-visual-verification/screenshots/ (58 screenshots)"
  modified:
    - "styles/global.css"

key-decisions:
  - "Wrap custom CSS reset in @layer base: in TW v4, unlayered CSS wins over @layer utilities, so the new-css-reset display:revert was blocking all Tailwind display utilities (.flex, .grid, md:grid etc.)"
  - "Production site shows missing Sanity CMS content on contact/faq pages: not a CSS migration regression, flagged as pre-existing data issue"

patterns-established:
  - "When upgrading from TW v3 to v4: audit all unlayered global CSS for display/layout properties that could override @layer utilities"
  - "CSS @layer cascade rule: unlayered CSS > @layer utilities > @layer base > browser defaults, regardless of selector specificity"

requirements-completed: [VER-01, VER-02]

# Metrics
duration: 22min
completed: 2026-02-28
---

# Phase 4 Plan 1: Visual Verification (Desktop + Mobile Sweep) Summary

**TW v4 unlayered CSS reset regression fixed: CSS reset wrapped in @layer base restores all Tailwind utility classes (.flex, .grid, md:grid, md:hidden, xl: variants) across all 8 pages at desktop (1440px) and mobile (375px)**

## Performance

- **Duration:** 22 min
- **Started:** 2026-02-28T18:03:19Z
- **Completed:** 2026-02-28T18:25:22Z
- **Tasks:** 3 of 3 (All tasks complete — Task 3 human-verify checkpoint approved 2026-03-01)
- **Files modified:** 1 (styles/global.css)

## Accomplishments

- Identified and fixed critical TW v4 CSS cascade layer regression: the project's custom CSS reset was unlayered and overriding ALL Tailwind utility display classes
- Verified all 8 pages at 1440px desktop: `.flex`, `.grid`, `md:grid`, `md:hidden`, `xl:` variants all apply correctly
- Verified all 8 pages at 375px mobile: responsive behavior correct (`md:grid` collapses to flex on mobile), no horizontal overflow on any page
- Clean `pnpm build` passes after fix
- 58 comparison screenshots saved (dev vs production, desktop and mobile) for human review

## Task Commits

Each task was committed atomically:

1. **Task 1: Desktop sweep + CSS layer fix** - `5d1e5d7` (fix)
2. **Task 2: Mobile verification screenshots** - `929ce4d` (feat)
3. **Task 3: Human confirms visual parity** - *APPROVED 2026-03-01 — visual parity confirmed by user*

## Files Created/Modified

- `styles/global.css` - Section 2 (CSS reset) wrapped in `@layer base` to restore TW v4 utility class cascade priority
- `.planning/phases/04-visual-verification/screenshots/` - 58 comparison screenshots (dev vs prod, 8 pages × 2 viewports × 2 sites, plus intermediate verification shots)

## Decisions Made

- **Wrap custom CSS reset in @layer base:** The project's new-css-reset (v1.7.3) has an unlayered `*:where(...) { all: unset; display: revert }` rule. In TW v4, all utilities are in `@layer utilities`, which loses to any unlayered CSS. Wrapping the reset in `@layer base` puts it in the CSS cascade layer system so `@layer utilities` can override it.

- **Production site Sanity content gaps are not regressions:** Production `/contact` and `/faq` pages appear to have missing Sanity CMS content in screenshots (no contact form fields, no FAQ filter buttons visible in prod). This is pre-existing and not caused by the CSS migration.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Unlayered CSS reset blocking TW v4 utility classes**
- **Found during:** Task 1 (desktop sweep - TW v4 responsive variant check)
- **Issue:** The project's custom CSS reset from `_reset.scss` was migrated to `global.css` as unlayered CSS. The rule `*:where(:not(html, ...)) { all: unset; display: revert }` is unlayered. In TW v4, `@layer utilities` (where `.flex`, `.grid`, `md:grid`, etc. live) is a named CSS cascade layer. Per CSS spec, unlayered styles always have higher priority than all named layers, regardless of selector specificity. Result: all Tailwind display utilities were overridden by `display: revert`.
- **Fix:** Wrapped entire Section 2 (new-css-reset) in `@layer base { ... }` so it participates in the named layer cascade. Since `@layer base` is declared before `@layer utilities` in TW v4's layer order, the utilities correctly win.
- **Files modified:** `styles/global.css`
- **Verification:** Browser computed styles confirm `.flex` = `flex`, `.grid` = `grid`, `md:grid` = `grid` at 1440px, `md:grid` = `flex` at 375px; no horizontal overflow; `pnpm build` passes cleanly
- **Committed in:** `5d1e5d7` (fix(04-01): wrap CSS reset in @layer base)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** The fix was necessary for the TW v4 migration to be functional. Without it, ALL responsive grid and flex layouts across the entire site would be broken (displaying as `block` on desktop). This was the root cause of the TW v4 responsive variant regression documented in STATE.md.

## Issues Encountered

- **Turbopack HMR delayed CSS recompilation:** After editing `global.css`, the dev server's on-disk CSS file (`styles_global_5f91b235.css`) was not immediately updated. Turbopack serves CSS from its in-memory incremental cache (not the disk file). The in-memory version reflected the change, but the disk file lagged. Resolved by restarting the dev server + clearing turbopack cache. The fix was verified correct by browser computed style inspection.

- **Stale disk CSS file (same content hash):** The compiled CSS filename uses content hashing. After the fix, the hash remained `5f91b235` because Turbopack had already compiled the correct version (with `@layer base` wrapping) into its in-memory cache from a previous hot compilation attempt that didn't write to disk. The browser was receiving correct CSS all along from the in-memory serve, but the disk file appeared stale.

## User Setup Required

None - no external service configuration required.

## Visual Verification Summary

### Desktop (1440px) — All Pages PASS

| Page | .flex | md:grid | md:hidden | xl: | Status |
|------|-------|---------|-----------|-----|--------|
| `/` (homepage) | PASS | PASS (grid) | PASS (none) | 3 elements | PASS |
| `/shop` | PASS | PASS (grid) | PASS (none) | 0 | PASS |
| `/shop/[slug]` | PASS | PASS (grid) | N/A | 0 | PASS |
| `/our-story` | PASS | PASS (grid) | PASS (none) | 0 | PASS |
| `/contact` | PASS | N/A | PASS (none) | 0 | PASS |
| `/faq` | PASS | N/A | PASS (none) | 1 element | PASS |
| `/privacy-policy` | PASS | N/A | N/A | 0 | PASS |
| `/store-locator` | PASS | N/A | N/A | 0 | PASS |

### Mobile (375px) — All Pages PASS

| Page | md:grid collapses | md:hidden shows | Horiz. overflow | Status |
|------|------------------|-----------------|-----------------|--------|
| `/` (homepage) | PASS (flex) | PASS (visible) | PASS (no) | PASS |
| `/shop` | PASS (flex) | PASS (visible) | PASS (no) | PASS |
| `/shop/[slug]` | PASS | N/A | PASS (no) | PASS |
| `/our-story` | PASS (flex) | PASS (visible) | PASS (no) | PASS |
| `/contact` | N/A | PASS (visible) | PASS (no) | PASS |
| `/faq` | N/A | PASS (visible) | PASS (no) | PASS |
| `/privacy-policy` | N/A | N/A | PASS (no) | PASS |
| `/store-locator` | N/A | N/A | PASS (no) | PASS |

### Known Acceptable Differences (Not Regressions)

1. **Production Sanity content gaps:** `/contact` and `/faq` show less content on production (no contact form fields, no FAQ filter tabs). This is a pre-existing Sanity CMS data issue on the production deployment, not caused by the CSS migration.
2. **GSAP animation state in screenshots:** Some pages (e.g., store-locator) show the header area in pre-animation state in screenshots (raw text, no styling applied yet). This is because GSAP initializes after DOM render and screenshots capture the initial state. Not a bug.
3. **1-2px spacing differences:** Acceptable per plan criteria.

## Next Phase Readiness

- All 8 pages confirmed visually correct at desktop (1440px) and mobile (375px)
- The TW v4 CSS cascade layer bug is fixed — all responsive and layout utilities now work
- Task 3 human confirmation checkpoint approved 2026-03-01 — user confirmed visual parity is acceptable
- Ready for Phase 04-02 interactive verification

---
*Phase: 04-visual-verification*
*Completed: 2026-02-28*
