import s from './out-of-stock.module.scss';

import { subscribeToBackInStock } from '@/lib/klaviyo/actions';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { IconClose } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Img } from '@/components/utility/img';

export interface OutOfStockProps {
  variantId: string;
  revalidationPath?: string;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

type FormValues = z.infer<typeof formSchema>;

export function OutOfStock({ variantId, revalidationPath }: OutOfStockProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  async function handleBackInStockSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await subscribeToBackInStock(values.email, variantId, revalidationPath);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch">
      <div
        className={cn(
          s['out-of-stock'],
          'flex justify-center tablet:justify-start mb-10 tablet:mb-20 py-2'
        )}
      >
        OUT OF STOCK
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex gap-4" size="sm">
            <BellRing />
            <span>NOTIFY ME WHEN BACK IN STOCK</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={cn(s['notify-me-content'])}>
          <DialogClose
            className={cn(
              s['close-button'],
              'flex items-center justify-center cursor-pointer z-10'
            )}
          >
            <IconClose fill="var(--cherry-blush)" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="grid grid-cols-12">
            <div className="col-span-7 p-8">
              <DialogTitle className={s.title}>
                Notify me when back in stock
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-[var(--nova-pink)]">
                {isSuccess ? (
                  <p className="text-green-600 py-4">
                    Thanks! We&apos;ll notify you when this product is back in
                    stock.
                  </p>
                ) : (
                  <>
                    <p className={s.description}>
                      We will notify you when the product is back in stock.
                    </p>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleBackInStockSubmit)}
                        className="flex flex-col gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className={cn(s.input)}
                                  placeholder="EMAIL ADDRESS"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <button
                          className={cn(
                            s.submitButton,
                            'inline-flex items-center justify-center'
                          )}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'NOTIFY ME'
                          )}
                        </button>
                      </form>
                    </Form>
                  </>
                )}
              </DialogDescription>
            </div>
            <div className="col-span-5">
              <Img
                className="object-cover"
                src="/img/lady.jpg"
                alt="Out of stock"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
