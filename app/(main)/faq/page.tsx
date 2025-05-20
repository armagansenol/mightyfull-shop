import { FaqList } from '@/components/faq-list';
import { Wrapper } from '@/components/wrapper';
import { sanityFetch } from '@/lib/sanity/client';
import { FAQ_QUERY } from '@/lib/sanity/faq';
import { FAQ } from '@/types';

export default async function Page() {
  const faq = await sanityFetch<FAQ[]>({
    query: FAQ_QUERY,
    tags: ['faq']
  });

  return (
    <Wrapper className="space-y-14 remaining-height">
      <section className="container mx-auto px-4 pt-20 flex flex-col items-center">
        <h1 className="font-bomstad-display text-5xl font-black mb-8 text-blue-ruin text-center">
          FAQ
        </h1>
        <p className="font-poppins text-lg font-normal mb-4 text-blue-ruin text-center">
          Quick and clear answers to the most frequently asked questions are
          here!
        </p>
      </section>
      <section className="container px-0 lg:px-24 xl:px-48 pb-48">
        <FaqList faq={faq} />
      </section>
    </Wrapper>
  );
}
