import { CalendarClock, Repeat, RotateCw } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { PageHeader } from '@/components/account/page-header';
import { SubscriptionStatusBadge } from '@/components/account/subscription-status-badge';
import {
  SubscriptionsFilters,
  type SubscriptionSortKey,
  type SubscriptionStatusFilter
} from '@/components/account/subscriptions-filters';
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
      subscriptionContracts(first: 50) {
        nodes {
          id
          status
          nextBillingDate
          createdAt
          deliveryPolicy {
            interval
            intervalCount {
              count
            }
          }
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

interface DeliveryFrequency {
  interval: 'WEEK' | 'MONTH' | 'YEAR' | 'DAY';
  intervalCount: { count: number };
}

interface SubscriptionContract {
  id: string;
  status: string;
  nextBillingDate: string | null;
  createdAt: string;
  deliveryPolicy: DeliveryFrequency | null;
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

function formatFrequency(policy: DeliveryFrequency | null): string | null {
  if (!policy) return null;
  const count = policy.intervalCount.count;
  const unit = policy.interval.toLowerCase();
  if (count === 1) return `Every ${unit}`;
  return `Every ${count} ${unit}s`;
}

function parseStatusFilter(value: string | undefined): SubscriptionStatusFilter {
  if (value === 'active' || value === 'paused' || value === 'cancelled') {
    return value;
  }
  return 'all';
}

function parseSortKey(value: string | undefined): SubscriptionSortKey {
  if (value === 'newest' || value === 'oldest') return value;
  return 'next-renewal';
}

function applyFilterAndSort(
  contracts: SubscriptionContract[],
  status: SubscriptionStatusFilter,
  sort: SubscriptionSortKey
): SubscriptionContract[] {
  const filtered = contracts.filter((c) => {
    if (status === 'all') return true;
    if (status === 'active') return c.status === 'ACTIVE';
    if (status === 'paused') return c.status === 'PAUSED';
    if (status === 'cancelled')
      return ['CANCELLED', 'EXPIRED', 'FAILED'].includes(c.status);
    return true;
  });

  const sorted = [...filtered];
  if (sort === 'newest') {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sort === 'oldest') {
    sorted.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } else {
    sorted.sort((a, b) => {
      if (!a.nextBillingDate && !b.nextBillingDate) return 0;
      if (!a.nextBillingDate) return 1;
      if (!b.nextBillingDate) return -1;
      return (
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
      );
    });
  }

  return sorted;
}

export default async function SubscriptionsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  const { status: statusParam, sort: sortParam } = await searchParams;
  const status = parseStatusFilter(statusParam);
  const sort = parseSortKey(sortParam);

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

  const allContracts = data?.customer?.subscriptionContracts.nodes ?? [];
  const activeCount = allContracts.filter((c) => c.status === 'ACTIVE').length;
  const contracts = applyFilterAndSort(allContracts, status, sort);

  return (
    <>
      <PageHeader
        eyebrow="Subscriptions"
        title="Your subscriptions"
        description={
          allContracts.length > 0
            ? `${activeCount} active · ${allContracts.length} total`
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

      {!error && allContracts.length === 0 ? (
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
          <>
            <SubscriptionsFilters
              initialStatus={status}
              initialSort={sort}
            />

            {contracts.length === 0 ? (
              <div className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk px-5 py-10 text-center">
                <p className="text-sm font-medium text-blue-ruin/75">
                  No subscriptions match this filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:gap-5">
                {contracts.map((contract) => {
                  const summary = contract.lines.nodes
                    .map((line) => `${line.title} × ${line.quantity}`)
                    .join(', ');
                  const firstLine = contract.lines.nodes[0];
                  const firstLinePrice = firstLine?.currentPrice ?? null;
                  const firstLineImage = firstLine?.image ?? null;
                  const frequencyLabel = formatFrequency(contract.deliveryPolicy);
                  const detailHref = `/account/subscriptions/${encodeURIComponent(contract.id)}`;

                  return (
                    <article
                      key={contract.id}
                      className="rounded-2xl border border-blue-ruin/20 bg-sugar-milk text-blue-ruin p-5 md:p-6 hover:border-blue-ruin/40 transition-colors"
                    >
                      <div className="flex items-start gap-4 md:gap-5">
                        {firstLineImage && (
                          <Image
                            src={firstLineImage.url}
                            alt={
                              firstLineImage.altText ?? firstLine?.title ?? ''
                            }
                            width={128}
                            height={128}
                            className="shrink-0 w-24 h-24 md:w-32 md:h-32 object-contain"
                          />
                        )}
                        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                          {/* Title + status badge inline */}
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <h2 className="font-bomstad-display text-xl md:text-2xl font-semibold text-blue-ruin leading-[0.98] text-wrap-balance">
                              {summary || 'Subscription'}
                            </h2>
                            <div className="shrink-0 mt-0.5">
                              <SubscriptionStatusBadge
                                status={contract.status}
                              />
                            </div>
                          </div>

                          {/* Info pills */}
                          <div className="flex flex-wrap items-center gap-2">
                            {frequencyLabel && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-ruin/8 text-blue-ruin text-xs font-semibold ring-1 ring-inset ring-blue-ruin/15">
                                <RotateCw
                                  className="w-3 h-3 shrink-0"
                                  strokeWidth={2.25}
                                  aria-hidden="true"
                                />
                                {frequencyLabel}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-ruin/8 text-blue-ruin text-xs font-semibold ring-1 ring-inset ring-blue-ruin/15">
                              <CalendarClock
                                className="w-3 h-3 shrink-0"
                                strokeWidth={2.25}
                                aria-hidden="true"
                              />
                              {contract.nextBillingDate
                                ? `Next renewal ${formatDate(contract.nextBillingDate)}`
                                : 'No renewal scheduled'}
                            </span>
                          </div>

                          {/* Money + Manage button on the same row */}
                          <div className="flex items-center justify-between gap-3 flex-wrap mt-1">
                            {firstLinePrice ? (
                              <p className="text-lg md:text-xl font-bold tabular-nums leading-none text-blue-ruin">
                                {formatMoney(firstLinePrice)}
                              </p>
                            ) : (
                              <span />
                            )}
                            <Button
                              asChild
                              colorTheme="blue-ruin"
                              size="sm"
                              padding="fat"
                              hoverAnimation={false}
                              className="h-10"
                            >
                              <Link href={detailHref}>Manage</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )
      )}
    </>
  );
}
