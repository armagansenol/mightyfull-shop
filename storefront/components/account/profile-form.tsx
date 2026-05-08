'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { updateProfile } from '@/app/account/profile/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const inputClasses =
  'h-10 border border-blue-ruin/30 rounded-md bg-white text-blue-ruin placeholder:text-blue-ruin/40 focus-visible:border-blue-ruin focus-visible:ring-2 focus-visible:ring-blue-ruin/20';

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });

  function onSubmit(values: ProfileFormValues) {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result.ok) {
        toast.success('Profile updated');
        form.reset(values);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === 'firstName' || field === 'lastName') {
            form.setError(field, { message });
          }
        }
      }
      toast.error(result.error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-lg"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">First name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">Last name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-start">
          <Button
            type="submit"
            colorTheme="blue-ruin"
            size="sm"
            hoverAnimation={false}
            disabled={isPending || !form.formState.isDirty}
            className="h-10 min-w-[140px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
