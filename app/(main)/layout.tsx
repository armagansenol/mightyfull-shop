import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { cache } from 'react';

import { Footer } from '@/components/footer';
import { sanityFetch } from '@/lib/sanity/client';
import { LAYOUT_QUERY } from '@/lib/sanity/layout';
import { LayoutQueryResponse } from '@/types/layout';

export const metadata: Metadata = {
  title: 'Mightyfull',
  description: 'This might be the best cookie ever!'
};

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const getLayoutData = cache(async (): Promise<LayoutQueryResponse> => {
  return await sanityFetch<LayoutQueryResponse>({
    query: LAYOUT_QUERY,
    tags: ['layout']
  });
});

export default async function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const layoutData = await getLayoutData();

  return (
    <div
      className={`flex min-h-screen flex-col items-stretch justify-between ${poppins.variable} overflow-hidden`}
    >
      <div className="mt-[var(--header-height)] overflow-hidden">
        {children}
      </div>
      <Footer socialLinks={layoutData.socialLinks} />
    </div>
  );
}
