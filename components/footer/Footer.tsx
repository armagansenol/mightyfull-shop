import s from "./footer.module.scss"

import cx from "clsx"

import { socialIcons } from "components/icons"
import { Link } from "components/utility/link"
import { routes } from "lib/constants"
import { SocialMedia } from "types"
import { SocialLink } from "types/layout"

interface FooterProps {
  socialLinks: SocialLink[]
}

export default function Footer(props: FooterProps) {
  console.log("footer props", props.socialLinks)

  return (
    <footer className={cx(s.footer, "flex flex-col items-stretch justify-center")}>
      <div className="flex flex-col-reverse tablet:grid grid-cols-12">
        <div className={cx(s.actions, "col-span-6")}>
          <h6>
            Stay mighty. <br />
            Stay full.
          </h6>
          <p>Be the first to know about new products, brand uptades, exclusive events, and more!</p>
          <nav className="flex flex-col gap-10 tablet:gap-5">
            <Link href={`/${routes.about.path}`} className={s.navItem}>
              About Us
            </Link>
            <Link href="mailto:kamola@mightyfull.com" className={s.navItem}>
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
      <div
        className={cx(
          s.copyright,
          "flex flex-col items-center tablet:flex-row tablet:items-start justify-between gap-10 tablet:gap-20"
        )}
      >
        <span className={s.c}>©2024 Mightyfull</span>
        <div className={cx(s.social, "flex items-center space-x-4")}>
          {props.socialLinks.map((item, i) => {
            return (
              <Link className={"w-8 h-8"} href={item.url} key={i}>
                {socialIcons[item.platform as SocialMedia]}
              </Link>
            )
          })}
        </div>
        <span className="ml-0 tablet:ml-auto">
          Made by{" "}
          <Link className={cx(s.signature, "underline")} href="https://justdesignfx.com">
            JUST DESIGN FX
          </Link>
        </span>
      </div>
    </footer>
  )
}
