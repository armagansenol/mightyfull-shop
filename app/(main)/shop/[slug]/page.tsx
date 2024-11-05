import s from "./productPage.module.scss"

import cx from "clsx"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion"
import { PortableText } from "@portabletext/react"
import { AnimatedCard } from "components/animated-card"
import { CustomerReviews } from "components/customer-reviews"
import { Purchase } from "components/purchase"
import { ThemeUpdater } from "components/theme-updater"
import { Link } from "components/utility/link"
import { PRODUCT_PAGE_QUERY } from "lib/queries/sanity/productPage"
import { sanityClient } from "lib/sanity/client"
import { SanityProductPage } from "lib/sanity/types"
import { AnimatedCardProps } from "types"
import Images from "./components/images"
import FollowUs from "components/follow-us/FollowUs"
import { LAYOUT_QUERY } from "lib/queries/sanity/layout"
import { LayoutQueryResponse } from "types/layout"
import { getProductReviews } from "lib/queries/okendo"
import { ANIMATED_CARDS_QUERY } from "@/lib/queries/sanity/animatedCards"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function Product({ params }: ProductPageProps) {
  const { slug } = params
  const product = await sanityClient.fetch<SanityProductPage>(PRODUCT_PAGE_QUERY, { slug })
  console.log("product", product)

  const cards = await sanityClient.fetch<AnimatedCardProps[]>(ANIMATED_CARDS_QUERY)
  const layout = await sanityClient.fetch<LayoutQueryResponse>(LAYOUT_QUERY)

  const filtered = cards.filter((it) => {
    console.log("it", it.product.shopifySlug)
    console.log("p", product)

    return it.product.shopifySlug !== product.slug
  })
  console.log("cards", cards)

  const reviews = await getProductReviews("8519377223832")
  console.log("reviews", reviews.data)

  // const mockFollowUsData = {
  //   socialMedia: [
  //     {
  //       icon: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45", // Example icon URL from Unsplash
  //       url: "https://facebook.com/yourprofile",
  //     },
  //     {
  //       icon: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", // Example icon URL from Unsplash
  //       url: "https://twitter.com/yourprofile",
  //     },
  //     {
  //       icon: "https://images.unsplash.com/photo-1496347646636-ea47f7d6a5d8", // Example icon URL from Unsplash
  //       url: "https://instagram.com/yourprofile",
  //     },
  //   ],
  //   images: [
  //     "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
  //     "https://images.unsplash.com/photo-1532009324734-20a7a5813719",
  //     "https://images.unsplash.com/photo-1524429656589-6633a470097c",
  //     "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
  //     "https://images.unsplash.com/photo-1532009324734-20a7a5813719",
  //     "https://images.unsplash.com/photo-1524429656589-6633a470097c",
  //     "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
  //     "https://images.unsplash.com/photo-1532009324734-20a7a5813719",
  //     "https://images.unsplash.com/photo-1524429656589-6633a470097c",
  //   ],
  // }

  return (
    <>
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
            <Purchase />
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
