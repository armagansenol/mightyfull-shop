import { notFound, redirect } from 'next/navigation';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const ORDER_QUERY = `
  query AccountOrder($idQuery: String!) {
    customer {
      orders(first: 1, query: $idQuery) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          subtotal {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          totalShipping {
            amount
            currencyCode
          }
          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            zoneCode
            zip
            territoryCode
            phoneNumber
          }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              variantTitle
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              totalPrice {
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

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface OrderDetail {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: MoneyV2;
  subtotal: MoneyV2 | null;
  totalTax: MoneyV2 | null;
  totalShipping: MoneyV2 | null;
  shippingAddress: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    zoneCode: string | null;
    zip: string | null;
    territoryCode: string | null;
    phoneNumber: string | null;
  } | null;
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      variantTitle: string | null;
      image: {
        url: string;
        altText: string | null;
        width: number | null;
        height: number | null;
      } | null;
      price: MoneyV2 | null;
      totalPrice: MoneyV2 | null;
    }>;
  };
}

interface OrderData {
  customer: {
    orders: { nodes: OrderDetail[] };
  } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatMoney(money: MoneyV2 | null | undefined): string {
  if (!money) return '—';
  const value = Number.parseFloat(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode
  }).format(value);
}

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  const { id: encodedId } = await params;
  const id = decodeURIComponent(encodedId);
  // Customer Account API doesn't expose customer.order(id:); we filter
  // through customer.orders(query:) using the numeric portion of the GID.
  const numericId = id.split('/').pop() ?? id;

  let data: OrderData | null = null;
  let error: string | null = null;
  try {
    data = await customerQuery<OrderData>({
      query: ORDER_QUERY,
      variables: { idQuery: `id:${numericId}` }
    });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect(
        `/account/login?return_to=${encodeURIComponent(`/account/orders/${encodedId}`)}`
      );
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load order';
    }
  }

  const order = data?.customer?.orders.nodes[0] ?? null;

  if (error) {
    return (
      <>
        <header>
          <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin leading-tight">
            Order
          </h1>
        </header>
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin leading-tight">
              Couldn’t load this order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap text-red-700">
              {error}
            </pre>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!order) {
    notFound();
  }

  return (
    <>
      <header className="flex flex-col gap-3">
        <Button
          asChild
          variant="link"
          size="sm"
          colorTheme="naked-blue-ruin"
          hoverAnimation={false}
          className="h-auto w-auto p-0 underline text-sm self-start"
        >
          <Link href="/account/orders">← All orders</Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin leading-tight">
              {order.name}
            </h1>
            <p className="text-sm text-blue-ruin/80">
              Placed on {formatDate(order.processedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge
              status={order.fulfillmentStatus}
              type="fulfillment"
            />
            <OrderStatusBadge
              status={order.financialStatus}
              type="financial"
            />
          </div>
        </div>
      </header>

      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardHeader>
          <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin leading-tight">
            Items
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {order.lineItems.nodes.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start border-b border-blue-ruin/10 pb-4 last:border-b-0 last:pb-0"
            >
              {item.image?.url && (
                <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-white border border-blue-ruin/15">
                  <Img
                    src={item.image.url}
                    alt={item.image.altText ?? item.title}
                    width={item.image.width ?? 80}
                    height={item.image.height ?? 80}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="font-semibold">{item.title}</p>
                {item.variantTitle && (
                  <p className="text-sm text-blue-ruin/80">
                    {item.variantTitle}
                  </p>
                )}
                <p className="text-sm text-blue-ruin/80">
                  Qty {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatMoney(item.totalPrice)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin leading-tight">
              Order summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-ruin/80">Subtotal</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-ruin/80">Shipping</span>
              <span>{formatMoney(order.totalShipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-ruin/80">Tax</span>
              <span>{formatMoney(order.totalTax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-blue-ruin/10 pt-2 mt-1">
              <span>Total</span>
              <span>{formatMoney(order.totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin leading-tight">
              Shipping address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shippingAddress ? (
              <address className="not-italic flex flex-col gap-0.5 text-sm">
                <span className="font-semibold text-base">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </span>
                {order.shippingAddress.address1 && (
                  <span>{order.shippingAddress.address1}</span>
                )}
                {order.shippingAddress.address2 && (
                  <span>{order.shippingAddress.address2}</span>
                )}
                <span>
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.zoneCode,
                    order.shippingAddress.zip
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
                {order.shippingAddress.territoryCode && (
                  <span>{order.shippingAddress.territoryCode}</span>
                )}
                {order.shippingAddress.phoneNumber && (
                  <span className="text-blue-ruin/80 mt-1">
                    {order.shippingAddress.phoneNumber}
                  </span>
                )}
              </address>
            ) : (
              <p className="text-sm text-blue-ruin/80">
                No shipping address on file.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
