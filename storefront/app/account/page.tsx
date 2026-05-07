import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';
import { cn } from '@/lib/utils';

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

const cardClasses =
  'rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin';

function CardActionLink({
  href,
  children,
  prefetch = false
}: {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
}) {
  return (
    <Button
      asChild
      variant="link"
      size="sm"
      colorTheme="naked-blue-ruin"
      hoverAnimation={false}
      className="h-auto p-0 underline text-sm font-medium"
    >
      <Link href={href} prefetch={prefetch}>
        {children}
      </Link>
    </Button>
  );
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

  const greetingName = customer?.firstName?.trim() || 'there';

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-bomstad-display text-3xl md:text-5xl font-bold text-blue-ruin">
          Hi, {greetingName}.
        </h1>
        <p className="text-sm text-blue-ruin/70">
          {customer?.emailAddress?.emailAddress}
        </p>
      </header>

      {error && (
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap text-red-700">
              {error}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className={cardClasses}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin">
              Recent order
            </CardTitle>
            <CardActionLink href="/account/orders">View all</CardActionLink>
          </CardHeader>
          <CardContent>
            {recentOrder ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">{recentOrder.name}</p>
                <CardDescription className="text-blue-ruin/70">
                  {formatDate(recentOrder.processedAt)} ·{' '}
                  {formatMoney(
                    recentOrder.totalPrice.amount,
                    recentOrder.totalPrice.currencyCode
                  )}
                </CardDescription>
                {recentOrder.fulfillmentStatus && (
                  <p className="text-xs uppercase tracking-wider mt-1">
                    {recentOrder.fulfillmentStatus.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <CardDescription className="text-blue-ruin/70">
                  No orders yet.
                </CardDescription>
                <CardActionLink href="/shop">Browse the shop</CardActionLink>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin">
              Subscriptions
            </CardTitle>
            <CardActionLink href="/account/subscriptions">Manage</CardActionLink>
          </CardHeader>
          <CardContent>
            {activeSubscriptions.length > 0 ? (
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">
                  {activeSubscriptions.length} active subscription
                  {activeSubscriptions.length === 1 ? '' : 's'}
                </p>
                {nextRenewal && (
                  <CardDescription className="text-blue-ruin/70">
                    Next renewal: {formatDate(nextRenewal)}
                  </CardDescription>
                )}
              </div>
            ) : (
              <CardDescription className="text-blue-ruin/70">
                No active subscriptions.
              </CardDescription>
            )}
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, 'md:col-span-2')}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin">
              Default address
            </CardTitle>
            <CardActionLink href="/account/addresses">Manage</CardActionLink>
          </CardHeader>
          <CardContent>
            {customer?.defaultAddress ? (
              <address className="not-italic flex flex-col gap-0.5 text-sm">
                <span className="font-semibold text-base">
                  {customer.defaultAddress.firstName}{' '}
                  {customer.defaultAddress.lastName}
                </span>
                {customer.defaultAddress.address1 && (
                  <span>{customer.defaultAddress.address1}</span>
                )}
                {customer.defaultAddress.address2 && (
                  <span>{customer.defaultAddress.address2}</span>
                )}
                <span>
                  {[
                    customer.defaultAddress.city,
                    customer.defaultAddress.zoneCode,
                    customer.defaultAddress.zip
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
                {customer.defaultAddress.territoryCode && (
                  <span>{customer.defaultAddress.territoryCode}</span>
                )}
                {customer.defaultAddress.phoneNumber && (
                  <span className="text-blue-ruin/70 mt-1">
                    {customer.defaultAddress.phoneNumber}
                  </span>
                )}
              </address>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <CardDescription className="text-blue-ruin/70">
                  No default address on file.
                </CardDescription>
                <CardActionLink href="/account/addresses/new">
                  Add one
                </CardActionLink>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
