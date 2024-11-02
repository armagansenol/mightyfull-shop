import groq from "groq"

import { COLOR_THEME } from "./fragments/colorTheme"
import { LINKS } from "./fragments/links"
import { PORTABLE_TEXT } from "./fragments/portableText/portableText"
import { IMAGE } from "./fragments/image"

export const LAYOUT_QUERY = groq`
  *[_type == 'settings'] | order(_updatedAt desc) [0] {
    seo,
    footer {
      links[] {
        ${LINKS}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    socialLinks[] {
      platform,
      url,
    },
    shopMenu[]{
      _id,
      title,
      items[]->{
        _id,
        _type,
        "title": store.title,
        "featuredImage": store.featuredImage,
      }
    },
    imageCarousel[] {
      ${IMAGE}
    },
    notFoundPage {
      body,
      "collectionGid": collection->store.gid,
      colorTheme->{
        ${COLOR_THEME}
      },
      title
    }
  }
`
