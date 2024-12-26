import groq from "groq"

import { MARK_DEFS } from "./portableText/markDefs"

export const MATERIAL = groq`
  _key,
  'material': @->{
    _id,
    "name": name,
    attributes,
    "story": story[] {
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    }
  }
`
