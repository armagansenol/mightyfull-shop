'use client';

import s from './product-images.module.scss';

import cx from 'clsx';
import { useState } from 'react';
import { ImageAsset } from 'sanity';

import { Img } from 'components/utility/img';

export interface ProductImagesProps {
  images: ImageAsset[];
}

export default function ProductImages(props: ProductImagesProps) {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="flex flex-col-reverse items-center tablet:items-start tablet:grid grid-cols-12 gap-5">
      <div
        className={cx(
          s.images,
          'col-span-2 flex flex-row tablet:flex-col justify-center tablet:justify-start gap-2',
        )}
      >
        {props.images.map((item, i) => {
          return (
            <div
              className={cx(s.imgC, 'cursor-pointer', {
                [s.active]: currentItem === i,
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
          <Img
            className="object-contain"
            src={props.images[currentItem].url}
            height={500}
            width={500}
            alt="Product Visual"
            priority
          />
        </div>
      </div>
    </div>
  );
}
