import s from "./feature-highlight.module.scss"

import cn from "clsx"

import { FadeIn } from "@/components/fade-in"
import { IconProtein8 } from "@/components/icons"
import { Parallax } from "@/components/parallax"
import { Img } from "@/components/utility/img"
import { FeatureHighLightCard } from "@/types"

export interface FeatureHighlightProps {
  items: FeatureHighLightCard[]
}

export default function FeatureHighlight(props: FeatureHighlightProps) {
  return (
    <section
      className={cn(
        s.featureHighlight,
        "flex flex-col items-center py-10 tablet:py-20 tablet:pb-96 bg-[var(--sugar-milk)]"
      )}
    >
      <h2 className={s.heading}>What Makes Mightyfull Truly Mighty?</h2>
      <div className="flex flex-col items-center tablet:grid grid-cols-2 gap-14">
        {props.items.map((item) => {
          return (
            <div className={s.cardC} key={item._key}>
              <FadeIn>
                <div
                  className={cn(s.card, `flex flex-col items-start justify-start`)}
                  style={
                    {
                      "--text-color": `${item.colorTheme?.text}`,
                      "--bg-color": `${item.colorTheme?.background}`,
                    } as React.CSSProperties
                  }
                >
                  <p className={s.title}>{item.title}</p>
                  <p className={s.desc}>{item.description}</p>
                  <div className={s.iconC}>
                    <Img src={item.icon.url} height={200} width={200} alt="alt-text" />
                  </div>
                </div>
              </FadeIn>
            </div>
          )
        })}
      </div>
      <div className={s.stickerC}>
        <Parallax speed={0.25}>
          <IconProtein8 />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie1)}>
        <Parallax>
          <Img alt="Cookie Crumb" className="object-contain rotate-180" src={"/img/c1.png"} height={200} width={200} />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie2)}>
        <Parallax>
          <Img alt="Cookie Crumb" className="object-contain -rotate-6" src={"/img/c2.png"} height={200} width={200} />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie3)}>
        <Parallax>
          <Img alt="Cookie Crumb" className="object-contain -rotate-12" src={"/img/c3.png"} height={200} width={200} />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie4)}>
        <Parallax>
          <Img alt="Cookie Crumb" className="object-contain -rotate-12" src={"/img/c4.png"} height={200} width={200} />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie5)}>
        <Parallax>
          <Img alt="Cookie Crumb" className="object-contain rotate-6" src={"/img/c5.png"} height={200} width={200} />
        </Parallax>
      </div>
      <div className={s.flyingCookie}>
        {/* <Img alt="Flying Cookie with a Cape" className="object-contain -rotate-12" src={flyingCookie} /> */}
        <video
          className="w-full h-full -rotate-12"
          autoPlay
          loop
          playsInline
          muted
          style={{ rotate: "rotateZ(180deg)" }}
        >
          <source src="/video/mighty-bottom.mov" type="video/mp4; codecs=hvc1" />
          <source src="/video/mighty-bottom.webm" type="video/webm" />
        </video>
      </div>
    </section>
  )
}
