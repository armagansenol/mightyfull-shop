'use client';

import { PencilEdit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { updateSubscriptionShippingAddress } from '@/app/account/subscriptions/actions';
import type { SubscriptionShippingAddressInput } from '@/app/account/subscriptions/constants';
import {
  AddressForm,
  type AddressFormResult
} from '@/components/account/address-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

interface SubscriptionAddressDialogProps {
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
}

export function SubscriptionAddressDialog({
  contractId,
  defaultValues
}: SubscriptionAddressDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    address: SubscriptionShippingAddressInput
  ): Promise<AddressFormResult> => {
    const result = await updateSubscriptionShippingAddress(contractId, address);
    if (result.ok) return { ok: true };
    return { ok: false, error: result.error };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Edit shipping address"
          className="text-blue-ruin/60 hover:text-blue-ruin transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 rounded cursor-pointer"
        >
          <HugeiconsIcon
            icon={PencilEdit01Icon}
            size={15}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit delivery address</DialogTitle>
          <DialogDescription>
            Update where this subscription ships. The new address must be
            shippable.
          </DialogDescription>
        </DialogHeader>
        {/* Re-mount the form whenever the dialog opens so it resets to the
            current defaultValues even if the user opens, edits, cancels,
            then reopens. */}
        {open && (
          <AddressForm
            mode="edit"
            defaultValues={defaultValues}
            showDefaultToggle={false}
            submitLabel="Save address"
            customSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
