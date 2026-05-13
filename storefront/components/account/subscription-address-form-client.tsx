'use client';

import { updateSubscriptionShippingAddress } from '@/app/account/subscriptions/actions';
import type { SubscriptionShippingAddressInput } from '@/app/account/subscriptions/constants';
import {
  AddressForm,
  type AddressFormResult
} from '@/components/account/address-form';

interface SubscriptionAddressFormClientProps {
  contractId: string;
  defaultValues: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    zoneCode: string;
    zip: string;
    territoryCode: string;
    phoneNumber: string;
  };
  backHref: string;
}

export function SubscriptionAddressFormClient({
  contractId,
  defaultValues,
  backHref
}: SubscriptionAddressFormClientProps) {
  const handleSubmit = async (
    address: SubscriptionShippingAddressInput
  ): Promise<AddressFormResult> => {
    const result = await updateSubscriptionShippingAddress(contractId, address);
    if (result.ok) return { ok: true };
    return { ok: false, error: result.error };
  };

  return (
    <AddressForm
      mode="edit"
      defaultValues={defaultValues}
      showDefaultToggle={false}
      submitLabel="Save address"
      cancelHref={backHref}
      successHref={backHref}
      customSubmit={handleSubmit}
    />
  );
}
