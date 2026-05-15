import 'styles/global.css';

import { cookies } from 'next/headers';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { cache } from 'react';
import { Cart } from '@/components/cart/cart';
import { GSAP } from '@/components/gsap';
import { CartProvider } from '@/components/providers/cart';
import { ReactQueryProvider } from '@/components/providers/react-query';
import { WelcomePopup } from '@/components/welcome-popup';
import { LayoutDataProvider } from '@/context/layout-data';
import { sanityFetch } from '@/lib/sanity/client';
import { LAYOUT_QUERY } from '@/lib/sanity/layout';
import { cartService } from '@/lib/shopify';
import { getWelcomeEligibility } from '@/lib/welcome-eligibility';
import type { LayoutQueryResponse } from '@/types';

const bomstadDisplay = localFont({
  src: [
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Thin.woff2',
      weight: '100',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-ExtraLight.woff2',
      weight: '200',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Light.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Bold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-ExtraBold.woff2',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../public/fonts/bomstad-display/BomstadDisplay-Black.woff2',
      weight: '900',
      style: 'normal'
    }
  ],
  variable: '--font-bomstad-display',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial'
});

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

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
  const cartId = (await cookies()).get('cartId')?.value;
  const cartPromise = cartService.get(cartId);

  const [layoutData, welcomeEligibility] = await Promise.all([
    getLayoutData(),
    getWelcomeEligibility()
  ]);

  return (
    <html
      lang="en"
      className={`${bomstadDisplay.variable} ${poppins.variable}`}
    >
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
              <Cart />
              {welcomeEligibility.kind !== 'has-orders' && (
                <WelcomePopup
                  prefilledEmail={
                    welcomeEligibility.kind === 'eligible'
                      ? welcomeEligibility.email
                      : undefined
                  }
                />
              )}
              <GSAP />
            </LayoutDataProvider>
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
