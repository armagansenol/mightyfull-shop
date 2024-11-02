import s from "./img.module.scss"

import cx from "clsx"
import type { ImageProps } from "next/image"
import NextImage from "next/image"

const Img = (props: ImageProps) => {
  const {
    alt,
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
  // const [loaded, setLoaded] = useState(false)

  return (
    <NextImage
      alt={alt}
      className={cx(s.img, className, {
        // [s.visible]: loaded,
      })}
      loading={loading}
      // onLoad={() => setLoaded(true)}
      priority={priority}
      src={src}
      style={{ ...style }}
      quality={quality}
      {...(blurDataURL && { blurDataURL })}
      {...(placeholder && { placeholder })}
      {...(height && { height })}
      {...(width && { width })}
    />
  )
}

export { Img }
