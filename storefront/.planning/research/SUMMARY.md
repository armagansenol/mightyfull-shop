# Project Research Summary

**Project:** Mightyfull Shop — Next.js Stack Upgrade + SCSS-to-CSS Modules Migration
**Domain:** Frontend modernization / headless e-commerce (Next.js + Shopify)
**Researched:** 2026-02-27
**Confidence:** HIGH

## Executive Summary

This project is a modernization-only milestone for an existing production headless Shopify storefront built with Next.js (App Router), Sanity CMS, GSAP/Lenis animations, and a Tailwind + SCSS dual styling system. The goal is not new features but parity: upgrade the dependency stack to current stable versions, migrate all 31 `.module.scss` files to native `.module.css`, and upgrade Tailwind from v3 to v4. The research is unusually high-confidence because the codebase is fully audited — every SCSS feature in use is catalogued, every file is identified, and every breaking change in the upgrade path is documented.

The recommended approach is strict sequential phasing: upgrade Next.js and dependencies first (fixes async params/cookies, ensures build tools are current), then migrate SCSS to CSS modules (the most time-consuming work, ~31 files), then upgrade Tailwind to v4 (after SCSS is gone, the PostCSS pipeline change is isolated), then do a final visual verification sweep. The key discipline is never doing two pipeline-touching migrations simultaneously — SCSS migration and Tailwind v4 both modify PostCSS and the CSS pipeline, so sequencing them is not optional, it is required.

The dominant risk is volume, not complexity. The SCSS-to-CSS conversion is mechanically straightforward but affects hundreds of call sites across 31 files with zero test coverage. The `prependData` injection mechanism (which globally injects `_functions.scss` into every module with no explicit import) is the single most dangerous assumption to invalidate before starting. Every call to `desktop-vw()`, `mobile-vw()`, `@include mobile`, `@include dims`, etc. must be explicitly replaced before renaming a file. The mitigation is working file-by-file with visual verification after each wave, not batching renames.

## Key Findings

### Recommended Stack

See full details in `.planning/research/STACK.md`.

The current stack is in good shape with minor version drift. Next.js is on 16.1.6 (lockfile tracks ahead), React is already on 19, and most other packages are within one minor version of latest. The two major upgrades requiring care are Tailwind v3 → v4 (configuration model changes entirely) and the removal of SASS (requires completing the full CSS module migration first).

**Core technologies:**
- **Next.js latest stable**: Framework foundation — upgrade first, run official codemod (`@next/codemod@latest upgrade`) to handle async params/cookies automatically
- **Tailwind CSS v4**: CSS-first config via `@theme` directive replaces `tailwind.config.ts` — upgrade last among styling changes; both faster builds and Lightning CSS as default engine
- **Native CSS Modules (.module.css)**: Direct replacement for SCSS modules — native nesting, inline media queries, `calc()` for vw functions
- **SASS (remove)**: Terminal step after all `.module.scss` files converted and verified
- **PostCSS**: Config update required for Tailwind v4 — swap `tailwindcss` plugin for `@tailwindcss/postcss`
- **tailwind-merge**: Must audit v4 compatibility before Tailwind upgrade
- **tailwindcss-animate**: Likely incompatible with v4 plugin system — audit required, may need native CSS replacement

**Critical version note:** `tailwind.config.ts` is silently ignored in Tailwind v4. All custom theme values (breakpoints, fonts, colors, 24-column grid) must be migrated to `@theme` in CSS before upgrading.

### Expected Features

See full details in `.planning/research/FEATURES.md`.

This milestone has no new user-facing features. All deliverables are engineering infrastructure. The SCSS surface area being replaced is fully catalogued:

**Must complete (table stakes for modernization):**
- Native CSS nesting in all 31 component modules — replaces SCSS `&` nesting
- Pre-computed `calc()` values replacing `desktop-vw()` and `mobile-vw()` functions — high volume, appears in every file
- Inline `@media` rules replacing `@include mobile`, `@include desktop`, `@include hover` mixins — highest volume task
- Expanded `@include dims()` and `@include position()` mixin calls — mechanical property expansion
- Static `:root` block replacing `_colors.scss` `@each` loop
- CSS custom properties replacing `z-index()` function calls
- `global.css` with inlined partials replacing `global.scss` with `@import` partials
- Tailwind v4 `@theme` config replacing `tailwind.config.ts`
- Next.js upgrade with async params/cookies fixes

**Nice-to-have (additive, do not do during migration):**
- CSS `@layer` for cascade control
- CSS `:has()` pseudo-class improvements

