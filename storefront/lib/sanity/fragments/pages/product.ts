import groq from 'groq';

import { COLOR_THEME } from '../colorTheme';
import { CUSTOM_PRODUCT_OPTIONS } from '../customProductOptions';
import { IMAGE } from '../image';
import { SEO_SHOPIFY } from '../seoShopify';
import { SHARED_TEXT } from '../sharedText';

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  "title": store.title,
  "featuredImage": store.featuredImage,
  "price": store.price,
  displayTitle,
  images[] {
    ${IMAGE}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  description,
  productSpecifications[] {
    "id": _key,
    title,
    description
  },
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  ${SHARED_TEXT},

`;
