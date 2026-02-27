# Pitfalls Research

**Research Date:** 2026-02-27
**Research Type:** Project Research — Pitfalls dimension for Next.js stack upgrade and SCSS-to-CSS migration

## SCSS Migration Pitfalls

### P1. `prependData` Mechanism Disappears Silently

**The problem:** `next.config.mjs` uses `sassOptions.prependData` to inject `_functions.scss` into every `.module.scss` file. All 31 module files depend on `desktop-vw()`, `mobile-vw()`, `dims()`, `position()`, `mobile`, `desktop`, `hover`, and `z-index()` with zero explicit imports. When you rename a file to `.module.css`, these functions silently stop being available — no import error, just broken output or build failure.

**Warning signs:** Build errors mentioning unknown functions after renaming a single file.

**Prevention:** Document every function/mixin from `_functions.scss` before starting. Create a conversion reference sheet. Convert each file fully (all function calls replaced) before renaming.

**Phase:** SCSS migration — must be understood before any file conversion.

### P2. `desktop-vw()` / `mobile-vw()` Volume Problem

**The problem:** These functions appear in nearly every `.module.scss` file, potentially hundreds of call sites. Each `desktop-vw(100px)` must become `calc(100 / 1440 * 100vw)` or a pre-computed `6.944vw` value. Manual conversion is error-prone at scale.

**Warning signs:** Subtle layout shifts from incorrect math.

**Prevention:** Write a find-and-replace script/regex to handle the mechanical conversion. Test output values match original computed values. Visual diff each page after conversion.

**Phase:** SCSS migration.

### P3. Native CSS Nesting Selector Differences

**The problem:** SCSS nesting allows `.parent .child { }` directly. Native CSS nesting requires `& .child { }` when the nested selector starts with a class or element. Without the `&` prefix, the selector is invalid or interpreted differently.

**Warning signs:** Styles not applying to nested elements after migration.

**Prevention:** When converting, add `&` prefix to all descendant selectors. Safe rule: if the nested selector doesn't start with `&`, add `& ` before it.

**Phase:** SCSS migration — every file.

### P4. `@extend` Has No CSS Equivalent

**The problem:** `global.scss` uses `@extend .remove-autofill-styles` on `input` elements. CSS modules and vanilla CSS have no `@extend`. Must be replaced with duplicated properties or a shared class applied in markup.

**Warning signs:** Input autofill styling breaks after global.scss conversion.

**Prevention:** Identify the one `@extend` usage, inline the extended styles directly.

**Phase:** SCSS migration — global styles wave.

### P5. `@each` Loop Generates Dynamic CSS

**The problem:** `_colors.scss` uses `@each` with `sass:color` to generate transparent color variants (`--blue-ruin-transparent` etc.) and a Safari gradient bug workaround. This must be expanded into static CSS declarations.

**Warning signs:** Missing color custom properties after conversion.

**Prevention:** Run the SCSS compiler once on `_colors.scss` to see the exact output. Copy that output as static CSS.

**Phase:** SCSS migration — global styles wave.

### P6. `z-index()` Function Requires Pre-computation

**The problem:** `z-index()` function resolves named z-index values at compile time. Must be replaced with CSS custom properties (`var(--z-header)`). Need to extract the full z-index map and create `:root` declarations.

**Warning signs:** Elements overlapping incorrectly after migration.

**Prevention:** Extract z-index map from `_functions.scss`, create `:root` block with all values, replace all `z-index()` calls.

**Phase:** SCSS migration — global styles wave.

### P7. Media Query Breakpoint Values Must Be Inlined

**The problem:** SCSS `$mobile-breakpoint` variable is used in `@mixin mobile` etc. CSS custom properties cannot be used in `@media` query conditions. The breakpoint value (800px) must be hardcoded in every `@media` rule.

**Warning signs:** Media queries not matching after conversion.

**Prevention:** Use literal `800px` in all `@media (max-width: 800px)` rules. Document the breakpoint value prominently.

**Phase:** SCSS migration — every file.

### P8. `buttons.module.scss` Is Shared and High Risk

**The problem:** `styles/buttons.module.scss` is imported across multiple components. A conversion error here breaks all buttons site-wide simultaneously.

**Warning signs:** All buttons break at once.

**Prevention:** Convert this file last among component modules. Test every button variant after conversion. Have the original SCSS available for quick rollback comparison.

**Phase:** SCSS migration — complex components wave.

---

## Next.js Upgrade Pitfalls

### P9. Async `params` in Dynamic Routes

**The problem:** Recent Next.js versions made `params` async in dynamic route handlers. `app/(main)/shop/[slug]/page.tsx` accesses `params.slug` — this must be `await`ed.

**Warning signs:** TypeScript errors about `params` type, or runtime errors accessing `.slug`.

**Prevention:** Run `npx @next/codemod@latest upgrade` which handles this automatically. Verify manually.

**Phase:** Next.js upgrade.

### P10. `cookies()` Is Now Async

**The problem:** Cart operations use `cookies()` from `next/headers` to read/write cart ID. This function is now async and must be `await`ed.

**Warning signs:** Runtime errors in cart operations.

**Prevention:** Search for all `cookies()` usage and add `await`. The codemod should catch this.

