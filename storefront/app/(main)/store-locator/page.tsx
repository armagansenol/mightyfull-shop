import type { Metadata } from 'next';

import { Container } from '@/components/container';
import { StoreLocator } from '@/components/store-locator';
import { Wrapper } from '@/components/wrapper';
import { sanityFetch } from '@/lib/sanity/client';
import { STORE_QUERY } from '@/lib/sanity/store';
import type { Store } from '@/types';

export const metadata: Metadata = {
  title: 'Store Locator | MIGHTYFULL',
  description: 'Find Mightyfull cookies in stores near you.'
};

export default async function StoreLocatorPage() {
  const stores = await sanityFetch<Store[]>({
    query: STORE_QUERY,
    tags: ['store']
  });

  return (
    <Wrapper>
      <Container
        as="section"
        className="py-12 md:py-20 px-4 md:px-16 space-y-8 md:space-y-10 mb-32 md:mb-48"
      >
        <h1 className="text-4xl md:text-5xl font-black font-bomstad-display text-blue-ruin">
          Find Mightyfull in stores near you
        </h1>
        <StoreLocator stores={stores} />
      </Container>
    </Wrapper>
  );
}
