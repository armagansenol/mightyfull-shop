# Mightyfull Shop

## What This Is

A headless Shopify e-commerce storefront for Mightyfull cookies, built with Next.js and React. The site combines Shopify Storefront API for product catalog and cart operations with Sanity CMS for content management. It features rich animations (GSAP, Motion), smooth scrolling (Lenis), and a polished UI with Radix UI primitives and Tailwind utilities.

## Core Value

The shopping experience must work flawlessly — browsing products, adding to cart, and completing checkout through Shopify — with visual polish that matches the brand.

## Requirements

### Validated

<!-- Inferred from existing codebase -->

- ✓ Product catalog with Shopify Storefront API integration — existing
- ✓ Product detail pages with variant selection — existing
- ✓ Shopping cart (add, remove, update quantity, batch operations) — existing
- ✓ Sanity CMS integration for content pages and product metadata — existing
- ✓ Contact form with Zod validation and Sanity document creation — existing
- ✓ Responsive layout with CSS custom properties theming — existing
- ✓ Rich animations (GSAP, scroll triggers, carousels) — existing
- ✓ Smooth scrolling with Lenis — existing
- ✓ Store locator page — existing
- ✓ Our Story page — existing
- ✓ Customer reviews via Okendo widget — existing
- ✓ Noticebar and header with scroll behavior — existing
- ✓ Revalidation webhook for Sanity content updates — existing

### Active

<!-- Current scope: upgrade and migration -->

- [ ] Upgrade Next.js, React, and all dependencies to latest stable versions
- [ ] Migrate all SCSS modules (.module.scss) to plain CSS modules (.module.css)
- [ ] Convert SCSS-specific syntax (nesting, variables, mixins) to vanilla CSS equivalents
- [ ] Remove SASS dependency from the project
- [ ] Ensure visual parity with current site after migration
- [ ] Remove clearly unused packages during upgrade (minimal cleanup)
- [ ] Keep Tailwind CSS coexisting with CSS modules

### Out of Scope

- Full Tailwind migration (replacing CSS modules with Tailwind classes) — keeping both systems
- Major dependency consolidation (e.g., merging 3 hooks libraries) — minimal cleanup only
- New features — will be decided after upgrade is complete
- Test coverage additions — not part of this milestone
- Fixing tech debt / security concerns — separate future work
- Performance optimization — separate future work

## Context

- Project is ~1.5 years old, built on Next.js with SCSS modules and Tailwind CSS
- Currently on Next.js 16.1.6, React 19, Tailwind CSS 3.4.1, SASS 1.80.3
- Dual backend: Shopify Storefront API for e-commerce, Sanity CMS for content
- Heavy animation layer: GSAP, Motion (Framer Motion), Embla Carousel, Lenis
- No test suite exists — zero test coverage
- Codebase map available at `.planning/codebase/` with detailed analysis
- Key concern: SCSS nesting, variables, and mixins need vanilla CSS equivalents (custom properties, native nesting)
- Tailwind v4 introduced significant changes (CSS-first config, no more tailwind.config.ts)

## Constraints

- **Visual parity**: Site must look identical after migration — pixel-level match matters
- **Tailwind coexistence**: CSS modules and Tailwind must work together
- **Minimal disruption**: Only remove packages that are clearly unused
- **No new features**: This milestone is purely about modernizing the stack

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Plain CSS modules over SCSS | Reduce build complexity, leverage native CSS nesting and custom properties | — Pending |
| Keep Tailwind alongside CSS modules | Both serve different purposes — utilities vs component styles | — Pending |
| Minimal package cleanup | Avoid scope creep, focus on the migration | — Pending |
| Visual parity as success criteria | Ensures no regressions from the migration | — Pending |

---
*Last updated: 2026-02-27 after initialization*
