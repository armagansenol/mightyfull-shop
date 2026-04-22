---
phase: 03-tailwind-v4-migration
plan: 01
subsystem: ui
tags: [tailwindcss, postcss, css-modules, tw-animate-css, tailwind-merge]

# Dependency graph
requires:
  - phase: 02-scss-to-css-modules
    provides: All SCSS converted to CSS modules; global.css as pure CSS baseline
provides:
  - Tailwind CSS v4 with CSS-first @theme configuration
  - postcss.config.mjs using @tailwindcss/postcss
  - Consolidated design token source of truth in styles/global.css @theme block
  - tw-animate-css replacing tailwindcss-animate
  - tailwind-merge v3
affects: [03-tailwind-v4-migration, all-components-using-tailwind-utilities]

# Tech tracking
tech-stack:
  added:
    - tailwindcss@4.2.1 (upgraded from v3.4.19)
    - "@tailwindcss/postcss@4.2.1"
    - tw-animate-css@1.4.0 (replaces tailwindcss-animate)
    - tailwind-merge@3.5.0 (upgraded from v2)
  patterns:
    - CSS-first Tailwind config via @theme block in global.css
    - @plugin for typography instead of JS plugins array
    - @utility for container instead of theme.container JS config
    - --color-* namespace for all brand and semantic colors in @theme
    - Backward-compat :root aliases (--blue-ruin -> var(--color-blue-ruin)) for CSS modules

key-files:
  created: []
  modified:
    - styles/global.css (added @import tailwindcss, @theme block, removed tailwind-initial.css content)
    - postcss.config.mjs (replaced tailwindcss with @tailwindcss/postcss)
    - app/layout.tsx (removed tailwind-initial.css import)
    - package.json (tailwindcss v4, @tailwindcss/postcss, tw-animate-css, tailwind-merge v3)
    - components/ui/textarea.tsx (shadow-sm -> shadow-xs, outline-none -> outline-hidden)
    - components/ui/radio-group.tsx (outline-none -> outline-hidden)
    - components/ui/button.tsx (outline-none -> outline-hidden)
    - components/ui/checkbox.tsx (shadow -> shadow-xs, outline-none -> outline-hidden)
    - components/ui/select.tsx (outline-none -> outline-hidden, outline-none standalone -> outline-hidden)
    - components/ui/input.tsx (outline-none -> outline-hidden)
  deleted:
    - styles/tailwind-initial.css
    - tailwind.config.ts

key-decisions:
  - "CSS-first @theme replaces tailwind.config.ts as the single source of design token truth"
  - "Backward-compat :root aliases kept for --blue-ruin etc. so CSS modules and GSAP don't break without mass refactor"
  - "tw-animate-css replaces tailwindcss-animate; @import tw-animate-css provides accordion animations"
  - "tailwindcss-animate removed before codemod ran, codemod failed on CSS prettier parse — migration done manually"
  - "Official codemod (@tailwindcss/upgrade) skipped due to unbalanced paren in tailwind.config.ts chart color and prettier CSS parse error; all codemod outputs replicated manually"
  - "outline-none -> outline-hidden and shadow-sm -> shadow-xs applied to all Shadcn UI components"

patterns-established:
  - "@theme block in global.css is the Tailwind v4 design token registry"
  - "Brand colors in @theme use --color-{name} namespace for Tailwind utility generation"
  - "CSS modules continue using var(--color-name) aliases defined in :root"
  - "@plugin @tailwindcss/typography replaces JS plugins array"
  - "@utility container replaces theme.container JS object"

requirements-completed: [TW-01, TW-02, TW-03, TW-04, TW-05]

# Metrics
duration: 25min
completed: 2026-02-28
---

# Phase 03 Plan 01: Tailwind v4 Infrastructure Migration Summary

**Tailwind CSS upgraded from v3 to v4 with CSS-first @theme config in global.css, @tailwindcss/postcss PostCSS plugin, tw-animate-css animations, and tailwind-merge v3 — full build passing**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-02-28T07:52:00Z
- **Completed:** 2026-02-28T08:17:00Z
- **Tasks:** 2
- **Files modified:** 11 files (2 deleted)

## Accomplishments

- Upgraded Tailwind CSS from v3.4.19 to v4.2.1 with @tailwindcss/postcss PostCSS plugin
- Created comprehensive @theme block consolidating all design tokens from tailwind.config.ts, tailwind-initial.css, and global.css :root
- Replaced tailwindcss-animate with tw-animate-css and upgraded tailwind-merge to v3
- Deleted tailwind.config.ts and tailwind-initial.css — global.css is now the single source of truth
- Applied v4 class renames (outline-none -> outline-hidden, shadow-sm -> shadow-xs) in all Shadcn UI components
- Build passes without errors on Tailwind v4

