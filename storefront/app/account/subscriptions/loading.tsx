import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function SubscriptionsLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="38%" description />
      <div className="flex flex-col gap-4 md:gap-5">
        <SkeletonCard titleWidth="55%" lines={2} />
        <SkeletonCard titleWidth="60%" lines={2} />
      </div>
    </>
  );
}
