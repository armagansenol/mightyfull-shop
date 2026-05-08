import {
  SkeletonCard,
  SkeletonHeader
} from '@/components/account/account-skeleton';

export default function ProfileLoading() {
  return (
    <>
      <SkeletonHeader titleWidth="22%" />
      <SkeletonCard titleWidth="30%" lines={5} />
    </>
  );
}
