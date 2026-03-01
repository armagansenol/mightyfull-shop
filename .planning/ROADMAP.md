# Roadmap: Mightyfull Shop — Stack Upgrade + CSS Migration

## Overview

This milestone modernizes the Mightyfull Shop build stack without changing any user-facing features. The sequence is determined by a hard PostCSS pipeline constraint: Next.js and dependencies must be upgraded first (stable build environment), then all 31 SCSS modules converted to plain CSS (core migration work), then Tailwind upgraded to v4 (isolated from SCSS changes to make regressions attributable), then a deliberate manual verification pass (zero automated test coverage means this is required, not optional).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Dependency Upgrades** - Upgrade Next.js, React, and all packages to latest stable with breaking changes resolved (completed 2026-02-27)
- [x] **Phase 2: SCSS to CSS Modules** - Convert all 31 `.module.scss` files to `.module.css`, remove SASS (completed 2026-02-27)
- [x] **Phase 3: Tailwind v4 Migration** - Replace `tailwind.config.ts` with `@theme` directive, update PostCSS plugin (completed 2026-02-28)
- [x] **Phase 4: Visual Verification** - Manual verification of visual parity across all pages, viewports, and interactions (completed 2026-03-01)

## Phase Details

### Phase 1: Dependency Upgrades
**Goal**: All packages are on latest stable versions, the build compiles cleanly, and Next.js async APIs are updated
**Depends on**: Nothing (first phase)
**Requirements**: DEP-01, DEP-02, DEP-03, DEP-04, DEP-05, DEP-06, DEP-07, DEP-08, DEP-09, DEP-10, DEP-11, DEP-12
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes without errors or warnings from outdated API usage
  2. The dev server starts and all pages load without runtime errors in the console
  3. All dynamic route `params` and `cookies()` calls use the await pattern (no deprecation warnings)
  4. No package in `package.json` reports a version behind its latest stable release
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — pnpm migration + Next.js/React verification + async API compliance
- [ ] 01-02-PLAN.md — Animation, CMS, Shopify, and Radix UI library upgrades
- [ ] 01-03-PLAN.md — State, form, utility upgrades (Zod v4) + Biome migration + final verification

### Phase 2: SCSS to CSS Modules
**Goal**: All styling is delivered via plain CSS modules with no SASS dependency, using native CSS nesting, calc() for vw functions, and CSS custom properties for variables
**Depends on**: Phase 1
**Requirements**: CSS-01, CSS-02, CSS-03, CSS-04, CSS-05, CSS-06, CSS-07, CSS-08, CSS-09, CSS-10, CSS-11, CSS-12, CSS-13, CSS-14, CSS-15, CSS-16
**Success Criteria** (what must be TRUE):
  1. Zero `.module.scss` files exist in the codebase — all renamed to `.module.css`
  2. `sass` is absent from `package.json` and `sassOptions` is absent from `next.config.mjs`
  3. The build compiles cleanly with no SCSS-related errors or unresolved function references
  4. All component styles render visually identical to the SCSS baseline at desktop (1440px) and mobile (375px)
  5. The shared `buttons.module.css` covers all button variants with correct styles
**Plans**: TBD

Plans:
- [ ] 02-01: Global styles migration (global.scss → global.css, colors, z-index, functions analysis)
- [ ] 02-02: Simple component modules migration (Wave B — minimal mixin usage, mechanical conversion)
- [ ] 02-03: Complex component modules migration (Wave C — cart, header, product pages, vw-heavy files)
- [ ] 02-04: Shared buttons module + cleanup (Wave D+E — buttons.module.scss last, sassOptions removal, sass uninstall)

### Phase 3: Tailwind v4 Migration
**Goal**: Tailwind CSS runs on v4 with CSS-first configuration, the PostCSS pipeline uses the new plugin, and all utility classes work correctly
**Depends on**: Phase 2
**Requirements**: TW-01, TW-02, TW-03, TW-04, TW-05, TW-06
**Success Criteria** (what must be TRUE):
  1. `tailwind.config.ts` is deleted — all custom theme values (breakpoints, fonts, colors, grid) live in a CSS `@theme` block
  2. PostCSS config uses `@tailwindcss/postcss` — the old `tailwindcss` plugin entry is gone
  3. All Tailwind utility classes that appear in JSX render with correct output (spot-checked across pages)
  4. `tailwind-merge` and `tailwindcss-animate` are on v4-compatible versions or replaced with native equivalents
**Plans**: TBD

Plans:
- [ ] 03-01: TW v4 core migration (codemod, PostCSS swap, @theme consolidation, tw-animate-css, tailwind-merge v3, delete tailwind.config.ts + tailwind-initial.css)
- [ ] 03-02: Breakpoint sync (800px->768px in CSS modules, tablet:->md: and desktop:->xl: in JSX, build verification)

### Phase 4: Visual Verification
**Goal**: The upgraded site is confirmed visually identical to the pre-migration baseline across all pages, viewports, and interactive states
**Depends on**: Phase 3
**Requirements**: VER-01, VER-02, VER-03, VER-04, VER-05, VER-06, VER-07
**Success Criteria** (what must be TRUE):
  1. All pages pass visual comparison at 1440px desktop viewport — no layout shifts, missing styles, or broken elements
  2. All pages pass visual comparison at 375px mobile viewport — no layout shifts, missing styles, or broken elements
  3. GSAP scroll animations, scroll triggers, and Lenis smooth scrolling behave identically to the baseline
  4. Cart open/close, add, remove, and quantity update operations complete without errors
  5. Contact form submits successfully and all hover states and transitions are visually correct
**Plans**: TBD

Plans:
- [x] 04-01: Desktop and mobile visual sweep (all pages at 1440px and 375px, layout parity check) — completed 2026-03-01
- [ ] 04-02: Interactive state verification (animations, carousels, cart operations, contact form, hover states)

## Progress

**Execution Order:**
Phases execute strictly in sequence: 1 → 2 → 3 → 4 (PostCSS pipeline constraint — not optional)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dependency Upgrades | 3/3 | Complete    | 2026-02-27 |
| 2. SCSS to CSS Modules | 5/5 | Complete   | 2026-02-27 |
| 3. Tailwind v4 Migration | 2/2 | Complete   | 2026-02-28 |
| 4. Visual Verification | 2/2 | Complete   | 2026-03-01 |
