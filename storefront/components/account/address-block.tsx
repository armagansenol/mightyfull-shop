import { cn } from '@/lib/utils';

export interface AddressBlockData {
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

interface AddressBlockProps {
  address: AddressBlockData;
  showName?: boolean;
  className?: string;
}

export function AddressBlock({
  address,
  showName = true,
  className
}: AddressBlockProps) {
  const cityLine = [address.city, address.zoneCode, address.zip]
    .filter(Boolean)
    .join(', ');

  return (
    <address
      className={cn(
        'not-italic flex flex-col gap-0.5 text-sm leading-relaxed',
        className
      )}
    >
      {showName && (address.firstName || address.lastName) && (
        <span className="font-semibold text-base text-blue-ruin">
          {address.firstName} {address.lastName}
        </span>
      )}
      {address.address1 && <span>{address.address1}</span>}
      {address.address2 && <span>{address.address2}</span>}
      {cityLine && <span>{cityLine}</span>}
      {address.territoryCode && <span>{address.territoryCode}</span>}
      {address.phoneNumber && (
        <span className="text-blue-ruin/70 mt-1">{address.phoneNumber}</span>
      )}
    </address>
  );
}
