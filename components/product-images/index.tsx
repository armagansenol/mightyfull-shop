'use client';

import s from './product-images.module.scss';

import cx from 'clsx';
import { useState } from 'react';
import { ImageAsset } from 'sanity';
import { AnimatePresence, motion } from 'motion/react';

import { Img } from '@/components/utility/img';

export interface ProductImagesProps {
  images: ImageAsset[];
}

export function ProductImages({ images }: ProductImagesProps) {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="flex flex-col-reverse items-center tablet:items-start tablet:grid grid-cols-12 gap-5">
      <div
        className={cx(
          s.images,
          'col-span-2 flex flex-row tablet:flex-col justify-center tablet:justify-start gap-2'
        )}
      >
        {images.map((item, i) => {
          return (
            <div
              className={cx(s.imgC, 'cursor-pointer', {
                [s.active]: currentItem === i
              })}
              key={i}
              onClick={() => setCurrentItem(i)}
            >
              <Img
                className="object-contain"
                src={item.url}
                height={500}
                width={500}
                alt="Product Visual"
                priority
              />
            </div>
          );
        })}
      </div>
      <div className="col-span-10">
        <div className={s.mainImgC}>
          <AnimatePresence mode="popLayout">
            <motion.div
              className={s.mainImg}
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
