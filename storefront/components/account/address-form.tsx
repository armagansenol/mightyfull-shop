'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  type AddressInput,
  createAddress,
  updateAddress
} from '@/app/account/addresses/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const inputClasses =
  'h-10 border border-blue-ruin/30 rounded-md bg-white text-blue-ruin placeholder:text-blue-ruin/40 focus-visible:border-blue-ruin focus-visible:ring-2 focus-visible:ring-blue-ruin/20';

const COUNTRIES: Array<{ code: string; name: string }> = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' }
];

const addressSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  address1: z
    .string()
    .min(1, 'Address is required')
    .max(100, 'Address is too long'),
  address2: z.string().max(100).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(50),
  zoneCode: z.string().min(2, 'State / Province is required').max(10),
  zip: z.string().min(3, 'Postal code is required').max(20),
  territoryCode: z.string().length(2, 'Country is required'),
  phoneNumber: z.string().max(30).optional().or(z.literal('')),
  isDefault: z.boolean()
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  mode: 'create' | 'edit';
  addressId?: string;
  defaultValues?: Partial<Omit<AddressFormValues, 'isDefault'>>;
  isCurrentDefault?: boolean;
}

export function AddressForm({
  mode,
  addressId,
  defaultValues,
  isCurrentDefault = false
}: AddressFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      address1: defaultValues?.address1 ?? '',
      address2: defaultValues?.address2 ?? '',
      city: defaultValues?.city ?? '',
      zoneCode: defaultValues?.zoneCode ?? '',
      zip: defaultValues?.zip ?? '',
      territoryCode: defaultValues?.territoryCode ?? 'US',
      phoneNumber: defaultValues?.phoneNumber ?? '',
      isDefault: isCurrentDefault
    }
  });

  function onSubmit(values: AddressFormValues) {
    const { isDefault, ...rest } = values;
    const payload: AddressInput = {
      firstName: rest.firstName,
      lastName: rest.lastName,
      address1: rest.address1,
      address2: rest.address2 || undefined,
      city: rest.city,
      zoneCode: rest.zoneCode,
      zip: rest.zip,
      territoryCode: rest.territoryCode,
      phoneNumber: rest.phoneNumber || undefined
    };

    startTransition(async () => {
      const result =
        mode === 'create' || !addressId
          ? await createAddress(payload, isDefault)
          : await updateAddress(addressId, payload, isDefault);

      if (result.ok) {
        toast.success(mode === 'create' ? 'Address added' : 'Address updated');
        router.push('/account/addresses');
        router.refresh();
        return;
      }

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field in form.getValues()) {
            form.setError(field as keyof AddressFormValues, { message });
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
        className="flex flex-col gap-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Street address"
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">
                Apartment, suite, etc. (optional)
              </FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-ruin">City</FormLabel>
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
            name="zoneCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-ruin">
                  State / Province
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="e.g. CA, NY, ON"
                    className={inputClasses}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-ruin">Postal code</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="territoryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger
                    className="h-10 border border-blue-ruin/30 rounded-md bg-white text-blue-ruin focus:border-blue-ruin focus:ring-2 focus:ring-blue-ruin/20"
                  >
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-ruin">
                Phone (optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="+1 555 0100"
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  disabled={isPending || isCurrentDefault}
                />
              </FormControl>
              <FormLabel className="text-blue-ruin font-normal !mt-0">
                Use as my default address
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            colorTheme="blue-ruin"
            size="sm"
            padding="fat"
            hoverAnimation={false}
            disabled={isPending}
            className="h-10 min-w-[160px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'create' ? (
              'Add address'
            ) : (
              'Save changes'
            )}
          </Button>
          <Button
            type="button"
            colorTheme="naked-blue-ruin"
            size="sm"
            padding="fat"
            hoverAnimation={false}
            disabled={isPending}
            onClick={() => router.push('/account/addresses')}
            className="h-10"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
