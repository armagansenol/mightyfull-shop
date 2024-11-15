import s from "./productPage.module.scss"

import { MoneyV2 } from "@shopify/hydrogen-react/storefront-api-types"
import cn from "clsx"

import { getShopifyProductByHandle } from "@/app/actions/shopify"
import { FollowUs } from "@/components/follow-us"
import { Purchase } from "@/components/purchase"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { PortableText } from "@portabletext/react"
import { AnimatedCard } from "components/animated-card"
import { CustomerReviews } from "components/customer-reviews"
import { ThemeUpdater } from "components/theme-updater"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion"
import { Link } from "components/utility/link"
import { getProductReviews } from "lib/queries/okendo"
import { LAYOUT_QUERY } from "lib/queries/sanity/layout"
import { PRODUCT_PAGE_QUERY } from "lib/queries/sanity/productPage"
import { sanityClient } from "lib/sanity/client"
import { SanityProductPage } from "lib/sanity/types"
import { AnimatedCardProps } from "types"
import { LayoutQueryResponse } from "types/layout"
import Images from "./components/images"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/constants"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function Product({ params }: ProductPageProps) {
  const { slug } = params

  const sanityProduct = await sanityClient.fetch<SanityProductPage>(PRODUCT_PAGE_QUERY, { slug })
  const layout = await sanityClient.fetch<LayoutQueryResponse>(LAYOUT_QUERY)
  const animatedCards = await sanityClient.fetch<AnimatedCardProps[]>(ANIMATED_CARDS_QUERY)
  const relatedProducts = animatedCards.filter((card) => {
    return card.product.shopifySlug !== sanityProduct.slug
  })
  const reviews = await getProductReviews("8519377223832")

  const data = await getShopifyProductByHandle(sanityProduct.slug as string)
  console.log("product page", data)

  const { data: shopifyProduct } = await getShopifyProductByHandle(sanityProduct.slug as string)

  console.log("selling plans", shopifyProduct?.product.sellingPlanGroups.nodes)

  return (
    <>
      {JSON.stringify(shopifyProduct?.product.sellingPlanGroups.nodes)}
      {sanityProduct.colorTheme && <ThemeUpdater {...sanityProduct.colorTheme} />}
      <div
        className={cn(s.productPage, "pt-20")}
        style={
          {
            "--text-color": `${sanityProduct.colorTheme?.text}`,
            "--bg-color": `${sanityProduct.colorTheme?.background}`,
          } as React.CSSProperties
        }
      >
        <section className={cn(s.intro, "grid grid-cols-12 gap-0 tablet:gap-20 py-20")}>
          <div className="col-span-6">
            <Images images={sanityProduct.images} />
          </div>
          <div className={cn(s.info, "col-span-6 pr-20")}>
            <h1 className={s.productTitle}>
              {sanityProduct.title} (
              {shopifyProduct?.product.variants.nodes[0].availableForSale ? "available" : "out of stock"}) (
              {shopifyProduct?.product.variants.nodes[0].quantityAvailable})
            </h1>
            <p className={s.productDescription}>{sanityProduct.description}</p>
            {shopifyProduct?.product.availableForSale ? (
              <Purchase
                gid={sanityProduct.gid as string}
                price={shopifyProduct?.product.variants.nodes[0].price as MoneyV2}
                sp={shopifyProduct.product.sellingPlanGroups.nodes[0]}
              />
            ) : (
              <div className={cn(s.outOfStock, "flex")}>
                <div>PRODUCT IS OUT OF STOCK</div>
                <Button variant="default" size="slim">
                  <Link href={`${routes.shop.url}`}>SEE OTHER PRODUCTS</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        {sanityProduct.specs.length > 0 && (
          <section className={cn(s.specs, "grid grid-cols-12")}>
            <div className="col-span-5 col-start-2">
              <Accordion
                className="space-y-10"
                type="multiple"
                defaultValue={sanityProduct.specs.map((_, i) => `${i}`)}
              >
                {sanityProduct.specs.map((item, i) => {
                  return (
                    <AccordionItem value={`${i}`} className={s.spec} key={i}>
                      <AccordionTrigger className="flex items-center justify-between py-10">
                        <h3 className={s.title}>{item.title}</h3>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className={s.description}>
                          <PortableText value={item.description} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </section>
        )}
        {reviews.data && (
          <section className={s.reviews}>
            <CustomerReviews reviews={reviews.data} />
          </section>
        )}
        <section className={s.relatedProducts}>
          <section className={cn(s.products, "flex flex-col items-center")}>
            <h2>Impossible to Choose Just One!</h2>
            <p>Can’t decide? Try them all and discover your new favorite!</p>
            <div className={cn(s.flavors, `grid grid-cols-3 grid-rows-1 gap-12 px-48`)}>
              {relatedProducts.map((item) => {
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
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </section>
        <section className="mb-40">
          <FollowUs socialLinks={layout.socialLinks} images={layout.imageCarousel.map((image) => image.url)} />
        </section>
      </div>
    </>
  )
}
