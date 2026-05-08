import {
  SkeletonCard,
  SkeletonHeader,
  SkeletonLine,
  SkeletonQuickAction
} from '@/components/account/account-skeleton';

export default function AccountOverviewLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="42%" description />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-start">
        <SkeletonCard className="lg:col-span-2" titleWidth="50%" lines={2} />
        <SkeletonCard titleWidth="55%" lines={2} />
        <SkeletonCard className="lg:col-span-3" titleWidth="45%" lines={4} />
      </div>
      <section className="flex flex-col gap-3" aria-hidden="true">
        <SkeletonLine width="12%" className="h-3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SkeletonQuickAction />
          <SkeletonQuickAction />
          <SkeletonQuickAction />
          <SkeletonQuickAction />
        </div>
      </section>
    </>
  );
}
