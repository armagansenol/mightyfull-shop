import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function OrdersLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="35%" description />
      <div className="flex flex-col gap-3 md:gap-4">
        <SkeletonCard titleWidth="20%" lines={2} />
        <SkeletonCard titleWidth="22%" lines={2} />
        <SkeletonCard titleWidth="18%" lines={2} />
      </div>
    </>
  );
}
