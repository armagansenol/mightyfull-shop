# Phase 03: Tailwind v4 Migration - Research

**Researched:** 2026-02-28
**Domain:** Tailwind CSS v3 to v4 migration, PostCSS pipeline, CSS-first configuration
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Theme token strategy:**
- `@theme` block lives in `global.css` alongside existing `:root` custom properties
- Register ALL existing CSS custom properties (colors, z-index, easings, fonts) as Tailwind theme tokens so TW generates utility classes for them (e.g. `bg-brand-blue`, `z-header`)
- Consolidate into `@theme` — move all design tokens from `:root` into `@theme`, remove duplicate `:root` vars. Single source of truth.
- Adopt Tailwind v4 default breakpoints (640, 768, 1024, 1280, 1536) instead of preserving custom 800px
- Sync CSS module media queries to match TW v4 breakpoints — update all `@media (max-width: 800px)` in `.module.css` files to 768px for consistency

**Breaking class changes:**
- Run official codemod (`npx @tailwindcss/upgrade`) first, then manually review and fix anything it missed
- Functional match tolerance — layout, spacing, and colors must match; minor rendering differences in shadows/rings/gradients acceptable if they look good
- Convert any `@apply` directives to regular CSS (align with v4 best practices)
- Let TW v4 handle CSS layer ordering automatically — trust default layer ordering (theme, base, components, utilities)

**Dark mode / theming:**
- No dark mode — keep single light theme. Dark mode is a separate feature for a potential future phase
- Focus purely on upgrading TW infrastructure

**Dependency compatibility:**
- Upgrade `tailwind-merge` to v3+ for TW v4 compatibility
- Upgrade `tailwindcss-animate` to v4-compatible version if one exists; otherwise Claude decides the fallback
- No other TW-dependent packages to account for — just tw-merge and tw-animate

### Claude's Discretion
- Exact `@theme` token naming conventions
- How to handle edge cases the codemod misses
- `tailwindcss-animate` fallback strategy if no v4-compatible version exists
- CSS layer conflict resolution if any arise

### Deferred Ideas (OUT OF SCOPE)
- Dark mode support — separate phase if desired later
- Custom breakpoint additions beyond TW v4 defaults — evaluate after migration lands
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TW-01 | `tailwind.config.ts` custom theme values migrated to CSS `@theme` directive | @theme namespaces, token naming, referencing CSS vars with `@theme inline` |
| TW-02 | PostCSS config updated from `tailwindcss` to `@tailwindcss/postcss` plugin | New package name, installation, config syntax |
| TW-03 | `tailwind-merge` updated to v4-compatible version | tailwind-merge v3.x required; v2.x not compatible with TW v4 class names |
| TW-04 | `tailwindcss-animate` audited and updated or replaced with native CSS animations | `tailwindcss-animate` is deprecated; `tw-animate-css` is the drop-in replacement |
| TW-05 | `tailwind.config.ts` file removed after migration | Confirmed: v4 is fully CSS-first; JS config no longer needed after @theme migration |
| TW-06 | All Tailwind utility classes verified working with v4 | Renamed utilities (shadow, blur, rounded, ring, outline-none), container changes, breakpoint changes |
</phase_requirements>

---

## Summary

Tailwind CSS v4 is a ground-up rewrite with a CSS-first configuration model. The JavaScript config file (`tailwind.config.ts`) is replaced by a `@theme` block in your main CSS file. The PostCSS plugin moved to a separate package (`@tailwindcss/postcss`). The official upgrade codemod (`npx @tailwindcss/upgrade`) handles ~90% of mechanical changes automatically, including package upgrades, config-to-CSS migration, and renamed utility class rewrites in JSX/TSX files.

