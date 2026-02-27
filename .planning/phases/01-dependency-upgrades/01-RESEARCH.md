# Phase 1: Dependency Upgrades - Research

**Researched:** 2026-02-27
**Domain:** npm-to-pnpm migration, package upgrades, ESLint-to-Biome migration, Next.js async API compliance
**Confidence:** HIGH (version data from npm registry; breaking change data from official docs and Context7)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Upgrade packages in logical groups (e.g., all Radix together, all Sanity together), not one-by-one or all-at-once
- Fix breakage immediately after each group — every commit is a working state
- Run Next.js codemod first for automated async API migration, then review and fix edge cases
- One git commit per logical group for easy bisection and revert
- Switch to pnpm FIRST, before any package upgrades — clean foundation
- Delete package-lock.json, create pnpm-lock.yaml
- Use pnpm's default content-addressable node_modules structure (not shamefully-hoist)
- Only add shamefully-hoist if specific compatibility issues arise
- Always upgrade to latest stable, even if it means more breaking changes to fix
- Use caret ranges (^) in package.json — lock file pins exact versions
- If a package's latest stable has a known bug affecting this project, pin to last good version
- If a package is deprecated and the replacement is a straightforward swap, migrate now; defer complex replacements
- After each logical group: `pnpm build` must succeed AND dev server must start without console errors
- TypeScript must be error-free before committing — type safety is part of "working state"
- Deprecation warnings are acceptable temporarily (note them, fix if easy)
- Lock file (pnpm-lock.yaml) committed with each group upgrade
- At the END of the full phase: comprehensive verification — build, dev server, load every page, check console
- Proper API migration always — no compatibility shims, no deprecated usage, no workarounds
- Fix everything in this phase — all breaking change fixes happen now, not deferred
- Phase 1 delivers a fully working, warning-free codebase (deprecation warnings excluded)
- Replace both ESLint AND Prettier with Biome — single tool for linting and formatting
- Use Biome's recommended default rules — fresh start, not replicating old ESLint config
- Remove ESLint config, ESLint packages, and Prettier config/packages from the project

### Claude's Discretion

- Exact logical groupings of packages (how to cluster related packages)
- Order of groups within each plan
- Whether to use Biome's `migrate` command or configure from scratch
- How to handle edge cases the Next.js codemod misses

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEP-01 | Next.js upgraded to latest stable version with codemod applied | Already on Next.js 16.1.6 (latest). Codemod is `pnpm dlx @next/codemod@canary upgrade latest`. Key breaking changes in v15 (async APIs) and v16 documented below. |
| DEP-02 | React and React DOM upgraded to latest 19.x stable | Currently react@19.2.4 / react-dom@19.2.4. Latest is 19.2.4 — already current. |
| DEP-03 | All async `params` usage in dynamic routes updated to await pattern | Already done: `app/(main)/shop/[slug]/page.tsx` uses `params: Promise<{slug}>` and `await params`. One dynamic route confirmed correct. |
| DEP-04 | All async `cookies()` usage in cart operations updated to await pattern | Already done: `app/layout.tsx`, `lib/shopify/index.ts`, `components/cart/actions.ts` all use `await cookies()`. |
| DEP-05 | GSAP, @gsap/react, Motion, Lenis, Embla Carousel upgraded to latest stable | gsap: 3.12.5 → 3.14.2; @gsap/react: 2.1.1 → 2.1.2; motion: 12.6.3 → 12.34.3; lenis: 1.2.3 → 1.3.17; embla: 8.3.1 → 8.6.0. No breaking changes found. |
| DEP-06 | Sanity, next-sanity, @portabletext/react upgraded to latest stable | sanity: 3.62.0 → 5.12.0; next-sanity: 9.12.3 → 12.1.0; @portabletext/react: 3.1.0 → 6.0.2. Major versions — see breaking changes below. |
| DEP-07 | Shopify Hydrogen React and Storefront API Client upgraded to latest compatible | @shopify/hydrogen-react: 2025.1.3 → 2026.1.1; @shopify/storefront-api-client: 1.0.4 → 1.0.9 (already at 1.0.9). Hydrogen has a vite peer dep to handle. |
| DEP-08 | Radix UI packages upgraded to latest stable | Multiple packages: dialog 1.1.6 → 1.1.15, select 2.1.2 → 2.2.6, accordion 1.2.1 → 1.2.12, slot 1.1.2 → 1.2.4, tooltip 1.2.0 → 1.2.8, checkbox 1.1.2 → 1.3.3, avatar 1.1.1 → 1.1.11, label 2.1.2 → 2.1.8, radio-group 1.2.1 → 1.3.8, scroll-area 1.2.0 → 1.2.10, icons 1.3.0 → 1.3.2. All minor bumps. |
| DEP-09 | TanStack React Query, Zustand, React Hook Form upgraded to latest stable | @tanstack/react-query: 5.59.20 → 5.90.21; zustand: 5.0.0 → 5.0.11; react-hook-form: 7.54.2 → 7.71.2. Minor bumps, compatible. |
| DEP-10 | Zod, Sonner, Lucide React, and utility packages upgraded to latest stable | zod: 3.24.2 → 4.3.6 (MAJOR — breaking changes); sonner: 1.7.4 → 2.0.7 (major); lucide-react: 0.454.0 → 0.575.0; clsx, cva, next-themes, sharp, @hookform/resolvers — minor bumps. |
| DEP-11 | ESLint, TypeScript, and dev dependencies upgraded to latest stable | Biome replaces ESLint+Prettier. typescript: 5.6.3 → 5.9.3; @types/node: 20.x → 25.3.2; @types/react/react-dom already current (19.2.x). |
| DEP-12 | Site builds successfully and runs without runtime errors after all upgrades | Verification step — `pnpm build` + dev server + all pages load. |

