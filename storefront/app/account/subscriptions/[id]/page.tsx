import {
  ArrowLeft01Icon,
  MapPinIcon,
  Package01Icon,
  Settings02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { notFound, redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AddressBlock } from '@/components/account/address-block';
import { PageHeader } from '@/components/account/page-header';
import { SubscriptionActions } from '@/components/account/subscription-actions';
import { SubscriptionStatusBadge } from '@/components/account/subscription-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <PageHeader eyebrow="Subscription" title="Subscription" />
        <Card className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl leading-tight">
              Couldn’t load this subscription
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

  if (!contract) {
    notFound();
  }

  const summary = contract.lines.nodes
    .map((line) => `${line.title} × ${line.quantity}`)
    .join(', ');

  return (
    <>
      <div className="flex flex-col gap-4">
        <Link
          href="/account/subscriptions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-ruin/80 hover:text-blue-ruin transition-colors w-fit cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk rounded"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>All subscriptions</span>
        </Link>
        <PageHeader
          eyebrow={`Started ${formatDate(contract.createdAt)}`}
          title={summary || 'Subscription'}
          description={
            contract.nextBillingDate
              ? `Next renewal on ${formatDate(contract.nextBillingDate)}`
              : 'No upcoming renewal'
          }
          action={<SubscriptionStatusBadge status={contract.status} />}
        />
      </div>

      <AccountCard icon={Package01Icon} eyebrow="Items" title="What ships">
        <ul className="flex flex-col list-none p-0">
          {contract.lines.nodes.map((line, idx) => (
            <li
              key={idx}
              className="flex justify-between items-start py-3 border-b border-blue-ruin/10 last:border-b-0 last:pb-0 first:pt-0"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-semibold text-blue-ruin">{line.title}</p>
                {line.variantTitle && (
                  <p className="text-sm font-medium text-blue-ruin/75">
                    {line.variantTitle}
                  </p>
                )}
                <p className="text-sm font-medium text-blue-ruin/75">
                  Qty {line.quantity}
                </p>
              </div>
              <p className="font-semibold tabular-nums shrink-0 text-blue-ruin">
                {formatMoney(line.currentPrice)}
              </p>
            </li>
          ))}
        </ul>
      </AccountCard>

      {contract.deliveryAddress && (
        <AccountCard
          icon={MapPinIcon}
          eyebrow="Delivery address"
          title={
            `${contract.deliveryAddress.firstName ?? ''} ${contract.deliveryAddress.lastName ?? ''}`.trim() ||
            'Delivery address'
          }
        >
          <AddressBlock address={contract.deliveryAddress} showName={false} />
        </AccountCard>
      )}

      <AccountCard
        icon={Settings02Icon}
        eyebrow="Manage"
        title="Pause, resume, or cancel"
      >
        <SubscriptionActions
          contractId={contract.id}
          status={contract.status}
        />
      </AccountCard>
    </>
  );
}
