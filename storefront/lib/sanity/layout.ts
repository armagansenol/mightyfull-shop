import groq from 'groq';

import { IMAGE } from './fragments/image';

export const LAYOUT_QUERY = groq`
  *[_type == 'layouts'] | order(_updatedAt desc) [0] {
    noticebar {
      title,
      active,
    },
    socialLinks[] {
      platform,
      url,
    },
    imageCarousel[] {
      ${IMAGE}
    },
  }
`;