</phase_requirements>

## Summary

The project is already on Next.js 16.1.6 (the current latest stable) and React 19.2.4, meaning the codemod step and async API migration are effectively complete — spot-checking confirms `params` and `cookies()` are already properly awaited throughout the codebase. The "codemod first" step in Plan 01-01 will be a quick verification pass rather than a migration.

The highest-risk upgrades in this phase are: (1) Sanity v3 → v5 and next-sanity v9 → v12 (two major version jumps, though the only breaking change is the React 19.2 requirement which is already met); (2) Zod v3 → v4 (breaking changes to error APIs and string format methods — used in the contact form); (3) Sonner v1 → v2 (major version); and (4) the Biome migration replacing both ESLint and Prettier entirely. All other package upgrades are minor increments with no breaking API changes.

The `tailwind-merge` package deserves special attention: **v3 drops Tailwind CSS v3 support and requires v4**. Since this project upgrades Tailwind in Phase 3, `tailwind-merge` must stay at v2.x (latest is 2.5.4, already installed) for Phase 1. The `@shopify/hydrogen-react` upgrade introduces a `vite` peer dependency warning that should be suppressed with pnpm's `peerDependencies` overrides rather than installing Vite.

**Primary recommendation:** Execute in this order: (1) pnpm migration, (2) Next.js/React verification, (3) animation/carousel group, (4) Sanity/CMS group, (5) Shopify group, (6) Radix UI group, (7) state/form/utility group including Zod v4 migration, (8) Biome migration replacing ESLint+Prettier.

## Standard Stack

### Core (what's being upgraded to)

| Package | Current | Target | Notes |
|---------|---------|--------|-------|
| pnpm | npm (current) | 10.30.3 | Package manager migration |
| next | 16.1.6 | 16.1.6 | Already current |
| react / react-dom | 19.2.4 | 19.2.4 | Already current |
| @biomejs/biome | (not installed) | 2.4.4 | Replaces eslint + prettier |
| gsap | 3.12.5 | 3.14.2 | Minor bump |
| @gsap/react | 2.1.1 | 2.1.2 | Minor bump |
| motion | 12.6.3 | 12.34.3 | Minor bumps, API-compatible |
| lenis | 1.2.3 | 1.3.17 | Minor bumps |
| embla-carousel (all) | 8.3.1 | 8.6.0 | Minor bumps |
| sanity | 3.62.0 | 5.12.0 | Major — see breaking changes |
| next-sanity | 9.12.3 | 12.1.0 | Major — see breaking changes |
| @portabletext/react | 3.1.0 | 6.0.2 | Major — check API |
| @shopify/hydrogen-react | 2025.1.3 | 2026.1.1 | Date-versioned, vite peer dep |
| @shopify/storefront-api-client | 1.0.4 | 1.0.9 | Already at 1.0.9 |
| zod | 3.24.2 | 4.3.6 | Major — breaking changes |
| sonner | 1.7.4 | 2.0.7 | Major — check API |
| @tanstack/react-query | 5.59.20 | 5.90.21 | Minor bumps |
| @tanstack/react-query-devtools | 5.59.20 | 5.90.21 | Minor bumps |
| zustand | 5.0.0 | 5.0.11 | Already major, minor bump |
| react-hook-form | 7.54.2 | 7.71.2 | Minor bumps |
| @hookform/resolvers | 4.1.3 | 5.2.2 | Major version |
| lucide-react | 0.454.0 | 0.575.0 | Minor bumps (0.x) |
| typescript | 5.6.3 | 5.9.3 | Minor bump |
| @types/node | 20.x | 25.3.2 | Major jump |
| tailwind-merge | 2.5.4 | **STAY AT 2.5.4** | v3 requires Tailwind v4 |
| tailwindcss | 3.4.14 | 3.4.x | STAY v3 — Phase 3 upgrades |

