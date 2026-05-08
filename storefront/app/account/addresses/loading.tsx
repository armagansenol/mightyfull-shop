import {
  SkeletonCard,
  SkeletonHeader,
  SkeletonLine
} from '@/components/account/account-skeleton';

export default function AddressesLoading() {
  return (
    <>
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SkeletonHeader titleWidth="35%" />
        <SkeletonLine className="h-10 w-40 rounded-lg self-start md:self-auto" />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard titleWidth="55%" lines={4} />
        <SkeletonCard titleWidth="45%" lines={4} />
      </div>
    </>
  );
}
