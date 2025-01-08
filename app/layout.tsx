import 'styles/global.scss';
import 'styles/tailwind-initial.css';

import { CartProvider } from '@/components/cart-test/cart-context';
import { Providers } from '@/components/providers';
import { getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await cookies()).get('cartId')?.value;
  console.log('cartId', cartId);

  const cartPromise = getCart(cartId);
  // console.log('initial', initialCart);

  return (
    <html lang="en">
      {/* <head>
        <meta name="oke:subscriber_id" content={process.env.OKENDO_USER_ID} />
        <script
          async
          src="https://cdn-static.okendo.io/reviews-widget-plus/js/okendo-reviews.js"
        ></script>
      </head> */}
      <body className={`antialiased`}>
        <CartProvider cartPromise={cartPromise}>
          <Providers>{children}</Providers>
        </CartProvider>
      </body>
    </html>
  );
}
