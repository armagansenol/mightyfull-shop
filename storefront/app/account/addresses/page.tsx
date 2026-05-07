import { redirect } from 'next/navigation';
import { AddressList } from '@/components/account/address-list';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const ADDRESSES_QUERY = `
  query AccountAddresses {
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

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let data: AddressesData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<AddressesData>({ query: ADDRESSES_QUERY });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load addresses';
    }
  }

  const addresses = data?.customer?.addresses.nodes ?? [];
  const defaultId = data?.customer?.defaultAddress?.id ?? null;

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h1 className="font-bomstad-display text-3xl md:text-5xl font-bold text-blue-ruin">
          Addresses
        </h1>
        <Button
          asChild
          colorTheme="blue-ruin"
          size="sm"
          padding="fat"
          hoverAnimation={false}
          className="h-10 self-start md:self-auto"
        >
          <Link href="/account/addresses/new">Add new address</Link>
        </Button>
      </header>

      {error && (
        <pre className="text-sm whitespace-pre-wrap text-red-700">{error}</pre>
      )}

      <AddressList addresses={addresses} defaultId={defaultId} />
    </>
  );
}
