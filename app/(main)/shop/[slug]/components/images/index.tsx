"use client"
import s from "./images.module.scss"

import cx from "clsx"
import { useState } from "react"
import { ImageAsset } from "sanity"

import { Img } from "components/utility/img"

export interface ImagesProps {
  images: ImageAsset[]
}

export default function Images(props: ImagesProps) {
  const [currentItem, setCurrentItem] = useState(0)

  return (
    <div className="grid grid-cols-12 gap-5">
      <div
        className={cx(s.images, "col-span-2 flex flex-row tablet:flex-col justify-center tablet:justify-start gap-2")}
      >
        {props.images.map((item, i) => {
          return (
            <div
              className={cx(s.imgC, "cursor-pointer", { [s.active]: currentItem === i })}
              key={i}
              onClick={() => setCurrentItem(i)}
            >
              <Img className="object-contain" src={item.url} height={500} width={500} alt="Product Visual" priority />
            </div>
          )
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
  )
}
