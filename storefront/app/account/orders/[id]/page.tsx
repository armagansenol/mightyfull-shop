import {
  ArrowLeft01Icon,
  MapPinIcon,
  Package01Icon,
  ReceiptDollarIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { notFound, redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AddressBlock } from '@/components/account/address-block';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { PageHeader } from '@/components/account/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <PageHeader eyebrow="Order" title="Order" />
        <Card className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl leading-tight">
              Couldn’t load this order
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
      </>
    );
  }

  if (!order) {
    notFound();
  }

  const totalQty = order.lineItems.nodes.reduce(
    (sum, n) => sum + n.quantity,
    0
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-ruin/80 hover:text-blue-ruin transition-colors w-fit cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk rounded"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>All orders</span>
        </Link>

        <PageHeader
          eyebrow={`Placed on ${formatDate(order.processedAt)}`}
          title={order.name}
          description={`${totalQty} item${totalQty === 1 ? '' : 's'} · ${formatMoney(order.totalPrice)}`}
          action={
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
          }
        />
      </div>

      <AccountCard
        icon={Package01Icon}
        eyebrow="Items"
        title="What you ordered"
      >
        <ul className="flex flex-col list-none p-0 -mx-1">
          {order.lineItems.nodes.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-4 items-start py-4 px-1 border-b border-blue-ruin/10 last:border-b-0 last:pb-0 first:pt-0"
            >
              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white border border-blue-ruin/15">
                {item.image?.url ? (
                  <Img
                    src={item.image.url}
                    alt={item.image.altText ?? item.title}
                    width={item.image.width ?? 80}
                    height={item.image.height ?? 80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-full h-full flex items-center justify-center text-blue-ruin/40"
                  >
                    <HugeiconsIcon
                      icon={Package01Icon}
                      size={28}
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="font-semibold text-blue-ruin">{item.title}</p>
                {item.variantTitle && (
                  <p className="text-sm font-medium text-blue-ruin/75">
                    {item.variantTitle}
                  </p>
                )}
                <p className="text-sm font-medium text-blue-ruin/75">
                  Qty {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0 flex flex-col gap-1">
                <p className="font-semibold tabular-nums text-blue-ruin">
                  {formatMoney(item.totalPrice)}
                </p>
                {item.price &&
                  item.totalPrice &&
                  Number(item.price.amount) !==
                    Number(item.totalPrice.amount) && (
                    <p className="text-xs text-blue-ruin/70 tabular-nums">
                      {formatMoney(item.price)} each
                    </p>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </AccountCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <AccountCard
          icon={ReceiptDollarIcon}
          eyebrow="Order summary"
          title="Totals"
        >
          <dl className="flex flex-col gap-2 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-blue-ruin/75">Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-blue-ruin/75">Shipping</dt>
              <dd>{formatMoney(order.totalShipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-blue-ruin/75">Tax</dt>
              <dd>{formatMoney(order.totalTax)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-blue-ruin/10 pt-3 mt-1">
              <dt>Total</dt>
              <dd>{formatMoney(order.totalPrice)}</dd>
            </div>
          </dl>
        </AccountCard>

        <AccountCard
          icon={MapPinIcon}
          eyebrow="Shipping address"
          title={
            order.shippingAddress
              ? `${order.shippingAddress.firstName ?? ''} ${order.shippingAddress.lastName ?? ''}`.trim() ||
                'Shipping address'
              : 'Shipping address'
          }
        >
          {order.shippingAddress ? (
            <AddressBlock address={order.shippingAddress} showName={false} />
          ) : (
            <p className="text-sm font-medium text-blue-ruin/75">
              No shipping address on file.
            </p>
          )}
        </AccountCard>
      </div>
    </>
  );
}
