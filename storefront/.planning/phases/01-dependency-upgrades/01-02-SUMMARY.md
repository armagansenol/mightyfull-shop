---
phase: 01-dependency-upgrades
plan: 02
subsystem: dependencies
tags: [gsap, motion, lenis, embla-carousel, sanity, next-sanity, portabletext, shopify, hydrogen-react, radix-ui]

requires:
  - phase: 01-dependency-upgrades
    provides: [pnpm-foundation, verified-async-api-compliance]
provides:
  - animation-libraries-at-latest
  - cms-libraries-at-latest
  - shopify-at-latest
  - radix-ui-at-latest
affects: [02-scss-migration, 03-tailwind-upgrade]

tech-stack:
  added: []
  patterns: [group-commit-upgrade-strategy]

key-files:
  created: []
  modified: [package.json, pnpm-lock.yaml]

key-decisions:
  - "Upgraded animation group (GSAP, Motion, Lenis, Embla) as first commit — all minor bumps, no breaking changes"
  - "Upgraded Sanity group (sanity 3->5, next-sanity 9->12, @portabletext/react 3->6) together due to peer dep relationships — build passed without any API migration needed"
  - "ImageAsset from sanity v5 resolved as type-only re-export via @sanity/types — TypeScript accepted it without changes"
  - "Shopify hydrogen-react upgraded from 2025.1.3 to 2026.1.1 — vite peer dep warning suppressed by existing peerDependencyRules"
  - "Radix UI packages (11 packages) all upgraded to latest minor versions — no breaking changes, build passed"

patterns-established:
  - "Group-commit pattern: upgrade related packages together, verify build, commit as a unit"

requirements-completed: [DEP-05, DEP-06, DEP-07, DEP-08]

duration: ~5min
completed: 2026-02-27
---

# Phase 01 Plan 02: Upgrade Animation, CMS, Shopify, and Radix UI Libraries — Summary

**Four dependency groups upgraded to latest stable in atomic commits: GSAP 3.14.2 + Motion 12.34.3 + Lenis 1.3.17 + Embla 8.6.0, Sanity 5.12.0 + next-sanity 12.1.0 + @portabletext/react 6.0.2, hydrogen-react 2026.1.1, and all 11 Radix UI packages — build passes after each group.**

## Performance

- **Duration:** ~5 minutes
- **Started:** 2026-02-27T08:19:35Z
- **Completed:** 2026-02-27T08:24:35Z
- **Tasks:** 2
- **Files modified:** 2 (package.json, pnpm-lock.yaml)

## Accomplishments

- Animation and carousel libraries at latest stable (GSAP 3.14.2, Motion 12.34.3, Lenis 1.3.17, Embla 8.6.0) — 3 major version jumps across these packages
- Sanity CMS ecosystem upgraded across 3 major version jumps (sanity 3->5, next-sanity 9->12, @portabletext/react 3->6) with zero API migration needed — all existing import patterns still valid
- Shopify Hydrogen React at 2026.1.1 (from 2025.1.3); Radix UI 11 packages all at latest minor versions

## Task Commits

Each dependency group was committed as a working state:

1. **Animation and carousel group** - `fe91e68` (chore)
2. **Sanity, next-sanity, @portabletext/react group** - `b418d92` (chore)
3. **Shopify hydrogen-react group** - `ae637f2` (chore)
4. **Radix UI packages group** - `fc5dca3` (chore)

## Files Created/Modified

- `package.json` - Updated dependency versions for all 4 groups (18 packages bumped)
- `pnpm-lock.yaml` - Lock file updated with resolved versions

## Decisions Made

- Upgraded in 4 logical groups (animation, CMS, Shopify, Radix UI) per plan — each group committed as working state
- No API migrations needed for any group despite major version bumps — all existing code patterns remain valid
- `@portabletext/react` v6 (3 major jumps): `PortableTextBlock` and `PortableTextComponents` still exported as TypeScript types from the package — no changes to types/index.ts or component files needed
- `sanity` v5: `ImageAsset` resolved correctly as TypeScript type — no source changes required
- `next-sanity` v12: `parseBody` from `next-sanity/webhook` unchanged — revalidate route works as-is

## Deviations from Plan

None — plan executed exactly as written. All four group upgrades completed with build passing after each. No TypeScript errors from changed APIs.

## Issues Encountered

None — all upgrades were compatible. The research correctly predicted "low risk" for all groups.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All animation, CMS, e-commerce, and UI libraries at latest stable — ready for Phase 2 (SCSS migration)
- pnpm-lock.yaml is clean and current
- Four separate group commits provide rollback points if any issues emerge in later phases

---
*Phase: 01-dependency-upgrades*
*Completed: 2026-02-27*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| `package.json` exists on disk | PASS |
| `pnpm-lock.yaml` exists on disk | PASS |
| `01-02-SUMMARY.md` exists on disk | PASS |
| Commit `fe91e68` (animation group) in git history | PASS |
| Commit `b418d92` (sanity group) in git history | PASS |
| Commit `ae637f2` (shopify group) in git history | PASS |
| Commit `fc5dca3` (radix group) in git history | PASS |
