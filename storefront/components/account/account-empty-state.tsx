import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface AccountEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function AccountEmptyState({
  icon: Icon,
  title,
  description,
  action
}: AccountEmptyStateProps) {
  return (
    <div className="py-10 md:py-14 flex flex-col items-center text-center gap-5">
      <div className="rounded-full bg-blue-ruin/10 p-4">
        <Icon
          className="w-8 h-8 text-blue-ruin"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="font-bomstad-display text-xl md:text-2xl font-bold text-blue-ruin tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-sm text-blue-ruin/80">{description}</p>
      </div>
      {action}
    </div>
  );
}