This project has a specific additional concern: the `tailwind.config.ts` uses custom breakpoints (`tablet: 800px`, `desktop: 1280px`) alongside standard Tailwind names. The user decision is to drop the 800px breakpoint in favor of TW v4's default 768px. This means 152 occurrences of `@media (max-width: 800px)` across 20 CSS module files need to be updated to 768px — a significant but mechanical change the codemod will NOT handle (it only rewrites class names in templates, not arbitrary CSS values).

The two plugin dependencies need dedicated attention. `tailwind-merge` v2.x is incompatible with TW v4 and must be upgraded to v3.x. `tailwindcss-animate` v1.0.7 (currently installed) was formally deprecated on March 19, 2025; the CSS-first replacement is `tw-animate-css`, which provides the same `accordion-down`/`accordion-up` keyframes and `animate-in`/`animate-out` vocabulary that this project actively uses.

**Primary recommendation:** Run `npx @tailwindcss/upgrade` first, then manually: (1) consolidate `:root` tokens into `@theme`, (2) replace `tailwindcss-animate` with `tw-animate-css`, (3) upgrade `tailwind-merge` to v3, (4) update 800px breakpoints to 768px in all CSS modules.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `tailwindcss` | `^4.x` (latest stable) | Core framework | v4 is current stable; v3 EOL trajectory |
| `@tailwindcss/postcss` | `^4.x` | PostCSS plugin (was inline in `tailwindcss` v3) | Required — separate package in v4 |
| `@tailwindcss/typography` | `^0.5.19` | Prose/typography utilities | Already in use; v0.5.19 is v4-compatible with `@plugin` directive |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tailwind-merge` | `^3.x` (latest ~3.5.0) | Merge conflicting TW classes without style conflicts | Already used via `cn()` helper — required upgrade |
| `tw-animate-css` | `^1.x` (latest) | v4 replacement for `tailwindcss-animate` | Use because `tailwindcss-animate` is deprecated and incompatible with v4 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `tw-animate-css` | Native `@keyframes` in `@theme` | Native approach requires manually defining accordion-down/up and other keyframes that `tw-animate-css` ships pre-made; adds boilerplate for no gain |
| `@tailwindcss/postcss` | `@tailwindcss/vite` | Vite plugin only works with Vite; this project uses Next.js with PostCSS pipeline |

**Installation (full upgrade):**
```bash
# Remove old TW v3 + dependencies
pnpm remove tailwindcss tailwindcss-animate tailwind-merge

# Install TW v4 stack
pnpm add -D tailwindcss @tailwindcss/postcss
pnpm add tw-animate-css tailwind-merge@^3

# @tailwindcss/typography already in dependencies — just upgrade it
pnpm add @tailwindcss/typography@latest
```

Note: The codemod will handle the `pnpm remove / pnpm add tailwindcss @tailwindcss/postcss` portion automatically. The `tailwindcss-animate` → `tw-animate-css` swap is manual.

---

## Architecture Patterns

### Recommended Project Structure

```
styles/
├── global.css          # @import "tailwindcss"; @theme { ... }; all :root tokens; base styles
├── tailwind-initial.css # DELETE after migration — content moves into global.css
└── okendo-widget.css   # Unchanged — no TW dependency

postcss.config.mjs      # @tailwindcss/postcss only (no tailwindcss, no autoprefixer)
tailwind.config.ts      # DELETE after full migration
```

### Pattern 1: CSS-First Configuration with @import

**What:** Replace `@tailwind base/components/utilities` directives and the JS config with a single CSS import and `@theme` block.

**Example:**
```css
/* Source: https://tailwindcss.com/docs/upgrade-guide */
/* styles/global.css — top of file, before @import './okendo-widget.css' */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "tw-animate-css";

