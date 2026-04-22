# Stack Research

**Research Date:** 2026-02-27
**Research Type:** Project Research — Stack dimension for Next.js headless Shopify upgrade + SCSS-to-CSS migration

## Current State (from package-lock.json)

| Package | package.json | Installed (lockfile) | Notes |
|---------|-------------|---------------------|-------|
| Next.js | 16.1.6 | 16.1.6 | Verify if stable or canary |
| React / React DOM | 19 | 19.2.4 | Already current |
| Tailwind CSS | 3.4.1 | 3.4.14 | Major v4 upgrade needed |
| SASS | 1.80.3 | 1.80.3 | To be removed |
| Motion | 12.6.3 | 12.34.3 | Lockfile ahead |
| Hydrogen React | 2025.1.3 | 2025.10.0 | Lockfile ahead |
| next-sanity | 9.8.36 | 9.12.3 | Lockfile ahead |
| Sanity | 3.61.0 | 3.62.0 | Minor patch ahead |
| GSAP | 3.12.5 | 3.12.5 | Check for v4 |
| TanStack React Query | 5.59.20 | 5.59.20 | Check latest 5.x |
| Zustand | 5.0.0 | 5.0.0 | Check latest 5.x |
| React Hook Form | 7.54.2 | 7.54.2 | Check latest 7.x |

## Target Versions

### Core Framework

**Next.js** — Target: latest stable (verify with `npm show next dist-tags`)
- **Confidence:** High
- **Breaking changes:** Turbopack now default for dev, async `params` in dynamic routes, cache behavior changes, `cookies()` is now async
- **Migration:** Run `npx @next/codemod@latest upgrade`, review `next.config.mjs` for deprecated options
- **Rationale:** Stay on latest stable for security patches, performance, and ecosystem compatibility

**React / React DOM** — Target: latest 19.x stable
- **Confidence:** High
- **Breaking changes:** Minimal from 19.2.x — already on React 19
- **Migration:** `npm install react@latest react-dom@latest`
- **Rationale:** Already current, just bump to latest patch

### Styling

**Tailwind CSS** — Target: v4.x stable
- **Confidence:** High
- **Breaking changes (major):**
  - Configuration moves from `tailwind.config.ts` to CSS `@theme` directive
  - PostCSS plugin changes from `tailwindcss` to `@tailwindcss/postcss`
  - Automatic content detection (no manual `content` array)
  - Lightning CSS replaces PostCSS as default engine
  - Class name format changes affect `tailwind-merge`
  - `tailwindcss-animate` compatibility unknown — audit required
- **Migration:** Follow official v4 upgrade guide. Rewrite config as `@theme` block in CSS.
- **Rationale:** v4 is significantly faster, CSS-first config aligns with CSS modules migration

**SASS** — Target: REMOVE
- **Confidence:** High
- **Migration:** Remove after all `.module.scss` files converted to `.module.css`
- **Rationale:** Core goal of this milestone

**PostCSS** — Target: latest 8.x
- **Confidence:** High
- **Changes:** Update `postcss.config.mjs` for Tailwind v4 plugin swap
- **Migration:** Replace `tailwindcss` with `@tailwindcss/postcss` in config

### Animation

**GSAP** — Target: latest 3.x (or 4.x if stable)
- **Confidence:** Medium — check if v4 exists and is stable
- **Breaking changes:** TBD based on version
- **Migration:** `npm install gsap@latest @gsap/react@latest`

**Motion (Framer Motion)** — Target: latest 12.x
- **Confidence:** High
- **Migration:** Already on 12.x, bump to latest

**Lenis** — Target: latest 1.x
- **Confidence:** High
- **Migration:** Bump to latest patch

**Embla Carousel** — Target: latest 8.x
- **Confidence:** High
- **Migration:** Bump all embla packages together

### E-commerce

**Shopify Hydrogen React** — Target: latest 2025.x or 2026.x
- **Confidence:** Medium — verify compatibility with latest React/Next.js
- **Migration:** `npm install @shopify/hydrogen-react@latest`

**Shopify Storefront API Client** — Target: latest 1.x
- **Confidence:** High
- **Migration:** Bump to latest

### CMS

**Sanity** — Target: latest 3.x
- **Confidence:** High
- **Migration:** Bump sanity and next-sanity together

**next-sanity** — Target: latest 9.x
- **Confidence:** High
- **Migration:** Check for breaking changes in 9.12+

### UI Libraries

**Radix UI** — Target: latest 1.x for all packages
- **Confidence:** High
- **Migration:** Bump all `@radix-ui/*` packages

**tailwind-merge** — Target: v4-compatible version
- **Confidence:** Medium — must audit v4 compatibility
- **Migration:** Check tailwind-merge changelog for v4 support

**tailwindcss-animate** — Target: audit v4 compatibility
- **Confidence:** Low — may need replacement
- **Migration:** Check if v4-compatible version exists, or find alternative

**class-variance-authority (CVA)** — Target: latest 0.7.x
- **Confidence:** High
- **Migration:** Bump to latest

## Packages to Remove

| Package | Reason |
|---------|--------|
| `sass` | Core migration goal — replace SCSS with CSS modules |
| `tailwindcss-animate` | If not v4-compatible, replace with native CSS animations |

## Packages to Evaluate for Removal (minimal cleanup)

| Package | Reason | Decision |
|---------|--------|----------|
| `@uidotdev/usehooks` | Overlaps with `usehooks-ts` and `react-use` | Keep (out of scope) |
| `usehooks-ts` | Overlaps with above | Keep (out of scope) |
| `react-use` | Overlaps with above | Keep (out of scope) |
| `next-themes` | Evaluate if still needed | Keep unless clearly unused |

## Upgrade Sequence

1. **Next.js + React** — Framework foundation first
2. **Dependency bumps** — All other packages to latest compatible versions
3. **SCSS to CSS modules** — Migrate all `.module.scss` to `.module.css`
4. **Tailwind v4** — Config migration after SCSS is done (both touch PostCSS pipeline)
5. **Remove SASS** — Terminal step after all conversions verified
6. **Verify visual parity** — Final check

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tailwind v4 breaks existing utilities | Medium | Medium | Audit all tw classes before upgrading |
| SCSS function conversion errors | Low | High | Convert one file at a time, visual check each |
| Next.js cache behavior changes | Medium | Low | Test product pages and cart flows |
| tailwindcss-animate incompatible with v4 | High | Low | Small surface area, replace with native CSS |
| GSAP hydration issues with new Next.js | Low | Medium | Test animation pages thoroughly |

---
*Stack research completed: 2026-02-27*
