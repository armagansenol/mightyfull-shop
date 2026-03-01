# Requirements: Mightyfull Shop

**Defined:** 2026-02-27
**Core Value:** The shopping experience must work flawlessly with visual polish that matches the brand

## v1 Requirements

Requirements for stack upgrade milestone. Each maps to roadmap phases.

### Dependency Upgrades

- [x] **DEP-01**: Next.js upgraded to latest stable version with codemod applied
- [x] **DEP-02**: React and React DOM upgraded to latest 19.x stable
- [x] **DEP-03**: All async `params` usage in dynamic routes updated to await pattern
- [x] **DEP-04**: All async `cookies()` usage in cart operations updated to await pattern
- [x] **DEP-05**: GSAP, @gsap/react, Motion, Lenis, Embla Carousel upgraded to latest stable
- [x] **DEP-06**: Sanity, next-sanity, @portabletext/react upgraded to latest stable
- [x] **DEP-07**: Shopify Hydrogen React and Storefront API Client upgraded to latest compatible
- [x] **DEP-08**: Radix UI packages upgraded to latest stable
- [x] **DEP-09**: TanStack React Query, Zustand, React Hook Form upgraded to latest stable
- [x] **DEP-10**: Zod, Sonner, Lucide React, and utility packages upgraded to latest stable
- [x] **DEP-11**: ESLint, TypeScript, and dev dependencies upgraded to latest stable
- [x] **DEP-12**: Site builds successfully and runs without runtime errors after all upgrades

### SCSS to CSS Modules Migration

- [x] **CSS-01**: Global `_functions.scss` analyzed — all functions/mixins documented with CSS equivalents
- [ ] **CSS-02**: `_colors.scss` `@each` loop expanded into static `:root` CSS custom properties
- [ ] **CSS-03**: z-index map extracted and converted to `:root` CSS custom properties
- [x] **CSS-04**: `global.scss` converted to `global.css` with all partials inlined
- [x] **CSS-05**: All `desktop-vw()` calls replaced with `calc(N / 1440 * 100vw)` across all modules
- [x] **CSS-06**: All `mobile-vw()` calls replaced with `calc(N / 375 * 100vw)` across all modules
- [x] **CSS-07**: All `@include mobile/desktop/hover` replaced with inline `@media` rules
- [x] **CSS-08**: All `@include dims()` calls replaced with expanded `width`/`height` properties
- [x] **CSS-09**: All `@include position()` calls replaced with expanded position properties
- [ ] **CSS-10**: All `z-index()` calls replaced with `var(--z-*)` references
- [x] **CSS-11**: All SCSS nesting converted to valid native CSS nesting (& prefix for descendants)
- [x] **CSS-12**: `@extend` in global.scss replaced with inlined properties
- [x] **CSS-13**: All 31 `.module.scss` files renamed to `.module.css` with updated imports
- [x] **CSS-14**: `sassOptions` removed from `next.config.mjs`
- [x] **CSS-15**: `sass` package removed from `package.json`
- [x] **CSS-16**: `styles/buttons.module.scss` (shared module) converted with all button variants verified

### Tailwind v4 Migration

- [x] **TW-01**: `tailwind.config.ts` custom theme values migrated to CSS `@theme` directive
- [x] **TW-02**: PostCSS config updated from `tailwindcss` to `@tailwindcss/postcss` plugin
- [x] **TW-03**: `tailwind-merge` updated to v4-compatible version
- [x] **TW-04**: `tailwindcss-animate` audited and updated or replaced with native CSS animations
- [x] **TW-05**: `tailwind.config.ts` file removed after migration
- [x] **TW-06**: All Tailwind utility classes verified working with v4

### Visual Verification

