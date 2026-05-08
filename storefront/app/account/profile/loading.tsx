import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function ProfileLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="32%" description />
      <SkeletonCard titleWidth="30%" lines={5} />
      <SkeletonCard titleWidth="40%" lines={2} />
    </>
  );
}
