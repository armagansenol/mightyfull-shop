import { MapPinIcon } from '@hugeicons/core-free-icons';
import { notFound, redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AddressForm } from '@/components/account/address-form';
import { PageHeader } from '@/components/account/page-header';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const ADDRESSES_QUERY = `
  query EditAddress {
    customer {
      defaultAddress {
        id
      }
      addresses(first: 50) {
        nodes {
          id
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
`;

interface AddressNode {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zoneCode: string | null;
  zip: string | null;
  territoryCode: string | null;
  phoneNumber: string | null;
}

interface AddressesData {
  customer: {
    defaultAddress: { id: string } | null;
    addresses: { nodes: AddressNode[] };
  } | null;
}

export default async function EditAddressPage({
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

  let data: AddressesData | null = null;
  try {
    data = await customerQuery<AddressesData>({ query: ADDRESSES_QUERY });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect(
        `/account/login?return_to=${encodeURIComponent(`/account/addresses/${encodedId}/edit`)}`
      );
    }
    if (e instanceof CustomerAccountAPIError) {
      throw new Error(`${e.status ?? 'unknown'}: ${e.message}`);
    }
    throw e;
  }

  const address = data.customer?.addresses.nodes.find((a) => a.id === id);
  const isDefault = data.customer?.defaultAddress?.id === id;

  if (!address) {
    notFound();
  }

  const fullName =
    `${address.firstName ?? ''} ${address.lastName ?? ''}`.trim();

  return (
    <>
      <PageHeader
        eyebrow="Addresses"
        title="Edit address"
        description={
          fullName
            ? `Updating address for ${fullName}`
            : 'Update this saved address.'
        }
      />
      <AccountCard
        icon={MapPinIcon}
        eyebrow="Address details"
        title="Where to ship"
      >
        <AddressForm
          mode="edit"
          addressId={address.id}
          isCurrentDefault={isDefault}
          defaultValues={{
            firstName: address.firstName ?? '',
            lastName: address.lastName ?? '',
            address1: address.address1 ?? '',
            address2: address.address2 ?? '',
            city: address.city ?? '',
            zoneCode: address.zoneCode ?? '',
            zip: address.zip ?? '',
            territoryCode: address.territoryCode ?? 'US',
            phoneNumber: address.phoneNumber ?? ''
          }}
        />
      </AccountCard>
    </>
  );
}
