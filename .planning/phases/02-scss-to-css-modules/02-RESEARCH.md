# Phase 2: SCSS to CSS Modules - Research

**Researched:** 2026-02-27
**Domain:** SCSS to plain CSS modules migration — global partials, vw() functions, mixins, z-index map
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Variable strategy**
- Convert all SCSS variables ($var) to CSS custom properties (--var) defined in a :root block in global.css
- global.scss becomes global.css with :root at the top containing all shared variables
- No separate tokens file — everything in global.css :root

**vw/calc replacement**
- Do NOT convert SCSS vw() functions to CSS calc() — replace them with Tailwind responsive classes instead
- Apply this to everything possible: font sizes, padding, margins, widths, heights, gaps
- Wherever Tailwind has the utility, use it instead of calc-based responsive sizing
- This means component JSX will gain Tailwind classes and CSS modules will lose responsive calc rules

**Mixin replacement**
- Replace SCSS mixins with Tailwind utility classes in JSX (responsive breakpoints become md:, lg:, etc.; typography mixins become text-* classes)
- Use CSS native nesting syntax (& selector) to preserve nested structures — do not flatten
- Replace @extend with CSS Modules composes: keyword

**Mixin timing (Claude's discretion)**
- Claude evaluates whether converting responsive mixins to Tailwind v3 classes now is safe given Phase 3 upgrades to v4
- If Tailwind v3→v4 would break the classes, use temporary inline CSS that Phase 3 converts properly
- If the classes are stable across v3→v4, convert to Tailwind now

**SASS color functions**
- Replace darken(), lighten(), and other SASS color functions with CSS color-mix() or oklch()
- Do NOT hardcode computed color values — use modern CSS color functions

**Conversion order**
- Follow roadmap wave structure: global.css first (standalone) → simple modules → complex modules → shared buttons + cleanup
- global.scss converted first as its own commit to establish :root variables and patterns
- Delete SCSS files immediately after conversion (rename in-place), do not keep alongside

**Commit granularity**
- Logical groups of 3-5 related files per commit
- Each commit must be a working build state

**Visual verification**
- After each conversion group: start dev server and check affected pages
- Check both viewports: desktop (1440px) AND mobile (375px)
- If visual difference is spotted, fix immediately before moving to next group — every commit maintains visual parity
- Build must pass before committing (same as Phase 1 convention)

### Claude's Discretion
- Exact grouping of files within each wave
- Whether specific mixin conversions go to Tailwind now or get temporary inline CSS
- How to handle edge cases where Tailwind doesn't have an equivalent utility
- Exact CSS native nesting patterns to use

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CSS-01 | Global `_functions.scss` analyzed — all functions/mixins documented with CSS equivalents | Full mixin/function inventory below; all have clear native equivalents |
| CSS-02 | `_colors.scss` `@each` loop expanded into static `:root` CSS custom properties | 16 colors + transparent variants identified; direct static expansion |
| CSS-03 | z-index map extracted and converted to `:root` CSS custom properties | 21-entry z-index list with formula (length - index) × 10 + 100 documented |
| CSS-04 | `global.scss` converted to `global.css` with all partials inlined | All 6 active partials inventoried; _layout.scss and _spacers.scss require analysis |
| CSS-05 | All `desktop-vw()` calls replaced across all modules | Decision: replace with Tailwind classes, not calc(); ~200+ call sites |
| CSS-06 | All `mobile-vw()` calls replaced across all modules | Same as CSS-05 — Tailwind responsive classes |
| CSS-07 | All `@include mobile/desktop/hover` replaced with inline `@media` rules | Where Tailwind can't cover, use `@media (max-width: 800px)` inline |
| CSS-08 | All `@include dims()` calls replaced with expanded `width`/`height` properties | Mechanical 1:1 expansion |
| CSS-09 | All `@include position()` calls replaced with expanded position properties | Mechanical 1:1 expansion |
| CSS-10 | All `z-index()` calls replaced with `var(--z-*)` references | z-index function used in footer.module.scss, header.module.scss, global.scss |
| CSS-11 | All SCSS nesting converted to valid native CSS nesting (& prefix for descendants) | Native nesting has 95%+ browser coverage; SCSS nesting pattern differences documented below |
| CSS-12 | `@extend` in global.scss replaced with inlined properties | Two `@extend` uses in global.scss: `.remove-autofill-styles` and `.noSelect`; `_layout.scss` uses @extend too |
| CSS-13 | All 31 `.module.scss` files renamed to `.module.css` with updated imports | All 31 import locations identified |
| CSS-14 | `sassOptions` removed from `next.config.mjs` | Confirmed present at line 24-27 of next.config.mjs |
| CSS-15 | `sass` package removed from `package.json` | Confirmed: `"sass": "^1.80.3"` |
| CSS-16 | `styles/buttons.module.scss` converted with all button variants verified | 7 variants inventoried; uses hover mixin, desktop-vw/mobile-vw for font sizes |
</phase_requirements>

---

## Summary

This phase converts 31 `.module.scss` files plus the global SCSS partials to plain CSS modules. The project uses SASS heavily for three things: (1) `desktop-vw(N)` / `mobile-vw(N)` fluid sizing functions that compute `calc(N * 100vw / 1440)` and `calc(N * 100vw / 375)`, (2) structural mixins (`@include dims`, `@include position`, `@include mobile`, `@include hover`), and (3) a z-index function mapping named layers to computed values.

The user's decision to replace vw() calls with Tailwind responsive classes rather than native `calc()` is the most consequential choice. It means every converted SCSS module file becomes simpler (fewer lines), but the JSX files gain Tailwind classes alongside the existing CSS module class references. This is the right call for long-term maintenance, but requires careful per-property mapping to ensure Tailwind's scale (fixed rem steps) visually matches the fluid vw() output at 1440px/375px.

A critical finding on mixin timing: **Tailwind v4 changed responsive prefix syntax from `md:` to `@md:`**. Using `md:` classes now means Phase 3 must rename every prefix when migrating to v4. The recommendation (documented in Architecture Patterns) is to use **inline `@media` rules in CSS modules** for the responsive behavior that currently comes from `@include mobile` / `@include desktop`, rather than converting to Tailwind responsive prefixes at this stage. Tailwind classes are safe to use for non-responsive utilities (colors, typography scale, spacing) since those names are stable across v3→v4.

The migration is mechanical and low-risk once the pattern dictionary is established with `global.css` as the first commit. No SASS color functions (`darken()`, `lighten()`) are used in the module files — only `color.change()` in `_colors.scss` for transparent variants, which converts directly to `color-mix(in srgb, COLOR 0%, transparent)`.

**Primary recommendation:** Convert `global.scss` first to establish the :root variable dictionary and pattern examples. Then process waves of component modules in complexity order, keeping calc() for the handful of absolute pixel values (e.g. `80px`, `8px` fixed sizes in utility components) and using Tailwind classes for everything fluid.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Plain CSS (CSS Modules) | CSS3 | Component-scoped styles | Zero deps; Next.js supports natively |
| Native CSS nesting | CSS Level 5 | Nested selectors with `&` | 95%+ browser support; no PostCSS plugin needed |
| CSS custom properties | CSS3 | Variables replacing `$var` | Browser-native; can be overridden per-theme |
| Tailwind CSS v3 | 3.4.1 (current) | Utility classes replacing vw() responsive sizing | Already installed; v4 migration is Phase 3 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `color-mix()` | CSS Color L5 | Replace SASS `color.change()` transparent variants | Only in global.css for `--color-transparent` vars |
| `@media` inline rules | CSS3 | Replace `@include mobile` / `@include desktop` | Any responsive breakpoint not covered by stable Tailwind utilities |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind responsive classes (md:) | Inline @media in CSS module | Tailwind v4 renames `md:` → `@md:` — safer to use @media now, let Phase 3 decide |
| CSS calc() for vw() | Tailwind classes | User locked decision: use Tailwind utilities |
| Separate tokens.css file | All vars in global.css :root | User locked decision: single file |

**Installation:** No new packages needed. The phase ends by removing `sass`.

---

## Architecture Patterns

### File Inventory

**Global SCSS partials to inline into `global.css`:**

| File | Status | Notes |
|------|--------|-------|
| `styles/_reset.scss` | Direct copy — no SCSS syntax | Pure CSS; paste verbatim |
| `styles/_fonts.scss` | Direct copy — no SCSS syntax | Pure `@font-face` blocks |
| `styles/_easings.scss` | Direct copy — already `:root` block | Pure CSS custom properties |
| `styles/_colors.scss` | Expand @each loop manually | 16 colors + 16 transparent variants = 32 static vars |
| `styles/_functions.scss` | DO NOT copy — extract only z-index values | Functions become :root vars; mixins are inlined at call sites |
| `styles/_variables.scss` | Extract values only | `$mobile-breakpoint: 800px`, `$desktop-width: 1440px`, `$mobile-width: 375px` → become :root docs |
| `styles/_utils.scss` | Convert to global CSS classes | Replace `@include` usages with inline media/property |
| `styles/_layout.scss` | Decide: inline or delete | Layout vars used? Audit first. `@extend` pattern inside |
| `styles/_spacers.scss` | Convert @each to static :root vars | 5 spacers × 2 breakpoints = 10 static var declarations |
| `styles/_themes.scss` | Currently commented out in global.scss | Skip (commented import) |
| `styles/_scroll.scss` | Currently commented out in global.scss | Skip (commented import) |
| `styles/okendo-widget.scss` | Convert — uses `@include hover` | Move to global.css or standalone okendo-widget.css |

**Component module files — sorted by complexity:**

Wave B — Minimal/zero SCSS constructs (mechanical rename + @include expand):
```
faq.module.scss                        — empty file (1 line)
privacy-policy.module.scss             — empty file (1 line)
auto-scroll-carousel/embla.module.scss — pure CSS, no mixins, no vw()
horizontal-scroll/horizontal-scroll.module.scss — 3 SCSS vars ($code-color etc), no vw() or mixins
price/price.module.scss                — 6 lines, no mixins, no vw()
utility/img/img.module.scss            — @include dims(100%) only
utility/loading-spinner/loading-spinner.module.scss — @keyframes, no vw()
utility/scrollable-box/scrollable-box.module.scss — no mixins, no vw()
utility/video/video.module.scss        — @include dims(100%) only
```

Wave C — Moderate SCSS: vw() calls + @include mobile/desktop (main conversion work):
```
marquee/marquee.module.scss            — @include mobile, @include reduced-motion; no vw()
noticebar/noticebar.module.scss        — 6 vw(), 2 @include mobile
quantity/quantity.module.scss          — 6 vw(), 2 @include mobile
product-card/product-card.module.scss  — 7 vw(), 3 @include mobile/desktop
customer-reviews/customer-reviews.module.scss — 10 vw(), 5 @include mobile
animated-card/animated-card.module.scss       — 10 vw(), 7 @include mobile
follow-us/follow-us.module.scss        — 12 vw(), 4 @include mobile
product-highlight-carousel/embla.module.scss  — 4 vw(), 4 @include mobile
fade-in-out-carousel/embla.module.scss        — 4 vw(), 4 @include mobile
product-highlight-carousel/product-highlight-carousel.module.scss — 5 vw(), 3 @include mobile
utility/scrollbar/scrollbar.module.scss — 3 vw(), @media (--mobile) BUG (see pitfalls)
shop/shop.module.scss                  — 15 vw(), 4 @include mobile/desktop
cart/edit-quantity-button/edit-quantity-button.module.scss — 3 vw(), no @include mobile
cart/edit-selling-plan-button/edit-selling-plan-button.module.scss — 24 vw(), 4 @include mobile/hover
out-of-stock/out-of-stock.module.scss  — 17 vw(), no @include mobile
```

Wave D — Heavy: many vw() calls + deeply nested @include:
```
package-animation/package-animation.module.scss — 20 vw(), 8 @include mobile
header/header.module.scss              — 14 vw(), 6 @include mobile/hover
our-story/our-story.module.scss        — 80 vw(), 25 @include mobile
feature-highlight/feature-highlight.module.scss — 69 vw(), 15 @include mobile
footer/footer.module.scss              — 66 vw(), 24 @include mobile/hover
home/home.module.scss                  — 101 vw(), 32 @include mobile/tablet/hover
```

Wave E — Shared module last:
```
styles/buttons.module.scss             — 6 vw(), 7 @include mobile/hover; global import via ui/button.tsx
```

---

### Pattern 1: vw() → Tailwind class mapping

**What:** The decision is to replace fluid `desktop-vw(N)` / `mobile-vw(N)` values with Tailwind responsive utilities in JSX.

**When to use:** Every CSS property that has a Tailwind equivalent utility.

**How the math maps to Tailwind:**

`desktop-vw(N)` = `calc(N * 100vw / 1440)`. At 1440px viewport this equals `N px`. So the conversion is: find the closest Tailwind step to `N px`.

Tailwind v3 spacing scale (1 unit = 4px):
- `desktop-vw(8px)` → `w-2` / `h-2` (8px)
- `desktop-vw(16px)` → `p-4` or `text-base` (16px)
- `desktop-vw(24px)` → `text-2xl` for font, `p-6` for spacing
- `desktop-vw(30px)` → `text-3xl` approx
- `desktop-vw(60px)` → no direct Tailwind step for font — use `text-[60px]` arbitrary
- `desktop-vw(80px)` → `p-20` for spacing (80px)

**Key limitation:** Tailwind's fixed scale matches pixel-perfect at 1440px desktop but does not scale fluidly. This is intentional (user decision) — treat it as responsive steps (desktop fixed, mobile fixed) rather than fluid.

**When Tailwind has no equivalent:** Write `@media (min-width: 800px) { property: calc(N / 1440 * 100vw); }` inline in the CSS module as a fallback. This is "temporary inline CSS" for Phase 3 to clean up.

---

### Pattern 2: @include mobile / @include desktop → inline @media

**What:** SCSS mixins for breakpoints expand to standard `@media` rules.

**Why NOT Tailwind `md:` prefix:** Tailwind v4 renames responsive modifiers from `md:` to `@md:`. Converting to `md:` now creates a Phase 3 find-and-replace burden. Inline `@media` in CSS modules is stable across Tailwind versions.

```css
/* SCSS source */
.element {
  font-size: desktop-vw(20px);

  @include mobile {
    font-size: mobile-vw(16px);
  }
}

/* CSS module output */
.element {
  font-size: 1.25rem; /* Tailwind text-xl or closest step */

  @media (max-width: 800px) {
    font-size: 1rem; /* Tailwind text-base or closest step */
  }
}
```

Breakpoint values (from `_variables.scss`):
- `$mobile-breakpoint: 800px` → `@media (max-width: 800px)` (= `@include mobile`)
- `$tablet-breakpoint: 1024px` → `@media (max-width: 1024px)` (= `@include tablet`)
- `@include desktop` = `@media (min-width: 800px)` (min-width, not max)
- `@include hover` = `@media (hover: hover)`
- `@include reduced-motion` = `@media (prefers-reduced-motion: reduce)`

---

### Pattern 3: @include dims() → explicit width/height

**What:** Mechanical expansion.

```css
/* SCSS: @include dims(desktop-vw(230px), auto) */
/* CSS: */
width: calc(230 / 1440 * 100vw); /* or Tailwind class on element */
height: auto;

/* SCSS: @include dims(100%) */
/* CSS: */
width: 100%;
height: 100%;

/* SCSS: @include dims(desktop-vw(22px)) — single arg = square */
/* CSS: */
width: calc(22 / 1440 * 100vw); /* or Tailwind w-[22px] */
height: calc(22 / 1440 * 100vw);
```

---

### Pattern 4: @include position() → explicit position properties

```css
/* SCSS: @include position(fixed, 0, 0, auto, 0) */
/* CSS: */
position: fixed;
top: 0;
right: 0;
bottom: auto;
left: 0;

/* SCSS: @include position(absolute, 50%, auto, auto, 50%) */
/* CSS: */
position: absolute;
top: 50%;
right: auto;
bottom: auto;
left: 50%;
```

---

### Pattern 5: z-index() function → CSS custom properties

The `z-index()` SCSS function computes: `((length($z-indexes) - index($z-indexes, $name)) * 10) + 100`

There are 21 entries. Computed values (highest = first in list):

| Name | Index | Value |
|------|-------|-------|
| preloader | 1 | (21-1)×10+100 = 300 |
| gsap-markers | 2 | 290 |
| modal-content | 3 | 280 |
| modal | 4 | 270 |
| cursor | 5 | 260 |
| privacy-popup | 6 | 250 |
| sticky | 7 | 240 |
| error | 8 | 230 |
| navigation | 9 | 220 |
| hamburger | 10 | 210 |
| menu | 11 | 200 |
| menu-bg | 12 | 190 |
| navigation-mobile | 13 | 180 |
| header | 14 | 170 |
| loading-screen | 15 | 160 |
| logo | 16 | 150 |
| img | 17 | 140 |
| main | 18 | 130 |
| language-select | 19 | 120 |
| footer-overlay | 20 | 110 |
| footer | 21 | 100 |
| bg | 21 (length) | 100 |

These become `:root` vars:
```css
:root {
  --z-preloader: 300;
  --z-gsap-markers: 290;
  --z-header: 170;
  --z-footer: 100;
  /* ... all 21 */
}
```

Used in: `footer.module.scss` (`z-index('footer')`), `header.module.scss` (`z-index('header')`), `global.scss` (`z-index('gsap-markers')`, `z-index('modal')`, `z-index('preloader')`).

---

### Pattern 6: @extend → composes: (CSS Modules)

CSS Modules supports `composes:` to reuse class definitions. However, the two `@extend` usages in `global.scss` are for global utility classes:
- `@extend .remove-autofill-styles` — inline the 4 webkit-autofill properties directly
- `@extend .noSelect` — inline the 7 user-select properties directly

`_layout.scss` uses `@extend .layout-block` inside `.layout-grid` — inline those two properties directly.

**Do not use `composes:` for global class extends.** `composes:` only works within CSS Modules scope. For global classes, inline the extended properties.

---

### Pattern 7: CSS native nesting

SCSS nesting and CSS native nesting differ in one key way: **type selectors in descendant position require `&`** in native CSS.

```css
/* SCSS — works */
.parent {
  p { color: red; }
  > h1 { color: blue; }
}

/* Native CSS — requires & for element selectors */
.parent {
  & p { color: red; }     /* descendant element */
  & > h1 { color: blue; } /* direct child element */

  /* Class/ID selectors work without & */
  .child { color: green; } /* OK */

  /* Pseudo-classes work */
  &:hover { opacity: 0.8; } /* OK */
  &:first-child { } /* OK */
  &::before { } /* OK */

  /* & appended pattern */
  &.active { } /* OK */
}
```

**Rule:** When the nested selector starts with a tag name (div, p, h1, span, etc.), prefix with `& `. When it starts with `.`, `#`, `&`, `:`, or `::`, no change needed.

---

### Pattern 8: _colors.scss → static :root expansion

The `@each` loop with `color.change()` for transparent variants expands to:

```css
:root {
  --white: rgb(255, 255, 255);
  --white-transparent: rgb(255 255 255 / 0);
  --black: rgb(21, 24, 25);
  --black-transparent: rgb(21 24 25 / 0);
  --error: rgb(229, 72, 77);
  --error-transparent: rgb(229 72 77 / 0);
  /* ... all 16 colors with -transparent variants */

  /* Special: nova-pink-light and highlighter-lilac-light already have alpha */
  --nova-pink-light: rgb(220, 79, 149, 0.15);  /* already in source */
  --highlighter-lilac-light: rgb(211, 49, 130, 0.15); /* already in source */
}
```

Note: `color.change($color, $alpha: 0)` = fully transparent version. In CSS: `color-mix(in srgb, var(--colorname) 0%, transparent)` is overly complex — just use `rgb(R G B / 0)` notation directly (modern CSS Level 4 syntax, fully supported).

---

### Pattern 9: _spacers.scss → static :root expansion

The `@each` loop with mobile/desktop variants expands to:
```css
:root {
  /* Mobile defaults */
  --spacer-xs: calc(32 / 375 * 100vw);   /* 4 × 8px mobile multiplier */
  --spacer-sm: calc(32 / 375 * 100vw);   /* 4 × 8px */
  --spacer-md: calc(48 / 375 * 100vw);   /* 6 × 8px */
  --spacer-lg: calc(64 / 375 * 100vw);   /* 8 × 8px */
  --spacer-xl: calc(80 / 375 * 100vw);   /* 10 × 8px */
}

@media (min-width: 800px) {
  :root {
    --spacer-xs: calc(48 / 1440 * 100vw);  /* 6 × 8px desktop multiplier */
    --spacer-sm: calc(64 / 1440 * 100vw);  /* 8 × 8px */
    --spacer-md: calc(80 / 1440 * 100vw);  /* 10 × 8px */
    --spacer-lg: calc(128 / 1440 * 100vw); /* 16 × 8px */
    --spacer-xl: calc(192 / 1440 * 100vw); /* 24 × 8px */
  }
}
```

Note: audit whether `--spacer-*` vars are actually used anywhere in the app before including. They may be legacy unused code.

---

### Pattern 10: _layout.scss analysis

`_layout.scss` is NOT imported in `global.scss`. It defines `.layout-block`, `.layout-grid`, `.layout-block-inner`, `.layout-grid-inner` classes and `--layout-*` CSS variables. Audit the JSX for usage before migrating. If unused, omit from global.css entirely.

---

### Anti-Patterns to Avoid

- **Flattening nested selectors:** Do not flatten — preserve nesting depth with `&` prefix syntax.
- **Using calc(N / 1440 * 100vw) as default:** The decision is Tailwind classes, not calc(). Use calc() only as last resort where no Tailwind equivalent exists.
- **Hardcoding transparent colors:** Do not write `rgba(0,0,0,0)` — use `rgb(R G B / 0)` from the color values.
- **Converting to Tailwind responsive prefixes (md:, lg:):** These break in Tailwind v4. Use inline `@media` in CSS modules instead.
- **Keeping .scss alongside .css:** Delete the SCSS file immediately upon conversion — do not run both in parallel.
- **Using `composes:` for global-scope extends:** `composes:` only works for CSS Modules scoped classes. Inline the properties instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Transparent color variants | Custom SCSS color.change() | `rgb(R G B / 0)` CSS syntax | Native; no preprocessor needed |
| Responsive breakpoints | Custom vw() calc rules | Inline `@media` or Tailwind fixed utilities | Stable; vw() was pre-Next.js CSS variables era |
| z-index management | Re-implementing the z-index() function | Static `--z-*` CSS custom properties | Simpler; readable; no function overhead |

---

## Common Pitfalls

### Pitfall 1: scrollbar.module.scss uses broken `@media (--mobile)` syntax

**What goes wrong:** `scrollbar.module.scss` line 23 uses `@media (--mobile)` — a CSS custom media query (a draft spec never widely implemented). This currently works because SASS passes it through, but it will fail in plain CSS.

**How to avoid:** Replace with `@media (max-width: 800px)` — the standard media query equivalent.

**Warning signs:** If the scrollbar appears on mobile after conversion, this rule isn't working.

---

### Pitfall 2: horizontal-scroll module uses SCSS local variables

**What goes wrong:** `horizontal-scroll/horizontal-scroll.module.scss` uses `$background-color`, `$text-color`, etc. (SCSS variables for debug colors). These are not used for production styles but will fail to parse in plain CSS.

**How to avoid:** Replace with literal hex values inline (these are debug colors, not production custom properties). The component appears to be a development/testing artifact given the `color: $code-color` in `.box`.

---

### Pitfall 3: global.scss uses desktop-vw() in :root block

**What goes wrong:** `global.scss` :root block uses `desktop-vw()` for `--header-height`, `--noticebar-height`, `--page-padding-top`, `--layout-spacing-x`. These are CSS custom properties used globally, not in JSX directly.

**How to handle:** Since these are CSS vars (not Tailwind classes), keep them as `calc()` expressions in the `:root` block. The Tailwind-replacement strategy applies only to component-level styling, not to shared CSS custom property definitions.

Conversion:
```css
:root {
  --header-height: calc(80 / 1440 * 100vw);
  --noticebar-height: calc(30 / 1440 * 100vw);
  --page-padding-top: calc(50 / 1440 * 100vw);
  --layout-spacing-x: calc(160 / 1440 * 100vw);

  @media (max-width: 800px) {
    --header-height: calc(60 / 375 * 100vw);
    --noticebar-height: calc(22 / 375 * 100vw);
    --page-padding-top: calc(30 / 375 * 100vw);
  }
}
```

---

### Pitfall 4: sassOptions.prependData causes global mixin injection

**What goes wrong:** `next.config.mjs` has `prependData: "@import 'styles/_functions';"` — this automatically injects all SCSS mixins (`@include mobile`, `@include dims`, etc.) and functions (`desktop-vw()`, `z-index()`) into every `.module.scss` file without an explicit import. Once SASS is removed, this injection disappears. CSS modules have no equivalent mechanism.

**Impact:** Every `.module.scss` file currently has access to mixins/functions "for free." After conversion, there are no functions to call — the conversion must expand all call sites in-place. This is expected and correct.

**Warning signs:** During wave-by-wave conversion, if you convert file A but leave file B as .scss, file B still has mixin access. This means partial conversions work fine in a mixed-format build, but is a good signal to convert related files together.

---

### Pitfall 5: home.module.scss uses tablet-vw() function

**What goes wrong:** `home.module.scss` is the only file using `tablet-vw()`. The `_functions.scss` file does not define `tablet-vw()` — only `desktop-vw()` and `mobile-vw()`. This call will fail if SASS attempted to compile it (it may be passing through somehow).

**Action needed:** Audit the actual tablet-vw calls in home.module.scss and treat them as either desktop-vw() (1440px base) or mobile-vw() (375px base) based on context. Replace with the appropriate calc() or Tailwind class.

---

### Pitfall 6: Tailwind v4 responsive prefix renaming

**What goes wrong:** If `@include mobile` blocks are converted to Tailwind `md:` responsive prefixes in JSX, Phase 3 must rename all of them from `md:` to `@md:` (Tailwind v4 syntax change).

**How to avoid:** Use inline `@media (max-width: 800px)` in CSS modules for all responsive breakpoint conversions. Only use Tailwind utilities for non-responsive properties (colors, fixed spacing, typography) where the class names are stable across v3→v4.

**Warning signs:** Any JSX file that gains `md:` or `lg:` classes in this phase will need Phase 3 migration.

---

### Pitfall 7: CSS Modules import path must change from .scss to .css

**What goes wrong:** Every importing file has `import s from './component.module.scss'` — all 28 import statements across JSX files must be updated to `.module.css`. Missing even one causes a Next.js build error.

**Complete import file list:**
- `app/(main)/home/page.tsx`
- `app/(main)/our-story/page.tsx`
- `app/(main)/shop/page.tsx`
- `components/ui/button.tsx` (imports `@/styles/buttons.module.scss`)
- `components/footer/index.tsx`
- `components/product-highlight-carousel/index.tsx`
- `components/product-highlight-carousel/EmblaCarouselButtons.tsx`
- `components/fade-in-out-carousel/EmblaCarouselButtons.tsx`
- `components/fade-in-out-carousel/FadeInOutCarousel.tsx`
- `components/product-card/index.tsx`
- `components/marquee/Marquee.tsx`
- `components/follow-us/index.tsx`
- `components/quantity/index.tsx`
- Plus all remaining components that import their module (animated-card, customer-reviews, etc.)

---

## Code Examples

### global.css :root structure

```css
/* styles/global.css — top-level structure */

/* 1. Fonts */
@font-face { ... }

/* 2. Reset (verbatim from _reset.scss) */
*:where(...) { all: unset; display: revert; }

/* 3. Color custom properties (expanded from _colors.scss @each) */
:root {
  --white: rgb(255, 255, 255);
  --white-transparent: rgb(255 255 255 / 0);
  /* ... 16 pairs */
}

/* 4. Easing custom properties (verbatim from _easings.scss) */
:root {
  --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  /* ... */
}

/* 5. z-index custom properties (expanded from _functions.scss z-index map) */
:root {
  --z-preloader: 300;
  --z-header: 170;
  /* ... 21 entries */
}

/* 6. Layout / spacing custom properties (from global.scss :root + spacers) */
:root {
  --header-height: calc(80 / 1440 * 100vw);
  --noticebar-height: calc(30 / 1440 * 100vw);
  --page-padding-top: calc(50 / 1440 * 100vw);
  --layout-spacing-x: calc(160 / 1440 * 100vw);
  --font-bomstad-display: BomstadDisplay;

  @media (max-width: 800px) {
    --header-height: calc(60 / 375 * 100vw);
    --noticebar-height: calc(22 / 375 * 100vw);
    --page-padding-top: calc(30 / 375 * 100vw);
  }
}

/* 7. Global utility classes (from _utils.scss — with inline replacements) */
.aspect-ratio { ... }
.full-width { ... }
.hide-on-desktop {
  @media (min-width: 800px) { display: none; }  /* was @include desktop */
}
.hide-on-mobile {
  @media (max-width: 800px) { display: none; }  /* was @include mobile */
}
/* ... */

/* 8. Global base styles (from current global.scss body section) */
html { font-family: Arial, Helvetica, sans-serif; ... }
html, body { overscroll-behavior: none; }
/* ... */

/* 9. Okendo widget overrides */
.okendo-widget-container { ... }
.oke-w-writeReview {
  @media (hover: hover) {  /* was @include hover */
    &:hover { ... }
  }
}
```

### Module file rename pattern

```tsx
// Before: any component file
import s from './component.module.scss';

// After: same file, extension change only
import s from './component.module.css';
```

### next.config.mjs cleanup

```js
// Remove the entire sassOptions block:
// sassOptions: {
//   includePaths: [path.join(__dirname, 'styles')],
//   prependData: `@import 'styles/_functions';`
// },

// Remove the path/fileURLToPath imports if sassOptions was their only use
// (check whether they're still needed for other config)
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| SCSS `@include mobile` | Inline `@media (max-width: 800px)` | Verbatim CSS; no build step |
| `desktop-vw(N)` fluid functions | Tailwind classes OR `calc(N / 1440 * 100vw)` for CSS vars | Decision: Tailwind classes in JSX |
| SCSS `@extend` | CSS Modules `composes:` or inline expansion | `composes:` for module-scoped; inline for global |
| SASS `color.change($c, $alpha: 0)` | `rgb(R G B / 0)` | Native CSS Color Level 4 |
| SCSS z-index() function | `var(--z-name)` CSS custom properties | Readable; no function call overhead |
| Tailwind `md:` prefixes | `@media (max-width: 800px)` in CSS modules | Avoid v4 prefix rename; stable approach |

---

## Open Questions

1. **Is `_layout.scss` actively used?**
   - What we know: It is not imported in `global.scss` (the global entry). It defines `.layout-block`, `.layout-grid`, etc.
   - What's unclear: Are these classes applied in any JSX file? The grep for "layout-block" only found node_modules references.
   - Recommendation: Skip converting _layout.scss unless audit finds active usage. It appears to be an unused utility.

2. **Are `--spacer-*` variables used anywhere?**
   - What we know: `_spacers.scss` is not imported in `global.scss`. No grep matches for `var(--spacer-` in JSX/CSS.
   - Recommendation: Skip converting _spacers.scss. It is legacy unused code.

3. **Exact Tailwind class mapping for specific vw() sizes**
   - What we know: Tailwind's scale is fixed rem steps, not fluid vw. At 1440px, `desktop-vw(20px)` = 20px = `text-base`+4px between steps.
   - What's unclear: Some values (e.g. `desktop-vw(22px)`, `desktop-vw(45px)`) don't map cleanly to Tailwind steps.
   - Recommendation: For values between Tailwind steps, use arbitrary values `text-[22px]` or accept nearest step. For sizes used in complex layout (not typography), keep `calc()`. Planner should specify a decision: "arbitrary Tailwind OR calc" per wave.

4. **home.module.scss `tablet-vw()` calls**
   - What we know: `tablet-vw()` is not defined in `_functions.scss`. The file uses it in the `.intro` section's `@include tablet` block.
   - Recommendation: Treat as `calc(N / 1024 * 100vw)` (since tablet width is 1024px per `$tablet-breakpoint`). Replace with nearest Tailwind class or calc() inside the tablet media query.

---

## Validation Architecture

`workflow.nyquist_validation` is not in `.planning/config.json` — this section is skipped.

Visual verification is the validation mechanism per locked decisions: dev server + Chrome devtools at 1440px and 375px after each commit group.

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection — all 31 .module.scss files read directly
- `styles/_functions.scss` — mixin/function definitions confirmed
- `styles/_variables.scss` — breakpoint and viewport values confirmed
- `styles/_colors.scss` — color map confirmed (16 colors)
- `next.config.mjs` — sassOptions confirmed present
- `package.json` — `sass: ^1.80.3` confirmed; `tailwindcss: ^3.4.1` confirmed

### Secondary (MEDIUM confidence)
- [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — confirms `md:` → `@md:` prefix change in v4
- [CSS nesting MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting) — confirms native nesting syntax with `&` requirement for element selectors
- [Can I Use — CSS Nesting](https://caniuse.com/css-nesting) — 95%+ global coverage confirmed

### Tertiary (LOW confidence)
- GitHub discussions on Tailwind v3→v4 breaking changes — community reports confirm prefix change but official docs are authoritative source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed from package.json and codebase
- Architecture: HIGH — all 31 files read and inventoried; patterns extracted from actual source
- Pitfalls: HIGH — identified from direct codebase inspection (scrollbar bug, tablet-vw, sassOptions injection pattern)
- Tailwind v3→v4 prefix change: HIGH — confirmed in official upgrade guide

**Research date:** 2026-02-27
**Valid until:** 2026-03-30 (stable domain — CSS spec, Tailwind v4 already released)
