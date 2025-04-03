import groq from 'groq';

import { COLOR_THEME } from './colorTheme';
import { IMAGE } from './image';

export const ANIMATED_CARD = groq`
  _id,
  displayTitle,
  imgCookie {
    ${IMAGE}
  },
  imgPackage {
    ${IMAGE}
  },
  product->{
    _id,
    "shopifySlug": store.slug.current,
    "shopifyTitle": store.title,
    colorTheme->{
      ${COLOR_THEME}
    }
  }
`;
