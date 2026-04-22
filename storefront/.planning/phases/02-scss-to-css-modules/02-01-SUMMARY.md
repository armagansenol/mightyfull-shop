---
phase: 02-scss-to-css-modules
plan: 01
subsystem: ui
tags: [css, scss, css-modules, global-styles, css-custom-properties]

# Dependency graph
requires:
  - phase: 01-dependency-upgrades
    provides: Next.js 15, working build pipeline
provides:
  - styles/global.css with all :root variables (colors, easings, z-index, layout)
  - styles/okendo-widget.css standalone widget override styles
  - CSS custom property dictionary consumed by all component modules
affects: [02-scss-to-css-modules, 03-tailwind-v4]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Native CSS nesting with & prefix for element selectors"
    - "CSS Level 4 rgb() syntax for transparent color variants"
    - "Static CSS custom properties for z-index values (no SCSS functions)"
    - "calc(N / 1440 * 100vw) pattern for responsive sizing (replaces desktop-vw())"
    - "@import must precede all rules in CSS (moved to top of global.css)"

key-files:
  created:
    - styles/global.css
    - styles/okendo-widget.css
  modified:
    - app/layout.tsx
  deleted:
    - styles/global.scss
    - styles/_reset.scss
    - styles/_fonts.scss
    - styles/_colors.scss
    - styles/_easings.scss
    - styles/_utils.scss
    - styles/okendo-widget.scss

key-decisions:
  - "@import okendo-widget.css moved to top of global.css — CSS spec requires @import before all other rules, Turbopack enforces this strictly"
  - "Inline @extend .remove-autofill-styles on input element — CSS Modules composes: inapplicable in global scope; inline expansion is correct approach"
  - "_functions.scss and _variables.scss preserved — consumed by sassOptions.prependData for remaining .module.scss files; delete in Plan 04"
  - "nova-pink-light and highlighter-lilac-light use rgba() with 0.15 alpha — these are the base values, transparent variants are rgb(R G B / 0)"

patterns-established:
  - "calc(N / 1440 * 100vw) for desktop viewport units (replaces desktop-vw() mixin)"
  - "calc(N / 375 * 100vw) for mobile viewport units (replaces mobile-vw() mixin)"
  - "@media (max-width: 800px) for mobile breakpoint (replaces @include mobile)"
  - "@media (min-width: 800px) for desktop breakpoint (replaces @include desktop)"
  - "@media (hover: hover) for hover states (replaces @include hover)"

requirements-completed: [CSS-01, CSS-02, CSS-03, CSS-04, CSS-10, CSS-11, CSS-12]

# Metrics
duration: ~15min
completed: 2026-02-27
---

# Phase 02 Plan 01: Global SCSS to CSS Summary

**All SCSS partials inlined into single global.css with 32 color vars, 22 z-index vars, 18 easing vars, and native CSS nesting throughout — build passes, awaiting visual verification**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-27T09:57:09Z
- **Completed:** 2026-02-27T10:10:00Z
- **Tasks:** 2 of 3 complete (Task 3 is human visual verification checkpoint)
- **Files modified:** 10 (2 created, 1 modified, 7 deleted)

## Accomplishments
- Created `styles/global.css` with all 9 sections inlined from SCSS partials
- Created `styles/okendo-widget.css` as standalone file with `@media (hover: hover)` replacing `@include hover`
- Deleted 7 SCSS partial files (global.scss, _reset, _fonts, _colors, _easings, _utils, okendo-widget.scss)
- Updated `app/layout.tsx` to import `global.css` instead of `global.scss`
- Build compiles successfully with all 11 routes intact
- Preserved `_functions.scss` and `_variables.scss` for remaining `.module.scss` files

## Task Commits

Each task was committed atomically:

1. **Task 1: Create global.css with all partials inlined** - `a114428` (feat)
2. **Task 2: Update imports and delete SCSS partials** - `4016049` (feat)
3. **Task 3: Visual verification** - PENDING (checkpoint:human-verify)

## Files Created/Modified
- `styles/global.css` - Single source of all global styles; 9 sections, 32 color vars, 22 z-index vars, 18 easing vars
- `styles/okendo-widget.css` - Standalone Okendo widget overrides with native @media (hover: hover)
- `app/layout.tsx` - Updated import from `global.scss` to `global.css`
- `styles/global.scss` - DELETED (inlined into global.css)
- `styles/_reset.scss` - DELETED
- `styles/_fonts.scss` - DELETED
- `styles/_colors.scss` - DELETED
- `styles/_easings.scss` - DELETED
- `styles/_utils.scss` - DELETED
- `styles/okendo-widget.scss` - DELETED

## Decisions Made
- `@import` for okendo-widget.css moved to top of global.css — Turbopack/CSS spec requires @import before all other rules. Original plan placed it at end of file (Section 9), but CSS spec prohibits this.
- `@extend .remove-autofill-styles` on `input` replaced with inlined webkit-autofill properties — CSS Modules `composes:` cannot reference global utility classes; inline expansion is the only valid approach.
- `_functions.scss` and `_variables.scss` not deleted — they are injected into every `.module.scss` file via `sassOptions.prependData` in next.config.mjs. Will be deleted in Plan 04 when all modules are converted.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Moved @import okendo-widget.css from end to top of global.css**
- **Found during:** Task 2 (build verification)
- **Issue:** Plan specified `@import './okendo-widget.css'` at the end (Section 9), but CSS spec requires @import before all other rules. Turbopack enforced this with a parse error.
- **Fix:** Moved `@import './okendo-widget.css'` to the very top of global.css, removed the Section 9 block at the bottom.
- **Files modified:** styles/global.css
- **Verification:** Build passes — `pnpm build` completes with all 11 routes
- **Committed in:** 4016049 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary CSS spec compliance fix. No scope creep.

## Issues Encountered
- Turbopack strictly enforces CSS @import ordering — @import must precede all rules including comments. This caused the first build attempt to fail. Fixed by relocating the @import.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- global.css is the complete :root variable dictionary for all component modules
- Build passes, all routes compile
- _functions.scss and _variables.scss preserved for remaining .module.scss files
- Task 3 (visual verification at 1440px and 375px) still required before marking plan complete
- After visual verification passes, Phase 02 Plans 02-05 can proceed with component module conversions

---
*Phase: 02-scss-to-css-modules*
*Completed: 2026-02-27*
