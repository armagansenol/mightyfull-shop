import groq from "groq"
import { IMAGE } from "./fragments/image"
import { COLOR_THEME } from "./fragments/colorTheme"

export const PRODUCT_HIGHLIGHT_QUERY = groq`
*[_type == "layouts"] | order(_updatedAt desc) [0] {
    productHighlight {
      items[]->{
        _id,
        "title": store.title,
        "slug": store.slug.current,
        "image": images[0] {
         ${IMAGE}
        }
        ,
        colorTheme->{
        ${COLOR_THEME}
        }
      }
    }
  }
`
