import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function SubscriptionsLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="35%" />
      <div className="flex flex-col gap-4">
        <SkeletonCard titleWidth="55%" lines={2} />
        <SkeletonCard titleWidth="60%" lines={2} />
      </div>
    </>
  );
}
