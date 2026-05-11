'use client';

import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Edit02Icon,
  MapPinIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loader2, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  deleteAddress,
  setDefaultAddress
} from '@/app/account/addresses/actions';
import { AccountCard } from '@/components/account/account-card';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { AddressBlock } from '@/components/account/address-block';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Link } from '@/components/utility/link';

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

interface AddressListProps {
  addresses: AddressNode[];
  defaultId: string | null;
}

export function AddressList({ addresses, defaultId }: AddressListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (addresses.length === 0) {
    return (
      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardContent>
          <AccountEmptyState
            icon={MapPin}
            title="No saved addresses"
            description="Save an address now and checkout will be one tap on your next order."
            action={
              <Button
                asChild
                colorTheme="blue-ruin"
                size="sm"
                padding="fat"
                hoverAnimation={false}
                className="h-10"
              >
                <Link href="/account/addresses/new">Add an address</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      const result = await setDefaultAddress(id);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  const defaultAddress = addresses.find((a) => a.id === defaultId) ?? null;
  const otherAddresses = addresses.filter((a) => a.id !== defaultId);

  const renderCard = (addr: AddressNode, isDefault: boolean) => {
    const fullName =
      `${addr.firstName ?? ''} ${addr.lastName ?? ''}`.trim() || 'Address';
    return (
      <AccountCard
        key={addr.id}
        icon={MapPinIcon}
        eyebrow={isDefault ? 'Default' : 'Address'}
        title={fullName}
        action={
          isDefault && (
            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full bg-blue-ruin text-sugar-milk shrink-0">
              Default
            </span>
          )
        }
        footer={
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                size="sm"
                colorTheme="inverted-blue-ruin"
                padding="fat"
                hoverAnimation={false}
                className="h-9 w-auto inline-flex items-center gap-1.5 text-sm"
              >
                <Link
                  href={`/account/addresses/${encodeURIComponent(addr.id)}/edit`}
                  prefetch={false}
                >
                  <HugeiconsIcon
                    icon={Edit02Icon}
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Edit
                </Link>
              </Button>
              {!isDefault && (
                <Button
                  type="button"
                  size="sm"
                  colorTheme="inverted-blue-ruin"
                  padding="fat"
                  hoverAnimation={false}
                  disabled={isPending}
                  onClick={() => handleSetDefault(addr.id)}
                  className="h-9 w-auto inline-flex items-center gap-1.5 text-sm"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Set as default
                </Button>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  colorTheme="naked-blue-ruin"
                  padding="fat"
                  hoverAnimation={false}
                  disabled={isPending || isDefault}
                  className="h-9 w-auto inline-flex items-center gap-1.5 text-sm font-medium text-blue-ruin/75 hover:text-blue-ruin"
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete address?</DialogTitle>
                  <DialogDescription>
                    This will remove this address from your account. It
                    can&apos;t be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      colorTheme="naked-blue-ruin"
                      size="sm"
                      padding="fat"
                      hoverAnimation={false}
                      className="h-10"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    colorTheme="blue-ruin"
                    size="sm"
                    padding="fat"
                    hoverAnimation={false}
                    disabled={isPending}
                    onClick={() => handleDelete(addr.id)}
                    className="h-10"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      >
        <AddressBlock address={addr} showName={false} />
        {isDefault && (
          <p className="text-xs text-blue-ruin/60 mt-1">
            Used at checkout unless you choose another. To delete, set a
            different address as default first.
          </p>
        )}
      </AccountCard>
    );
  };

  // No default set — show every address in one bucket
  if (!defaultAddress) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/70">
          Saved addresses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {otherAddresses.map((addr) => renderCard(addr, false))}
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/70">
          Default
        </h2>
        {renderCard(defaultAddress, true)}
      </section>

      {otherAddresses.length > 0 && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/70">
              Other addresses
            </h2>
            <span className="h-px flex-1 bg-blue-ruin/15" aria-hidden="true" />
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {otherAddresses.map((addr) => renderCard(addr, false))}
          </div>
        </section>
      )}
    </div>
  );
}
