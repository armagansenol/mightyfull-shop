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
      className={cn('h-10 md:h-12 rounded-lg', baseShimmer, className)}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton that mirrors the AccountCard structure: rounded surface with
 * an icon dot, an eyebrow, a title, and a body of lines.
 */
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
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk p-5 md:p-6',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className={cn('h-9 w-9 rounded-full shrink-0', baseShimmer)}
          aria-hidden="true"
        />
        <div className="flex-1 flex flex-col gap-1.5">
          <div
            className={cn('h-3 rounded', baseShimmer)}
            style={{ width: '20%' }}
          />
          <div
            className={cn('h-6 md:h-7 rounded-md', baseShimmer)}
            style={{ width: titleWidth }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} width={`${Math.max(40, 100 - i * 15)}%`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHeader({
  titleWidth = '50%',
  description,
  eyebrow = true
}: {
  titleWidth?: string;
  description?: boolean;
  eyebrow?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5" role="presentation">
      {eyebrow && <SkeletonLine width="14%" className="h-3" />}
      <SkeletonHeading width={titleWidth} />
      {description && <SkeletonLine width="36%" className="h-3 mt-1" />}
    </div>
  );
}

/**
 * Skeleton tile for the overview quick-actions row.
 */
export function SkeletonQuickAction({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk p-4 flex flex-col gap-2',
        className
      )}
      aria-hidden="true"
    >
      <div className={cn('h-9 w-9 rounded-full', baseShimmer)} />
      <div
        className={cn('h-5 rounded', baseShimmer)}
        style={{ width: '70%' }}
      />
      <div
        className={cn('h-3 rounded', baseShimmer)}
        style={{ width: '90%' }}
      />
    </div>
  );
}
