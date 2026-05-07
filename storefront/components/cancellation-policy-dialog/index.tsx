'use client';

import { X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Link } from '@/components/utility/link';
import { cn } from '@/lib/utils';

interface CancellationPolicyDialogProps {
  trigger: React.ReactNode;
}

export function CancellationPolicyDialog({
  trigger
}: CancellationPolicyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          'max-w-lg w-[calc(100%-2rem)] rounded-2xl border-2 border-primary',
          'bg-background p-0 overflow-hidden'
        )}
      >
        <div className="relative p-6 sm:p-8">
          <DialogClose
            className={cn(
              'absolute right-4 top-4 rounded-full p-1.5',
              'text-primary hover:bg-primary/10 transition-colors',
              'flex items-center justify-center'
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </DialogClose>

          <DialogTitle className="font-bomstad-display font-bold text-primary text-2xl mb-6 pr-8">
            Cancellation Policy
          </DialogTitle>

          <div className="space-y-5 font-poppins text-primary">
            <section>
              <h3 className="font-semibold text-base mb-1.5">Subscriptions</h3>
              <p className="text-sm leading-relaxed text-primary/80">
                Subscriptions deliver at your selected frequency and are charged
                automatically on each renewal date until you cancel. You can
                cancel or pause anytime before your next renewal date from your{' '}
                <Link
                  href="/account/subscriptions"
                  prefetch={false}
                  className="underline"
                >
                  account dashboard
                </Link>
                .
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1.5">Pre-orders</h3>
              <p className="text-sm leading-relaxed text-primary/80">
                Pre-orders reserve a not-yet-in-stock product. Payment may be
                full or partial at checkout; any remaining balance is charged
                when your order is ready to ship. You can cancel any time before
                your order ships.
              </p>
            </section>

            <p className="text-xs text-primary/60 pt-2 border-t border-primary/20">
              For full details, see our{' '}
              <Link
                className="underline underline-offset-2 hover:text-primary transition-colors"
                href="/terms-of-service"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
