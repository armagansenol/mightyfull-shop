import { NextResponse } from 'next/server';
import {
  buildEventPayload,
  filterContractsForTargetDate,
  getTargetDate,
  type SubscriptionContractNode
} from '@/lib/subscription-reminder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SHOPIFY_API_VERSION = '2026-04';
const KLAVIYO_REVISION = '2025-01-15';
const REMINDER_DAYS_AHEAD = 5;
const SUBSCRIPTION_PAGE_SIZE = 250;

type ShopifyResponse = {
  data?: {
    subscriptionContracts?: {
      edges: Array<{ node: SubscriptionContractNode }>;
    };
  };
  errors?: unknown;
};

const SUBSCRIPTION_CONTRACTS_QUERY = `
  query SubscriptionContractsForReminder($first: Int!) {
    subscriptionContracts(first: $first, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          status
          nextBillingDate
          customer {
            email
            firstName
            lastName
          }
          lines(first: 50) {
            edges {
              node {
                title
                currentPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchSubscriptionContracts(params: {
  shopDomain: string;
  adminToken: string;
}): Promise<SubscriptionContractNode[]> {
  const { shopDomain, adminToken } = params;
  const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken
    },
    body: JSON.stringify({
      query: SUBSCRIPTION_CONTRACTS_QUERY,
      variables: { first: SUBSCRIPTION_PAGE_SIZE }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify request failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as ShopifyResponse;

  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data?.subscriptionContracts?.edges?.map((edge) => edge.node) ?? [];
}

async function sendKlaviyoEvent(params: {
  contract: SubscriptionContractNode;
  klaviyoKey: string;
}): Promise<void> {
  const { contract, klaviyoKey } = params;

  const response = await fetch('https://a.klaviyo.com/api/events', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${klaviyoKey}`,
      'Content-Type': 'application/json',
      revision: KLAVIYO_REVISION
    },
    body: JSON.stringify(buildEventPayload(contract))
  });

  if (!response.ok && response.status !== 202) {
    const text = await response.text();
    throw new Error(`Klaviyo ${response.status}: ${text}`);
  }
}

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
  const klaviyoKey = process.env.KLAVIYO_PRIVATE_API_KEY;

  if (!shopDomain || !adminToken || !klaviyoKey) {
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    );
  }

  const targetDate = getTargetDate(REMINDER_DAYS_AHEAD);

  try {
    const contracts = await fetchSubscriptionContracts({
      shopDomain,
      adminToken
    });
    const matching = filterContractsForTargetDate(contracts, targetDate);

    console.log(
      `[subscription-reminder] target=${targetDate} fetched=${contracts.length} matching=${matching.length}`
    );

    const results = await Promise.allSettled(
      matching.map((contract) => sendKlaviyoEvent({ contract, klaviyoKey }))
    );

    let succeeded = 0;
    let failed = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        succeeded += 1;
      } else {
        failed += 1;
        const contract = matching[index];
        const reason =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        console.error(
          `[subscription-reminder] failed customer=${contract.customer?.email} contract=${contract.id} reason=${reason}`
        );
      }
    });

    return NextResponse.json({ succeeded, failed, targetDate });
  } catch (error) {
    console.error('[subscription-reminder] fatal', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message, targetDate }, { status: 500 });
  }
}
