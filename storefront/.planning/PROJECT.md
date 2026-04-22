# Mightyfull Shop

## What This Is

A headless Shopify e-commerce storefront for Mightyfull cookies, built with Next.js 16 and React 19. The site combines Shopify Storefront API for product catalog and cart operations with Sanity CMS (v5) for content management. It features rich animations (GSAP, Motion), smooth scrolling (Lenis), and a polished UI with Radix UI primitives and Tailwind CSS v4 utilities alongside plain CSS modules.

## Core Value

The shopping experience must work flawlessly — browsing products, adding to cart, and completing checkout through Shopify — with visual polish that matches the brand.

## Requirements

### Validated

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
- ✓ All dependencies upgraded to latest stable versions — v1.0
- ✓ SCSS modules migrated to plain CSS modules with native nesting — v1.0
- ✓ SASS dependency removed from project — v1.0
- ✓ Tailwind CSS v4 with CSS-first @theme configuration — v1.0
- ✓ Visual parity confirmed across all pages and viewports — v1.0

### Active

(None — plan next milestone)

### Out of Scope

- Full Tailwind migration (replacing CSS modules with Tailwind classes) — keeping both systems
- Major dependency consolidation (e.g., merging 3 hooks libraries) — minimal cleanup only
- Test coverage additions — not part of current scope
- Performance optimization — separate future work

## Context

- Shipped v1.0 stack upgrade milestone on 2026-03-01
- Tech stack: Next.js 16.1.6, React 19.2.4, Tailwind CSS v4.2.1, Biome 2.4.4, TypeScript 5.9.3
- Dual backend: Shopify Storefront API for e-commerce, Sanity CMS v5 for content
- Animation layer: GSAP 3.14.2, Motion 12.34.3, Embla Carousel 8.6.0, Lenis 1.3.17
- Styling: Plain CSS modules (.module.css) with native nesting + Tailwind v4 utilities
- No test suite exists — zero test coverage
- Build tool: pnpm with lockfile v9.0

## Constraints

- **Visual parity**: Site must look identical after any migration
- **Tailwind coexistence**: CSS modules and Tailwind must work together
- **No test coverage**: Manual verification is required for any changes

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Plain CSS modules over SCSS | Reduce build complexity, leverage native CSS nesting and custom properties | ✓ Good — 31 modules converted, SASS removed, zero regressions |
| Keep Tailwind alongside CSS modules | Both serve different purposes — utilities vs component styles | ✓ Good — coexistence works with @layer base fix |
| Biome replacing ESLint + Prettier | Single tool for linting and formatting | ✓ Good — checks 223 files with no issues |
| Visual parity as success criteria | Ensures no regressions from the migration | ✓ Good — 58 screenshots captured, human-verified |
| CSS-first @theme for TW v4 | Eliminates tailwind.config.ts, all tokens in CSS | ✓ Good — backward-compat aliases bridge CSS module var() refs |
| @layer base for CSS reset | Unlayered reset beat TW v4 utilities in cascade | ✓ Good — critical fix discovered during visual verification |
| Remove stale var() refs (not add definitions) | Git history confirmed vars were intentionally deleted or never defined | ✓ Good — 4 stale refs removed, no new definitions needed |

---
*Last updated: 2026-03-01 after v1.0 milestone*
