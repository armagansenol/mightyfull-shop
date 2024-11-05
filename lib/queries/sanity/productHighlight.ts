import groq from "groq"
import { IMAGE } from "./fragments/image"

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
      }
    }
  }
`