**Explicitly excluded (anti-features):**
- Migrating to Tailwind-only styling (doubles scope)
- Any PostCSS plugins to replicate SCSS behavior
- Visual design improvements during migration (creates regression ambiguity)
- CSS-in-JS introduction
- Consolidating hooks libraries

### Architecture Approach

See full details in `.planning/research/ARCHITECTURE.md`.

The component architecture (Server/Client components, Provider pattern, server actions) remains completely unchanged. The migration is purely presentational — only style file extensions and import paths change. The build pipeline moves from `sass compiler + prependData injection` to native CSS with no preprocessor. The data flow (Shopify API, Sanity CMS, cart operations, Zustand, React Query) is untouched.

**Migration components:**
1. **Global styles** (migrate first) — `global.scss` → `global.css`, expand partials inline, delete `_functions.scss` and `_variables.scss`, expand `@each` color loop, create z-index CSS custom properties
2. **Low-risk component modules** (Wave 2) — simple components with minimal mixin usage, mechanical find-and-replace
3. **High-risk component modules** (Wave 3) — cart, header, product pages, and critically `styles/buttons.module.scss` (shared across all buttons — convert last)
4. **Config cleanup** (Wave 4) — remove `sassOptions` from `next.config.mjs`, remove `sass` from `package.json`
5. **Tailwind v4** (after SCSS complete) — `@theme` directive, PostCSS plugin swap, `tailwind-merge` / `tailwindcss-animate` audit

### Critical Pitfalls

See full details in `.planning/research/PITFALLS.md`.

1. **`prependData` injection disappears silently (P1)** — All 31 modules depend on `_functions.scss` via `sassOptions.prependData` with no explicit imports. Renaming a file before replacing every function call produces broken output with no import error. Prevention: document the full function/mixin reference sheet before touching a single file; convert completely before renaming.

2. **`tailwind.config.ts` is silently ignored in v4 (P13)** — All custom theme values vanish with no build error. Prevention: catalogue every custom value in `tailwind.config.ts` before upgrading; migrate each to `@theme` directive; verify output custom properties match.

3. **`buttons.module.scss` is shared site-wide (P8)** — A conversion error here breaks all buttons simultaneously. Prevention: convert this file last in the component wave; test every button variant after conversion.

4. **Simultaneous pipeline migrations (P16)** — SCSS migration and Tailwind v4 both modify PostCSS. Doing both at once makes regressions impossible to isolate. Prevention: complete and verify SCSS → CSS fully before touching Tailwind.

5. **No test coverage forces manual visual verification (P17)** — Zero automated regression detection. Prevention: create a visual checklist covering all pages, viewports, and interactive states (cart open, hover, mobile); check after each conversion wave.

## Implications for Roadmap

Based on combined research, a 4-phase structure is strongly indicated by hard build dependencies. The sequence is not a preference — it is determined by the PostCSS pipeline constraint.

### Phase 1: Next.js and Dependency Upgrades

**Rationale:** Framework tooling must be current before touching the CSS pipeline. Async params/cookies must be fixed before SCSS migration starts (otherwise you have two sources of breakage). Run `@next/codemod@latest upgrade` first to handle the mechanical Next.js breaking changes automatically.
**Delivers:** Stable, current build environment. All packages on latest compatible versions. Next.js async APIs updated.
**Addresses:** Next.js features (Turbopack default, `after()` API, stable dynamic rendering)
**Avoids:** P9 (async params), P10 (async cookies), P18 (GSAP/Lenis hydration with new Next.js), P19 (Hydrogen React compatibility)
**Research flag:** Standard — well-documented upgrade path with official codemod. Skip research-phase.

### Phase 2: SCSS to CSS Modules Migration

**Rationale:** This is the core work of the milestone and must complete before Tailwind v4 (pipeline constraint). Start with globals (which define the functions everything else depends on), then wave through components low-risk to high-risk. `buttons.module.scss` is last.
**Delivers:** All 31 `.module.scss` files converted to `.module.css`. `sass` package removed. `sassOptions` removed from `next.config.mjs`. Visual parity confirmed.
**Uses:** Native CSS nesting, inline `@media` rules, `calc()` for vw functions, CSS custom properties for z-index and colors
**Avoids:** P1 (prependData), P2 (vw function volume), P3 (CSS nesting differences), P4 (@extend), P5 (@each loop), P6 (z-index), P7 (breakpoint inline values), P8 (shared buttons module), P12 (sassOptions timing), P17 (visual verification)
**Research flag:** Well-understood conversion patterns. Skip research-phase. But create a per-file conversion checklist at phase planning time.

