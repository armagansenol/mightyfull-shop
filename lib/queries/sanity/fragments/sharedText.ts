import groq from "groq"

export const SHARED_TEXT = groq`
  "sharedText": *[_type == 'sharedText'][0] {
    "deliveryAndReturns": deliveryAndReturns[]
  }
`
