import {
  ArrowLeft01Icon,
  CalendarSetting02Icon,
  CreditCardIcon,
  MapPinIcon,
  Package01Icon,
  Settings02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { notFound, redirect } from 'next/navigation';
import { FREQUENCY_OPTIONS } from '@/app/account/subscriptions/constants';
import { AccountCard } from '@/components/account/account-card';
import { AddressBlock } from '@/components/account/address-block';
import { PageHeader } from '@/components/account/page-header';
import {
  detectPreorderLines,
  PreorderBanner
} from '@/components/account/preorder-banner';
import { SubscriptionActions } from '@/components/account/subscription-actions';
import { SubscriptionFrequencyForm } from '@/components/account/subscription-frequency-form';
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
          billingPolicy {
            interval
            intervalCount {
              count
            }
          }
          deliveryPolicy {
            interval
            intervalCount {
              count
            }
          }
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
          deliveryMethod {
            ... on SubscriptionDeliveryMethodShipping {
              address {
                firstName
                lastName
                address1
                address2
                city
                province
                provinceCode
                zip
                country
                countryCode
                phone
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

interface SubscriptionLine {
  title: string;
  quantity: number;
  variantTitle: string | null;
  currentPrice: MoneyV2 | null;
}

interface DeliveryFrequency {
  interval: 'WEEK' | 'MONTH' | 'YEAR' | 'DAY';
  intervalCount: { count: number };
}

interface SubscriptionMailingAddress {
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  zip: string | null;
  country: string | null;
  countryCode: string | null;
  phone: string | null;
}

interface SubscriptionContract {
  id: string;
  status: string;
  nextBillingDate: string | null;
  createdAt: string;
  billingPolicy: DeliveryFrequency | null;
  deliveryPolicy: DeliveryFrequency | null;
  lines: { nodes: SubscriptionLine[] };
  deliveryMethod: {
    address?: SubscriptionMailingAddress;
  } | null;
}

function toAddressBlock(
  address: SubscriptionMailingAddress | null | undefined
) {
  if (!address) return null;
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    zoneCode: address.provinceCode ?? address.province,
    zip: address.zip,
    territoryCode: address.countryCode ?? address.country,
    phoneNumber: address.phone
  };
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

      <PreorderBanner lines={detectPreorderLines(contract.lines.nodes)} />

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

      {(() => {
        const deliveryAddress = toAddressBlock(contract.deliveryMethod?.address);
        if (!deliveryAddress) return null;
        return (
          <AccountCard
            icon={MapPinIcon}
            eyebrow="Delivery address"
            title={
              `${deliveryAddress.firstName ?? ''} ${deliveryAddress.lastName ?? ''}`.trim() ||
              'Delivery address'
            }
            action={
              contract.status === 'ACTIVE' || contract.status === 'PAUSED' ? (
                <Link
                  href={`/account/subscriptions/${encodedId}/address`}
                  className="text-sm font-semibold text-blue-ruin underline-offset-4 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk rounded"
                >
                  Edit
                </Link>
              ) : null
            }
          >
            <AddressBlock address={deliveryAddress} showName={false} />
          </AccountCard>
        );
      })()}

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

      {contract.status === 'ACTIVE' && (
        <AccountCard
          icon={CalendarSetting02Icon}
          eyebrow="Frequency"
          title="How often it ships"
        >
          <SubscriptionFrequencyForm
            contractId={contract.id}
            currentValue={matchFrequencyValue(contract.deliveryPolicy)}
          />
        </AccountCard>
      )}

      {(contract.status === 'ACTIVE' || contract.status === 'PAUSED') &&
        shopHostedManageUrl(numericId) && (
          <AccountCard
            icon={CreditCardIcon}
            eyebrow="Payment method"
            title="Update card on file"
          >
            <p className="text-sm text-blue-ruin/85 max-w-prose">
              Payment details are handled securely by Shopify. Use the link
              below to update the card on file for this subscription.
            </p>
            <div>
              <a
                href={shopHostedManageUrl(numericId) ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-6 lg:px-8 xl:px-12 rounded-lg bg-blue-ruin text-sugar-milk font-bold text-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 transition-colors hover:bg-blue-ruin/90"
              >
                Update on Shopify
              </a>
            </div>
          </AccountCard>
        )}
    </>
  );
}

function shopHostedManageUrl(numericContractId: string): string | null {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
  if (!shopId) return null;
  return `https://shopify.com/${shopId}/account/subscriptions/${numericContractId}`;
}

function matchFrequencyValue(
  policy: DeliveryFrequency | null
): string | undefined {
  if (!policy) return undefined;
  return FREQUENCY_OPTIONS.find(
    (o) =>
      o.interval === policy.interval &&
      o.intervalCount === policy.intervalCount.count
  )?.value;
}
