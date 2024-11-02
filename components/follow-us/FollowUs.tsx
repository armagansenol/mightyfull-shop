import s from "./follow-us.module.scss"

import cn from "clsx"

import { AutoScrollCarousel } from "components/auto-scroll-carousel"
import { socialIcons } from "components/icons"
import { Img } from "components/utility/img"
import { Link } from "components/utility/link"
import { SocialMedia } from "types"
import { SocialLink } from "types/layout"

export interface FollowUsProps {
  socialLinks: SocialLink[]
  images: string[]
}

export default function FollowUs(props: FollowUsProps) {
  return (
    <div className={s.followUs}>
      <div className="border-y-[5px] border-solid border-[var(--blue-ruin)] flex items-stretch mb-16">
        <p
          className={cn(
            s.title,
            "border-r-[5px] border-solid border-[var(--blue-ruin)] flex items-center justify-center"
          )}
        >
          Follow Us
        </p>
        <div className={cn(s.social, "col-span-9 flex items-center justify-start space-x-8")}>
          {props.socialLinks.map((item, i) => {
            return (
              <Link className={cn(s.iconC, "w-8 h-8")} href={item.url} key={i}>
                {socialIcons[item.platform as SocialMedia]}
              </Link>
            )
          })}
        </div>
      </div>
      <AutoScrollCarousel options={{ loop: true, dragFree: true }}>
        {props.images.map((source, i) => {
          return (
            <div className={s.imgC} key={i}>
              <Img className="object-cover" src={source} height={500} width={500} alt="Product Visual" />
            </div>
          )
        })}
      </AutoScrollCarousel>
    </div>
  )
}
