import s from "./home.module.scss"

import cx from "clsx"

import { IconLeftArm, IconProtein8, IconRightArm } from "components/icons"
import { Img } from "components/utility/img"
import { ANIMATED_CARDS_QUERY } from "lib/queries/sanity/animatedCards"
import { HOME_PAGE_QUERY } from "lib/queries/sanity/home"
import { LAYOUT_QUERY } from "lib/queries/sanity/layout"
import { PRODUCTS_QUERY } from "lib/queries/sanity/products"
import { sanityClient } from "lib/sanity/client"

export default async function HomePage() {
  const homePageData = await sanityClient.fetch(HOME_PAGE_QUERY)
  const sanityProducts = await sanityClient.fetch(PRODUCTS_QUERY)
  const animatedCards = await sanityClient.fetch(ANIMATED_CARDS_QUERY)
  const settings = await sanityClient.fetch(LAYOUT_QUERY)

  // console.log("homepage", homePageData)
  // console.log("sanity products", sanityProducts)
  // console.log("cards", animatedCards)
  console.log("settings", settings)

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
      <section className={s.products}>
        {/* {shopifyProducts.map((item) => {
            return (
              <Link
                href={`/products/${item.handle}`}
                prefetch={true}
                className="flex flex-col items-center"
                key={item.id}
              >
                <div className="w-52 h-52">
                  {item.images.map((img) => {
                    return <Image key={img.url} src={img.url} height={img.height} width={img.width} alt={img.altText} />
                  })}
                </div>
                <div>{item.title}</div>
              </Link>
            )
          })} */}
      </section>
      <section className={cx(s.pros, "flex p-5")}>
        <div className="flex flex-col items-center flex-1">
          <h2 className={s.heading}>What Makes Mightyfull Truly Mighty?</h2>
          <div className="flex flex-col tablet:flex-row items-center justify-center gap-20 tablet:gap-10 tablet:grid tablet:grid-cols-12">
            <div className="flex flex-col items-center justify-center gap-10 tablet:gap-20 tablet:col-span-4">
              <div className="flex flex-col items-center">
                <p className={cx(s.title, "-rotate-3")}>
                  Gluten-Free
                  <span className={s.bg}>
                    <Img alt="Background" src="/img/bg-text.svg" width={200} height={200} />
                  </span>
                </p>
                <p className={s.desc}>Baked for everyone—crafted to perfection, no gluten needed.</p>
              </div>
              <div className="flex flex-col items-center">
                <p className={cx(s.title, "rotate-3")}>
                  Dairy-Free
                  <span className={s.bg}>
                    <Img alt="Background" src="/img/bg-text.svg" width={200} height={200} />
                  </span>
                </p>
                <p className={s.desc}>Skip the dairy, dodge the bloat—snack smarter, feel better.</p>
              </div>
            </div>
            <div className={cx(s.imgC, "col-span-4")}>
              <Img src="/img/c-choco-chip.png" height={500} width={500} alt="Cookie" />
              <div className={s.stickerC}>
                <IconProtein8 />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-10 tablet:gap-20 tablet:col-span-4">
              <div className="flex flex-col items-center">
                <p className={cx(s.title, "-rotate-3")}>
                  Soy-Free
                  <span className={s.bg}>
                    <Img alt="Background" src="/img/bg-text.svg" width={200} height={200} />
                  </span>
                </p>
                <p className={s.desc}>Soy-long! We’ve moved on to better, cleaner snacking.</p>
              </div>
              <div className="flex flex-col items-center">
                <p className={cx(s.title, "rotate-3")}>
                  Whey-Free
                  <span className={s.bg}>
                    <Img alt="Background" src="/img/bg-text.svg" width={200} height={200} />
                  </span>
                </p>
                <p className={s.desc}>Whey out? More like way better! All the flavor, none of the hassle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={cx(s.theStory, "flex p-5")}>
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
        <div className={s.stickerC}>
          <Img className="object-contain" src="/img/c-pb-jelly-choco-chip.png" height={500} width={500} alt="Cookie" />
        </div>
      </section>
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
