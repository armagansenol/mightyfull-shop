import { sanityFetch } from '@/lib/sanity/client';
import { FAQ_QUERY } from '@/lib/sanity/faq';
import { FAQ } from '@/types';

import { PortableText } from '@portabletext/react';

export default async function FaqPage() {
  const faq = await sanityFetch<FAQ[]>({
    query: FAQ_QUERY,
    tags: ['faq']
  });

  console.log('faq', faq);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h1 className="text-6xl font-bold mb-8 text-blue-ruin text-center">
        FAQ
      </h1>
      {faq &&
        faq.length > 0 &&
        faq.map((item: FAQ) => (
          <div key={item._id} className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-blue-ruin">
              {item.question}
            </h2>
            <div className="prose">
              <PortableText value={item.answer} />
            </div>
          </div>
        ))}
    </div>
  );
}
