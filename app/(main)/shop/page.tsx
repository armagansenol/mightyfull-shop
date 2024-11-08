import s from "./shop.module.scss"

import cn from "clsx"

import { AnimatedCard } from "components/animated-card"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { sanityClient } from "lib/sanity/client"
import { AnimatedCardProps } from "types"
import { Link } from "@/components/utility/link"

export default async function Page() {
  const cards = await sanityClient.fetch<AnimatedCardProps[]>(ANIMATED_CARDS_QUERY)
  console.log("cards", cards)

  return (
    <section className={cn(s.shop, "flex flex-col items-center")}>
      <h2>Impossible to Choose Just One!</h2>
      <p>Can’t decide? Try them all and discover your new favorite!</p>
      <div className={cn(s.flavors, "grid grid-cols-4 gap-12")}>
        {cards.map((item) => {
          return (
            <div className={cn(s.card, "flex flex-col space-y-12")} key={item.id}>
              <Link href={`/shop/${item.product.shopifySlug}`} prefetch={true}>
                <AnimatedCard {...item} />
              </Link>
              <div className="flex flex-col items-stretch space-y-2">
                <Link
                  href={`/shop/${item.product.shopifySlug}`}
                  className={cn(s.button, "cursor-pointer flex items-center justify-center")}
                  prefetch={true}
                >
                  <span>SHOP NOW</span>
                </Link>
                <button className={cn(s.button, "cursor-pointer flex items-center justify-center")}>
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
