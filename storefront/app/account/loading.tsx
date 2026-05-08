import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function AccountOverviewLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="42%" description />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        <SkeletonCard titleWidth="50%" lines={3} />
        <SkeletonCard titleWidth="40%" lines={2} />
        <SkeletonCard
          className="md:col-span-2"
          titleWidth="35%"
          lines={4}
        />
      </div>
    </>
  );
}
