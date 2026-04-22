# Phase 1: Dependency Upgrades - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade Next.js, React, and all packages to latest stable versions with breaking changes resolved. Migrate from npm to pnpm. Replace ESLint+Prettier with Biome. Build compiles cleanly, dev server runs, async APIs adopted.

</domain>

<decisions>
## Implementation Decisions

### Upgrade strategy
- Upgrade packages in logical groups (e.g., all Radix together, all Sanity together), not one-by-one or all-at-once
- Fix breakage immediately after each group — every commit is a working state
- Run Next.js codemod first for automated async API migration, then review and fix edge cases
- One git commit per logical group for easy bisection and revert

### Package manager migration (pnpm)
- Switch to pnpm FIRST, before any package upgrades — clean foundation
- Delete package-lock.json, create pnpm-lock.yaml
- Use pnpm's default content-addressable node_modules structure (not shamefully-hoist)
- Only add shamefully-hoist if specific compatibility issues arise

### Risk tolerance
- Always upgrade to latest stable, even if it means more breaking changes to fix
- Use caret ranges (^) in package.json — lock file pins exact versions
- If a package's latest stable has a known bug affecting this project, pin to last good version
- If a package is deprecated and the replacement is a straightforward swap, migrate now; defer complex replacements

### Verification between steps
- After each logical group: `pnpm build` must succeed AND dev server must start without console errors
- TypeScript must be error-free before committing — type safety is part of "working state"
- Deprecation warnings are acceptable temporarily (note them, fix if easy)
- Lock file (pnpm-lock.yaml) committed with each group upgrade
- At the END of the full phase: comprehensive verification — build, dev server, load every page, check console

### Breaking change handling
- Proper API migration always — no compatibility shims, no deprecated usage, no workarounds
- Fix everything in this phase — all breaking change fixes happen now, not deferred
- Phase 1 delivers a fully working, warning-free codebase (deprecation warnings excluded)

### Biome migration (replaces ESLint + Prettier)
- Replace both ESLint AND Prettier with Biome — single tool for linting and formatting
- Use Biome's recommended default rules — fresh start, not replicating old ESLint config
- Remove ESLint config, ESLint packages, and Prettier config/packages from the project

### Claude's Discretion
- Exact logical groupings of packages (how to cluster related packages)
- Order of groups within each plan
- Whether to use Biome's `migrate` command or configure from scratch
- How to handle edge cases the Next.js codemod misses

</decisions>

<specifics>
## Specific Ideas

- User explicitly wants pnpm — not npm, not yarn
- User explicitly wants Biome — not ESLint 9 flat config
- Clean slate approach: Biome defaults, not legacy rule replication

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-dependency-upgrades*
*Context gathered: 2026-02-27*
