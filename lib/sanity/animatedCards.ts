import groq from "groq"
import { IMAGE } from "./fragments/image"

export const ANIMATED_CARDS_QUERY = groq`
*[_type == "animatedCard"] {
  _id,
  displayTitle,
  imgCookie {
      ${IMAGE}
    },
  imgPackage {
      ${IMAGE}
    },
  product->{
    _id,
    "shopifySlug": store.slug.current,
    "shopifyTitle": store.title,
    colorTheme->{
      text,
      background
    }
  }
}
`
