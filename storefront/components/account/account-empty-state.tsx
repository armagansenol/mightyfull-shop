import type { ReactNode } from 'react';

interface AccountEmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function AccountEmptyState({ message, action }: AccountEmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <p className="text-sm text-blue-ruin/70">{message}</p>
      {action}
    </div>
  );
}
