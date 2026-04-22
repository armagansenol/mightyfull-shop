# Architecture Research

**Research Date:** 2026-02-27
**Research Type:** Project Research — Architecture dimension for Next.js stack upgrade and SCSS-to-CSS migration

## How the Upgrade Affects Existing Architecture

### Build Pipeline Changes

**Current pipeline:**
```
SCSS files → sass compiler (via sassOptions in next.config.mjs) → CSS
            + prependData injects _functions.scss into every module
Tailwind   → PostCSS (tailwindcss plugin) → CSS
```

**Target pipeline:**
```
CSS modules → native CSS (no preprocessor) → CSS
Tailwind    → PostCSS (@tailwindcss/postcss plugin) → CSS
```

**Key changes:**
1. Remove `sassOptions` from `next.config.mjs` (after all files converted)
2. Update `postcss.config.mjs` — swap `tailwindcss` for `@tailwindcss/postcss`
3. Remove `tailwind.config.ts` — move config to CSS `@theme` directive
4. No more `prependData` injection — every CSS module is self-contained

### Styling System Changes

**Current:** Dual system
- SCSS modules (`.module.scss`) for component-specific layout, responsive sizing, animations
- Tailwind utilities in JSX for spacing, colors, flexbox, common patterns
- Global SCSS (`styles/global.scss`) imports partials: `_reset`, `_fonts`, `_colors`, `_variables`, `_easings`, `_utils`, `_functions`
- CSS custom properties defined in `:root` for theme colors

**Target:** Dual system (simplified)
- CSS modules (`.module.css`) for component-specific styles using native CSS nesting
- Tailwind v4 utilities in JSX (same role as before)
- Global CSS (`styles/global.css`) with inlined partial content
- CSS custom properties for everything (theme colors + z-index + any remaining variables)

### Component Structure — No Changes

The component architecture stays the same:
- Server components for data fetching
- Client components for interactivity
- `'use server'` actions for mutations
- Provider pattern for context (Cart, ReactQuery, LayoutData)

Only the style imports change: `import s from './component.module.scss'` → `import s from './component.module.css'`

---

## Components Affected by Migration

### Global Styles (migrate first)

| File | What changes |
|------|-------------|
| `styles/global.scss` → `global.css` | Inline all `@import` partials, expand `@each` loop, replace `@extend` |
| `styles/_functions.scss` | DELETE — functions consumed by modules, not CSS output |
| `styles/_colors.scss` | Expand `@each` loop into static `:root` declarations |
| `styles/_variables.scss` | DELETE — values inline into call sites |
| `styles/_reset.scss` → `_reset.css` | Rename (already plain CSS) |
| `styles/_fonts.scss` → `_fonts.css` | Rename (already plain CSS) |
| `styles/_easings.scss` → `_easings.css` | Rename (already plain CSS) |
| `styles/_utils.scss` → `_utils.css` | Rename, expand any SCSS features |
| `styles/okendo-widget.scss` → `.css` | Rename |
| `styles/buttons.module.scss` → `.module.css` | **HIGH RISK** — shared across all buttons site-wide |

### Component Modules (~31 files)

Every `.module.scss` file needs:
1. Replace `desktop-vw(N)` calls → `calc(N / 1440 * 100vw)`
2. Replace `mobile-vw(N)` calls → `calc(N / 375 * 100vw)`
3. Replace `@include mobile { ... }` → `@media (max-width: 800px) { ... }`
4. Replace `@include desktop { ... }` → `@media (min-width: 801px) { ... }`
5. Replace `@include hover { ... }` → `@media (hover: hover) { ... }`
6. Replace `@include dims(N)` → `width: N; height: N;`
7. Replace `@include position(pos, T, R, B, L)` → expanded properties
8. Replace `z-index(key)` → `var(--z-key)` with `:root` definitions
9. Fix native CSS nesting syntax (add `&` prefix for descendant selectors where needed)
10. Rename `.module.scss` → `.module.css`
11. Update import in component `.tsx` file

### Config Files

| File | Change |
|------|--------|
| `next.config.mjs` | Remove `sassOptions` block |
| `postcss.config.mjs` | Swap `tailwindcss` → `@tailwindcss/postcss` |
| `tailwind.config.ts` | Migrate to CSS `@theme` directive, then delete |
| `package.json` | Remove `sass`, update `tailwindcss` |

---

## Suggested Migration Order

### Phase 1: Next.js + Dependency Upgrades
- Upgrade Next.js to latest stable
- Bump all other dependencies
- Fix breaking changes (async params, cookies)
- Verify site builds and runs

### Phase 2: SCSS → CSS Modules Migration
Start with globals, then components:

**Wave 1 — Globals:**
1. `styles/_functions.scss` — analyze and document all functions
2. `styles/_colors.scss` — expand `@each` into static CSS
3. `styles/global.scss` → `global.css` — inline partials
4. Create `:root` z-index custom properties

**Wave 2 — Low-risk components:**
- Simple components with few SCSS features
- Components with minimal mixin usage

**Wave 3 — Complex components:**
- Components with heavy `desktop-vw`/`mobile-vw` usage
- `styles/buttons.module.scss` (shared, high risk)
- Cart components, header, product pages

**Wave 4 — Cleanup:**
- Remove `_functions.scss`, `_variables.scss`
- Remove `sassOptions` from `next.config.mjs`
- Remove `sass` from `package.json`

### Phase 3: Tailwind v4 Migration
- After SCSS is fully removed
- Migrate `tailwind.config.ts` → CSS `@theme`
- Update PostCSS config
- Audit and update tailwind-merge, tailwindcss-animate

### Phase 4: Visual Verification
- Side-by-side comparison of all pages
- Check responsive breakpoints
- Verify animations still work
- Confirm hover states and transitions

---

## Data Flow — No Impact

The migration is purely presentational. No changes to:
- Shopify API integration
- Sanity CMS queries
- Cart operations / server actions
- Form handling
- State management (Context, Zustand, React Query)
- Routing

---

## Build Order Dependencies

```
[Upgrade Next.js + deps] → must complete before SCSS migration
                           (ensures build tools are current)

[SCSS → CSS modules]     → must complete before Tailwind v4
                           (both touch PostCSS pipeline)
                         → must complete before removing sass

[Tailwind v4]            → must complete before final verification
                           (changes class names, build process)

[Visual verification]    → terminal step after everything
```

---
*Architecture research completed: 2026-02-27*
