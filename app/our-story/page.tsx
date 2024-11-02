import s from "./our-story.module.scss"

import cx from "clsx"

import { IconLeftArm, IconRightArm } from "components/icons"
import { Img } from "components/utility/img"

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
        <div className={s.stickerC}>
          <Img className="object-contain" src="/img/c-pb-jelly-choco-chip.png" height={500} width={500} alt="Cookie" />
        </div>
      </section>
      <section className={s.differences}>
        <h2>The Mightyfull Difference</h2>
        <div className="flex flex-col items-center tablet:items-start tablet:grid grid-cols-12 gap-5 tablet:gap-20">
          <div className="col-span-6">
            <p className={s.p}>
              Mightyfull Cookies are all about flavor, without the fuss. They’re gluten-free, dairy-free, whey-free, and
              soy-free, so you can snack with confidence. These chewy, indulgent cookies deliver everything you crave—no
              artificial junk, just pure deliciousness.
            </p>
          </div>
          <div className="col-span-6">
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
            "col-span-6 border:none tablet:border-r-[5px] tablet:border-r-solid tablet:border-r-[var(--blue-ruin)]"
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
          <h2>What&apos;s Next for Mightyfull?</h2>
        </div>

        <p>
          From the very beginning, we’ve wanted Mightyfull to stand for more than just delicious cookies. We believe in
          filling bellies and fueling potential. That’s why we’re committed to donating a portion of every sale to No
          Hunger for Kids—because no child should go without a meal, and every kid deserves a full belly to grow strong.
        </p>
        <p>
          <strong>
            At Mightyfull, we believe in staying mighty and full—whether it’s through our cookies or through our efforts
            to help those in need.
          </strong>
        </p>
      </section>
    </>
  )
}
