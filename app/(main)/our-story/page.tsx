import s from "./our-story.module.scss"

import cx from "clsx"

import { IconLeftArm, IconRightArm, IconStar } from "@/components/icons"
import { Img } from "@/components/utility/img"
import { Marquee } from "@/components/marquee"

export default function Page() {
  return (
    <>
      <section className={cx(s.intro, "flex flex-col items-stretch")}>
        <div className={cx("flex flex-col items-center")}>
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
            uplift your day, and taste incredible. Our journey began with a simple moment in the kitchen.
          </p>
        </div>
        <div className={cx(s.bottom, "flex flex-col items-center tablet:grid grid-cols-12 gap-5 tablet:gap-20")}>
          <div className="col-span-6">
            <div className={s.imgC}>
              <Img className="object-contain" src="/img/mom-n-son.png" height={1000} width={1000} alt="Mom and Son" />
            </div>
          </div>
          <div className={cx(s.p, s.textC, "col-span-6")}>
            <p>
              When my son casually said, <strong className="italic">“Mom, I need to bulk up for football!”</strong> I
              realized that ‘bulking up’ wasn’t about buying bigger clothes—it was about nourishing him properly.
              <br />
              <br />
              Frustrated by protein snacks that were tasteless or overly processed, I set out to create something
              better: a cookie that not only packs a nutritional punch but also tastes like a homemade treat.
            </p>
          </div>
        </div>
        <div className={cx(s.cookieC, "z-10")}>
          <Img className="object-contain" src="/img/c-pb-choco-oatie.png" height={500} width={500} alt="Cookie" />
        </div>
      </section>
      <section className={s.fullImgC}>
        <Img className="object-cover" src="/img/about.jpg" fill sizes="100vw" alt="Lady holding a cookie" />
      </section>
      <section className={s.differences}>
        <h2>The Mightyfull Difference</h2>
        <div className="flex flex-col items-center tablet:items-start tablet:grid grid-cols-2 gap-5 tablet:gap-28">
          <div>
            <p className={s.p}>
              Mightyfull Cookies are all about flavor, without the fuss. They’re gluten-free, dairy-free, whey-free, and
              soy-free, so you can snack with confidence. These chewy, indulgent cookies deliver everything you crave—no
              artificial junk, just pure deliciousness.
            </p>
          </div>
          <div>
            <p className={s.p}>
              With just the right touch of sweetness and a satisfying bite, each cookie is packed with enough protein to
              keep you fueled all day. They’re perfect for anyone who wants to snack smarter without sacrificing taste.
            </p>
          </div>
        </div>
      </section>
      <section className={cx(s.mission, "flex flex-col-reverse items-stretch tablet:grid grid-cols-12")}>
        <div
          className={cx(
            s.text,
            "col-span-6 border:none tablet:border-r-[5px] tablet:border-r-solid tablet:border-r-[var(--nova-pink)]"
          )}
        >
          <h2>Our Mission</h2>
          <p>
            We’re on a mission to make healthy snacking easy, delicious, and accessible for everyone.
            <br />
            <br />
            Whether you’re hitting the gym, powering through a busy workday, or simply craving something sweet,
            Mightyfull’s got you. We believe that when you feel good about what you’re eating, you feel ready to take on
            anything.
          </p>
        </div>
        <div className="col-span-6">
          <div className={s.imgC}>
            <Img
              className="object-contain"
              src="/img/lady-2.jpg"
              height={1000}
              width={1000}
              alt="Lady eating a cookie"
            />
          </div>
        </div>
      </section>
      <section className={cx(s.whatsNext, "flex flex-col items-center")}>
        <div className={cx(s.titleC, "w-full flex items-center justify-center")}>
          <Marquee repeat={4}>
            <div className="flex items-center gap-20 mr-20">
              <h2>What&apos;s Next for Mightyfull?</h2>
              <span className={cx("block", s.iconC)}>
                <IconStar fill="var(--nova-pink)" />
              </span>
            </div>
          </Marquee>
        </div>
        <p>
          We’re committed to growing our community and empowering others. As a women-owned brand, we believe in
          supporting fellow women entrepreneurs and giving back. As we scale, we plan to partner with small, women-owned
          businesses to help drive growth and create new opportunities in the industry.
        </p>
        <p>
          <strong>
            So, the next time you&apos;re looking for a snack that&apos;s free of everything you don&apos;t want and
            packed with everything you do, remember Mightyfull.
          </strong>
        </p>
      </section>
    </>
  )
}
