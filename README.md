# Subscription Renewal Reminder Cron

Daily Vercel cron that finds Shopify subscription contracts billing in exactly **5 days** and sends a `Subscription Renewal Reminder` event to Klaviyo for each matching customer. Lives inside the storefront Next.js app so it ships and rolls back with the rest of the site.

## How it works

- Runs daily at **08:00 UTC** via Vercel Cron (`vercel.json` → `crons`).
- Endpoint: `GET /api/subscription-reminder` (App Router Route Handler in `storefront/`).
- Authenticates the Vercel Cron invocation using a Bearer token (`CRON_SECRET`).
- Queries the Shopify Admin GraphQL API (`subscriptionContracts`, up to 250 per run).
- Filters to contracts whose `nextBillingDate` is `today + 5 days` (UTC, `YYYY-MM-DD`).
- Sends one Klaviyo event per matching contract in parallel via `Promise.allSettled`.
- Returns `{ succeeded, failed, targetDate }`.

## File structure

```
.
├── storefront/
│   └── app/api/subscription-reminder/route.ts   # Route Handler (GET)
├── vercel.json                                  # `crons` config + framework settings
├── .env.example                                 # Required environment variables
└── README.md
```

## Environment variables

| Name | Description |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Shop domain, e.g. `mystore.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | Shopify Admin API access token (custom or partner app) |
| `KLAVIYO_PRIVATE_API_KEY` | Klaviyo private API key (`pk_...`) — shared with `welcome-email` route |
| `CRON_SECRET` | Shared secret used by Vercel Cron's `Authorization: Bearer …` header |

Copy `.env.example` to `storefront/.env.local` and fill in the values for local testing.

## Required Shopify Admin scopes

The Admin API token must have at least:

- `read_own_subscription_contracts`
- `read_customers` (for the contract's `customer` field)

Configure these in your Shopify custom app's API config and reinstall the app on the shop.

## Deploy to Vercel

1. **Set environment variables** on the storefront Vercel project (Production + Preview as needed):
   ```bash
   vercel env add SHOPIFY_STORE_DOMAIN
   vercel env add SHOPIFY_ADMIN_TOKEN
   vercel env add KLAVIYO_PRIVATE_API_KEY
   vercel env add CRON_SECRET
   ```
2. **Deploy**:
   ```bash
   vercel deploy --prod
   ```
3. Vercel registers the cron from `vercel.json` automatically. Verify under **Project → Settings → Cron Jobs**.

> Vercel Cron automatically attaches `Authorization: Bearer ${CRON_SECRET}` to scheduled invocations when `CRON_SECRET` is set on the project.

## Manual testing

```bash
# Local dev
pnpm dev:storefront

curl -i \
  -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/subscription-reminder

# Production
curl -i \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-deployment>.vercel.app/api/subscription-reminder
```

A successful response looks like:

```json
{ "succeeded": 3, "failed": 0, "targetDate": "2026-05-12" }
```

A request without a valid Bearer token returns `401`.

## Observability

Each run logs:

- `target=<date> fetched=<n> matching=<m>` — sanity check on the filter.
- One `failed customer=… contract=… reason=…` line per Klaviyo error (the rest of the batch is unaffected because of `Promise.allSettled`).

Tail logs with:

```bash
vercel logs <deployment-url>
```