## Task Commits

Each task was committed atomically:

1. **Task 1: Install TW v4 packages and run official codemod** - `0fa39fa` (feat)
2. **Task 2: Consolidate @theme block in global.css, delete tailwind-initial.css and tailwind.config.ts** - `3449bf6` (feat)

## Files Created/Modified

- `styles/global.css` - Added @import "tailwindcss", @theme block with all tokens, @plugin, @utility container; updated color var refs to --color-*
- `postcss.config.mjs` - Replaced tailwindcss plugin with @tailwindcss/postcss
- `app/layout.tsx` - Removed tailwind-initial.css import
- `package.json` - tailwindcss@4, @tailwindcss/postcss, tw-animate-css, tailwind-merge@3
- `components/ui/textarea.tsx` - shadow-sm -> shadow-xs, outline-none -> outline-hidden
- `components/ui/radio-group.tsx` - outline-none -> outline-hidden
- `components/ui/button.tsx` - outline-none -> outline-hidden
- `components/ui/checkbox.tsx` - shadow -> shadow-xs, outline-none -> outline-hidden
- `components/ui/select.tsx` - outline-none -> outline-hidden (2 instances)
- `components/ui/input.tsx` - outline-none -> outline-hidden
- `styles/tailwind-initial.css` - DELETED (content consolidated into global.css @theme)
- `tailwind.config.ts` - DELETED (replaced by CSS-first @theme in global.css)

## Decisions Made

- **CSS-first configuration:** All tokens now in @theme block — no JS config file. @theme `--color-*` namespace enables Tailwind v4 automatic utility class generation.
- **Backward-compat :root aliases:** Kept `--blue-ruin`, `--sugar-milk`, etc. as `:root` aliases pointing to `var(--color-blue-ruin)` etc. This avoids mass refactoring of CSS modules and GSAP animation code that reference the old variable names.
- **Manual codemod:** The official `@tailwindcss/upgrade` codemod failed due to: (1) missing tailwindcss-animate after we removed it, and (2) an unbalanced paren in tailwind.config.ts `'var(--chart-1))'` causing prettier parse failure. All codemod effects were applied manually.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added :root aliases for backward-compat with CSS modules**
- **Found during:** Task 2 (consolidate @theme block)
- **Issue:** After moving brand colors to @theme `--color-*` namespace and deleting the `:root` `--blue-ruin` etc. declarations, all CSS modules and GSAP animations referencing `var(--blue-ruin)` would break. Dozens of CSS module files use these old variable names.
- **Fix:** Added `:root` block with `--blue-ruin: var(--color-blue-ruin)` aliases for all brand colors, preserving backward compatibility without mass refactoring.
- **Files modified:** styles/global.css
- **Verification:** `pnpm build` passes; CSS modules continue to resolve brand colors correctly.
- **Committed in:** 3449bf6 (Task 2 commit)

**2. [Rule 3 - Blocking] Official codemod failed — manual migration performed**
- **Found during:** Task 1 (run official codemod)
- **Issue:** `@tailwindcss/upgrade` codemod failed because (1) tailwindcss-animate was already removed so config couldn't load, and (2) after removing that import, prettier threw "Unbalanced parenthesis" on `'var(--chart-1))'` in tailwind.config.ts preventing CSS migration.
- **Fix:** Performed all codemod operations manually: installed tailwindcss@4 and @tailwindcss/postcss via pnpm, rewrote postcss.config.mjs, applied v4 class renames in UI components.
- **Files modified:** package.json, pnpm-lock.yaml, postcss.config.mjs, all UI components
- **Verification:** `pnpm build` passes with tailwindcss@4.2.1
- **Committed in:** 0fa39fa (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 blocking issue)
**Impact on plan:** Both essential for a working build. Backward-compat aliases prevent breaking dozens of CSS modules without requiring a mass refactor.

## Issues Encountered

- `@tailwindcss/upgrade` codemod could not run due to missing tailwindcss-animate (which we pre-removed) and a pre-existing typo in tailwind.config.ts (`var(--chart-1))` with extra closing paren). Resolved by performing all migration steps manually.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Tailwind v4 infrastructure complete, ready for Plan 02 (utility class migration / visual verification)
- All brand colors available as both `bg-blue-ruin` (via @theme --color-blue-ruin) and `var(--blue-ruin)` (via :root alias)
- Accordion animations provided by tw-animate-css @import
- Typography plugin available via @plugin @tailwindcss/typography
- No blockers identified

---
*Phase: 03-tailwind-v4-migration*
*Completed: 2026-02-28*
