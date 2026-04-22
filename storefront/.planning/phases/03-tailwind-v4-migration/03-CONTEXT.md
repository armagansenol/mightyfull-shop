# Phase 3: Tailwind v4 Migration - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade Tailwind CSS from v3 to v4 with CSS-first configuration. Migrate theme config from `tailwind.config.ts` to `@theme` blocks in CSS, update the PostCSS pipeline, and ensure all utility classes work correctly. No new features — pure infrastructure migration.

</domain>

<decisions>
## Implementation Decisions

### Theme token strategy
- @theme block lives in global.css alongside existing :root custom properties
- Register ALL existing CSS custom properties (colors, z-index, easings, fonts) as Tailwind theme tokens so TW generates utility classes for them (e.g. `bg-brand-blue`, `z-header`)
- Consolidate into @theme — move all design tokens from :root into @theme, remove duplicate :root vars. Single source of truth.
- Adopt Tailwind v4 default breakpoints (640, 768, 1024, 1280, 1536) instead of preserving custom 800px
- Sync CSS module media queries to match TW v4 breakpoints — update all `@media (max-width: 800px)` in .module.css files to 768px for consistency

### Breaking class changes
- Run official codemod (`npx @tailwindcss/upgrade`) first, then manually review and fix anything it missed
- Functional match tolerance — layout, spacing, and colors must match; minor rendering differences in shadows/rings/gradients acceptable if they look good
- Convert any @apply directives to regular CSS (align with v4 best practices)
- Let TW v4 handle CSS layer ordering automatically — trust default layer ordering (theme, base, components, utilities)

### Dark mode / theming
- No dark mode — keep single light theme. Dark mode is a separate feature for a potential future phase
- Focus purely on upgrading TW infrastructure

### Dependency compatibility
- Upgrade tailwind-merge to v3+ for TW v4 compatibility
- Upgrade tailwindcss-animate to v4-compatible version if one exists; otherwise Claude decides the fallback
- No other TW-dependent packages to account for — just tw-merge and tw-animate

### Claude's Discretion
- Exact @theme token naming conventions
- How to handle edge cases the codemod misses
- tailwindcss-animate fallback strategy if no v4-compatible version exists
- CSS layer conflict resolution if any arise

</decisions>

<specifics>
## Specific Ideas

- Use the official TW upgrade tool as the starting point — don't reinvent the migration
- The 800px → 768px breakpoint sync across all CSS modules is a significant touch-all-files change — plan for it explicitly
- All 33 color vars, 22 z-index vars, and 18 easing vars from global.css should become @theme tokens

</specifics>

<deferred>
## Deferred Ideas

- Dark mode support — separate phase if desired later
- Custom breakpoint additions beyond TW v4 defaults — evaluate after migration lands

</deferred>

---

*Phase: 03-tailwind-v4-migration*
*Context gathered: 2026-02-28*
