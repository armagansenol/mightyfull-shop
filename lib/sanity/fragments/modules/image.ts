import groq from "groq"

import { IMAGE } from "../image"
import { PRODUCT_HOTSPOT } from "../productHotspot"
import { PRODUCT_WITH_VARIANT } from "../productWithVariant"

export const MODULE_IMAGE = groq`
  image {
    ${IMAGE}
  },
  (variant == 'caption') => {
    caption,
  },
  (variant == 'productHotspots') => {
    productHotspots[] {
      _key,
      ${PRODUCT_HOTSPOT}
    }
  },
  (variant == 'productTags') => {
    productTags[] {
      _key,
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  variant,
`
