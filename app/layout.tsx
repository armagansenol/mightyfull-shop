import 'styles/global.scss';
import 'styles/tailwind-initial.css';

import { Providers } from '@/components/providers';
import { getCart } from '@/lib/shopify-test';
import { cookies } from 'next/headers';
import { CartProvider } from '@/components/cart-test/cart-context';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get('cartId')?.value;
  const cartPromise = getCart(cartId);

  return (
    <html lang="en">
      <div className="fixed bottom-0 left-0 bg-black text-lime-300 text-sm p-2 z-9999999999999999999999999 font-bold">
        CLIENT PREVIEW
      </div>
      {/* <head>
        <meta name="oke:subscriber_id" content={process.env.OKENDO_USER_ID} />
        <script
          async
          src="https://cdn-static.okendo.io/reviews-widget-plus/js/okendo-reviews.js"
        ></script>
      </head> */}
      <body className={`antialiased isolate`}>
        <CartProvider cartPromise={cartPromise}>
          <Providers>{children}</Providers>
        </CartProvider>
      </body>
    </html>
  );
}