### Packages to Remove

| Package | Why |
|---------|-----|
| eslint | Replaced by Biome |
| @next/eslint-plugin-next | Replaced by Biome |
| @typescript-eslint/eslint-plugin | Replaced by Biome |
| @typescript-eslint/parser | Replaced by Biome |
| @trivago/prettier-plugin-sort-imports | Replaced by Biome |
| prettier (if installed) | Replaced by Biome |
| eslint.config.mjs | Config file to delete |
| .prettierrc | Config file to delete |

## Architecture Patterns

### pnpm Migration Pattern

```bash
# Step 1: Install pnpm globally (or use corepack)
corepack enable pnpm
# or
npm install -g pnpm@latest-10

# Step 2: Delete npm artifacts
rm package-lock.json

# Step 3: Install with pnpm (auto-creates pnpm-lock.yaml)
pnpm install

# Step 4: Verify build still works
pnpm build
pnpm dev
```

pnpm uses a content-addressable store and symlinked `node_modules` by default. Most Next.js projects work without any `.npmrc` changes. Only add `.npmrc` with `shamefully-hoist=true` if specific packages fail to resolve.

### Next.js Codemod Pattern (verification only — already migrated)

```bash
# Run in dry mode first to see what it would change
npx @next/codemod@canary upgrade latest --dry

# If changes needed, run for real
pnpm dlx @next/codemod@canary upgrade latest
```

Since the project is already on Next.js 16.1.6, the codemod should find nothing to change. The codemod handles:
- `experimental.turbopack` → top-level `turbopack`
- `middleware` → `proxy` rename
- `unstable_` prefix removal from stabilized APIs
- `next lint` → ESLint CLI migration

### Biome Setup Pattern (fresh start, Biome defaults)

```bash
# Install Biome
pnpm add -D -E @biomejs/biome

# Initialize config (generates biome.json)
pnpm biome init

# Optional: migrate Prettier config to get matching formatting rules
pnpm biome migrate prettier --write

# Apply formatting and linting to whole project
pnpm biome check --write .

# Update package.json scripts
# "lint": "biome check .",
# "format": "biome format --write ."
```

The user wants Biome defaults (clean slate), not ESLint rule replication. However, running `biome migrate prettier --write` is worth doing to preserve formatting preferences (single quotes, 80 char width, trailing commas) from `.prettierrc`. The existing `.prettierrc` has:
- `printWidth: 80`, `tabWidth: 2`, `trailingComma: "none"`, `singleQuote: true`, `semi: true`

Running `biome migrate prettier` converts these into biome.json formatter settings, which respects the decision to not replicate ESLint rules while still preserving code style.

### Zod v4 Migration Pattern

The project uses Zod in exactly two files:
- `components/contact-form/index.tsx` — uses `z.string().email()`, `z.string().min()`, `z.object()`
- `components/out-of-stock/index.tsx` — uses some zod schema

Breaking changes that affect this project:

```typescript
// BEFORE (v3)
z.string().email({ message: 'Invalid email address' })

// AFTER (v4) — .email() is deprecated, use z.email()
// But deprecated methods still work in v4, so this is low-urgency
// For clean migration:
z.email({ message: 'Invalid email address' })
```

