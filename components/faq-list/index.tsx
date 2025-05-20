'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { PortableText } from '@portabletext/react';
import { FAQ } from '@/types';
import { AnimatePresence, motion } from 'motion/react';

interface FaqListProps {
  faq: FAQ[];
}

export function FaqList({ faq }: FaqListProps) {
  const categories = Array.from(
    new Map(faq.map((item: FAQ) => [item.category._id, item.category])).values()
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredFaq = selectedCategory
    ? faq.filter((item: FAQ) => item.category._id === selectedCategory)
    : faq;

  return (
    <>
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`font-poppins text-blue-ruin text-sm lg:text-base font-semibold px-3 py-1 rounded border border-lg border-blue-ruin transition-all duration-300 ${selectedCategory === null && 'bg-blue-ruin text-white'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`font-poppins text-blue-ruin text-sm lg:text-base font-semibold px-3 py-1 rounded border border-lg border-blue-ruin transition-all duration-300 ${selectedCategory === category._id && 'bg-blue-ruin text-white'}`}
          >
            {category.title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory || 'all'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Accordion className="space-y-5" type="multiple">
            {filteredFaq.map((item) => (
              <AccordionItem
                className="border border-lg border-blue-ruin rounded-xl"
                value={item._id}
                key={item._id}
              >
                <AccordionTrigger
                  className={
                    'flex items-center justify-between p-4 lg:p-4 w-full [&>svg]:text-blue-ruin cursor-pointer'
                  }
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
            ))}
          </Accordion>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
