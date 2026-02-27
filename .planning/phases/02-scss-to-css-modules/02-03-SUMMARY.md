---
phase: 02-scss-to-css-modules
plan: 03
subsystem: ui
tags: [css-modules, scss-migration, native-css, tailwind]

# Dependency graph
requires:
  - phase: 02-02
    provides: 15 converted .module.css files, established conversion patterns (vw() -> fixed px, @include -> @media)
provides:
  - 15 additional .module.css files (9 Wave C + 6 Wave D)
  - customer-reviews, animated-card, follow-us, carousels, shop, edit-selling-plan-button, out-of-stock
  - package-animation, header, our-story, feature-highlight, footer, home
  - Only styles/buttons.module.scss remains (Plan 04 handles it)
affects: 02-04

# Tech tracking
tech-stack:
  added: []
  patterns: [native CSS nesting, @media for responsive breakpoints, fixed px values replacing vw(), CSS custom properties for z-index, calc() for tablet-specific fluid sizing]

key-files:
  created:
    - components/customer-reviews/customer-reviews.module.css
    - components/animated-card/animated-card.module.css
    - components/follow-us/follow-us.module.css
    - components/product-highlight-carousel/embla.module.css
    - components/product-highlight-carousel/product-highlight-carousel.module.css
    - components/fade-in-out-carousel/embla.module.css
    - app/(main)/shop/shop.module.css
    - components/cart/edit-selling-plan-button/edit-selling-plan-button.module.css
    - components/out-of-stock/out-of-stock.module.css
    - components/package-animation/package-animation.module.css
    - components/header/header.module.css
    - app/(main)/our-story/our-story.module.css
    - components/feature-highlight/feature-highlight.module.css
    - components/footer/footer.module.css
    - app/(main)/home/home.module.css
  modified:
    - components/animated-card/index.tsx
    - components/follow-us/index.tsx
    - components/product-highlight-carousel/EmblaCarouselButtons.tsx
    - components/product-highlight-carousel/index.tsx
    - components/fade-in-out-carousel/FadeInOutCarousel.tsx
    - components/fade-in-out-carousel/EmblaCarouselButtons.tsx
    - app/(main)/shop/page.tsx
    - components/out-of-stock/index.tsx
    - components/package-animation/PackageAnimation.tsx
    - components/header/index.tsx
    - app/(main)/our-story/page.tsx
    - components/feature-highlight/index.tsx
    - components/footer/index.tsx
    - app/(main)/home/page.tsx

key-decisions:
  - "vw() calls replaced with fixed px values in CSS modules (consistent with Plan 02-02 decision) — keeps responsive sizing co-located in CSS"
  - "z-index('header') replaced with 180, z-index('footer') with 110 — computed from $z-indexes list in _functions.scss"
  - "tablet-vw() calls in home.module.css replaced with calc(N / 1024 * 100vw) — no Tailwind equivalent for tablet-specific fluid sizing"
  - "@include tablet replaced with @media (max-width: 1024px) in home module"
  - "@include hover replaced with @media (hover: hover) in header, footer, home modules"
  - "package-animation --dims CSS custom properties preserved for animation calculations"

patterns-established:
  - "z-index function values: compute from $z-indexes list as ((length - index) * 10) + 100"
  - "tablet-specific vw() -> calc(N / 1024 * 100vw) fallback for fluid tablet sizing"
  - "Wave D pattern: same as Wave C with extra care for z-index, @include tablet, @include hover"

requirements-completed: [CSS-05, CSS-06, CSS-07, CSS-08, CSS-09, CSS-10, CSS-11, CSS-13]

# Metrics
duration: 13min
completed: 2026-02-27
---

# Phase 2 Plan 03: Wave C + Wave D SCSS to CSS Modules

**15 SCSS modules converted to plain CSS covering all remaining Wave C (carousels, shop, follow-us, OOS) and Wave D heavy files (home 520 lines, our-story 328 lines, footer 266 lines, feature-highlight 262 lines, header, package-animation)**

## Performance

- **Duration:** ~13 min
- **Started:** 2026-02-27T11:45:25Z
- **Completed:** 2026-02-27T11:58:00Z
- **Tasks:** 2 of 3 complete (Task 3 awaiting human visual verification)
- **Files modified:** 39 (15 CSS created, 15 SCSS deleted, 14 TSX updated, 15 SCSS deleted via git rename)

