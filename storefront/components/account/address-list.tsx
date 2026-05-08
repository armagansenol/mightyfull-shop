'use client';

import { Loader2, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  deleteAddress,
  setDefaultAddress
} from '@/app/account/addresses/actions';
import { AccountEmptyState } from '@/components/account/account-empty-state';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
        toast.success('Default address updated');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result.ok) {
        toast.success('Address deleted');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((addr) => {
        const isDefault = addr.id === defaultId;
        return (
          <Card
            key={addr.id}
            className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <CardTitle className="font-bomstad-display text-lg md:text-xl text-blue-ruin leading-tight">
                {addr.firstName} {addr.lastName}
              </CardTitle>
              {isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-ruin text-sugar-milk shrink-0">
                  Default
                </span>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <address className="not-italic flex flex-col gap-0.5 text-sm">
                {addr.address1 && <span>{addr.address1}</span>}
                {addr.address2 && <span>{addr.address2}</span>}
                <span>
                  {[addr.city, addr.zoneCode, addr.zip]
                    .filter(Boolean)
                    .join(', ')}
                </span>
                {addr.territoryCode && <span>{addr.territoryCode}</span>}
                {addr.phoneNumber && (
                  <span className="text-blue-ruin/80 mt-1">
                    {addr.phoneNumber}
                  </span>
                )}
              </address>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="link"
                  colorTheme="naked-blue-ruin"
                  hoverAnimation={false}
                  className="h-9 w-auto underline px-2"
                >
                  <Link
                    href={`/account/addresses/${encodeURIComponent(addr.id)}/edit`}
                    prefetch={false}
                  >
                    Edit
                  </Link>
                </Button>
                {!isDefault && (
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    colorTheme="naked-blue-ruin"
                    hoverAnimation={false}
                    disabled={isPending}
                    onClick={() => handleSetDefault(addr.id)}
                    className="h-9 w-auto underline px-2"
                  >
                    Set as default
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      colorTheme="naked-blue-ruin"
                      hoverAnimation={false}
                      disabled={isPending || isDefault}
                      className="h-9 w-auto underline px-2 ml-auto"
                    >
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
              </div>
              {isDefault && (
                <p className="text-xs text-blue-ruin/60">
                  To delete the default address, set a different one as default
                  first.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