@theme {
  /* colors */
  --color-white: rgb(255, 255, 255);
  --color-black: rgb(21, 24, 25);
  --color-blue-ruin: rgb(0, 119, 224);
  --color-sugar-milk: rgb(255, 250, 243);
  /* ... all other brand colors */

  /* fonts */
  --font-bomstad-display: BomstadDisplay, sans-serif;
  --font-poppins: Poppins, sans-serif;

  /* breakpoints — v4 defaults (640, 768, 1024, 1280, 1536) */
  /* No custom breakpoints — use defaults */

  /* grid extensions */
  --grid-template-columns-24: repeat(24, minmax(0, 1fr));
  /* col-span-13 through col-span-24 — see note below */

  /* border radius */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* accordion animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }

  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}
```

Note: `tw-animate-css` ships `accordion-down`/`accordion-up` keyframes. If importing `tw-animate-css`, the manual `@keyframes` above are likely redundant — verify after testing.

### Pattern 2: @theme inline for CSS Variable References

**What:** When a `@theme` token references another CSS variable (e.g., font loaded via `next/font`), use `@theme inline` to resolve the value at build time.

**When to use:** Fonts injected by `next/font` as CSS custom properties (e.g., `--font-inter`).

**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
@theme inline {
  --font-sans: var(--font-inter);
}
```

This project uses `var(--font-bomstad-display)` and `var(--font-poppins)` in `tailwind.config.ts`. Since BomstadDisplay is defined directly in `@font-face` (not `next/font`), the font values can be referenced directly in `@theme` without `inline`.

### Pattern 3: PostCSS Config