```typescript
// BEFORE (v3) - error via message param
z.string().min(1, { message: 'Name is required' })

// AFTER (v4) - message param still works, but error param is preferred
z.string().min(1, { error: 'Name is required' })
// Or keep { message: ... } — still accepted in v4
```

The user decision is "proper API migration — no deprecated usage." So use the new v4 APIs:
- `z.string().email()` → `z.email()`
- `z.string().url()` → `z.url()`
- `z.string().uuid()` → `z.uuid()`

The `z.object()`, `z.string()`, `z.infer<>` patterns are unchanged.

### Sanity v3 → v5 Migration Pattern

The project uses Sanity in a minimal way — it's a content API consumer, not a Studio host:
- `lib/sanity/client.ts` — uses `@sanity/client` (createClient) directly, not `sanity` package
- `app/api/revalidate/route.ts` — uses `next-sanity/webhook` (parseBody)
- `components/product-images/index.tsx` — imports `ImageAsset` type from `sanity`

The Sanity v5 upgrade guide states the **only breaking change is React 19.2 requirement** — already met. Schemas, plugins, and APIs are unchanged. The `next-sanity` v12 upgrade from v9 requires `sanity ^5.8.1`.

Steps:
```bash
pnpm add sanity@latest next-sanity@latest @portabletext/react@latest
```

