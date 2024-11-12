import s from "./home.module.scss"

import cn from "clsx"

import { FadeInOutCarousel } from "@/components/fade-in-out-carousel"
import { FeatureHighlight } from "@/components/feature-highlight"
import { IconCloud2, IconLeftArm, IconRightArm } from "@/components/icons"
import { Marquee } from "@/components/marquee"
import { PackageAnimation } from "@/components/package-animation"
import { Parallax } from "@/components/parallax"
import { ProductHighlight } from "@/components/product-highlight"
import { Button } from "@/components/ui/button"
import { Img } from "@/components/utility/img"
import { Link } from "@/components/utility/link"
import { ProductHighlightCarousel } from "@/components/product-highlight-carousel"

import { routes } from "@/lib/constants"
import { FEATURE_HIGHLIGHT_QUERY } from "@/lib/queries/sanity/featureHighlightQuery"
import { PRODUCT_HIGHLIGHT_QUERY } from "@/lib/queries/sanity/productHighlight"
import { TESTIMONIALS_QUERY } from "@/lib/queries/sanity/testimonials"
import { sanityClient } from "@/lib/sanity/client"

import { FeatureHighlightQueryResult, ProductHighlightQueryResult, Testimonial } from "@/types"

export default async function HomePage() {
  // const homePageData = await sanityClient.fetch(HOME_PAGE_QUERY)
  // const sanityProducts = await sanityClient.fetch(PRODUCTS_QUERY)
  // const animatedCards = await sanityClient.fetch(ANIMATED_CARDS_QUERY)
  // const settings = await sanityClient.fetch(LAYOUT_QUERY)
  const { productHighlight } = await sanityClient.fetch<ProductHighlightQueryResult>(PRODUCT_HIGHLIGHT_QUERY)
  const { featureHighlight } = await sanityClient.fetch<FeatureHighlightQueryResult>(FEATURE_HIGHLIGHT_QUERY)
  const testimonials = await sanityClient.fetch<Testimonial[]>(TESTIMONIALS_QUERY)

  // const test = await getProduct()
  // console.log("test", test.data.product.sellingPlanGroups)

  // console.log("homepage", homePageData)
  // console.log("sanity products", sanityProducts)
  // console.log("cards", animatedCards)
  // console.log("settings", settings)
  // console.log("ph", productHighlight)
  // console.log("fh", featureHighlight)
  // console.log("testimonials", testimonials)

  return (
    <>
      <section className={cn(s.intro, "flex flex-col items-stretch tablet:grid grid-cols-12")}>
        <div className={cn(s.text, "col-span-6 flex flex-col items-center tablet:items-start justify-center")}>
          <h1>
            This <span className={s.might}>might</span> be the <span className={s.best}>best cookie</span> ever!
          </h1>
          <p>Meet our mightyfull flavors.</p>
          <Button asChild>
            <Link href={routes.shop.url} prefetch>
              SHOP NOW
            </Link>
          </Button>
        </div>
        <div className="col-span-6">
          <div className={s.imgC}>
            <video className="w-full h-full" autoPlay loop playsInline muted>
              {/* <source src="/video/intro-test.webm" /> */}
              {/* <source src="/video/intro-test.mov" /> */}
            </video>
          </div>
        </div>
        <div className={s.cloud}>
          <IconCloud2 />
        </div>
      </section>
      <section className={s.marquee}>
        <Marquee duration={10} repeat={5}>
          <div className="flex items-center">
            <div className={s.marqueeItem}>PROTEIN PACKED COOKIES!</div>
            <div className={s.imgC}>
              <Img src="/img/c-pb-jelly-choco-chip.png" height={100} width={100} alt="Cookie" />
            </div>
            <div className={s.marqueeItem}>FEEL THE MIGHT, SAVOR THE FULLNESS!</div>
            <div className={s.imgC}>
              <Img src="/img/c-double-choco-chip.png" height={100} width={100} alt="Cookie" />
            </div>
          </div>
        </Marquee>
      </section>
      {productHighlight.items.length > 0 && (
        <section className={cn(s.highlights, "py-10 tablet:py-20")}>
          <div className="block tablet:hidden">
            <ProductHighlightCarousel items={productHighlight.items} options={{ loop: true }} />
          </div>
          <div className="hidden tablet:block">
            <ProductHighlight items={productHighlight.items} />
          </div>
        </section>
      )}
      {featureHighlight.items.length > 0 && (
        <div className="bg-[var(--blue-ruin)] p-2 tablet:p-5">
          <FeatureHighlight items={featureHighlight.items} />
        </div>
      )}
      <div className="relative bg-[var(--blue-ruin)] p-2 tablet:p-5 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-2 tablet:h-5 bg-[var(--blue-ruin)] z-50"></div>
        <section
          className={cn(s.theStory, "flex flex-col items-stretch p-5 pt-20 tablet:pt-60 bg-[var(--sugar-milk)]")}
        >
          <div className={cn("flex flex-col items-center flex-1")}>
            <div className={cn(s.titleC, "flex items-center gap-3")}>
              <div className={s.iconC}>
                <IconLeftArm />
              </div>
              <h1 className={s.title}>
                <span>The</span>
                <span>Mightyfull</span>
                <span>Story</span>
                <div className={s.bg}>
                  <div className={s.transform}>
                    <Img
                      className="object-contain"
                      src="/img/lightrays.png"
                      height={1000}
                      width={1000}
                      alt="Lightrays Background Image"
                    />
                  </div>
                </div>
              </h1>
              <div className={s.iconC}>
                <IconRightArm />
              </div>
            </div>
            <p className={cn(s.p, s.desc)}>
              At Mightyfull, we believe snacking should do more than just satisfy cravings—it should fuel your body,
              uplift your day, and taste incredible.
              <br />
              <br />
              Our journey began with a simple moment in the kitchen.
            </p>
            <Button variant="ghost" asChild>
              <Link href={routes.ourStory.url}>READ OUR STORY</Link>
            </Button>
          </div>
          <PackageAnimation />
          <div className={cn(s.cookie, s.cookie3)}>
            <Parallax>
              <Img
                alt="Cookie Crumb"
                className="object-contain -rotate-12"
                src={"/img/c3.png"}
                height={200}
                width={200}
              />
            </Parallax>
          </div>
        </section>
      </div>
      <section className={cn(s.testimonials, "flex flex-col-reverse tablet:grid grid-cols-12")}>
        <div className="col-span-5">
          <div className={s.imgC}>
            <Img className="object-cover" src="/img/lady.jpg" alt="Lady Eating a Cookie" height={1000} width={1000} />
          </div>
        </div>
        <div className="col-span-7 py-20 tablet:py-0 flex items-center justify-center">
          <div className={s.sliderC}>
            <FadeInOutCarousel options={{ loop: true }}>
              {testimonials.map((item) => {
                return (
                  <div className={cn(s.item, "flex flex-col items-center justify-center")} key={item._id}>
                    <div className={s.title}>{item.description}</div>
                    <div className={s.description}>{item.title}</div>
                  </div>
                )
              })}
            </FadeInOutCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
