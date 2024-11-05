import { FeatureHighLightCard } from "@/types"
import cn from "clsx"
import { IconProtein8 } from "../icons"
import s from "./feature-highlight.module.scss"
import { Img } from "../utility/img"

export interface FeatureHighlightProps {
  items: FeatureHighLightCard[]
}

export default function FeatureHighlight(props: FeatureHighlightProps) {
  console.log("aa", props.items)

  return (
    <section className={cn(s.featureHighlight, "flex flex-col items-center py-20 pb-80 bg-[var(--sugar-milk)]")}>
      <h2 className={s.heading}>What Makes Mightyfull Truly Mighty?</h2>
      <div className="grid grid-cols-2 gap-14">
        {props.items.map((item, i) => {
          return (
            <div
              className={cn(s.card, `flex flex-col items-start justify-start -z-${i}`)}
              key={item._key}
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
          )
        })}
      </div>
      <div className={s.stickerC}>
        <IconProtein8 />
      </div>
    </section>
  )
}
