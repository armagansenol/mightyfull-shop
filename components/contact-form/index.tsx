'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { type Control, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const getFormSchema = () =>
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    surname: z.string().min(1, { message: 'Surname is required' }),
    email: z.email({ message: 'Invalid email address' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    message: z.string().min(1, { message: 'Message is required' })
  });

type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

const commonInputStyles =
  'bg-transparent border border-blue-ruin rounded-lg px-0 transition-colors duration-300 ease-in-out px-4 py-6 placeholder:text-blue-ruin placeholder:font-bold text-blue-ruin font-medium focus:placeholder:opacity-30 placeholder:transition-opacity duration-300 ease-in-out';

interface FormInputProps {
  name: keyof FormValues;
  control: Control<FormValues>;
  placeholder: string;
  type?: string;
  className?: string;
}

const FormInput = ({
  name,
  control,
  placeholder,
  type = 'text',
  className
}: FormInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormControl>
          <Input
            placeholder={placeholder}
            type={type}
            {...field}
            value={field.value ?? ''}
            className={`${commonInputStyles}`}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export function ContactForm() {
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          setMessage({
            type: 'error',
            text: result.message || 'Failed to submit form'
          });
          throw new Error(result.message || 'Failed to submit form');
        }

        setMessage({ type: 'success', text: result.message });
        return result;
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      form.reset({
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: ''
      });

      form.clearErrors();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    },
    onError: () => {
      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <FormInput
            className="col-span-6"
            control={form.control}
            name="name"
            placeholder="NAME"
          />
          <FormInput
            className="col-span-6"
            control={form.control}
            name="surname"
            placeholder="SURNAME"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <FormInput
            className="col-span-6"
            control={form.control}
            name="email"
            type="email"
            placeholder="EMAIL"
          />
          <FormInput
            className="col-span-6"
            control={form.control}
            name="phone"
            type="tel"
            placeholder="PHONE NUMBER"
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormControl>
                <Textarea
                  {...field}
                  className={`${commonInputStyles} py-3 min-h-[200px]`}
                  placeholder="MESSAGE"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-48 font-bomstad-display text-2xl h-11"
          colorTheme="blue-ruin"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Sending...' : 'SEND'}
        </Button>
      </form>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-center py-6 my-4  ${message.type === 'success' ? 'text-green-400' : 'text-red'}`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}
