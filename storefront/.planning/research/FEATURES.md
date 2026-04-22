# Features Research

**Research Date:** 2026-02-27
**Research Type:** Project Research — Features dimension for Next.js stack upgrade and SCSS-to-CSS-modules migration

## Context

This milestone is a modernization upgrade, not a feature release. The goal is visual parity after migration. Features here describe what the upgrade enables for the engineering stack.

## SCSS Surface Area Being Replaced

### SCSS Features in Active Use

**Custom functions with `sass:math`** — `desktop-vw()`, `mobile-vw()`, `z-index()` used in nearly every `.module.scss` file. Compute-at-compile-time functions that resolve to `vw` values.

**SCSS variables** — `$mobile-breakpoint: 800px`, `$desktop-width: 1440px`, `$mobile-width: 375px`. Used only as function inputs; codebase is already ~80% on CSS custom properties.

**Mixins** — `@mixin mobile`, `@mixin dims`, `@mixin position`, `@mixin hover` are pervasive. Every component uses these.

**SCSS nesting with `&`** — Deep nesting with BEM modifier patterns (`&.hidden`, `&.active`) common across all 30+ module files.

**`@each` loop** in `_colors.scss` — Generates brand color CSS custom properties from SCSS map.

**`@import` partials** — `global.scss` imports 6 partial files.

**`@extend`** — Used once in `global.scss` (`input { @extend .remove-autofill-styles; }`).

**`prependData` injection** — `_functions.scss` globally injected into every SCSS module via `sassOptions.prependData` in `next.config.mjs`. All 31 `.module.scss` files depend on this with zero explicit imports.

### SCSS Features NOT in Use

- `@use` / `@forward` module system (only built-in `sass:math` / `sass:color`)
- Complex mixin logic beyond media query wrappers
- Placeholder selectors, `@for` loops, `@while` loops
- Multi-level namespace patterns

---

## Table Stakes: Must-Have for Modern Stack

### 1. Native CSS Nesting in CSS Modules

**Replaces:** SCSS `&` nesting
**Syntax:** Nearly identical — `&.hidden` works the same. Descendant selectors require `& .child` prefix.
**Complexity:** Low-Moderate. Mechanical in 90% of cases.

### 2. CSS Custom Properties as Variable Replacement

**Replaces:** SCSS `$variables`. Remaining SCSS variables are breakpoint constants used inside mixin conditions. After migration, these become inlined literal values in media queries.
**Complexity:** Low. Fixed set of known values.

### 3. Pre-computed Values Replacing SCSS Functions

**Replaces:** `desktop-vw(N)` → `calc(N / 1440 * 100vw)`, `mobile-vw(N)` → `calc(N / 375 * 100vw)`, `z-index()` → CSS custom properties.
**Complexity:** Moderate. High volume — appears in every module file. Transformation is mechanical.

### 4. Inline Media Queries Replacing Mixins

**Replaces:**
- `@include mobile { ... }` → `@media (max-width: 800px) { ... }`
- `@include desktop { ... }` → `@media (min-width: 801px) { ... }`
- `@include hover { &:hover { ... } }` → `@media (hover: hover) { &:hover { ... } }`
- `@include dims(N)` → `width: N; height: N;`
- `@include position(abs, T, R, B, L)` → `position: absolute; top: T; right: R; bottom: B; left: L;`

**Complexity:** High volume, low intellectual complexity. Most time-consuming part — 30+ files.

### 5. Static Global CSS Replacing SCSS Partials

**Replaces:**
- `_functions.scss` → disappears entirely (no CSS output, only SCSS constructs)
- `_colors.scss` `@each` loop → expanded into static `:root` block
- `_variables.scss` → disappears (values inline into call sites)
- `_reset.scss`, `_fonts.scss`, `_easings.scss`, `_utils.scss` → plain `.css` files
- `global.scss` → `global.css` with inlined content

**Complexity:** Low. One-time mechanical expansion.

### 6. Tailwind CSS v4 Configuration Model

**Enables:**
- `@theme` directive in CSS replaces `tailwind.config.ts`
- Theme tokens auto-generate CSS custom properties
- Lightning CSS replaces PostCSS as default engine (faster builds)
- Automatic content detection (no manual `content` array)

**Breaking vs v3:**
- `postcss.config.mjs` switches plugin
- `tailwindcss-animate` must be audited
- `tailwind-merge` must be v4-compatible
- `tailwind.config.ts` is eliminated

**Complexity:** Moderate. Small Tailwind surface area but plugin dependencies need auditing.

### 7. Next.js Latest Stable Improvements

- **Turbopack stable** — default for `next dev`, faster HMR
- **Stable `after()` API** — post-response logic
- **Async `params`** — dynamic routes need updating
- **`cookies()` async** — cart cookie handling needs updating

**Complexity:** Low-Moderate. Already on App Router.

### 8. SASS Dependency Removal

Terminal step after all conversions complete. Remove `sass` from `package.json`.
**Complexity:** Zero (final step).

---

## Differentiators: Nice-to-Have

| Feature | Complexity | Notes |
|---------|-----------|-------|
| CSS `@layer` for cascade control | Low | Eliminates `!important` between Tailwind and modules |
| Container queries | Moderate | Out of scope for upgrade |
| CSS `:has()` pseudo-class | Low | Additive improvement |
| CSS Subgrid | Moderate | Out of scope for upgrade |
| Turbopack dev speed | Zero | Default on Next.js upgrade |

---

## Anti-Features: Do NOT Do During Upgrade

| Anti-Feature | Reason |
|-------------|--------|
| Migrate to Tailwind-only styling | Doubles scope, regression risk. Explicitly excluded. |
| Add PostCSS plugins to replicate SCSS | Trades one abstraction for another |
| Introduce CSS-in-JS | Wrong direction, bundle weight, SSR complexity |
| Convert global utility classes to CSS modules | Breaks every usage site (global by design) |
| Adopt another CSS preprocessor | Defeats migration purpose |
| Consolidate hooks libraries | Separate future work |
| Make visual improvements during migration | Regression ambiguity |

---

## Feature Dependencies Map

```
[Next.js upgrade] ──────────────────── Independent track
  Turbopack (default on upgrade)
  React 19 APIs (already declared)
  Async params/cookies updates

[SCSS → CSS Modules] ───────────────── Independent track
  Native CSS nesting
  Inline media queries
  Expand dims/position mixins
  Pre-compute vw functions
  Expand @each colors loop
  Convert z-index() → CSS vars
  Merge @import partials
  Remove @extend
    └─ [ALL COMPLETE] → Remove sass dependency

[Tailwind v4 upgrade] ──────────────── Sequence AFTER SCSS migration
  @theme CSS config
  tailwind-merge v4 compat
  tailwindcss-animate audit
  postcss.config.mjs update
```

**Critical:** SCSS migration and Tailwind v4 both touch PostCSS pipeline — sequence them to avoid simultaneous changes.

---

## Complexity Summary

| Feature | Category | Complexity |
|---------|----------|-----------|
| Native CSS nesting | Table Stakes | Low-Moderate |
| CSS custom properties | Table Stakes | Low |
| Pre-compute SCSS functions | Table Stakes | Moderate (high volume) |
| Inline media query mixins | Table Stakes | High Volume |
| Expand layout mixins | Table Stakes | High Volume |
| Merge @import partials | Table Stakes | Low |
| Tailwind v4 upgrade | Table Stakes | Moderate |
| Next.js upgrade | Table Stakes | Low-Moderate |
| Remove SASS | Table Stakes | Zero (terminal) |

---
*Features research completed: 2026-02-27*
