# Phase 2: SCSS to CSS Modules - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert all 31 `.module.scss` files to `.module.css`, remove SASS dependency. Use native CSS nesting, CSS custom properties for variables, and Tailwind responsive classes to replace vw/calc patterns. Visual parity must be maintained at desktop (1440px) and mobile (375px).

</domain>

<decisions>
## Implementation Decisions

### Variable strategy
- Convert all SCSS variables ($var) to CSS custom properties (--var) defined in a :root block in global.css
- global.scss becomes global.css with :root at the top containing all shared variables
- No separate tokens file — everything in global.css :root

### vw/calc replacement
- Do NOT convert SCSS vw() functions to CSS calc() — replace them with Tailwind responsive classes instead
- Apply this to everything possible: font sizes, padding, margins, widths, heights, gaps
- Wherever Tailwind has the utility, use it instead of calc-based responsive sizing
- This means component JSX will gain Tailwind classes and CSS modules will lose responsive calc rules

### Mixin replacement
- Replace SCSS mixins with Tailwind utility classes in JSX (responsive breakpoints become md:, lg:, etc.; typography mixins become text-* classes)
- Use CSS native nesting syntax (& selector) to preserve nested structures — do not flatten
- Replace @extend with CSS Modules composes: keyword

### Mixin timing (Claude's discretion)
- Claude evaluates whether converting responsive mixins to Tailwind v3 classes now is safe given Phase 3 upgrades to v4
- If Tailwind v3→v4 would break the classes, use temporary inline CSS that Phase 3 converts properly
- If the classes are stable across v3→v4, convert to Tailwind now

### SASS color functions
- Replace darken(), lighten(), and other SASS color functions with CSS color-mix() or oklch()
- Do NOT hardcode computed color values — use modern CSS color functions

### Conversion order
- Follow roadmap wave structure: global.css first (standalone) → simple modules → complex modules → shared buttons + cleanup
- global.scss converted first as its own commit to establish :root variables and patterns
- Delete SCSS files immediately after conversion (rename in-place), do not keep alongside

### Commit granularity
- Logical groups of 3-5 related files per commit
- Each commit must be a working build state

### Visual verification
- After each conversion group: start dev server and check affected pages
- Check both viewports: desktop (1440px) AND mobile (375px)
- If visual difference is spotted, fix immediately before moving to next group — every commit maintains visual parity
- Build must pass before committing (same as Phase 1 convention)

### Claude's Discretion
- Exact grouping of files within each wave
- Whether specific mixin conversions go to Tailwind now or get temporary inline CSS
- How to handle edge cases where Tailwind doesn't have an equivalent utility
- Exact CSS native nesting patterns to use

</decisions>

<specifics>
## Specific Ideas

- User explicitly wants vw/calc patterns replaced with Tailwind responsive classes — not converted to CSS calc()
- User wants modern CSS color functions (color-mix, oklch) — not hardcoded color values
- CSS native nesting is preferred — do not flatten selectors

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-scss-to-css-modules*
*Context gathered: 2026-02-27*
