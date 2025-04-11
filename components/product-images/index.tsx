'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ImageAsset } from 'sanity';

import { Img } from '@/components/utility/img';

export interface ProductImagesProps {
  images: ImageAsset[];
}

export function ProductImages({ images }: ProductImagesProps) {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="flex flex-col-reverse items-center tablet:items-start tablet:grid grid-cols-12 gap-5">
      <div
        className={cn(
          'col-span-2 flex flex-row tablet:flex-col justify-center tablet:justify-start gap-2'
        )}
      >
        {images.map((item, i) => {
          return (
            <div
              className={cn(
                'w-full aspect-square rounded-xl p-3 cursor-pointer',
                {
                  'border border-tertiary': currentItem === i
                }
              )}
              key={i}
              onClick={() => setCurrentItem(i)}
            >
              <Img
                className="object-contain"
                src={item.url}
                height={1000}
                width={1000}
                alt="Product Visual"
                priority
              />
            </div>
          );
        })}
      </div>
      <div className="col-span-10">
        <div className="w-full aspect-square border border-tertiary rounded-xl p-16">
          <AnimatePresence mode="popLayout">
            <motion.div
              className="w-full h-full"
              key={currentItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut'
              }}
            >
              <Img
                className="object-contain"
                src={images[currentItem].url}
                height={1000}
                width={1000}
                alt="Product Visual"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
