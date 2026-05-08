import { MapPinIcon } from '@hugeicons/core-free-icons';
import { redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { AddressForm } from '@/components/account/address-form';
import { PageHeader } from '@/components/account/page-header';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

export default async function NewAddressPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  return (
    <>
      <PageHeader
        eyebrow="Addresses"
        title="New address"
        description="Add a shipping destination. We’ll save it for next time."
      />
      <AccountCard
        icon={MapPinIcon}
        eyebrow="Address details"
        title="Where to ship"
      >
        <AddressForm mode="create" />
      </AccountCard>
    </>
  );
}
