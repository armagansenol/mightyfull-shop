import { PortableText } from '@portabletext/react';

import { Container } from '@/components/container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type { FAQ } from '@/types';

interface ProductFaqProps {
  faqs?: FAQ[];
  title?: string;
  description?: string;
}

export function ProductFaq({
  faqs,
  title = 'Frequently Asked Questions',
  description
}: ProductFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Container
      as="section"
      className="px-4 md:px-16 py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 text-center mb-10 md:mb-14">
        <h2 className="font-bomstad-display text-4xl md:text-5xl font-black text-primary">
          {title}
        </h2>
        {description && (
          <p className="font-poppins text-base md:text-lg text-primary/80">
            {description}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion className="space-y-5" type="multiple">
          {faqs.map((item) => (
            <AccordionItem
              key={item._id}
              value={item._id}
              className="border border-primary rounded-xl"
            >
              <AccordionTrigger className="flex items-center justify-between p-4 lg:p-4 w-full [&>svg]:text-primary cursor-pointer">
                <h3 className="font-poppins text-sm lg:text-base font-semibold text-primary text-left">
                  {item.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent className="mx-4 lg:mx-4 px-0 lg:px-4 py-4 lg:py-8 border-t border-primary">
                <div className="prose text-sm lg:text-base text-primary font-normal">
                  <PortableText value={item.answer} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
}
