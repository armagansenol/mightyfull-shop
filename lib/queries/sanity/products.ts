import groq from "groq"

export const PRODUCTS_QUERY = groq`
 *[_type == "product"] {
  _id,
  "shopifyTitle": store.title,
  "shopifyId": store.id,
  "shopifyDescription": store.description,
  colorTheme,
  description,
  specs,
}
`
