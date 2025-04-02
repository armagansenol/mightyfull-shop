import 'styles/global.scss';
import 'styles/tailwind-initial.css';

import { CartProvider } from '@/components/providers/cart';
import { ReactQueryProvider } from '@/components/providers/react-query';
import { Toaster } from '@/components/ui/sonner';

import { cartService } from '@/lib/shopify';
import { cookies } from 'next/headers';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get('cartId')?.value;
  const cartPromise = cartService.get(cartId);

  return (
    <html lang="en">
      <head>
        <meta name="oke:subscriber_id" content={process.env.OKENDO_USER_ID} />
        <script
          async
          src="https://cdn-static.okendo.io/reviews-widget-plus/js/okendo-reviews.js"
        ></script>
      </head>
      <body className={`antialiased`}>
        <ReactQueryProvider>
          <CartProvider cartPromise={cartPromise}>
            {children}
            <Toaster position="bottom-left" />
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
