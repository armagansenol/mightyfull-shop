# Milestones

## v1.0 Stack Upgrade + CSS Migration (Shipped: 2026-03-01)

**Phases completed:** 5 phases, 13 plans
**Timeline:** 2026-02-27 → 2026-03-01 (3 days)
**Requirements:** 41/41 satisfied

**Key accomplishments:**
- Upgraded all dependencies to latest stable (Next.js 16, React 19, Sanity v5, Zod v4, Biome v2)
- Migrated all 31 SCSS modules to plain CSS with native nesting and custom properties
- Removed SASS dependency entirely from the project
- Migrated Tailwind CSS from v3 to v4 with CSS-first @theme configuration
- Verified visual parity across all 8 pages at desktop and mobile viewports
- Fixed CSS cascade layer issue (@layer base) that blocked Tailwind v4 utility classes
- Closed 4 undefined CSS custom property gaps identified by milestone audit

**Tech debt accepted:**
- Embla boilerplate vars (pre-existing, not from migration)
- Duplicate orphaned `breakpoints` export in lib/utils.ts and lib/constants.ts
- Unused @theme --z-index-* tokens (20 entries)
- Dead code: components/horizontal-scroll/ not imported anywhere
- 14 Biome lint rules disabled for codebase patterns

**Archives:** `.planning/milestones/v1.0-ROADMAP.md`, `.planning/milestones/v1.0-REQUIREMENTS.md`, `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

---

