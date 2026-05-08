import { Repeat } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { SubscriptionStatusBadge } from '@/components/account/subscription-status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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

  return (
    <>
      <header>
        <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin">
          Subscriptions
        </h1>
      </header>

      {error && (
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin">
              Couldn’t load subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap text-red-700">
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
          <div className="flex flex-col gap-4">
            {contracts.map((contract) => {
              const summary = contract.lines.nodes
                .map((line) => `${line.title} × ${line.quantity}`)
                .join(', ');
              const firstLinePrice = contract.lines.nodes[0]?.currentPrice;
              return (
                <Card
                  key={contract.id}
                  className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                    <div className="flex flex-col gap-1 min-w-0">
                      <CardTitle className="font-bomstad-display text-lg md:text-xl text-blue-ruin truncate">
                        {summary || 'Subscription'}
                      </CardTitle>
                      {contract.nextBillingDate && (
                        <p className="text-sm text-blue-ruin/80">
                          Next renewal {formatDate(contract.nextBillingDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {firstLinePrice && (
                        <p className="font-semibold">
                          {formatMoney(firstLinePrice)}
                        </p>
                      )}
                      <SubscriptionStatusBadge status={contract.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-end">
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      colorTheme="naked-blue-ruin"
                      hoverAnimation={false}
                      className="h-auto w-auto p-0 underline text-sm font-medium"
                    >
                      <Link
                        href={`/account/subscriptions/${encodeURIComponent(contract.id)}`}
                        prefetch={false}
                      >
                        Manage
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}
    </>
  );
}
