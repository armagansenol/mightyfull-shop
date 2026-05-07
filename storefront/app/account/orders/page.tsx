import { redirect } from 'next/navigation';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
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

const ORDERS_QUERY = `
  query AccountOrders {
    customer {
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
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
}

interface OrdersData {
  customer: {
    orders: { nodes: OrderNode[] };
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

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let data: OrdersData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<OrdersData>({ query: ORDERS_QUERY });
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

  return (
    <>
      <header>
        <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin">
          Orders
        </h1>
      </header>

      {error && (
        <pre className="text-sm whitespace-pre-wrap text-red-700">{error}</pre>
      )}

      {orders.length === 0 ? (
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardContent className="py-8 flex flex-col items-start gap-3">
            <p className="text-sm text-blue-ruin/80">
              You don&apos;t have any orders yet.
            </p>
            <Button
              asChild
              variant="link"
              size="sm"
              colorTheme="naked-blue-ruin"
              hoverAnimation={false}
              className="h-auto p-0 underline text-sm font-medium"
            >
              <Link href="/shop">Browse the shop</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-bomstad-display text-lg md:text-xl text-blue-ruin">
                    {order.name}
                  </CardTitle>
                  <p className="text-sm text-blue-ruin/80">
                    {formatDate(order.processedAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold">
                    {formatMoney(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode
                    )}
                  </p>
                  <OrderStatusBadge
                    status={order.fulfillmentStatus}
                    type="fulfillment"
                  />
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
                    href={`/account/orders/${encodeURIComponent(order.id)}`}
                    prefetch={false}
                  >
                    View details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
