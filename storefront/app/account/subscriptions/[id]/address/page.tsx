import { ArrowLeft01Icon, MapPinIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { notFound, redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { PageHeader } from '@/components/account/page-header';
import { SubscriptionAddressFormClient } from '@/components/account/subscription-address-form-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const SUBSCRIPTION_ADDRESS_QUERY = `
  query SubscriptionAddress($idQuery: String!) {
    customer {
      subscriptionContracts(first: 1, query: $idQuery) {
        nodes {
          id
          status
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

interface AddressData {
  customer: {
    subscriptionContracts: {
      nodes: Array<{
        id: string;
        status: string;
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
      }>;
    };
  } | null;
}

export default async function SubscriptionAddressEditPage({
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
  const backHref = `/account/subscriptions/${encodedId}`;

  let data: AddressData | null = null;
  let error: string | null = null;
  try {
    data = await customerQuery<AddressData>({
      query: SUBSCRIPTION_ADDRESS_QUERY,
      variables: { idQuery: `id:${numericId}` }
    });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect(
        `/account/login?return_to=${encodeURIComponent(`${backHref}/address`)}`
      );
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load address';
    }
  }

  const contract = data?.customer?.subscriptionContracts.nodes[0] ?? null;

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Delivery address" title="Edit delivery address" />
        <Card className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900">
          <CardHeader>
            <CardTitle className="font-bomstad-display text-xl leading-tight">
              Couldn’t load this address
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

  if (!contract) notFound();

  return (
    <>
      <div className="flex flex-col gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-ruin/80 hover:text-blue-ruin transition-colors w-fit cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk rounded"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>Back to subscription</span>
        </Link>
        <PageHeader
          eyebrow="Delivery address"
          title="Edit delivery address"
          description="Update where this subscription ships."
        />
      </div>

      <AccountCard
        icon={MapPinIcon}
        eyebrow="Ships to"
        title="Recipient and address"
      >
        <SubscriptionAddressFormClient
          contractId={contract.id}
          defaultValues={{
            firstName: contract.deliveryAddress?.firstName ?? '',
            lastName: contract.deliveryAddress?.lastName ?? '',
            address1: contract.deliveryAddress?.address1 ?? '',
            address2: contract.deliveryAddress?.address2 ?? '',
            city: contract.deliveryAddress?.city ?? '',
            zoneCode: contract.deliveryAddress?.zoneCode ?? '',
            zip: contract.deliveryAddress?.zip ?? '',
            territoryCode: contract.deliveryAddress?.territoryCode ?? 'US',
            phoneNumber: contract.deliveryAddress?.phoneNumber ?? ''
          }}
          backHref={backHref}
        />
      </AccountCard>
    </>
  );
}
