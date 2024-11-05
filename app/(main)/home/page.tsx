import s from "./home.module.scss"

import cx from "clsx"

import { FeatureHighlight } from "@/components/feature-highlight"
import { IconLeftArm, IconRightArm } from "@/components/icons"
import { Marquee } from "@/components/marquee"
import { Img } from "@/components/utility/img"
import { FEATURE_HIGHLIGHT_QUERY } from "@/lib/queries/sanity/featureHighlightQuery"
import { LAYOUT_QUERY } from "@/lib/queries/sanity/layout"
import { PRODUCT_HIGHLIGHT_QUERY } from "@/lib/queries/sanity/productHighlight"
import { sanityClient } from "@/lib/sanity/client"
import { FeatureHighlightQueryResult, ProductHighlightQueryResult } from "@/types"

export default async function HomePage() {
  // const homePageData = await sanityClient.fetch(HOME_PAGE_QUERY)
  // const sanityProducts = await sanityClient.fetch(PRODUCTS_QUERY)
  // const animatedCards = await sanityClient.fetch(ANIMATED_CARDS_QUERY)
  const settings = await sanityClient.fetch(LAYOUT_QUERY)
  const { productHighlight } = await sanityClient.fetch<ProductHighlightQueryResult>(PRODUCT_HIGHLIGHT_QUERY)
  const { featureHighlight } = await sanityClient.fetch<FeatureHighlightQueryResult>(FEATURE_HIGHLIGHT_QUERY)

  // console.log("homepage", homePageData)
  // console.log("sanity products", sanityProducts)
  // console.log("cards", animatedCards)
  console.log("settings", settings)
  console.log("ph", productHighlight)

  return (
    <>
      <section className={cx(s.intro, "flex flex-col items-stretch tablet:grid grid-cols-12")}>
        <div className={cx(s.text, "col-span-6 flex flex-col justify-center")}>
          <h1>
            This <span className={s.might}>might</span> be the <span className={s.best}>best cookie</span> ever!
          </h1>
          <p>Meet our mightyfull flavors.</p>
        </div>
        <div className="col-span-6">
          <div className={s.imgC}>
            <video className="w-full h-full" src="/video/heroi.mp4" autoPlay loop playsInline muted />
          </div>
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
      {/* {productHighlight.items.length > 0 && (
        <section className={cx(s.highlights, "py-20")}>
          <ProductHighlight items={productHighlight.items} />
        </section>
      )} */}
      {featureHighlight.items.length > 0 && (
        <div className="bg-[var(--blue-ruin)] p-5">
          <FeatureHighlight items={featureHighlight.items} />
        </div>
      )}
      <div className="bg-[var(--blue-ruin)] p-5">
        <section className={cx(s.theStory, "flex p-5 bg-[var(--sugar-milk)]")}>
          <div className={cx("flex flex-col items-center flex-1")}>
            <div className={cx(s.titleC, "flex items-center gap-3")}>
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
            <p className={cx(s.p, s.desc)}>
              At Mightyfull, we believe snacking should do more than just satisfy cravings—it should fuel your body,
              uplift your day, and taste incredible.
              <br />
              <br />
              Our journey began with a simple moment in the kitchen.
            </p>
          </div>
        </section>
      </div>
      <section className={cx(s.testimonials, "flex flex-col tablet:grid grid-cols-12")}>
        <div className="col-span-5">
          <div className={s.imgC}>
            <Img src="/img/lady.jpg" alt="Lady Eating a Cookie" height={1000} width={1000} />
          </div>
        </div>
        <div className="col-span-7 flex items-center justify-center">
          <div className={s.sliderC}>
            {/* <EmblaCarousel
                plugins={[Fade()]}
                slides={[
                  <div className={s.item} key={"s-1"}>
                    <p className={s.quote}>
                      I&apos;ve struggled to find a good snack that&apos;s actually healthy and tastes amazing. I&apos;m
                      obsessed!
                    </p>
                    <p className={s.author}>— Melissa G.</p>
                  </div>,
                  <div className={s.item} key={"s-2"}>
                    <p className={s.quote}>
                      These are the first cookies I&apos;ve found that are both healthy and delicious. I&apos;ve tried
                      everything, but nothing compares to these.
                    </p>
                    <p className={s.author}>— Jason K.</p>
                  </div>,
                  <div className={s.item} key={"s-3"}>
                    <p className={s.quote}>
                      Healthy, protein-rich, and tastes great—it&apos;s hard to find a snack that checks all three
                      boxes, but these cookies do it perfectly!
                    </p>
                    <p className={s.author}>— Courtney M.</p>
                  </div>,
                ]}
                options={{ loop: true }}
              /> */}
          </div>
        </div>
      </section>
    </>
  )
}
