import 'styles/global.scss';
import 'styles/tailwind-initial.css';

import { GSAP } from '@/components/gsap';
import { CartProvider } from '@/components/providers/cart';
import { ReactQueryProvider } from '@/components/providers/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LayoutDataProvider } from '@/context/layout-data';
import { sanityFetch } from '@/lib/sanity/client';
import { LAYOUT_QUERY } from '@/lib/sanity/layout';
import { cartService } from '@/lib/shopify';
import { LayoutQueryResponse } from '@/types';
import { cookies } from 'next/headers';
import { cache } from 'react';

const getLayoutData = cache(async (): Promise<LayoutQueryResponse> => {
  return await sanityFetch<LayoutQueryResponse>({
    query: LAYOUT_QUERY,
    tags: ['layout']
  });
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = cookies().get('cartId')?.value;
  const cartPromise = cartService.get(cartId);

  const layoutData = await getLayoutData();

  console.log('layoutData', layoutData);

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
            <LayoutDataProvider value={layoutData}>
              {children}
              <Toaster position="bottom-left" />
              <GSAP />
            </LayoutDataProvider>
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
