import cn from 'clsx';

import { Wrapper } from '@/components/wrapper';
import { sanityFetch } from '@/lib/sanity/client';
import { FAQ_QUERY } from '@/lib/sanity/faq';
import { FAQ } from '@/types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { PortableText } from '@portabletext/react';

export default async function FaqPage() {
  const faq = await sanityFetch<FAQ[]>({
    query: FAQ_QUERY,
    tags: ['faq']
  });

  return (
    <Wrapper headerWithPadding>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-6xl font-bold mb-8 text-blue-ruin text-center">
          FAQ
        </h1>
        <p className="font-poppins text-lg xl:text-xl font-normal mb-4 text-blue-ruin text-center">
          Quick and clear answers to the most frequently asked questions are
          here!
        </p>
        <section className="w-full px-0 lg:px-24 xl:px-48 py-8 lg:py-16 mb-0 lg:mb-20">
          <Accordion className="space-y-5" type="multiple">
            {faq.map((item, i) => {
              return (
                <AccordionItem
                  className="border border-lg border-blue-ruin rounded-xl"
                  value={item._id}
                  key={i}
                >
                  <AccordionTrigger
                    className={cn(
                      'flex items-center justify-between p-4 lg:p-4 w-full [&>svg]:text-blue-ruin'
                    )}
                  >
                    <h2 className="font-poppins text-sm lg:text-base font-semibold text-blue-ruin">
                      {item.question}
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="mx-4 lg:mx-4 px-0 lg:px-4 py-4 lg:py-8 border-t border-blue-ruin">
                    <div className="prose text-sm lg:text-base text-blue-ruin font-normal">
                      <PortableText value={item.answer} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </div>
    </Wrapper>
  );
}