After upgrade, check:
1. `next-sanity/webhook` (parseBody) — verify API unchanged
2. `ImageAsset` type from `sanity` — verify still exported
3. `@sanity/client` (used directly) — verify unchanged (it's a separate package)

### Hydrogen React Peer Dependency Pattern

`@shopify/hydrogen-react@2026.1.1` lists `vite` as a peer dependency:
```json
{ "vite": "^5.1.0 || ^6.2.1" }
```

This project uses Next.js, not Vite. The `vite` peer dep is optional — it's needed for Vite-based Hydrogen storefronts, not Next.js. Handle with pnpm peer dependency config:

```ini
# .npmrc (create if not exists)
# Tell pnpm to not warn about optional peer deps
auto-install-peers=false
```

Or in `package.json`:
```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["vite"]
    }
  }
}
```

Source: [Shopify Hydrogen issues #3428](https://github.com/Shopify/hydrogen/issues/3428) — confirmed vite is not required for non-Vite consumers (MEDIUM confidence, single source).

### @hookform/resolvers v4 → v5 Pattern

The jump from v4 to v5 may include breaking changes. The contact form uses `zodResolver` from `@hookform/resolvers/zod`. After upgrading, verify the import path `@hookform/resolvers/zod` still works.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Linting + formatting config | Custom eslint + prettier setup | `@biomejs/biome` | Single tool, zero config, fast |
| Package version delta analysis | Manual npm view | `pnpm outdated` after pnpm migration | Shows all outdated at once |
| Async params migration | Manual search-replace | `@next/codemod@canary upgrade latest` | Handles edge cases (opengraph-image, twitter-image, icon, apple-icon) |
| Zod migration | Manual file-by-file edit | Search for deprecated patterns, fix in one pass | Limited scope — only 2 files use zod |

## Common Pitfalls

### Pitfall 1: tailwind-merge v3 Incompatibility with Tailwind v3

**What goes wrong:** Upgrading tailwind-merge to v3+ while still on Tailwind CSS v3 breaks class merging — v3 was rebuilt for Tailwind v4's class name format.

**Why it happens:** The changelog makes this easy to miss; it reads like a patch release.

**How to avoid:** Pin `tailwind-merge` at `^2.5.4` in Phase 1. Upgrade to v3 together with Tailwind v4 in Phase 3.

**Warning signs:** `cn()` (or `twMerge()`) calls stop resolving class conflicts correctly.

### Pitfall 2: pnpm Hoisting Breaks Module Resolution

**What goes wrong:** Some packages that previously relied on npm's flat `node_modules` hoisting may fail to resolve peer dependencies after pnpm migration.

**Why it happens:** pnpm uses a strict, non-flat structure by default. Packages can only access their declared dependencies.

**How to avoid:** Run `pnpm build` immediately after migration before any package upgrades. If errors appear with `MODULE_NOT_FOUND`, try `shamefully-hoist=true` in `.npmrc` (user decision: use as escape hatch only).

**Warning signs:** Errors like `Cannot find module 'X'` during build that didn't exist with npm.

### Pitfall 3: Sanity Package Already Has Peer Dep Conflicts

**What goes wrong:** `sanity@3.62.0` is already mismatched with `next-sanity@9.12.3` (which requires `sanity ^3.99.0`). The build may show existing peer dep warnings.

**Why it happens:** The installed sanity version is behind what next-sanity needs even in the current state.

**How to avoid:** Upgrade both `sanity` and `next-sanity` together in the same group commit.

**Warning signs:** `pnpm install` shows peer dep conflicts for sanity after pnpm migration.

### Pitfall 4: revalidateTag Second Argument in Next.js 16

**What goes wrong:** `revalidateTag(body._type, 'default')` in `app/api/revalidate/route.ts` — in Next.js 16, the second argument is a `cacheLife` profile. This code already uses the new API correctly ('default' is a valid cacheLife profile).

**Why it happens:** Confusion from seeing a 2-argument call — it looks new but is intentional.

**How to avoid:** No action needed. The code is already compatible with Next.js 16.

### Pitfall 5: Biome Formatting Causes Massive Diff

**What goes wrong:** Running `biome check --write .` on the entire codebase in one shot creates an enormous commit that's hard to review or bisect.

**Why it happens:** Biome may use different defaults from Prettier (e.g., tabs vs spaces, trailing comma rules).

**How to avoid:** Run `biome migrate prettier --write` first to import the Prettier settings (preserving existing code style), then run `biome format --write .`. Keep the Biome migration as its own dedicated commit, separate from package removal.

**Warning signs:** Git diff shows thousands of changed lines after `biome format`.

### Pitfall 6: Zod v4 Changes Object Optional Default Behavior

**What goes wrong:** In Zod v4, `z.object({ a: z.string().default("x").optional() }).parse({})` returns `{ a: "x" }` instead of `{}`. If the contact form schema has fields with both `.default()` and `.optional()`, the parsed values change.

**Why it happens:** Intentional behavior change in Zod v4 to make defaults more predictable.

**How to avoid:** Audit the zod schemas in `components/contact-form/index.tsx` and `components/out-of-stock/index.tsx` for any `.default().optional()` chains.

**Warning signs:** Form validation allows unexpected empty submissions, or form data has unexpected default values populated.

### Pitfall 7: @hookform/resolvers Major Version

**What goes wrong:** `@hookform/resolvers` jumped from v4 to v5 — the resolver import may have changed.

**Why it happens:** Major version bumps can rename exports or change resolver function signatures.

**How to avoid:** After upgrade, verify `zodResolver` import from `@hookform/resolvers/zod` still works and the resolver API hasn't changed.

**Warning signs:** TypeScript errors on `zodResolver()` usage after upgrade.

## Code Examples

### pnpm workspace configuration (if needed)

```ini
# .npmrc — only add if module resolution issues arise
shamefully-hoist=true
```

### Biome configuration after init + prettier migrate

```json
// biome.json (generated by biome init + biome migrate prettier)
{
  "$schema": "https://biomejs.dev/schemas/2.4.4/schema.json",
  "formatter": {
    "enabled": true,
    "lineWidth": 80,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "none",
      "semicolons": "always"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignore": [".next", "node_modules"]
  }
}
```

Note: Biome's import organization is simpler than `@trivago/prettier-plugin-sort-imports` (which had `importOrder` regex groups). The clean-slate approach means accepting Biome's alphabetical grouping rather than replicating custom regexes.

### Zod v4 contact form migration

```typescript
// BEFORE (v3) - components/contact-form/index.tsx
const getFormSchema = () =>
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    surname: z.string().min(1, { message: 'Surname is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    message: z.string().min(1, { message: 'Message is required' })
  });

// AFTER (v4) - proper API migration (no deprecated usage)
const getFormSchema = () =>
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    surname: z.string().min(1, { message: 'Surname is required' }),
    email: z.email({ message: 'Invalid email address' }),  // z.email() not z.string().email()
    phone: z.string().min(1, { message: 'Phone number is required' }),
    message: z.string().min(1, { message: 'Message is required' })
  });
```

### Hydrogen React pnpm peer dep override

```json
// package.json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["vite"]
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params.slug` (sync) | `const { slug } = await params` | Next.js 15 (enforced in 16) | Already done in this codebase |
| `cookies()` (sync) | `await cookies()` | Next.js 15 (enforced in 16) | Already done in this codebase |
| `eslint` + `prettier` | `@biomejs/biome` (single tool) | Biome 1.0+ (2023) | Replaces both, faster |
| `middleware.ts` | `proxy.ts` (rename) | Next.js 16 | May need rename if middleware.ts exists |
| `experimental.turbopack` | top-level `turbopack` | Next.js 16 | Config change |
| `z.string().email()` | `z.email()` | Zod v4 (2025) | Breaking — needs migration |
| npm flat node_modules | pnpm content-addressable store | pnpm v10 | Faster installs, stricter resolution |
| `next lint` command | ESLint CLI direct | Next.js 16 | Command removed from Next.js |
| sanity v3 | sanity v5 | 2025 | Only breaking change: requires React 19.2 |

**Deprecated/outdated in this project:**

- `eslint.config.mjs` + ESLint packages: delete entirely, replaced by Biome
- `.prettierrc`: delete after running `biome migrate prettier`
- `@trivago/prettier-plugin-sort-imports`: remove, Biome handles import organization
- `tailwindcss` v3: stays for Phase 1, Phase 3 upgrades to v4
- `tailwind-merge` v2: stays for Phase 1 (v3 requires Tailwind v4)
- `next lint` script in `package.json`: update to `biome check .`

## Version Delta Reference

### Already Current (no action needed)

| Package | Installed | Latest |
|---------|-----------|--------|
| next | 16.1.6 | 16.1.6 |
| react | 19.2.4 | 19.2.4 |
| react-dom | 19.2.4 | 19.2.4 |
| @types/react | 19.2.14 | 19.2.14 |
| @types/react-dom | 19.2.3 | 19.2.3 |
| @shopify/storefront-api-client | 1.0.9 | 1.0.9 |
| @uidotdev/usehooks | 2.4.1 | 2.4.1 |
| clsx | 2.1.1 | 2.1.1 |
| react-use | 17.6.0 | 17.6.0 |
| zustand | 5.0.0 (→ 5.0.11) | 5.0.11 |

### Minor Bumps (low risk, no breaking changes expected)

| Package | Installed | Target |
|---------|-----------|--------|
| gsap | 3.12.5 | 3.14.2 |
| @gsap/react | 2.1.1 | 2.1.2 |
| motion | 12.6.3 | 12.34.3 |
| lenis | 1.2.3 | 1.3.17 |
| embla-carousel | 8.3.1 | 8.6.0 |
| embla-carousel-react | 8.3.1 | 8.6.0 |
| embla-carousel-auto-scroll | 8.3.1 | 8.6.0 |
| embla-carousel-fade | 8.3.1 | 8.6.0 |
| @tanstack/react-query | 5.59.20 | 5.90.21 |
| @tanstack/react-query-devtools | 5.59.20 | 5.90.21 |
| react-hook-form | 7.54.2 | 7.71.2 |
| lucide-react | 0.454.0 | 0.575.0 |
| sonner | 1.7.4 | 2.0.7 |
| class-variance-authority | 0.7.0 | 0.7.1 |
| next-themes | 0.4.4 | 0.4.6 |
| sharp | 0.33.5 | 0.34.5 |
| typescript | 5.6.3 | 5.9.3 |
| @types/node | 20.x | 25.3.2 |
| usehooks-ts | 3.1.0 | 3.1.1 |
| use-resize-observer | 9.1.0 | 9.1.0 (current) |
| @number-flow/react | 0.5.7 | 0.5.14 |
| All @radix-ui/* | various 1.x/2.x | latest 1.x/2.x |

### Major Bumps (higher risk, need migration)

| Package | Installed | Target | Risk |
|---------|-----------|--------|------|
| sanity | 3.62.0 | 5.12.0 | LOW — only breaking change is React 19.2 req (already met) |
| next-sanity | 9.12.3 | 12.1.0 | LOW — API surface unchanged, peer dep update |
| @portabletext/react | 3.1.0 | 6.0.2 | MEDIUM — 3 major versions, check API |
| zod | 3.24.2 | 4.3.6 | MEDIUM — string format method changes, error API |
| @hookform/resolvers | 4.1.3 | 5.2.2 | MEDIUM — check zodResolver import |
| @shopify/hydrogen-react | 2025.1.3 | 2026.1.1 | LOW — date-versioned, vite peer dep warning |

### Pinned (must NOT upgrade in Phase 1)

| Package | Current | Why Pinned |
|---------|---------|-----------|
| tailwind-merge | 2.5.4 | v3 requires Tailwind v4, upgrade in Phase 3 |
| tailwindcss | 3.4.14 | Phase 3 upgrade |
| postcss | 8.x | Tied to Tailwind v3 pipeline |

## Open Questions

1. **Does `@portabletext/react` v6 have breaking API changes vs v3?**
   - What we know: Three major versions jumped (3.x → 6.x). The project imports from `@portabletext/react` in at least one component. The library handles Sanity portable text rendering.
   - What's unclear: Exact breaking changes between v3 and v6. The peerDependencies show `react: '^18.2 || ^19'` which is fine.
   - Recommendation: Before upgrading, `grep -r "from '@portabletext/react'"` to find all usage sites, then check the package's CHANGELOG on GitHub for breaking changes.

2. **Does `sonner` v2 have breaking API changes vs v1?**
   - What we know: Sonner jumped from v1.7.4 to v2.0.7. Used for toast notifications.
   - What's unclear: Exact breaking changes.
   - Recommendation: Check [sonner's GitHub releases](https://github.com/emilkowalski/sonner/releases) before upgrading. Grep usage sites first.

3. **Does `@hookform/resolvers` v5 have a different import path for `zodResolver`?**
   - What we know: v4.1.3 → v5.2.2. The project uses `import { zodResolver } from '@hookform/resolvers/zod'`.
   - What's unclear: Whether the import path changed in v5.
   - Recommendation: After upgrading, if TypeScript errors appear, check the package's exports.

4. **Is there a `middleware.ts` file that needs renaming to `proxy.ts` per Next.js 16?**
   - What we know: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`.
   - What's unclear: Whether this project has a middleware.ts file (not visible in current file listing).
   - Recommendation: `find . -name "middleware.ts" -not -path "*/node_modules/*"` to check. The codemod handles this rename automatically.

## Sources

### Primary (HIGH confidence)

- npm registry — `npm view [package] version` — all version numbers above
- [Next.js v16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — Breaking changes, codemod details, removed features
- [Next.js v15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15) — Async API migration details
- [Biome Getting Started](https://biomejs.dev/guides/getting-started/) — Installation and init commands
- [Biome Migrate from ESLint & Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/) — `biome migrate eslint` and `biome migrate prettier` commands
- [Zod v4 Changelog](https://zod.dev/v4/changelog) — Breaking changes (string format methods, error API, object defaults)
- [Sanity Studio v5 announcement](https://www.sanity.io/blog/sanity-studio-v5) — Only breaking change: React 19.2 requirement

### Secondary (MEDIUM confidence)

- [tailwind-merge v3 requires Tailwind v4](https://github.com/dcastil/tailwind-merge/issues/513) — WebSearch result confirmed by multiple sources
- [Shopify Hydrogen React vite peer dep](https://github.com/Shopify/hydrogen/issues/3428) — peerDep is optional for non-Vite consumers

### Tertiary (LOW confidence)

- GSAP 3.14.x breaking changes — WebSearch found user reports of issues; no official changelog reviewed. Treat as possible regression risk.

## Metadata

**Confidence breakdown:**

- Version targets: HIGH — direct from npm registry
- Next.js breaking changes: HIGH — official docs
- Biome migration: HIGH — official docs
- Sanity v3→v5 migration scope: HIGH — official blog post
- Zod v4 breaking changes: HIGH — official changelog
- tailwind-merge v3 Tailwind v4 requirement: HIGH — verified by multiple WebSearch sources
- GSAP 3.14 breaking changes: LOW — not verified with official changelog
- @portabletext/react v3→v6 breaking changes: LOW — not verified, flagged as open question
- Sonner v1→v2 breaking changes: LOW — not verified, flagged as open question
- @hookform/resolvers v4→v5 breaking changes: LOW — not verified, flagged as open question

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (30 days — stable packages)