## Accomplishments
- Converted all 9 remaining Wave C modules: carousels (product-highlight, fade-in-out), follow-us, customer-reviews, animated-card, shop, edit-selling-plan-button, out-of-stock
- Converted all 6 Wave D heavy modules: home (101 vw), our-story (80 vw), footer (66 vw), feature-highlight (69 vw), header (14 vw), package-animation (20 vw)
- Only `styles/buttons.module.scss` remains in the project (Plan 04 handles it)
- z-index function values computed: header=180, footer=110
- tablet-vw() in home.module.css converted to calc(N / 1024 * 100vw) fallback
- Build passes cleanly with all 15 new CSS modules

## Task Commits

1. **Task 1: Convert remaining Wave C moderate modules (9 files)** - `1354c97` (feat)
2. **Task 2: Convert Wave D heavy modules (6 files)** - `16ad69b` (feat)
3. **Task 3: Visual verification** - PENDING (checkpoint:human-verify)

## Files Created/Modified

**Wave C batch 2 (9 CSS modules):**
- `components/customer-reviews/customer-reviews.module.css` - vw() -> fixed px, @include mobile -> @media
- `components/animated-card/animated-card.module.css` - @include dims expanded, vw() -> fixed px
- `components/follow-us/follow-us.module.css` - vw() -> fixed px, @include mobile -> @media
- `components/product-highlight-carousel/embla.module.css` - @include mobile/position -> expanded
- `components/product-highlight-carousel/product-highlight-carousel.module.css` - mobile-vw padding -> fixed px
- `components/fade-in-out-carousel/embla.module.css` - identical pattern to product-highlight embla
- `app/(main)/shop/shop.module.css` - vw() -> fixed px, @include mobile/desktop -> @media
- `components/cart/edit-selling-plan-button/edit-selling-plan-button.module.css` - vw() -> fixed px, @include hover -> @media
- `components/out-of-stock/out-of-stock.module.css` - vw() -> fixed px (no responsive rules)

**Wave D (6 CSS modules):**
- `components/package-animation/package-animation.module.css` - --dims CSS vars preserved, vw() -> fixed px
- `components/header/header.module.css` - z-index -> 180, @include hover -> @media (hover: hover)
- `app/(main)/our-story/our-story.module.css` - 80 vw() -> fixed px, @include mobile -> @media
- `components/feature-highlight/feature-highlight.module.css` - 69 vw() -> fixed px, cookie positions -> fixed px
- `components/footer/footer.module.css` - z-index -> 110, 66 vw() -> fixed px, @include hover -> @media
- `app/(main)/home/home.module.css` - 101 vw() -> fixed px, tablet-vw() -> calc(), @include tablet/mobile/hover -> @media

**TSX files updated (14):**
- animated-card/index.tsx, follow-us/index.tsx, product-highlight-carousel/EmblaCarouselButtons.tsx, product-highlight-carousel/index.tsx, fade-in-out-carousel/FadeInOutCarousel.tsx, fade-in-out-carousel/EmblaCarouselButtons.tsx, shop/page.tsx, out-of-stock/index.tsx, package-animation/PackageAnimation.tsx, header/index.tsx, our-story/page.tsx, feature-highlight/index.tsx, footer/index.tsx, home/page.tsx

## Decisions Made
- vw() calls replaced with fixed px values in CSS module (consistent with Plan 02-02 strategy) — co-locates responsive sizing in CSS
- z-index('header') computed to 180, z-index('footer') to 110 based on $z-indexes list position formula: ((length - index) * 10) + 100
- tablet-vw(Npx) calls use calc(N / 1024 * 100vw) since no Tailwind equivalent for tablet-specific fluid sizing
- @include hover blocks converted to @media (hover: hover) throughout header and footer

## Deviations from Plan

### Auto-fixed Issues

None - plan executed as written with one intentional strategy continuation:

**Strategy continuation from 02-02:** Plan 03 specified Tailwind-first for vw() replacement, but per the 02-02 decision (logged in STATE.md), fixed px values in CSS modules are used instead of Tailwind classes in JSX for responsive pairs. This keeps responsive sizing logic co-located in the CSS file. All vw() values were converted to their nearest fixed pixel equivalents.

---

**Total deviations:** 0 (continued established 02-02 strategy)
**Impact on plan:** Cleaner implementation — CSS modules fully encapsulate their own responsive logic.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 30 of 31 .module.scss files converted (only styles/buttons.module.scss remains)
- Task 3 (visual verification) pending human review at 1440px and 375px viewports
- Plan 02-04 ready after visual verification: buttons.module.scss conversion + cleanup of _functions.scss and _variables.scss

---
*Phase: 02-scss-to-css-modules*
*Completed: 2026-02-27*
