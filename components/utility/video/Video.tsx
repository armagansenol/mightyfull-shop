import { forwardRef } from "react"

import s from "./video.module.scss"

import cx from "clsx"

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string
  primaryVideoUrl: string
  primaryVideoType?: string
  secondaryVideoUrl?: string
  secondaryVideoType?: string
}

const Video = forwardRef<HTMLVideoElement, VideoProps>((props, ref) => {
  const {
    className,
    primaryVideoUrl,
    primaryVideoType = "video/mp4",
    secondaryVideoUrl,
    secondaryVideoType = "video/mp4",
    poster,
    ...rest
  } = props

  const primaryVideoSource = primaryVideoUrl && <source src={primaryVideoUrl} type={primaryVideoType} />
  const secondaryVideoSource = secondaryVideoUrl && <source src={secondaryVideoUrl} type={secondaryVideoType} />

  return (
    <video ref={ref} className={cx(s.video, className)} poster={poster} aria-hidden {...rest}>
      {primaryVideoSource}
      {secondaryVideoSource}
    </video>
  )
})

Video.displayName = "Video"

export default Video