**Phase:** Next.js upgrade.

### P11. Cache Behavior Changes

**The problem:** Next.js has changed default caching behavior across versions. `fetch()` calls may behave differently regarding `force-cache` vs `no-store` defaults.

**Warning signs:** Stale data on product pages, or unnecessary API calls on every request.

**Prevention:** Explicitly set cache options on all `fetch()` calls. Don't rely on framework defaults.

**Phase:** Next.js upgrade — verify during testing.

### P12. `sassOptions` Must Stay Until All Files Converted

**The problem:** Removing `sassOptions` from `next.config.mjs` before all `.module.scss` files are converted breaks the remaining SCSS files.

**Warning signs:** Build errors on unconverted SCSS files.

**Prevention:** Remove `sassOptions` only as the very last step, after every `.module.scss` is renamed to `.module.css`. Keep `sass` in `package.json` until then too.

**Phase:** SCSS migration — final cleanup wave.

---

## Tailwind v4 Pitfalls

### P13. `tailwind.config.ts` Is Silently Ignored

**The problem:** Tailwind v4 does not read `tailwind.config.ts`. Your custom breakpoints, fonts, colors, 24-column grid, and plugins will silently disappear. The site will look wrong with no build error.

**Warning signs:** Missing custom theme values, wrong fonts, wrong colors, wrong grid.

**Prevention:** Before upgrading, document every custom value in `tailwind.config.ts`. Migrate each to `@theme` directive in CSS. Verify the `@theme` block produces identical custom properties.

**Phase:** Tailwind v4 migration.

### P14. `tailwindcss-animate` Compatibility

**The problem:** `tailwindcss-animate` is a v3 plugin. May not work with v4's new plugin system.

**Warning signs:** Animation utility classes stop working.

**Prevention:** Check for a v4-compatible version before upgrading. If none exists, replace with native CSS `@keyframes` and custom utilities.

**Phase:** Tailwind v4 migration.

### P15. `tailwind-merge` Class Name Changes

**The problem:** Tailwind v4 may change some class name formats. `tailwind-merge` needs to understand v4 class names to deduplicate correctly.

**Warning signs:** Duplicate or conflicting classes in rendered HTML.

**Prevention:** Update `tailwind-merge` to latest v4-compatible version. Test `cn()` utility with common class combinations.

**Phase:** Tailwind v4 migration.

---

## Sequencing Pitfalls

### P16. Don't Do Both Migrations Simultaneously

**The problem:** SCSS → CSS and Tailwind v3 → v4 both modify the styling pipeline. Doing both at once makes it impossible to isolate which change caused a regression.

**Warning signs:** Unclear whether a visual bug is from SCSS conversion or Tailwind change.

**Prevention:** Complete SCSS → CSS migration first. Verify visual parity. Then upgrade Tailwind. Verify again.

**Phase:** Sequencing — between migration phases.

### P17. No Test Coverage Means Manual Visual Verification

**The problem:** Zero test coverage. No automated way to detect regressions. Every change must be visually verified.

**Warning signs:** Subtle visual differences that go unnoticed.

**Prevention:** Create a visual checklist of all pages and key states (cart open, mobile viewport, hover states). Check each page after each wave of conversions. Consider screenshot comparison tools.

**Phase:** All phases — verification after each wave.

### P18. GSAP/Lenis Hydration With New Next.js

**The problem:** GSAP and Lenis manipulate DOM directly. New Next.js versions may change hydration behavior, causing animation glitches or hydration mismatches.

**Warning signs:** Console hydration warnings, animations not triggering, scroll jank.

**Prevention:** Test all animated pages after Next.js upgrade, before starting SCSS migration. Ensure `'use client'` directives are on all animation components.

**Phase:** Next.js upgrade — verification.

### P19. Shopify Hydrogen React Compatibility

**The problem:** `@shopify/hydrogen-react` has version-specific compatibility with React and Next.js. Upgrading Next.js may require a specific Hydrogen version.

**Warning signs:** Type errors or runtime errors in Shopify components.

**Prevention:** Check Hydrogen React release notes for compatible React/Next.js versions before upgrading.

**Phase:** Next.js upgrade.

---

## Pitfall Priority Matrix

| Pitfall | Likelihood | Impact | Phase |
|---------|-----------|--------|-------|
| P1. prependData disappears | Certain | High | SCSS migration |
| P2. vw function volume | Certain | Medium | SCSS migration |
| P3. CSS nesting differences | High | Medium | SCSS migration |
| P7. Breakpoint values inline | Certain | Low | SCSS migration |
| P9. Async params | Certain | Medium | Next.js upgrade |
| P10. Async cookies | Certain | Medium | Next.js upgrade |
| P13. tailwind.config.ts ignored | Certain | High | Tailwind v4 |
| P16. Simultaneous migrations | Medium | High | Sequencing |
| P17. No test coverage | Certain | Medium | All phases |
| P12. sassOptions timing | Medium | High | SCSS cleanup |
| P8. Shared buttons module | Medium | High | SCSS migration |
| P5. @each loop expansion | Certain | Low | SCSS migration |
| P14. tailwindcss-animate compat | High | Low | Tailwind v4 |

---
*Pitfalls research completed: 2026-02-27*
