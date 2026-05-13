# Mightyfull

Monorepo for the Mightyfull storefront and content studio.

## Packages

- **[`storefront/`](./storefront)** — Next.js (App Router) Shopify headless storefront. Includes the on-site customer account dashboard (login, orders, subscriptions, addresses, profile) backed by Shopify's Customer Account API.
- **[`studio/`](./studio)** — Sanity Studio for editorial content (product copy, marketing pages).

## Stack

- Next.js 16 (App Router) + React 19
- pnpm workspaces (managed via `corepack`)
- Tailwind CSS
- Shopify Storefront API + Customer Account API
- Sanity for editorial content

## Local dev

```bash
pnpm install
pnpm --filter storefront dev    # storefront on :3000
pnpm --filter studio dev        # studio on :3333
```

See [`storefront/README.md`](./storefront/README.md) for storefront-specific environment variables and setup.
