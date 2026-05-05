import Image from 'next/image';
import { CustomizedPortableText } from '@/components/customized-portable-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type { SanityProductPage } from '@/lib/sanity/types';
import { cn } from '@/lib/utils';

interface ProductSpecsProps {
  className?: string;
  specs: SanityProductPage['productSpecifications'];
}

export function ProductSpecs({ specs, className }: ProductSpecsProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-12 gap-5', className)}>
      <Accordion
        className={cn(
          'col-span-12 md:col-span-10 md:col-start-3',
          '[&>div]:border-b [&>div]:border-neutral-200 border-opacity-10 [&>div:last-child]:border-b-0'
        )}
        type="multiple"
      >
        {specs.map((item) => (
          <AccordionItem value={item.id} key={item.id}>
            <AccordionTrigger
              className={cn(
                'flex items-center justify-between py-10 w-full',
                'font-bomstad-display font-black text-primary text-3xl md:text-4xl'
              )}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-10">
              {item.image ? (
                <div className="relative w-full max-w-xs">
                  <Image
                    src={item.image}
                    alt={`${item.title} panel`}
                    width={400}
                    height={600}
                    className="object-contain w-full h-auto"
                  />
                </div>
              ) : item.description ? (
                <CustomizedPortableText
                  wrapperClassName="prose font-poppins font-normal text-primary text-sm text-left"
                  content={item.description}
                />
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
