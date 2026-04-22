# Phase 4: Visual Verification - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Confirm the migrated site is visually identical to the pre-migration production baseline across all pages, viewports, and interactive states. Fix issues as they are found. No new features — purely verification and repair.

</domain>

<decisions>
## Implementation Decisions

### Verification approach
- Live browser walkthrough comparing dev build against production baseline
- Baseline: https://mightyfull-shop.vercel.app/ (currently deployed production site)
- Claude performs verification using browser tools, comparing both sites
- Fix issues immediately as they're found (not log-then-fix)
- After each fix, re-verify the entire page to catch regressions

### Page priority & coverage
- Check every page on the site — full coverage
- Viewports: 1440px desktop and 375px mobile (as roadmapped)
- One product page is sufficient (shared template)
- Start with homepage first (most complex, highest confidence signal)

### Interaction testing scope
- GSAP animations and Lenis smooth scrolling: visual spot-check (fire, look smooth, no glitches)
- Cart operations: full end-to-end flow (add product, change quantity, remove, cart open/close)
- Contact form: full submission test (fill out, submit, verify success/error states)
- Hover states and transitions: spot-check key elements (buttons, nav links, product cards, CTAs)

### Pass/fail criteria
- Standard: functionally identical — layout, colors, typography, spacing must match
- Minor subpixel rendering differences are acceptable
- Blockers: broken layouts, missing elements, wrong colors, non-working interactions
- Acceptable: minor spacing tweaks (1-2px difference)
- Final gate: clean `pnpm build` must pass after all visual fixes are applied

### Claude's Discretion
- Order of pages after homepage
- How to structure fix commits
- Whether a difference is "minor spacing" vs "broken layout"

</decisions>

<specifics>
## Specific Ideas

- Production baseline is live at https://mightyfull-shop.vercel.app/
- Homepage first because it's most visually complex — if it passes, simpler pages likely pass too
- Fix-as-you-go approach keeps context fresh and avoids accumulating a big fix backlog

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-visual-verification*
*Context gathered: 2026-02-28*
