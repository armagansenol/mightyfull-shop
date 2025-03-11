import groq from 'groq';
import { ANIMATED_CARD } from './fragments/animatedCard';

export const PRODUCT_HIGHLIGHT_QUERY = groq`
*[_type == "layouts"] | order(_updatedAt desc) [0] {
    productHighlight {
      items[]->{
        ${ANIMATED_CARD}
      }
    }
  }
`;
