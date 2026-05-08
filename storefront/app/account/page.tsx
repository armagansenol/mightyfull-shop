import {
  Location04Icon,
  MapPinIcon,
  Package01Icon,
  PackageDeliveredIcon,
  RepeatIcon,
  ShoppingBag01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AddressBlock } from '@/components/account/address-block';
import { CardActionLink } from '@/components/account/card-action-link';
import { OrderStatusBadge } from '@/components/account/order-status-badge';
import { PageHeader } from '@/components/account/page-header';
import { SubscriptionStatusBadge } from '@/components/account/subscription-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const OVERVIEW_QUERY = `
  query AccountOverview {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      defaultAddress {
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
      orders(first: 1, sortKey: PROCESSED_AT, reverse: true) {
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
      subscriptionContracts(first: 50) {
        nodes {
          id
          status
          nextBillingDate
        }
      }
    }
  }
`;

interface OverviewData {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
    defaultAddress: {
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
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        processedAt: string;
        totalPrice: { amount: string; currencyCode: string };
        financialStatus: string | null;
        fulfillmentStatus: string | null;
      }>;
    };
    subscriptionContracts: {
      nodes: Array<{
        id: string;
        status: string;
        nextBillingDate: string | null;
      }>;
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

const QUICK_ACTIONS: Array<{
  href: string;
  label: string;
  description: string;
  icon: typeof Package01Icon;
}> = [
  {
    href: '/account/orders',
    label: 'Track an order',
    description: 'Status, tracking & receipts',
    icon: PackageDeliveredIcon
  },
  {
    href: '/account/subscriptions',
    label: 'Manage subscriptions',
    description: 'Pause, skip, or swap flavors',
    icon: RepeatIcon
  },
  {
    href: '/account/addresses/new',
    label: 'Add an address',
    description: 'Faster checkout next time',
    icon: Location04Icon
  },
  {
    href: '/shop',
    label: 'Browse the shop',
    description: 'Stock up on cookies',
    icon: ShoppingBag01Icon
  }
];

export default async function AccountOverviewPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let data: OverviewData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<OverviewData>({ query: OVERVIEW_QUERY });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect('/account/login?return_to=/account');
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load account data';
    }
  }

  const customer = data?.customer ?? null;
  const recentOrder = customer?.orders.nodes[0];
  const activeSubscriptions =
    customer?.subscriptionContracts.nodes.filter(
      (sub) => sub.status === 'ACTIVE'
    ) ?? [];
  const nextRenewal = activeSubscriptions
    .map((s) => s.nextBillingDate)
    .filter((d): d is string => Boolean(d))
    .sort()[0];
  const nextActiveSubscription = activeSubscriptions.find(
    (sub) => sub.nextBillingDate === nextRenewal
  );

  const greetingName = customer?.firstName?.trim() || 'there';
  const email = customer?.emailAddress?.emailAddress;

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title={<>Hi, {greetingName}.</>}
        description={
          email ? (
            <>
              Signed in as{' '}
              <span className="font-semibold text-blue-ruin">{email}</span>
            </>
          ) : null
        }
      />

      {error && (
        <Card className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl leading-tight">
              Something went wrong
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-start">
        <AccountCard
          icon={Package01Icon}
          eyebrow="Recent order"
          title={recentOrder?.name ?? 'No orders yet'}
          action={
            <CardActionLink href="/account/orders">View all</CardActionLink>
          }
          className="lg:col-span-2"
        >
          {recentOrder ? (
            <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-sm text-account-muted">
                  Placed on {formatDate(recentOrder.processedAt)}
                </span>
                <span aria-hidden="true" className="text-account-subtle/60">
                  •
                </span>
                <span className="text-sm font-semibold text-blue-ruin">
                  {formatMoney(
                    recentOrder.totalPrice.amount,
                    recentOrder.totalPrice.currencyCode
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge
                  status={recentOrder.fulfillmentStatus}
                  type="fulfillment"
                />
                <OrderStatusBadge
                  status={recentOrder.financialStatus}
                  type="financial"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-account-muted">
              When you place your first order, you’ll see it here with status,
              totals, and tracking.
            </p>
          )}
        </AccountCard>

        <AccountCard
          icon={RepeatIcon}
          eyebrow="Subscriptions"
          title={
            activeSubscriptions.length > 0
              ? `${activeSubscriptions.length} active`
              : 'None active'
          }
          action={
            <CardActionLink href="/account/subscriptions">
              Manage
            </CardActionLink>
          }
        >
          {activeSubscriptions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {nextActiveSubscription && (
                <SubscriptionStatusBadge
                  status={nextActiveSubscription.status}
                />
              )}
              {nextRenewal && (
                <p className="text-sm text-account-muted">
                  Next renewal on{' '}
                  <span className="font-semibold text-blue-ruin">
                    {formatDate(nextRenewal)}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-account-muted">
              Subscribe to your favorites and we’ll deliver them on your
              schedule.
            </p>
          )}
        </AccountCard>

        <AccountCard
          icon={MapPinIcon}
          eyebrow="Default address"
          title={
            customer?.defaultAddress
              ? `${customer.defaultAddress.firstName ?? ''} ${customer.defaultAddress.lastName ?? ''}`.trim() ||
                'Default address'
              : 'No address yet'
          }
          action={
            <CardActionLink href="/account/addresses">Manage</CardActionLink>
          }
          className="lg:col-span-3"
        >
          {customer?.defaultAddress ? (
            <AddressBlock address={customer.defaultAddress} showName={false} />
          ) : (
            <p className="text-sm text-account-muted">
              Add a shipping address now and checkout will be one tap on your
              next order.
            </p>
          )}
        </AccountCard>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="quick-actions">
        <h2
          id="quick-actions"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-account-subtle"
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              prefetch={action.href.startsWith('/account')}
              className="group flex flex-col gap-2 p-4 rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin transition-colors duration-200 hover:bg-blue-ruin hover:text-sugar-milk hover:border-blue-ruin focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk cursor-pointer"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-ruin/10 group-hover:bg-sugar-milk/15 transition-colors">
                <HugeiconsIcon
                  icon={action.icon}
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <span className="font-bomstad-display text-base md:text-lg leading-tight">
                {action.label}
              </span>
              <span className="text-xs text-account-muted group-hover:text-sugar-milk/75 transition-colors">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
