import groq from "groq"

import { MODULE_ACCORDION } from "../modules/accordion"
import { MODULE_CALLOUT } from "../modules/callout"
import { MODULE_GRID } from "../modules/grid"
import { MODULE_INSTAGRAM } from "../modules/instagram"
import { MODULE_TAGGED_PRODUCTS } from "../modules/taggedProducts"
import { MARK_DEFS } from "./markDefs"

// We check the _type for backwards compatibility with the old block type names.
export const PORTABLE_TEXT = groq`
  ...,
  (_type == 'blockAccordion' || _type == 'module.accordion') => {
    '_type': 'module.accordion',
    ${MODULE_ACCORDION},
  },
  (_type == 'blockCallout' || _type == 'module.callout') => {
    '_type': 'module.callout',
    ${MODULE_CALLOUT}
  },
  (_type == 'blockGrid' || _type == 'module.grid') => {
    '_type': 'module.grid',
    ${MODULE_GRID},
  },
  (_type == 'blockInstagram' || _type == 'module.instagram') => {
    '_type': 'module.instagram',
    ${MODULE_INSTAGRAM}
  },
  (_type == 'blockTaggedProducts' || _type == 'module.blockTaggedProducts') => {
    '_type': 'module.taggedProducts',
    ${MODULE_TAGGED_PRODUCTS}
  },
  markDefs[] {
    ${MARK_DEFS}
  }
`
