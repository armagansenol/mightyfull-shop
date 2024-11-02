import groq from "groq"

export const PRODUCTS = groq`
*[_type == "product"] {
    _id,
    title,
    handle,
    description,
  }
`
