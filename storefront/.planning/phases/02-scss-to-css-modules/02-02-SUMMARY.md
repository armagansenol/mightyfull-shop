---
phase: 02-scss-to-css-modules
plan: 02
subsystem: ui
tags: [css-modules, scss-migration, tailwind, native-css]

# Dependency graph
requires:
  - phase: 02-01
    provides: global.css with CSS custom properties and sassOptions.prependData for remaining .module.scss files
provides:
  - 9 Wave B simple .module.css files (faq, privacy-policy, embla, horizontal-scroll, price, img, loading-spinner, scrollable-box, video)
  - 6 Wave C batch 1 moderate .module.css files (marquee, noticebar, quantity, product-card, scrollbar, edit-quantity-button)
  - JSX import paths updated for all 15 converted modules
affects: 02-03, 02-04

# Tech tracking
tech-stack:
  added: []
  patterns: [native CSS nesting, @media for responsive breakpoints, fixed px values replacing vw(), @keyframes inside .module.css selector scope]

key-files:
  created:
    - app/(main)/faq/faq.module.css
    - app/(main)/privacy-policy/privacy-policy.module.css
    - components/auto-scroll-carousel/embla.module.css
    - components/horizontal-scroll/horizontal-scroll.module.css
    - components/price/price.module.css
    - components/utility/img/img.module.css
    - components/utility/loading-spinner/loading-spinner.module.css
    - components/utility/scrollable-box/scrollable-box.module.css
    - components/utility/video/video.module.css
    - components/marquee/marquee.module.css
    - components/noticebar/noticebar.module.css
    - components/quantity/quantity.module.css
    - components/product-card/product-card.module.css
    - components/utility/scrollbar/scrollbar.module.css
    - components/cart/edit-quantity-button/edit-quantity-button.module.css
  modified:
    - components/auto-scroll-carousel/index.tsx
    - components/horizontal-scroll/index.tsx
    - components/price/LoadingPrice.tsx
    - components/utility/img/index.tsx
    - components/utility/loading-spinner/index.tsx
    - components/utility/scrollable-box/index.tsx
    - components/utility/video/Video.tsx
    - components/marquee/Marquee.tsx
    - components/noticebar/index.tsx
    - components/quantity/index.tsx
    - components/product-card/index.tsx
    - components/utility/scrollbar/index.tsx

key-decisions:
  - "vw() calls in moderate modules replaced with fixed px values in CSS module (not Tailwind classes in JSX) for responsive pairs that use @media (max-width: 800px) — keeps responsive logic co-located in CSS"
  - "scrollbar.module.css fixed @media (--mobile) to @media (max-width: 800px) — custom media queries not supported in browsers"
  - "marquee @keyframes defined inside .marquee selector scope — valid in native CSS nesting"
  - "edit-quantity-button.module.scss converted even though no TSX imports it — file consistency"
  - "noticebar JSX updated with text-sm and w/h Tailwind classes for desktop font-size and iconC sizing"

patterns-established:
  - "Wave B pattern: rename + inline @include dims() expansion, remove SCSS variables with literal values"
  - "Wave C pattern: @include mobile/desktop/hover/reduced-motion -> @media equivalents; vw() -> fixed px values in CSS or Tailwind classes in JSX"
  - "native CSS nesting: element children need & prefix (& > div), class/pseudo selectors nest without &"
  - "@media (--mobile) is a non-standard custom media query — replace with @media (max-width: 800px)"

requirements-completed: [CSS-05, CSS-06, CSS-07, CSS-08, CSS-09, CSS-11, CSS-13]

# Metrics
duration: 15min
completed: 2026-02-27
---

# Phase 2 Plan 02: Wave B + Wave C Batch 1 SCSS to CSS Modules

**15 SCSS modules converted to plain CSS: 9 simple Wave B renames and 6 moderate Wave C conversions with @media replacements and vw() elimination**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-27T08:45:00Z
- **Completed:** 2026-02-27T09:00:00Z
- **Tasks:** 3 of 3 complete
- **Files modified:** 27 (15 CSS created, 15 SCSS deleted, 12 TSX updated)

## Accomplishments
- Converted all 9 Wave B trivial modules: renamed .scss to .css, expanded @include dims(), replaced SCSS variables with literals, converted // to /* */ comments
- Converted 6 Wave C moderate modules: replaced @include mobile/desktop/reduced-motion with native @media queries, replaced vw() with fixed px values, fixed non-standard @media (--mobile) in scrollbar
- Updated all 12 JSX/TSX files importing these modules (3 files had no imports so no TSX changes)
- Build passes cleanly with all 15 new CSS modules

