import { redirect } from 'next/navigation';
import { AddressForm } from '@/components/account/address-form';
import { Card, CardContent } from '@/components/ui/card';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

export default async function NewAddressPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  return (
    <>
      <header>
        <h1 className="font-bomstad-display text-3xl md:text-5xl font-bold text-blue-ruin">
          New address
        </h1>
      </header>
      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardContent className="pt-6">
          <AddressForm mode="create" />
        </CardContent>
      </Card>
    </>
  );
}
