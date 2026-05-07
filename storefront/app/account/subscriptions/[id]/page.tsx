import { notFound, redirect } from 'next/navigation';
import { SubscriptionActions } from '@/components/account/subscription-actions';
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

const SUBSCRIPTION_QUERY = `
  query AccountSubscription($idQuery: String!) {
    customer {
      subscriptionContracts(first: 1, query: $idQuery) {
        nodes {
          id
          status
          nextBillingDate
          createdAt
          lines(first: 50) {
            nodes {
              title
              quantity
              variantTitle
              currentPrice {
                amount
                currencyCode
              }
            }
          }
          deliveryAddress {
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
        }
      }
    }
  }
`;

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface SubscriptionLine {
  title: string;
  quantity: number;
  variantTitle: string | null;
  currentPrice: MoneyV2 | null;
}

interface SubscriptionContract {
  id: string;
  status: string;
  nextBillingDate: string | null;
  createdAt: string;
  lines: { nodes: SubscriptionLine[] };
  deliveryAddress: {
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
}

interface SubscriptionData {
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

function formatMoney(money: MoneyV2 | null): string {
  if (!money) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode
  }).format(Number.parseFloat(money.amount));
}

export default async function SubscriptionDetailPage({
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
  const numericId = id.split('/').pop() ?? id;

  let data: SubscriptionData | null = null;
  let error: string | null = null;
  try {
    data = await customerQuery<SubscriptionData>({
      query: SUBSCRIPTION_QUERY,
      variables: { idQuery: `id:${numericId}` }
    });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect(
        `/account/login?return_to=${encodeURIComponent(`/account/subscriptions/${encodedId}`)}`
      );
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load subscription';
    }
  }

  const contract = data?.customer?.subscriptionContracts.nodes[0] ?? null;

  if (error) {
    return (
      <>
        <header>
          <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin">
            Subscription
          </h1>
        </header>
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin">
              Couldn’t load this subscription
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

  if (!contract) {
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
          <Link href="/account/subscriptions">← All subscriptions</Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin">
              Subscription
            </h1>
            <p className="text-sm text-blue-ruin/80">
              Started {formatDate(contract.createdAt)}
              {contract.nextBillingDate &&
                ` · Next renewal ${formatDate(contract.nextBillingDate)}`}
            </p>
          </div>
          <SubscriptionStatusBadge status={contract.status} />
        </div>
      </header>

      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardHeader>
          <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin">
            Items
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {contract.lines.nodes.map((line, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start border-b border-blue-ruin/10 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-semibold">{line.title}</p>
                {line.variantTitle && (
                  <p className="text-sm text-blue-ruin/80">
                    {line.variantTitle}
                  </p>
                )}
                <p className="text-sm text-blue-ruin/80">Qty {line.quantity}</p>
              </div>
              <p className="font-semibold shrink-0">
                {formatMoney(line.currentPrice)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {contract.deliveryAddress && (
        <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl text-blue-ruin">
              Delivery address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <address className="not-italic flex flex-col gap-0.5 text-sm">
              <span className="font-semibold text-base">
                {contract.deliveryAddress.firstName}{' '}
                {contract.deliveryAddress.lastName}
              </span>
              {contract.deliveryAddress.address1 && (
                <span>{contract.deliveryAddress.address1}</span>
              )}
              {contract.deliveryAddress.address2 && (
                <span>{contract.deliveryAddress.address2}</span>
              )}
              <span>
                {[
                  contract.deliveryAddress.city,
                  contract.deliveryAddress.zoneCode,
                  contract.deliveryAddress.zip
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
              {contract.deliveryAddress.territoryCode && (
                <span>{contract.deliveryAddress.territoryCode}</span>
              )}
              {contract.deliveryAddress.phoneNumber && (
                <span className="text-blue-ruin/80 mt-1">
                  {contract.deliveryAddress.phoneNumber}
                </span>
              )}
            </address>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardHeader>
          <CardTitle className="font-bomstad-display text-xl text-blue-ruin">
            Manage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionActions
            contractId={contract.id}
            status={contract.status}
          />
        </CardContent>
      </Card>
    </>
  );
}
