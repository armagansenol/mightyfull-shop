import { RepeatIcon } from '@hugeicons/core-free-icons';
import { Repeat } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { CardActionLink } from '@/components/account/card-action-link';
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
              const firstLinePrice = contract.lines.nodes[0]?.currentPrice;
              return (
                <AccountCard
                  key={contract.id}
                  icon={RepeatIcon}
                  eyebrow="Subscription"
                  title={summary || 'Subscription'}
                  action={
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {firstLinePrice && (
                        <p className="font-semibold tabular-nums text-blue-ruin">
                          {formatMoney(firstLinePrice)}
                        </p>
                      )}
                      <SubscriptionStatusBadge status={contract.status} />
                    </div>
                  }
                  footer={
                    <>
                      <span className="text-sm font-medium text-blue-ruin/75">
                        {contract.nextBillingDate
                          ? `Next renewal ${formatDate(contract.nextBillingDate)}`
                          : 'No renewal scheduled'}
                      </span>
                      <CardActionLink
                        href={`/account/subscriptions/${encodeURIComponent(contract.id)}`}
                      >
                        Manage
                      </CardActionLink>
                    </>
                  }
                />
              );
            })}
          </div>
        )
      )}
    </>
  );
}
