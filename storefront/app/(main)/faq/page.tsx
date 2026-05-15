import { Container } from '@/components/container';
import { FaqList } from '@/components/faq-list';
import { Wrapper } from '@/components/wrapper';
import { sanityFetch } from '@/lib/sanity/client';
import { FAQ_QUERY } from '@/lib/sanity/faq';
import type { FAQ } from '@/types';

export default async function Page() {
  const faq = await sanityFetch<FAQ[]>({
    query: FAQ_QUERY,
    tags: ['faq']
  });

  return (
    <Wrapper className="space-y-16 md:space-y-20 remaining-height">
      <Container
        as="section"
        className="px-4 pt-16 md:pt-24 flex flex-col items-center"
      >
        <h1 className="font-bomstad-display text-5xl font-black mb-6 text-blue-ruin text-center text-balance">
          FAQ
        </h1>
        <p className="font-poppins text-lg font-normal text-blue-ruin text-center text-pretty max-w-2xl">
          Quick and clear answers to the most frequently asked questions are
          here!
        </p>
      </Container>
      <Container as="section" className="px-0 lg:px-24 xl:px-48 pb-32 md:pb-48">
        <FaqList faq={faq} />
      </Container>
    </Wrapper>
  );
}
