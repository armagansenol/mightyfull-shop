import s from "./shop.module.scss"

import cn from "clsx"

import { AnimatedCard } from "@/components/animated-card"
import { Link } from "@/components/utility/link"
import { routes } from "@/lib/constants"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { sanityFetch } from "@/lib/sanity/client"
import { AnimatedCardProps } from "types"

export default async function ShopPage() {
  const cards = await sanityFetch<AnimatedCardProps[]>({ query: ANIMATED_CARDS_QUERY, tags: ["animatedCards"] })
  console.log("cards", cards)

  return (
    <section className={cn(s.shop, "flex flex-col items-center")}>
      <h2>Impossible to Choose Just One!</h2>
      <p>Can’t decide? Try them all and discover your new favorite!</p>
      <div className="flex flex-col items-center tablet:grid grid-cols-4 gap-16 mt-10 tablet:mt-20 px-4 tablet:px-0">
        {cards.map((item) => {
          return (
            <div
              className={cn(s.card, "flex flex-col items-center tablet:items-stretch gap-5 tablet:gap-10")}
              key={item.id}
            >
              <Link href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                <AnimatedCard {...item} />
              </Link>
              <div className="flex flex-row tablet:flex-col items-stretch gap-2">
                <Link
                  href={`/${routes.shop.url}/${item.product.shopifySlug}`}
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
