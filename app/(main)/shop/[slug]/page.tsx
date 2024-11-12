import s from "./productPage.module.scss"

import cx from "clsx"

import { FollowUs } from "@/components/follow-us"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { getProduct } from "@/lib/shopify"
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

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function Product({ params }: ProductPageProps) {
  const { slug } = params

  const product = await sanityClient.fetch<SanityProductPage>(PRODUCT_PAGE_QUERY, { slug })
  const cards = await sanityClient.fetch<AnimatedCardProps[]>(ANIMATED_CARDS_QUERY)
  const layout = await sanityClient.fetch<LayoutQueryResponse>(LAYOUT_QUERY)
  const filtered = cards.filter((it) => {
    return it.product.shopifySlug !== product.slug
  })
  const reviews = await getProductReviews("8519377223832")
  const { data, errors } = await getProduct()

  console.log("shopifyProduct", data, errors)

  return (
    <>
      {JSON.stringify(data?.product.sellingPlanGroups)}
      {product.colorTheme && <ThemeUpdater {...product.colorTheme} />}
      <div
        className={cx(s.productPage, "pt-20")}
        style={
          {
            "--text-color": `${product.colorTheme?.text}`,
            "--bg-color": `${product.colorTheme?.background}`,
          } as React.CSSProperties
        }
      >
        <section className={cx(s.intro, "grid grid-cols-12 gap-0 tablet:gap-20 py-20")}>
          <div className="col-span-6">
            <Images images={product.images} />
          </div>
          <div className={cx(s.info, "col-span-6 pr-20")}>
            <h1 className={s.productTitle}>{product.title}</h1>
            <p className={s.productDescription}>{product.description}</p>
            {/* <Purchase
              subscriptionTitle={data?.product.sellingPlanGroups.nodes[0].name as string}
              subscriptionOptions={
                data?.product.sellingPlanGroups.nodes[0].sellingPlans.nodes.map((option) => option) as SellingPlan[]
              }
            /> */}
          </div>
        </section>

        {product.specs.length > 0 && (
          <section className={cx(s.specs, "grid grid-cols-12")}>
            <div className="col-span-5 col-start-2">
              <Accordion className="space-y-10" type="multiple" defaultValue={product.specs.map((_, i) => `${i}`)}>
                {product.specs.map((item, i) => {
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
          <section className={cx(s.products, "flex flex-col items-center")}>
            <h2>Impossible to Choose Just One!</h2>
            <p>Can’t decide? Try them all and discover your new favorite!</p>
            <div className={cx(s.flavors, `grid grid-cols-3 grid-rows-1 gap-12 px-48`)}>
              {filtered.map((item) => {
                return (
                  <div className={cx(s.card, "flex flex-col space-y-12")} key={item.id}>
                    <Link href={`/shop/${item.product.shopifySlug}`} prefetch={true}>
                      <AnimatedCard {...item} />
                    </Link>
                    <div className="flex flex-col items-stretch space-y-2">
                      <Link
                        href={`/shop/${item.product.shopifySlug}`}
                        className={cx(s.button, "cursor-pointer flex items-center justify-center")}
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
