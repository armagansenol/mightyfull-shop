import { Repeat } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { PageHeader } from '@/components/account/page-header';
import { SubscriptionStatusBadge } from '@/components/account/subscription-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const SUBSCRIPTIONS_QUERY = `
  query AccountSubscriptions {
    customer {
      subscriptionContracts(first: 20) {
        nodes {
          id
          status
          nextBillingDate
          lines(first: 5) {
            nodes {
              title
              quantity
              currentPrice {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

interface SubscriptionLine {
  title: string;
  quantity: number;
  currentPrice: { amount: string; currencyCode: string } | null;
  image: { url: string; altText: string | null } | null;
}

interface SubscriptionContract {
  id: string;
  status: string;
  nextBillingDate: string | null;
  lines: { nodes: SubscriptionLine[] };
}

interface SubscriptionsData {
  customer: {
    subscriptionContracts: { nodes: SubscriptionContract[] };
  } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatMoney(money: { amount: string; currencyCode: string } | null) {
  if (!money) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode
  }).format(Number.parseFloat(money.amount));
}

export default async function SubscriptionsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let data: SubscriptionsData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<SubscriptionsData>({
      query: SUBSCRIPTIONS_QUERY
    });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect('/account/login?return_to=/account/subscriptions');
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load subscriptions';
    }
  }

  const contracts = data?.customer?.subscriptionContracts.nodes ?? [];
  const activeCount = contracts.filter((c) => c.status === 'ACTIVE').length;

  return (
    <>
      <PageHeader
        eyebrow="Subscriptions"
        title="Your subscriptions"
        description={
          contracts.length > 0
            ? `${activeCount} active · ${contracts.length} total`
            : undefined
        }
      />

      {error && (
        <Card className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl leading-tight">
              Couldn’t load subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              role="alert"
              className="text-sm whitespace-pre-wrap text-red-800"
            >
              {error}
            </pre>
          </CardContent>
        </Card>
      )}

      {!error && contracts.length === 0 ? (
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardContent>
            <AccountEmptyState
              icon={Repeat}
              title="No subscriptions yet"
              description="Subscribe to your favorites and we&apos;ll deliver them on your schedule. Pause, skip, or cancel anytime."
              action={
                <Button
                  asChild
                  colorTheme="blue-ruin"
                  size="sm"
                  padding="fat"
                  hoverAnimation={false}
                  className="h-10"
                >
                  <Link href="/shop">Browse the shop</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        !error && (
          <div className="flex flex-col gap-4 md:gap-5">
            {contracts.map((contract) => {
              const summary = contract.lines.nodes
                .map((line) => `${line.title} × ${line.quantity}`)
                .join(', ');
              const firstLine = contract.lines.nodes[0];
              const firstLinePrice = firstLine?.currentPrice ?? null;
              const firstLineImage = firstLine?.image ?? null;
              return (
                <Link
                  key={contract.id}
                  href={`/account/subscriptions/${encodeURIComponent(contract.id)}`}
                  className="block rounded-2xl border border-blue-ruin/20 bg-sugar-milk text-blue-ruin p-5 md:p-6 hover:border-blue-ruin/45 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk"
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    {firstLineImage && (
                      <Image
                        src={firstLineImage.url}
                        alt={firstLineImage.altText ?? firstLine?.title ?? ''}
                        width={80}
                        height={80}
                        className="shrink-0 w-16 h-16 md:w-20 md:h-20 object-contain"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <h2 className="font-bomstad-display text-xl md:text-2xl font-semibold text-blue-ruin leading-[0.98] text-wrap-balance">
                        {summary || 'Subscription'}
                      </h2>
                      <p className="text-sm font-medium text-blue-ruin/75">
                        {contract.nextBillingDate
                          ? `Next renewal ${formatDate(contract.nextBillingDate)}`
                          : 'No renewal scheduled'}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {firstLinePrice && (
                        <p className="font-semibold tabular-nums text-blue-ruin">
                          {formatMoney(firstLinePrice)}
                        </p>
                      )}
                      <SubscriptionStatusBadge status={contract.status} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}
    </>
  );
}
