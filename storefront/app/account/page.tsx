import {
  ArrowRight01Icon,
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

function getCustomerName(
  customer: NonNullable<OverviewData['customer']>
): string {
  return [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
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
  const fullName = customer ? getCustomerName(customer) : '';
  const orderStatus =
    recentOrder?.fulfillmentStatus ?? recentOrder?.financialStatus;
  const hasSavedAddress = Boolean(customer?.defaultAddress);

  return (
    <>
      <PageHeader
        eyebrow="Account home"
        title={<>Hi, {greetingName}</>}
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
        <Card className="rounded-xl border border-red-300/60 bg-red-50 text-red-900">
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

      <section
        aria-label="Account summary"
        className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-blue-ruin/20 bg-blue-ruin/[0.04] p-3 md:p-4"
      >
        <div className="rounded-lg bg-sugar-milk px-4 py-3 border border-blue-ruin/15">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-account-subtle">
            Orders
          </p>
          <p className="mt-1 font-bomstad-display text-2xl leading-none text-blue-ruin tabular-nums">
            {recentOrder ? 'Latest ready' : 'No orders'}
          </p>
          <p className="mt-2 text-xs text-account-muted">
            {recentOrder
              ? `Last placed ${formatDate(recentOrder.processedAt)}`
              : 'Start with your first checkout.'}
          </p>
        </div>
        <div className="rounded-lg bg-sugar-milk px-4 py-3 border border-blue-ruin/15">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-account-subtle">
            Renewals
          </p>
          <p className="mt-1 font-bomstad-display text-2xl leading-none text-blue-ruin tabular-nums">
            {activeSubscriptions.length}
          </p>
          <p className="mt-2 text-xs text-account-muted">
            {nextRenewal
              ? `Next charge ${formatDate(nextRenewal)}`
              : 'No active subscription.'}
          </p>
        </div>
        <div className="rounded-lg bg-sugar-milk px-4 py-3 border border-blue-ruin/15">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-account-subtle">
            Shipping
          </p>
          <p className="mt-1 font-bomstad-display text-2xl leading-none text-blue-ruin">
            {hasSavedAddress ? 'Saved' : 'Missing'}
          </p>
          <p className="mt-2 text-xs text-account-muted">
            {hasSavedAddress
              ? 'Default address is ready.'
              : 'Add one for faster orders.'}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] gap-5 md:gap-6 items-start">
        <div className="flex flex-col gap-5 md:gap-6">
          <AccountCard
            icon={Package01Icon}
            eyebrow="Latest order"
            title={recentOrder?.name ?? 'No orders yet'}
            action={
              <CardActionLink href="/account/orders">
                View orders
              </CardActionLink>
            }
            className="overflow-hidden"
            contentClassName="gap-5"
          >
            {recentOrder ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-blue-ruin/15 bg-blue-ruin/[0.04] px-4 py-3">
                    <span className="text-xs text-account-subtle">Placed</span>
                    <p className="mt-1 text-sm font-semibold text-blue-ruin">
                      {formatDate(recentOrder.processedAt)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-ruin/15 bg-blue-ruin/[0.04] px-4 py-3">
                    <span className="text-xs text-account-subtle">Total</span>
                    <p className="mt-1 text-sm font-semibold text-blue-ruin tabular-nums">
                      {formatMoney(
                        recentOrder.totalPrice.amount,
                        recentOrder.totalPrice.currencyCode
                      )}
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-ruin/15 bg-blue-ruin/[0.04] px-4 py-3">
                    <span className="text-xs text-account-subtle">Status</span>
                    <p className="mt-1 text-sm font-semibold text-blue-ruin">
                      {orderStatus?.replace(/_/g, ' ').toLowerCase() ??
                        'Processing'}
                    </p>
                  </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-blue-ruin/15 bg-blue-ruin/[0.04] p-4">
                <p className="text-sm text-account-muted max-w-md">
                  Your orders will show up here with totals, fulfillment status,
                  and tracking links after checkout.
                </p>
                <CardActionLink href="/shop">Shop now</CardActionLink>
              </div>
            )}
          </AccountCard>

          <section
            className="rounded-xl border border-blue-ruin/20 bg-sugar-milk text-blue-ruin overflow-hidden"
            aria-labelledby="quick-actions"
          >
            <div className="px-5 md:px-6 py-4 border-b border-blue-ruin/15">
              <h2
                id="quick-actions"
                className="font-bomstad-display text-xl md:text-2xl leading-tight text-blue-ruin"
              >
                Quick actions
              </h2>
            </div>
            <div className="divide-y divide-blue-ruin/15">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  prefetch={action.href.startsWith('/account')}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-5 md:px-6 py-4 transition-colors duration-200 hover:bg-blue-ruin/[0.06] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk cursor-pointer"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-ruin/20 bg-blue-ruin/[0.06] text-blue-ruin transition-transform duration-200 group-hover:-translate-y-0.5">
                    <HugeiconsIcon
                      icon={action.icon}
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bomstad-display text-base md:text-lg leading-tight text-blue-ruin">
                      {action.label}
                    </span>
                    <span className="block text-xs text-account-muted mt-0.5">
                      {action.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-blue-ruin transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5 md:gap-6">
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
              <div className="flex flex-col gap-3">
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
                Subscribe to favorites and manage renewal timing here.
              </p>
            )}
          </AccountCard>

          <AccountCard
            icon={MapPinIcon}
            eyebrow="Default address"
            title={
              customer?.defaultAddress
                ? `${customer.defaultAddress.firstName ?? ''} ${customer.defaultAddress.lastName ?? ''}`.trim() ||
                  fullName ||
                  'Default address'
                : 'No address yet'
            }
            action={
              <CardActionLink href="/account/addresses">Manage</CardActionLink>
            }
          >
            {customer?.defaultAddress ? (
              <AddressBlock
                address={customer.defaultAddress}
                showName={false}
              />
            ) : (
              <p className="text-sm text-account-muted">
                Add a shipping address now so the next checkout is faster.
              </p>
            )}
          </AccountCard>
        </aside>
      </div>
    </>
  );
}
