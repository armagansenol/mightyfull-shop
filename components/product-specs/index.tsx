import { cn } from '@/lib/utils';
import { CustomizedPortableText } from '@/components/customized-portable-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { SanityProductPage } from '@/lib/sanity/types';

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
          'col-span-12 tablet:col-span-10 tablet:col-start-3',
          '[&>div]:border-b [&>div]:border-neutral-200 border-opacity-10 [&>div:last-child]:border-b-0'
        )}
        type="multiple"
      >
        {specs.map((item) => (
          <AccordionItem value={item.id} key={item.id}>
            <AccordionTrigger
              className={cn(
                'flex items-center justify-between py-10 w-full',
                'font-bomstad-display font-black text-primary text-4xl'
              )}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-10">
              <CustomizedPortableText
                wrapperClassName="prose font-poppins font-normal text-primary text-sm"
                content={item.description}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
