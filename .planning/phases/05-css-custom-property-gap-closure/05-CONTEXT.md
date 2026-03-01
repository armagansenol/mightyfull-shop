# Phase 5: CSS Custom Property Gap Closure - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove 4 stale CSS custom property references from component modules. These were flagged by the milestone audit as "undefined", but git history reveals they were intentionally removed or never existed in the original SCSS.

</domain>

<decisions>
## Implementation Decisions

### Fix approach
- REMOVE the stale var() references from the CSS modules — do NOT add new definitions
- Git history confirms:
  - `var(--laurens-lace)` in header.module.css:107 — was intentionally removed by user in commit 570cecb (Jan 2025)
  - `var(--padding-x)` in header.module.css:165 — was intentionally removed by user in commit 2fe2a06 (Apr 2025)
  - `var(--purple-cactus-flower)` in footer.module.css:204 — was never defined in _colors.scss
  - `var(--z-content)` in wrapper.module.css:14 — no definition found in git history

### Removal strategy
- Delete the CSS rules that use these undefined vars (not just the var() call — the whole rule if it becomes meaningless)
- Verify `pnpm build` passes after removal

### Claude's Discretion
- Whether to remove entire rule blocks or just the property lines
- Any fallback values if removing a rule would break layout

</decisions>

<specifics>
## Specific Ideas

No specific requirements — straightforward removal of dead CSS references.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-css-custom-property-gap-closure*
*Context gathered: 2026-03-01*
