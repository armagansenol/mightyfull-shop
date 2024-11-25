import s from "./productPage.module.scss"

import { sanityFetch } from "@/lib/sanity/client"
import { MoneyV2 } from "@shopify/hydrogen-react/storefront-api-types"
import cn from "clsx"
import { BellRing } from "lucide-react"

import { getShopifyProductByHandle } from "@/app/actions/shopify"
import { CustomizedPortableText } from "@/components/customized-portable-text"
import { FollowUs } from "@/components/follow-us"
import { IconCloud } from "@/components/icons"
import { ProductHighlightCarousel } from "@/components/product-highlight-carousel"
import { Purchase } from "@/components/purchase"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/constants"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"
import { AnimatedCard } from "components/animated-card"
import { CustomerReviews } from "components/customer-reviews"
import { ThemeUpdater } from "components/theme-updater"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion"
import { Link } from "components/utility/link"
import { getProductReviews } from "lib/queries/okendo"
import { LAYOUT_QUERY } from "lib/queries/sanity/layout"
import { PRODUCT_PAGE_QUERY } from "lib/queries/sanity/productPage"
import { SanityProductPage } from "lib/sanity/types"
import { AnimatedCardProps } from "types"
import { LayoutQueryResponse } from "types/layout"
import Images from "./components/images"
// import { AddToCart } from "@/components/cart-next-commerce/add-to-cart"
// import { addItem } from "@/components/cart-next-commerce/actions"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function Product({ params }: ProductPageProps) {
  const sanityProduct = await sanityFetch<SanityProductPage>({
    query: PRODUCT_PAGE_QUERY,
    tags: ["productPage"],
    qParams: { slug: params.slug },
  })
  const layout = await sanityFetch<LayoutQueryResponse>({ query: LAYOUT_QUERY, tags: ["layout"] })
  const animatedCards = await sanityFetch<AnimatedCardProps[]>({ query: ANIMATED_CARDS_QUERY, tags: ["animatedCards"] })
  const relatedProducts = animatedCards.filter((card) => {
    return card.product.shopifySlug !== sanityProduct.slug
  })
  const reviews = await getProductReviews("8519377223832")

  // const data = await getShopifyProductByHandle(sanityProduct.slug as string)
  // console.log("product page", data)

  const { data: shopifyProduct } = await getShopifyProductByHandle(sanityProduct.slug as string)

  // console.log("selling plans", shopifyProduct?.product.sellingPlanGroups.nodes)

  // async function add() {
  //   "use server"
  //   const a = await addItem(shopifyProduct?.product.variants.nodes[0].id)
  //   console.log("pppp", a)
  // }

  return (
    <>
      {/* {JSON.stringify(shopifyProduct?.product.sellingPlanGroups.nodes)} */}
      {sanityProduct.colorTheme && <ThemeUpdater {...sanityProduct.colorTheme} />}
      <div
        className={cn(s.productPage, "pt-7 tablet:pt-20 mb-20 tablet:mb-60")}
        style={
          {
            "--text-color": `${sanityProduct.colorTheme?.text}`,
            "--bg-color": `${sanityProduct.colorTheme?.background}`,
          } as React.CSSProperties
        }
      >
        <section
          className={cn(
            s.intro,
            "flex flex-col items-center tablet:grid grid-cols-12 gap-10 tablet:gap-20 tablet:items-start py-20"
          )}
        >
          <div className="col-span-6">
            <Images images={sanityProduct.images} />
          </div>
          <div className="col-span-6 w-full flex flex-col items-center tablet:items-start pr-0 tablet:pr-20">
            <h1 className={s.productTitle}>{sanityProduct.title}</h1>
            <p className={s.productPackInfo}>1 PACK (12 COOKIES)</p>
            <div className={s.productDescription}>
              <CustomizedPortableText content={sanityProduct.description} />
            </div>
            {shopifyProduct?.product.availableForSale ? (
              <>
                <Purchase
                  gid={shopifyProduct.product.id}
                  price={shopifyProduct?.product.variants.nodes[0].price as MoneyV2}
                  sp={shopifyProduct.product.sellingPlanGroups.nodes[0]}
                  product={shopifyProduct.product}
                />
                {/* <AddToCart test={add} /> */}
              </>
            ) : (
              <div className="w-full flex flex-col items-stretch">
                <div className={cn(s.outOfStock, "flex justify-center tablet:justify-start mb-10 tablet:mb-20 py-2")}>
                  OUT OF STOCK
                </div>
                <Button className="flex gap-4" variant="highlighted" size="sm">
                  <span>
                    <BellRing />
                  </span>
                  <span>NOTIFY ME WHEN BACK IN STOCK</span>
                </Button>
              </div>
            )}
          </div>
        </section>
        {sanityProduct.specs.length > 0 && (
          <section className={cn(s.specs, "flex flex-col items-center tablet:grid grid-cols-12 my-5 tablet:my-20")}>
            <div className="w-full tablet:col-span-5 tablet:col-start-2">
              <Accordion type="multiple" defaultValue={sanityProduct.specs.map((_, i) => `${i}`)}>
                {sanityProduct.specs.map((item, i) => {
                  return (
                    <AccordionItem value={`${i}`} className={s.spec} key={i}>
                      <AccordionTrigger className={cn(s.accordionTrigger, "flex items-center justify-between py-10")}>
                        <h3 className={s.title}>{item.title}</h3>
                      </AccordionTrigger>
                      <AccordionContent className="pb-10">
                        <div className={s.description}>
                          <CustomizedPortableText content={item.description} />
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
          <section className={cn(s.reviews, "my-12 tablet:my-32")}>
            <div className={s.cloudTop}>
              <IconCloud fill="var(--text-color)" />
            </div>
            <CustomerReviews reviews={reviews.data} />
            <div className={s.cloudBottom}>
              <IconCloud rotate={180} fill="var(--text-color)" />
            </div>
          </section>
        )}
        {relatedProducts.length > 0 && (
          <section className={cn(s.highlights, "py-10 tablet:py-20")}>
            {/* MOBILE */}
            <div className="block tablet:hidden">
              <ProductHighlightCarousel items={relatedProducts} options={{ loop: true }} />
            </div>
            {/* DESKTOP */}
            <div className="hidden tablet:block">
              <section className={cn(s.relatedProducts, "flex flex-col items-center")}>
                <h2>Impossible to Choose Just One!</h2>
                <p>Can’t decide? Try them all and discover your new favorite!</p>
                <div className="flex items-center justify-center gap-10 px-32">
                  {relatedProducts.map((item) => {
                    return (
                      <div className={cn(s.card, "flex flex-col gap-10 flex-shrink-0")} key={item.id}>
                        <Link href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                          <AnimatedCard {...item} />
                        </Link>
                        <div className="flex flex-row tablet:flex-col items-stretch gap-2">
                          <Button asChild variant="highlighted" size="sm" padding="slim">
                            <Link href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                              SHOP NOW
                            </Link>
                          </Button>
                          <Button variant="default" size="sm" padding="slim">
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          </section>
        )}
        <FollowUs socialLinks={layout.socialLinks} images={layout.imageCarousel.map((image) => image.url)} />
      </div>
    </>
  )
}
