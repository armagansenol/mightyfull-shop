import { cn } from '@/lib/utils';

const baseShimmer = 'rounded bg-blue-ruin/10 animate-pulse';

export function SkeletonLine({
  className,
  width
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={cn('h-4', baseShimmer, className)}
      style={width ? { width } : undefined}
      aria-hidden="true"
    />
  );
}

export function SkeletonHeading({
  className,
  width = '40%'
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={cn('h-10 md:h-12', baseShimmer, className)}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({
  className,
  titleWidth = '40%',
  lines = 3
}: {
  className?: string;
  titleWidth?: string;
  lines?: number;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk p-6',
        className
      )}
      aria-hidden="true"
    >
      <SkeletonLine className="h-6 mb-4" width={titleWidth} />
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={`${Math.max(40, 100 - i * 15)}%`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHeader({
  titleWidth = '50%',
  description
}: {
  titleWidth?: string;
  description?: boolean;
}) {
  return (
    <header className="flex flex-col gap-2" aria-hidden="true">
      <SkeletonHeading width={titleWidth} />
      {description && <SkeletonLine width="30%" className="h-3 mt-1" />}
    </header>
  );
}
