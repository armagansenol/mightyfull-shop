import groq from "groq"

export const PRODUCT_SPECS = groq`
  specs[] {
    title,
  }
`