## Task Commits

1. **Task 1: Convert Wave B simple modules (9 files)** - `1eb51c7` (feat)
2. **Task 2: Convert Wave C batch 1 moderate modules (6 files)** - `0b93411` (feat)
3. **Task 3: Visual verification** - human-approved (1440px + 375px viewports)

## Files Created/Modified

**Wave B (9 CSS modules created, 9 SCSS deleted):**
- `app/(main)/faq/faq.module.css` - Empty module (was empty SCSS)
- `app/(main)/privacy-policy/privacy-policy.module.css` - Empty module (was empty SCSS)
- `components/auto-scroll-carousel/embla.module.css` - Pure CSS copy (no SCSS constructs)
- `components/horizontal-scroll/horizontal-scroll.module.css` - SCSS vars replaced with #222 literal
- `components/price/price.module.css` - Direct rename, no changes needed
- `components/utility/img/img.module.css` - @include dims(100%) -> width/height: 100%
- `components/utility/loading-spinner/loading-spinner.module.css` - @include dims(80px) expanded, & > div added
- `components/utility/scrollable-box/scrollable-box.module.css` - // comment -> /* */
- `components/utility/video/video.module.css` - @include dims(100%) -> width/height: 100%, // removed

**Wave C batch 1 (6 CSS modules created, 6 SCSS deleted):**
- `components/marquee/marquee.module.css` - @include reduced-motion/mobile -> @media
- `components/noticebar/noticebar.module.css` - @include dims expanded, vw() -> fixed rem, @include mobile -> @media
- `components/quantity/quantity.module.css` - vw() -> fixed px/rem, @include mobile -> @media
- `components/product-card/product-card.module.css` - all vw() -> fixed px, @include mobile/desktop -> @media
- `components/utility/scrollbar/scrollbar.module.css` - @media (--mobile) -> @media (max-width: 800px), vw() -> fixed px
- `components/cart/edit-quantity-button/edit-quantity-button.module.css` - vw() -> fixed px/rem

**TSX files updated (12):**
- auto-scroll-carousel/index.tsx, horizontal-scroll/index.tsx, price/LoadingPrice.tsx, utility/img/index.tsx, utility/loading-spinner/index.tsx, utility/scrollable-box/index.tsx, utility/video/Video.tsx, marquee/Marquee.tsx, noticebar/index.tsx, quantity/index.tsx, product-card/index.tsx, utility/scrollbar/index.tsx

## Decisions Made
- vw() calls in moderate modules replaced with fixed px values in the CSS module using @media breakpoints, rather than Tailwind classes in JSX, for responsive pairs. This keeps responsive sizing logic co-located in the CSS module.
- noticebar is the only component where Tailwind classes were added to JSX (text-sm and w/h for iconC) since those are single-viewport (desktop) values without a responsive pair.
- scrollbar @media (--mobile) pitfall fixed: custom media queries are not browser-supported — replaced with @media (max-width: 800px).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed vw() responsive strategy for CSS module components**
- **Found during:** Task 2 (noticebar, quantity, product-card conversions)
- **Issue:** Plan specified Tailwind-first approach for vw() replacement, but most properties had responsive @include mobile counterparts making Tailwind class approach complex (Tailwind is mobile-first, project uses max-width: 800px breakpoints)
- **Fix:** Used fixed px values in CSS module with @media (max-width: 800px) for responsive pairs; used Tailwind classes in JSX only for desktop-only values (noticebar font-size, iconC sizing)
- **Files modified:** noticebar/index.tsx (Tailwind classes added), all other responsive values in CSS modules
- **Verification:** Build passes, no SCSS syntax remains

---

**Total deviations:** 1 auto-decision (responsive strategy refinement)
**Impact on plan:** Minor strategy refinement — plan allowed calc() fallback for properties without Tailwind equivalents; used CSS module @media approach for cleaner responsive handling.

## Issues Encountered
None beyond the responsive strategy decision above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 15 of ~31 SCSS modules converted and visually verified at 1440px and 375px
- All 3 tasks complete — plan fully closed
- Plans 02-03 and 02-04 will convert the remaining Wave C complex modules and Wave D files

---
*Phase: 02-scss-to-css-modules*
*Completed: 2026-02-27*
