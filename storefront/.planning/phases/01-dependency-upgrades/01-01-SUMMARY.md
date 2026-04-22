---
phase: 01-dependency-upgrades
plan: 01
subsystem: package-manager
tags: [pnpm, migration, package-manager, next.js, react, async-api]
dependency_graph:
  requires: []
  provides: [pnpm-foundation, verified-async-api-compliance]
  affects: [all-subsequent-plans-in-phase]
tech_stack:
  added: [pnpm@10.24.0]
  patterns: [pnpm-content-addressable-store, peer-dependency-rules]
key_files:
  created: [pnpm-lock.yaml]
  modified: [package.json]
  deleted: [package-lock.json]
decisions:
  - "pnpm already installed at v10.24.0 via homebrew/standalone, so corepack enable was skipped (permission error) — pnpm works without it"
  - "onlyBuiltDependencies added to package.json pnpm config for sharp, esbuild, @parcel/watcher to handle pnpm v10 build script security model"
  - "No codemod changes: Next.js codemod confirmed project already at target v16.1.6 — nothing to transform"
  - "No async API fixes needed: all params and cookies() already properly awaited throughout codebase"
metrics:
  duration: "~3 minutes"
  completed: 2026-02-27
  tasks_completed: 2
  files_modified: 2
  files_created: 1
  files_deleted: 1
---

# Phase 01 Plan 01: Migrate from npm to pnpm — Summary

**One-liner:** pnpm migration replacing package-lock.json with pnpm-lock.yaml using pnpm v10.24.0 content-addressable store, with verified Next.js 16.1.6 and React 19.2.4 at latest stable and all async APIs confirmed correct.

## What Was Built

1. **pnpm migration** — Project now uses pnpm as the package manager. package-lock.json removed, pnpm-lock.yaml generated with 1260 packages resolved. Build continues to succeed cleanly.

2. **Next.js/React verification** — Confirmed Next.js 16.1.6 and React 19.2.4 are already at latest stable. The `@next/codemod` tool confirmed: "Current Next.js version is already on the target version v16.1.6." No transformations applied.

3. **Async API compliance confirmed** — All `cookies()` calls are `await cookies()` throughout `app/layout.tsx`, `lib/shopify/index.ts`, and `components/cart/actions.ts`. The single dynamic route `app/(main)/shop/[slug]/page.tsx` uses `params: Promise<{slug}>` and `const { slug } = await params`. No middleware.ts exists (no rename needed).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate from npm to pnpm | 1ac013f | package.json, pnpm-lock.yaml (created), package-lock.json (deleted) |
| 2 | Verify Next.js/React, confirm async API compliance | (no changes needed) | — |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Config] Added `onlyBuiltDependencies` to pnpm config**

- **Found during:** Task 1 — pnpm install
- **Issue:** pnpm v10 requires explicit allowlisting of packages that run install scripts (security model change from v8/v9). Without this, `sharp`, `esbuild`, and `@parcel/watcher` were flagged as "Ignored build scripts."
- **Fix:** Added `"onlyBuiltDependencies": ["@parcel/watcher", "esbuild", "sharp"]` to the `pnpm` config block in `package.json`.
- **Files modified:** `package.json`
- **Commit:** 1ac013f (included in same task commit)

### Notes (not deviations, just observations)

- `corepack enable pnpm` failed with a permission error because pnpm was already installed via a standalone method at `/Users/armagansenol/Library/pnpm/pnpm`. The standalone install takes precedence and pnpm works correctly — corepack enable was skipped as it was unnecessary.
- `pnpm dlx @next/codemod@canary upgrade latest --dry` does not support `--dry` flag — ran without it. The codemod exited immediately with "Current Next.js version is already on the target version v16.1.6." confirming a no-op.
- Several pre-existing peer dependency warnings were present from the old npm install (e.g., `@shopify/hydrogen-react` xstate react version mismatch, `use-resize-observer` react version range). These are pre-existing and not introduced by this plan.
- 59 SassWarnings (SCSS deprecation warnings) appear during build — these are pre-existing and acceptable per user constraints ("Deprecation warnings are acceptable temporarily").

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm-lock.yaml` exists | PASS |
| `package-lock.json` does NOT exist | PASS |
| `pnpm build` completes | PASS (59 Sass deprecation warnings only, no errors) |
| Next.js codemod reports no changes | PASS |
| All `cookies()` calls use `await` | PASS |
| All `params` usage uses `await` | PASS |
| No `middleware.ts` needing rename | PASS (no file exists) |

## Self-Check: PASSED

| Item | Status |
|------|--------|
| `pnpm-lock.yaml` exists on disk | PASS |
| `package-lock.json` absent from disk | PASS |
| `package.json` exists on disk | PASS |
| Commit `1ac013f` exists in git history | PASS |