**Suggested sub-waves:**
- Wave A: Global styles (`global.scss`, `_colors.scss`, `_functions.scss` analysis, z-index CSS custom properties)
- Wave B: Simple component modules (minimal mixin usage)
- Wave C: Complex component modules (heavy vw function usage, cart, header, product pages)
- Wave D: `buttons.module.scss` (last, highest blast radius)
- Wave E: Cleanup (`sassOptions` removal, `sass` uninstall, `_functions.scss` deletion)

### Phase 3: Tailwind v4 Migration

**Rationale:** Must follow SCSS migration completion — both touch PostCSS. Can only safely isolate Tailwind regressions after CSS modules are stable and verified.
**Delivers:** `tailwind.config.ts` replaced by CSS `@theme` directive. `@tailwindcss/postcss` plugin active. `tailwind-merge` and `tailwindcss-animate` audited and updated/replaced.
**Avoids:** P13 (tailwind.config.ts silently ignored), P14 (tailwindcss-animate compat), P15 (tailwind-merge class name changes), P16 (simultaneous migrations)
**Research flag:** May need a focused audit of `tailwindcss-animate` v4 compatibility before committing to the upgrade. If no v4-compatible version exists, plan for native CSS `@keyframes` replacement (small surface area).

### Phase 4: Visual Verification and Release

**Rationale:** Zero automated test coverage means a deliberate manual verification pass is a required phase, not an afterthought. Must cover all pages at desktop and mobile, all interactive states, all animations.
**Delivers:** Confirmed visual parity across all pages and viewports. Regression-free release.
**Avoids:** P17 (no test coverage means unnoticed regressions)
**Research flag:** Standard. Skip research-phase.

### Phase Ordering Rationale

- Next.js first because framework tooling determines what CSS pipeline options are even available
- SCSS before Tailwind because both touch PostCSS — sequential ordering isolates regressions to one variable at a time
- Global styles before component modules because globals define the SCSS constructs that all components depend on
- High-risk shared modules last within wave because blast radius is highest
- Visual verification as a named phase (not a checkbox) because there are zero automated tests

### Research Flags

Phases needing deeper attention during planning:
- **Phase 3 (Tailwind v4):** Audit `tailwindcss-animate` compatibility before committing to upgrade path. If no v4-compatible version, plan replacement with native CSS animations. Audit `tailwind-merge` for v4 class name changes.
- **Phase 2 (SCSS Migration):** Not a research gap, but requires creating a conversion reference sheet at planning time — document every function signature and its CSS equivalent before writing a single line.

Phases with standard patterns (skip `/gsd:research-phase`):
- **Phase 1 (Next.js upgrade):** Official codemod handles the mechanical work. Well-documented.
- **Phase 4 (Visual verification):** Create checklist at planning time. Standard QA process.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Codebase fully audited from `package.json` and `package-lock.json`. All packages identified and target versions reasoned. |
| Features | HIGH | SCSS feature surface fully catalogued by inspecting actual source files. No SCSS feature in use is undocumented. |
| Architecture | HIGH | Existing architecture documented from code. Migration changes are purely mechanical — no structural decisions required. |
| Pitfalls | HIGH | Pitfalls derived from direct code inspection (not speculation). Known call site patterns, known file counts, known shared module risks. |

**Overall confidence: HIGH**

### Gaps to Address

- **GSAP v4 existence and stability:** STACK.md flagged "check if v4 exists and is stable." Low impact (v3 works fine) but check before planning Phase 1.
- **`tailwindcss-animate` v4 compatibility:** Flagged as likely incompatible (HIGH likelihood). Must confirm before Phase 3 planning. If incompatible, surface area for replacement is small.
- **`tailwind-merge` v4 support:** Must verify the exact version that supports Tailwind v4 class name format before Phase 3.
- **Hydrogen React + Next.js compatibility matrix:** Medium confidence — check release notes for compatible versions before Phase 1 execution.
- **Exact Next.js latest stable version:** STACK.md notes `npm show next dist-tags` needed to confirm exact version. Run before Phase 1.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `package.json`, `package-lock.json`, all `styles/` files, all `.module.scss` files, `next.config.mjs`
- Next.js official upgrade documentation — async params/cookies changes, codemod
- Tailwind CSS v4 official migration guide — `@theme` directive, `@tailwindcss/postcss` plugin, config elimination

### Secondary (MEDIUM confidence)
- Community knowledge of CSS nesting browser support and `&` selector differences from SCSS
- Tailwind v4 ecosystem — `tailwind-merge` and `tailwindcss-animate` compatibility status

### Tertiary (LOW confidence)
- GSAP v4 existence — unverified, needs `npm show gsap dist-tags` check
- Hydrogen React + Next.js latest compatibility — needs release note verification

---
*Research completed: 2026-02-27*
*Ready for roadmap: yes*
