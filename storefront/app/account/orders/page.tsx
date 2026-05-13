import { Package01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Package } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import {
  type OrderStatusFilter,
  OrdersFilters
} from '@/components/account/orders-filters';
import { PageHeader } from '@/components/account/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ORDERS_PER_PAGE = 10;

const ORDERS_QUERY = `
  query AccountOrders($first: Int!, $after: String, $query: String) {
    customer {
      orders(
        first: $first
        after: $after
        sortKey: PROCESSED_AT
        reverse: true
        query: $query
      ) {
        nodes {
          id
          name
          processedAt
          totalPrice {
            amount
            currencyCode
          }
          financialStatus
          fulfillmentStatus
          lineItems(first: 1) {
            nodes {
              title
              quantity
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

interface OrderNode {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: { amount: string; currencyCode: string };
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  lineItems: {
    nodes: Array<{ title: string; quantity: number }>;
  };
}

interface OrdersData {
  customer: {
    orders: {
      nodes: OrderNode[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatMoney(amount: string, currency: string): string {
  const value = Number.parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value);
}

function summarizeItems(nodes: OrderNode['lineItems']['nodes']): string {
  if (nodes.length === 0) return 'No items';
  const first = nodes[0];
  const totalQty = nodes.reduce((sum, n) => sum + n.quantity, 0);
  if (totalQty <= first.quantity) {
    return `${first.title} × ${first.quantity}`;
  }
  return `${first.title} + ${totalQty - first.quantity} more`;
}

function normalizeStatus(value: string | undefined): OrderStatusFilter {
  if (value === 'open' || value === 'fulfilled' || value === 'cancelled') {
    return value;
  }
  return 'all';
}

function buildSearchString(status: OrderStatusFilter, q: string): string {
  const parts: string[] = [];
  if (status === 'open') parts.push('status:open');
  if (status === 'fulfilled') parts.push('fulfillment_status:fulfilled');
  if (status === 'cancelled') parts.push('status:cancelled');
  const trimmed = q.trim();
  if (trimmed) {
    // Strip leading '#' so users can paste either form.
    const name = trimmed.replace(/^#/, '');
    parts.push(`name:#${name}`);
  }
  return parts.join(' ');
}

function buildHref(params: {
  q?: string;
  status?: OrderStatusFilter;
  after?: string | null;
}): string {
  const usp = new URLSearchParams();
  if (params.q) usp.set('q', params.q);
  if (params.status && params.status !== 'all')
    usp.set('status', params.status);
  if (params.after) usp.set('after', params.after);
  const qs = usp.toString();
  return qs ? `/account/orders?${qs}` : '/account/orders';
}

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    after?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  const sp = await searchParams;
  const q = sp.q?.trim() ?? '';
  const status = normalizeStatus(sp.status);
  const after = sp.after ?? null;
  const queryString = buildSearchString(status, q);

  let data: OrdersData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<OrdersData>({
      query: ORDERS_QUERY,
      variables: {
        first: ORDERS_PER_PAGE,
        after,
        query: queryString || null
      }
    });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect('/account/login?return_to=/account/orders');
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load orders';
    }
  }

  const orders = data?.customer?.orders.nodes ?? [];
  const pageInfo = data?.customer?.orders.pageInfo;
  const hasFilter = q.length > 0 || status !== 'all';

  return (
    <>
      <PageHeader
        eyebrow="Orders"
        title="Your orders"
        description={
          !hasFilter && orders.length > 0
            ? `Showing ${orders.length} order${orders.length === 1 ? '' : 's'}`
            : hasFilter
              ? 'Filtered view'
              : undefined
        }
      />

      <OrdersFilters initialQuery={q} initialStatus={status} />

      {error && (
        <pre role="alert" className="text-sm whitespace-pre-wrap text-red-700">
          {error}
        </pre>
      )}

      {orders.length === 0 ? (
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardContent>
            <AccountEmptyState
              icon={Package}
              title={hasFilter ? 'No matching orders' : 'No orders yet'}
              description={
                hasFilter
                  ? 'Try a different status or search term.'
                  : "When you place your first order, you'll see it here with status, totals, and tracking."
              }
              action={
                hasFilter ? (
                  <Button
                    asChild
                    colorTheme="naked-blue-ruin"
                    size="sm"
                    padding="fat"
                    hoverAnimation={false}
                    className="h-10"
                  >
                    <Link href="/account/orders">Clear filters</Link>
                  </Button>
                ) : (
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
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:gap-4 list-none p-0">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${encodeURIComponent(order.id)}`}
                  className={cn(
                    'group block rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin',
                    'p-5 md:p-6 transition-colors duration-200 cursor-pointer',
                    'hover:border-blue-ruin/40 hover:bg-blue-ruin/[0.03]',
                    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk'
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <span
                      aria-hidden="true"
                      className="hidden md:inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-ruin/10 text-blue-ruin group-hover:bg-blue-ruin group-hover:text-sugar-milk transition-colors"
                    >
                      <HugeiconsIcon
                        icon={Package01Icon}
                        size={20}
                        strokeWidth={1.75}
                      />
                    </span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bomstad-display text-lg md:text-xl text-blue-ruin leading-tight">
                          {order.name}
                        </span>
                        <span className="text-xs text-blue-ruin/70">
                          {formatDate(order.processedAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-blue-ruin/75 truncate">
                        {summarizeItems(order.lineItems.nodes)}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col md:items-end justify-between md:justify-center gap-2 md:gap-1.5 md:shrink-0">
                      <span className="text-base font-semibold tabular-nums">
                        {formatMoney(
                          order.totalPrice.amount,
                          order.totalPrice.currencyCode
                        )}
                      </span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        <OrderStatusBadge
                          status={order.fulfillmentStatus}
                          type="fulfillment"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {(pageInfo?.hasNextPage || after) && (
            <nav
              aria-label="Orders pagination"
              className="flex items-center justify-between gap-3 pt-2"
            >
              {after ? (
                <Button
                  asChild
                  colorTheme="naked-blue-ruin"
                  size="sm"
                  padding="fat"
                  hoverAnimation={false}
                  className="h-10"
                >
                  <Link href={buildHref({ q, status })}>← Start over</Link>
                </Button>
              ) : (
                <span />
              )}
              {pageInfo?.hasNextPage && pageInfo.endCursor ? (
                <Button
                  asChild
                  colorTheme="blue-ruin"
                  size="sm"
                  padding="fat"
                  hoverAnimation={false}
                  className="h-10"
                >
                  <Link
                    href={buildHref({
                      q,
                      status,
                      after: pageInfo.endCursor
                    })}
                  >
                    Next page →
                  </Link>
                </Button>
              ) : null}
            </nav>
          )}
        </>
      )}
    </>
  );
}
