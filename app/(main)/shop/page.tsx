import s from "./products.module.scss"

import cx from "clsx"
import Link from "next/link"

import { AnimatedCard } from "components/animated-card"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { sanityClient } from "lib/sanity/client"
import { AnimatedCardProps } from "types"

export default async function Products() {
  const cards = await sanityClient.fetch<AnimatedCardProps[]>(ANIMATED_CARDS_QUERY)
  console.log("cards", cards)

  return (
    <section className={cx(s.products, "flex flex-col items-center")}>
      <h2>Impossible to Choose Just One!</h2>
      <p>Can’t decide? Try them all and discover your new favorite!</p>
      <div className={cx(s.flavors, "grid grid-cols-4 gap-12")}>
        {cards.map((item) => {
          return (
            <div className={cx(s.card, "flex flex-col space-y-12")} key={item.id}>
              <Link href={`/shop/${item.product.shopifySlug}`}>
                <AnimatedCard
                  imgCookie={item.imgCookie.url}
                  imgPackage={item.imgPackage.url}
                  text={item.product.shopifyTitle}
                  textColor={item.product.colorTheme?.text.hex}
                  bgColor={item.product.colorTheme?.background.hex}
                />
              </Link>
              <div className="flex flex-col items-stretch space-y-2">
                <Link
                  href={`/shop/${item.product.shopifySlug}`}
                  className={cx(s.button, "cursor-pointer flex items-center justify-center")}
                >
                  <span>SHOP NOW</span>
                </Link>
                <button className={cx(s.button, "cursor-pointer flex items-center justify-center")}>
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
