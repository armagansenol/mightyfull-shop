'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  message: z.string().min(1, { message: 'Message is required' })
});

type FormValues = z.infer<typeof formSchema>;

const inputStyles =
  'bg-transparent border border-blue-ruin rounded-lg px-4 py-6 transition-colors duration-300 ease-in-out placeholder:text-blue-ruin/50 placeholder:font-bold text-blue-ruin font-medium focus:placeholder:opacity-20 placeholder:transition-opacity duration-300 ease-in-out';

export function ContactForm() {
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: result.message });
        throw new Error(result.message);
      }

      setMessage({ type: 'success', text: result.message });
      return result;
    },
    onSuccess: () => {
      form.reset();
      setTimeout(() => setMessage(null), 5000);
    },
    onError: () => {
      setTimeout(() => setMessage(null), 5000);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel className="font-poppins font-semibold text-sm text-blue-ruin">
                  NAME
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="NAME"
                    {...field}
                    className={inputStyles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel className="font-poppins font-semibold text-sm text-blue-ruin">
                  EMAIL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="EMAIL"
                    type="email"
                    {...field}
                    className={inputStyles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-poppins font-semibold text-sm text-blue-ruin">
                MESSAGE
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="MESSAGE"
                  className={`${inputStyles} py-3 min-h-[200px]`}
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
            className={`flex items-center py-6 my-4 font-poppins text-sm ${
              message.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}