```javascript
// Source: https://tailwindcss.com/docs/guides/nextjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Note: `autoprefixer` and `postcss-import` are no longer needed — v4 handles both automatically.

### Pattern 4: Typography Plugin as @plugin Directive

In v4, plugins are declared with `@plugin` in CSS instead of in the JS config:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

The `prose` class usage across this project (faq-list, product-specs, privacy-policy, shop product page) will continue working.

### Pattern 5: Container Utility with @utility

The v3 config had `container: { center: true, padding: { DEFAULT: '1rem' } }`. In v4, container configuration is handled via `@utility`:

```css
/* Source: https://tailwindcss.com/docs/upgrade-guide */
@utility container {
  margin-inline: auto;
  padding-inline: 1rem;
}
```

The project uses `container` in `customer-reviews`, `horizontal-scroll`, and several page files — this will need to preserve centered + padded behavior.

### Pattern 6: @theme for Custom Grid Columns

The v3 config extends `gridTemplateColumns` and `gridColumn` for a 24-column grid. In v4:

```css
@theme {
  /* 24-column grid */
  --grid-template-columns-24: repeat(24, minmax(0, 1fr));

  /* Extended col-span utilities (13-24) */
  /* Note: In v4, col-span-N utilities are generated automatically for any N.
     The codemod should handle col-span-13 through col-span-24 automatically.
     Verify after running codemod. */
}
```

In Tailwind v4, arbitrary values and dynamic utilities are more flexible. The `col-span-13` through `col-span-24` custom utilities from v3 config may be automatically available in v4 without explicit `@theme` registration — verify post-codemod.

### Anti-Patterns to Avoid

- **Keeping `tailwindcss` as PostCSS plugin:** Error — `[postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin.` Package is separate in v4.
- **Keeping `tailwindcss-animate` as a JS plugin import:** Deprecated, incompatible with v4's plugin system. Use `tw-animate-css` CSS import instead.
- **Using `@apply` in CSS modules without `@reference`:** In v4, CSS modules don't have access to theme variables/utilities from other files. Since the user decision is to convert `@apply` to regular CSS, this is avoided by design — but if any `@apply` usage is found during migration, use CSS variables directly instead.
- **Keeping `.dark` class overrides in global.css:** No dark mode needed. The `tailwind-initial.css` Shadcn init CSS includes `.dark { ... }` block — safe to remove when moving tokens to `@theme`.
- **Forgetting `@theme inline` for CSS variables referenced in utilities:** Without `inline`, variable resolution at utility-generation time can silently fall back instead of throwing an error.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class conflict merging | Custom merge logic | `tailwind-merge` v3 | Handles TW v4 class name format changes (important modifier position, arbitrary CSS var syntax) |
| Animate-in/out vocabulary | Custom `@keyframes` for accordion/fade/zoom/slide | `tw-animate-css` | Ships accordion-down/up, fade, zoom, slide, blur presets; `@import "tw-animate-css"` |
| @tailwind directives parse | Nothing | `@import "tailwindcss"` | v4 replaces 3 separate directives with one import |

**Key insight:** The TW v4 ecosystem has first-party CSS-first replacements for every v3 JS-plugin pattern. Don't rebuild what the ecosystem already solved.

---

## Common Pitfalls

### Pitfall 1: Codemod Misses Config-to-Theme Edge Cases

**What goes wrong:** The codemod migrates most of the `tailwind.config.ts` but may not correctly handle: nested color objects (like `card: { DEFAULT: ..., foreground: ... }`), the `darkMode: ['class']` config (produces `.dark:*` variants), and `container` plugin options.

**Why it happens:** The codemod is heuristic-based; complex or non-standard config shapes sometimes require manual review.

**How to avoid:** After running the codemod, diff the generated CSS against the original config. Check that all color tokens in `tailwind.config.ts` have corresponding `@theme` entries. The nested color objects (card, popover, primary, secondary, muted, accent, destructive) need flat naming in `@theme`:
```css
@theme {
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  /* etc. */
}
```

**Warning signs:** `bg-card`, `text-foreground`, `border-input` classes stop rendering.

### Pitfall 2: tailwind.config.ts Color Values Use HSL Space Components (Shadcn Pattern)

**What goes wrong:** The `tailwind-initial.css` defines `:root` CSS variables using bare HSL space-separated values (e.g., `--background: 0 0% 100%`), and `tailwind.config.ts` wraps them as `hsl(var(--background))`. This v3 Shadcn pattern breaks in v4 because TW v4 uses modern CSS color functions natively.

**Why it happens:** Shadcn's original Tailwind v3 setup used a compatibility hack — defining variables as raw HSL components so they could be embedded in `hsl()`. TW v4 expects actual color values or `oklch()`.

**How to avoid:** Convert the HSL component variables to actual values when migrating to `@theme`. For example:
- `--background: 0 0% 100%` (bare components) → `--color-background: oklch(1 0 0)` or `--color-background: #ffffff` in `@theme`

The codemod usually handles this. Verify the generated `@theme` block has valid CSS color values, not bare space-separated numbers.

**Warning signs:** Background/foreground colors render incorrectly or as transparent.

### Pitfall 3: Custom Breakpoints — `tablet:` and `desktop:` Classes Break

**What goes wrong:** The v3 config has `screens: { tablet: '800px', desktop: '1280px', ... }`. These generate `tablet:*` and `desktop:*` responsive prefix classes used extensively in JSX (verified: `tablet:hidden`, `tablet:grid`, `desktop:gap-4`, etc.). After codemod, these breakpoints must be in `@theme` as `--breakpoint-tablet` etc., OR the user decision to drop the custom breakpoints must be executed (rename `tablet:` → `md:` in JSX).

**Why it happens:** The user decided to adopt TW v4 defaults (640/768/1024/1280/1536) and NOT add custom breakpoints. This means `tablet:` → `md:` (768px) and `desktop:` → `lg:` (1024px) rename in all JSX files.

**How to avoid:** This is the largest manual task in the migration. The codemod will NOT rename `tablet:md:*` prefix semantics for you — it only renames class names, not breakpoint aliases. Requires grep + replace across all TSX files.

**Warning signs:** All `tablet:*` and `desktop:*` utilities silently stop applying (no build error, just broken responsive layouts).

### Pitfall 4: `tailwindcss-animate` Plugin Not Loadable in v4

**What goes wrong:** The v3 plugin import pattern (`import tailwindAnimate from 'tailwindcss-animate'` → `plugins: [tailwindAnimate]`) is the JavaScript plugin API which v4 changed. `tailwindcss-animate` v1.0.7 does not support `@plugin` directive.

**Why it happens:** `tailwindcss-animate` was deprecated March 2025. It was never updated for v4 compatibility.

**How to avoid:** Replace with `tw-animate-css`. Change `tailwind.config.ts` accordion keyframes to inline `@keyframes` in `@theme` (or rely on `tw-animate-css`'s built-in `accordion-down`/`accordion-up`). Remove the `animation` and `keyframes` entries from the config.

**Warning signs:** `data-[state=closed]:animate-accordion-up` and `data-[state=open]:animate-accordion-down` on the `<AccordionContent>` component stop animating.

### Pitfall 5: The 800px → 768px CSS Module Update Is Mechanical but High-Touch

**What goes wrong:** 152 occurrences of `@media (max-width: 800px)` across 20 CSS files need updating to `768px`. Manual editing is error-prone at this scale.

**Why it happens:** The previous SCSS migration preserved 800px because that was the custom breakpoint; now aligning to TW v4 defaults.

**How to avoid:** Use a single sed/replace command across all `.module.css` files in the project. Verify count before and after to ensure completeness. Also update `@media (min-width: 800px)` occurrences (found in `global.css` `.hide-on-desktop` and `.hide-on-mobile` rules).

**Warning signs:** After upgrading, `tablet:hidden` (now `md:hidden`) triggers at 768px but CSS modules trigger hide/show at 800px — creating a 32px gap where both might apply.

### Pitfall 6: `tailwind-initial.css` Import vs `@import "tailwindcss"` Conflict

**What goes wrong:** Currently `app/layout.tsx` imports two files separately: `styles/global.css` (base styles) and `styles/tailwind-initial.css` (TW directives + Shadcn variables). After v4 migration, `@import "tailwindcss"` goes in `global.css`. If `tailwind-initial.css` still exists with old `@tailwind` directives, conflicts arise.

**Why it happens:** The two-file setup was a legacy organization from the pre-migration era.

**How to avoid:** During migration, fold the Shadcn `:root` variables from `tailwind-initial.css` into the `@theme` block in `global.css`, then delete `tailwind-initial.css` and its import from `app/layout.tsx`.

---

## Code Examples

Verified patterns from official sources:

### PostCSS Config (v4)

```javascript
// Source: https://tailwindcss.com/docs/guides/nextjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### @theme Block Structure for This Project

```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "tw-animate-css";

@theme {
  /* === Brand Colors === */
  --color-white: rgb(255, 255, 255);
  --color-black: rgb(21, 24, 25);
  --color-error: rgb(229, 72, 77);
  --color-blue-ruin: rgb(0, 119, 224);
  --color-cerulean: rgb(85, 177, 242);
  --color-sugar-milk: rgb(255, 250, 243);
  --color-nova-pink: rgb(220, 79, 149);
  --color-nova-pink-light: rgba(220, 79, 149, 0.15);
  --color-cherry-blush: rgb(255, 199, 224);
  --color-fuchsia-nebula: rgb(124, 30, 179);
  --color-rose-dragee: rgb(233, 206, 255);
  --color-lavender-blossom: rgb(185, 122, 221);
  --color-columbia-blue: rgb(152, 225, 255);
  --color-highlighter-lilac: rgb(211, 49, 130);
  --color-highlighter-lilac-light: rgba(211, 49, 130, 0.15);
  --color-silverback: rgb(203, 203, 203);

  /* === Shadcn Semantic Colors (from tailwind-initial.css) === */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(240 10% 3.9%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(240 10% 3.9%);
  --color-primary: hsl(240 5.9% 10%);
  --color-primary-foreground: hsl(0 0% 98%);
  --color-secondary: hsl(240 4.8% 95.9%);
  --color-secondary-foreground: hsl(240 5.9% 10%);
  --color-muted: hsl(240 4.8% 95.9%);
  --color-muted-foreground: hsl(240 3.8% 46.1%);
  --color-accent: hsl(240 4.8% 95.9%);
  --color-accent-foreground: hsl(240 5.9% 10%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-border: hsl(240 5.9% 90%);
  --color-input: hsl(240 5.9% 90%);
  --color-ring: hsl(240 10% 3.9%);

  /* === Fonts === */
  --font-bomstad-display: BomstadDisplay, sans-serif;
  --font-poppins: Poppins, sans-serif;

  /* === Border Radius (from Shadcn) === */
  --radius: 0.5rem;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* === Grid === */
  --grid-template-columns-24: repeat(24, minmax(0, 1fr));

  /* === Accordion animations (if not relying on tw-animate-css) === */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}
```

### Container Utility Migration

```css
/* Source: https://tailwindcss.com/docs/upgrade-guide */
/* Replaces tailwind.config.ts: container: { center: true, padding: { DEFAULT: '1rem' } } */
@utility container {
  margin-inline: auto;
  padding-inline: 1rem;
}
```

### tailwind-merge v3 Usage (No API Change)

```typescript
// Source: https://github.com/dcastil/tailwind-merge
// lib/utils.ts — no change needed, API is identical
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

tailwind-merge v3 is a drop-in upgrade for the `cn()` helper — API unchanged.

### 800px → 768px Breakpoint Update Command

```bash
# Update all CSS module media queries (run from project root)
# max-width direction (mobile-first guard)
find . -name "*.module.css" -not -path "./.next/*" \
  -exec sed -i '' 's/@media (max-width: 800px)/@media (max-width: 768px)/g' {} +

# min-width direction (desktop-first guard)
find . -name "*.module.css" -not -path "./.next/*" \
  -exec sed -i '' 's/@media (min-width: 800px)/@media (min-width: 768px)/g' {} +

# Also update global.css (.hide-on-desktop / .hide-on-mobile utilities)
sed -i '' 's/@media (max-width: 800px)/@media (max-width: 768px)/g' styles/global.css
sed -i '' 's/@media (min-width: 800px)/@media (min-width: 768px)/g' styles/global.css
```

### Renamed Classes in v4 (relevant to this project)

```
v3 class       → v4 class
outline-none   → outline-hidden   (found in Radix/Shadcn components)
rounded-sm     → rounded-xs       (found once in components)
shadow-sm      → shadow-xs        (check post-codemod)
```

The codemod handles these automatically. Verify with `git diff` after running it.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwindcss` as PostCSS plugin | `@tailwindcss/postcss` separate package | TW v4 (Jan 2025) | Breaking — must update postcss.config.mjs |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | TW v4 | Breaking — replaces 3 directives with 1 import |
| JS config (`tailwind.config.ts`) | `@theme { }` block in CSS | TW v4 | Breaking — JS config obsolete for standard use |
| `tailwindcss-animate` plugin | `tw-animate-css` CSS import | Mar 2025 (deprecation) | Breaking — deprecated, incompatible with v4 plugin API |
| `tailwind-merge` v2 | `tailwind-merge` v3 | v3.0.0 release | Breaking — v2 doesn't handle TW v4 class format changes |
| `tailwindcss-animate` in plugins array | `@import "tw-animate-css"` in CSS | TW v4 | Behavior identical; API completely different |
| `container: { center: true }` JS config | `@utility container { ... }` CSS | TW v4 | Config option removed; needs CSS-side replacement |

**Deprecated/outdated in this project:**
- `tailwind-initial.css`: Shadcn init file with `@tailwind` directives — replace with `@import "tailwindcss"` in `global.css`, then delete
- `tailwindcss-animate` v1.0.7: Deprecated March 2025 — replace with `tw-animate-css`
- `tailwind-merge` v2.6.1: Not v4-compatible — upgrade to v3.x
- `tailwind.config.ts`: Delete after `@theme` migration is complete
- `darkMode: ['class']` in config: No dark mode needed — omit entirely
- `screens: { tablet: '800px' }` custom breakpoint: Drop in favor of default `md: 768px`
- `screens: { desktop: '1280px' }` custom breakpoint: Aligned with default `xl: 1280px` — verify naming

---

## Open Questions

1. **Does the codemod handle `col-span-13` through `col-span-24` custom gridColumn extensions?**
   - What we know: In v4, `col-span-*` utilities are generated dynamically for any integer. The v3 config explicitly extended `gridColumn` with these.
   - What's unclear: Whether v4 auto-generates `col-span-13` through `col-span-24` or if they need explicit `@theme` entries.
   - Recommendation: After running the codemod, test `col-span-24` in the contact page and shop page; if it works, no action needed. If not, add `--grid-column-span-24: span 24 / span 24` etc. to `@theme`.
   - Confidence: MEDIUM — v4 dynamic utilities suggest they work, but verify.

2. **Does `tw-animate-css` ship the exact `accordion-down`/`accordion-up` keyframes that Radix needs?**
   - What we know: `tw-animate-css` README states it ships `accordion-down` and `accordion-up` as ready-to-use animations.
   - What's unclear: Whether the keyframe uses `var(--radix-accordion-content-height)` specifically (the Radix-required variable), or a generic height animation.
   - Recommendation: After installing `tw-animate-css`, test the accordion in the FAQ page. If it doesn't animate correctly, add the Radix-specific keyframes manually to `@theme`.
   - Confidence: MEDIUM — tw-animate-css appears purpose-built for this use case.

3. **`desktop: '1280px'` breakpoint — align with TW v4 `xl: 1280px` or `2xl: 1536px`?**
   - What we know: TW v4 default breakpoints are `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`. The project's `desktop: 1280px` aligns with TW v4's `xl`.
   - What's unclear: The project's current `desktop:` prefix usage in JSX (e.g., `desktop:gap-4`) — if the codemod doesn't rename `desktop:` → `xl:`, this is another manual rename pass.
   - Recommendation: After the codemod, grep for `desktop:` prefixes in JSX; if present, rename to `xl:`.
   - Confidence: HIGH for the alignment; MEDIUM for whether codemod handles this.

---

## Sources

### Primary (HIGH confidence)
- https://tailwindcss.com/docs/upgrade-guide — Official migration guide, all breaking changes
- https://tailwindcss.com/docs/theme — @theme directive, namespaces, inline option
- https://tailwindcss.com/docs/guides/nextjs — Next.js + PostCSS setup for v4

### Secondary (MEDIUM confidence)
- https://github.com/Wombosvideo/tw-animate-css — tw-animate-css README, installation, class list
- https://github.com/dcastil/tailwind-merge/releases — Release notes confirming v3.x supports TW v4.0-4.2
- https://www.npmjs.com/package/@tailwindcss/typography — v0.5.19 changelog confirming v4 support

### Tertiary (LOW confidence)
- https://ui.shadcn.com/docs/tailwind-v4 — Shadcn migration notes (community source but authoritative for Shadcn patterns)
- https://github.com/tailwindlabs/tailwindcss/discussions/14801 — Container utility discussion confirming @utility approach

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified via official docs and npm release notes
- Architecture patterns: HIGH — @theme, @import "tailwindcss", @utility all from official docs
- Pitfalls: HIGH — verified against official upgrade guide; breakpoint rename risk is HIGH based on codebase grep findings
- `tw-animate-css` accordion keyframes: MEDIUM — README claims compatibility, unverified against Radix specifically

**Research date:** 2026-02-28
**Valid until:** 2026-04-01 (Tailwind v4 is actively releasing minor versions; verify latest before executing)
