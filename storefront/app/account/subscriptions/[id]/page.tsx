import {
  ArrowLeft01Icon,
  Package01Icon,
  PencilEdit01Icon,
  Settings02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { notFound, redirect } from 'next/navigation';
import { FREQUENCY_OPTIONS } from '@/app/account/subscriptions/constants';
import { AddressBlock } from '@/components/account/address-block';
import { PageHeader } from '@/components/account/page-header';
import {
  detectPreorderLines,
  PreorderBanner
} from '@/components/account/preorder-banner';
import { SubscriptionActions } from '@/components/account/subscription-actions';
import { SubscriptionFrequencyForm } from '@/components/account/subscription-frequency-form';
import { SubscriptionSkipButton } from '@/components/account/subscription-skip-button';
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
    month: 'long',
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

function shopHostedManageUrl(numericContractId: string): string | null {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
  const pageId = process.env.NEXT_PUBLIC_SHOPIFY_SUBSCRIPTION_PAGE_ID;
  if (!shopId || !pageId) return null;
  return `https://shopify.com/${shopId}/account/pages/${pageId}/subscriptions/${numericContractId}`;
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

function matchFrequencyLabel(
  policy: DeliveryFrequency | null
): string | undefined {
  if (!policy) return undefined;
  return FREQUENCY_OPTIONS.find(
    (o) =>
      o.interval === policy.interval &&
      o.intervalCount === policy.intervalCount.count
  )?.label;
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
              Couldn't load this subscription
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

  const isActive = contract.status === 'ACTIVE';
  const isPaused = contract.status === 'PAUSED';
  const isManageable = isActive || isPaused;
  const isTerminated =
    contract.status === 'CANCELLED' ||
    contract.status === 'EXPIRED' ||
    contract.status === 'FAILED';

  const summary = contract.lines.nodes
    .map((line) => `${line.title} × ${line.quantity}`)
    .join(', ');

  const deliveryAddress = toAddressBlock(contract.deliveryMethod?.address);
  const manageUrl = shopHostedManageUrl(numericId);
  const frequencyValue = matchFrequencyValue(contract.deliveryPolicy);
  const frequencyLabel = matchFrequencyLabel(contract.deliveryPolicy);

  return (
    <>
      {/* Header */}
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
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            eyebrow={`Started ${formatDate(contract.createdAt)}`}
            title={summary || 'Subscription'}
          />
          <div className="shrink-0 mt-1">
            <SubscriptionStatusBadge status={contract.status} />
          </div>
        </div>
      </div>

      <PreorderBanner lines={detectPreorderLines(contract.lines.nodes)} />

      {/* Next billing banner */}
      {contract.nextBillingDate && !isTerminated && (
        <div className="rounded-2xl bg-blue-ruin px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sugar-milk/60">
              Upcoming order
            </p>
            <p className="text-2xl font-bold text-sugar-milk mt-1">
              {formatDate(contract.nextBillingDate)}
            </p>
          </div>
          {isActive && <SubscriptionSkipButton contractId={contract.id} />}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: products + manage */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Products */}
          <div className="rounded-2xl border border-blue-ruin/10 bg-sugar-milk overflow-hidden">
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-blue-ruin/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-ruin/8 shrink-0">
                <HugeiconsIcon
                  icon={Package01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-blue-ruin"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
                Items
              </p>
            </div>
            <ul className="flex flex-col list-none p-0 px-5">
              {contract.lines.nodes.map((line, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-start py-4 border-b border-blue-ruin/10 last:border-b-0"
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
          </div>

          {/* Manage */}
          <div className="rounded-2xl border border-blue-ruin/10 bg-sugar-milk overflow-hidden">
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-blue-ruin/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-ruin/8 shrink-0">
                <HugeiconsIcon
                  icon={Settings02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-blue-ruin"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
                Manage
              </p>
            </div>
            <div className="px-5 py-4">
              <SubscriptionActions
                contractId={contract.id}
                status={contract.status}
              />
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2 rounded-2xl border border-blue-ruin/10 bg-sugar-milk overflow-hidden divide-y divide-blue-ruin/10 self-start">
          {/* Frequency */}
          <div className="px-5 py-4 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
              Frequency
            </p>
            {isActive ? (
              <SubscriptionFrequencyForm
                contractId={contract.id}
                currentValue={frequencyValue}
              />
            ) : (
              <p className="text-sm text-blue-ruin/85">
                {frequencyLabel ?? '—'}
              </p>
            )}
          </div>

          {/* Shipping address */}
          {deliveryAddress && (
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
                  Shipping address
                </p>
                {isManageable && (
                  <Link
                    href={`/account/subscriptions/${encodedId}/address`}
                    aria-label="Edit shipping address"
                    className="text-blue-ruin/60 hover:text-blue-ruin transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 rounded"
                  >
                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      size={15}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
              <AddressBlock address={deliveryAddress} showName />
            </div>
          )}

          {/* Payment method */}
          {isManageable && manageUrl && (
            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
                Payment method
              </p>
              <a
                href={manageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-ruin underline-offset-4 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 rounded w-fit"
              >
                Update on Shopify ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
