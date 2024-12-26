"use client"

import s from "./img.module.scss"
import cx from "clsx"
import type { ImageProps } from "next/image"
import NextImage from "next/image"
import { useState } from "react"

const Img = (props: ImageProps) => {
  const {
    alt,
    fill,
    sizes,
    className,
    height,
    loading = "eager",
    priority = false,
    src,
    style,
    quality = 100,
    width,
    placeholder,
    blurDataURL,
  } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <NextImage
      alt={alt}
      className={cx(s.img, className, {
        [s.loaded]: loaded,
      })}
      loading={loading}
      onLoad={() => setLoaded(true)}
      priority={priority}
      src={src}
      style={{
        ...style,
        transition: "opacity 300ms ease-in-out",
        opacity: loaded ? 1 : 0,
      }}
      quality={quality}
      {...(blurDataURL && { blurDataURL })}
      {...(placeholder && { placeholder })}
      {...(height && { height })}
      {...(width && { width })}
      {...(fill && { fill })}
      {...(sizes && { sizes })}
    />
  )
}

export { Img }