- [x] **VER-01**: All pages verified at desktop viewport (1440px+) — visual parity confirmed
- [x] **VER-02**: All pages verified at mobile viewport (375px) — visual parity confirmed
- [x] **VER-03**: All GSAP animations, scroll triggers, and Lenis smooth scrolling work correctly
- [x] **VER-04**: All Embla carousels (product highlight, etc.) function correctly
- [x] **VER-05**: Cart operations (add, remove, update, open/close) work correctly
- [x] **VER-06**: Contact form submission works correctly
- [ ] **VER-07**: All hover states and transitions work correctly

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Tech Debt

- **DEBT-01**: Consolidate duplicate hooks libraries (usehooks-ts, @uidotdev/usehooks, react-use)
- **DEBT-02**: Refactor cart actions.ts (777 lines) into focused modules
- **DEBT-03**: Standardize error handling patterns across server actions
- **DEBT-04**: Add input validation to API routes (contact form, revalidation)

### Test Coverage

- **TEST-01**: Add unit tests for cart operations
- **TEST-02**: Add unit tests for cart context reducers and price calculations
- **TEST-03**: Add e2e tests for critical user flows (browse → add to cart → checkout)

### Security

- **SEC-01**: Add CSRF protection to contact form endpoint
- **SEC-02**: Add rate limiting to API endpoints
- **SEC-03**: Sanitize Shopify error messages before displaying to users

## Out of Scope

| Feature | Reason |
|---------|--------|
| New product features | Upgrade milestone only — features decided after |
| Tailwind-only styling migration | Doubles scope, CSS modules serve different purpose |
| PostCSS plugins replicating SCSS | Defeats migration purpose |
| CSS-in-JS introduction | Wrong direction for this project |
| Visual design improvements | Regression ambiguity during migration |
| Hooks library consolidation | Minimal cleanup only per project constraints |
| Analytics tracking | Separate future work |
| Product search/filtering | Separate future work |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEP-01 | Phase 1 | Complete |
| DEP-02 | Phase 1 | Complete |
| DEP-03 | Phase 1 | Complete |
| DEP-04 | Phase 1 | Complete |
| DEP-05 | Phase 1 | Complete |
| DEP-06 | Phase 1 | Complete |
| DEP-07 | Phase 1 | Complete |
| DEP-08 | Phase 1 | Complete |
| DEP-09 | Phase 1 | Complete |
| DEP-10 | Phase 1 | Complete |
| DEP-11 | Phase 1 | Complete |
| DEP-12 | Phase 1 | Complete |
| CSS-01 | Phase 2 | Complete |
| CSS-02 | Phase 5 (gap closure) | Pending |
| CSS-03 | Phase 5 (gap closure) | Pending |
| CSS-04 | Phase 2 | Complete |
| CSS-05 | Phase 2 | Complete |
| CSS-06 | Phase 2 | Complete |
| CSS-07 | Phase 2 | Complete |
| CSS-08 | Phase 2 | Complete |
| CSS-09 | Phase 2 | Complete |
| CSS-10 | Phase 5 (gap closure) | Pending |
| CSS-11 | Phase 2 | Complete |
| CSS-12 | Phase 2 | Complete |
| CSS-13 | Phase 2 | Complete |
| CSS-14 | Phase 2 | Complete |
| CSS-15 | Phase 2 | Complete |
| CSS-16 | Phase 2 | Complete |
| TW-01 | Phase 3 | Complete |
| TW-02 | Phase 3 | Complete |
| TW-03 | Phase 3 | Complete |
| TW-04 | Phase 3 | Complete |
| TW-05 | Phase 3 | Complete |
| TW-06 | Phase 3 | Complete |
| VER-01 | Phase 4 | Complete |
| VER-02 | Phase 4 | Complete |
| VER-03 | Phase 4 | Complete |
| VER-04 | Phase 4 | Complete |
| VER-05 | Phase 4 | Complete |
| VER-06 | Phase 4 | Complete |
| VER-07 | Phase 5 (gap closure) | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-27*
*Last updated: 2026-02-27 after initial definition*
