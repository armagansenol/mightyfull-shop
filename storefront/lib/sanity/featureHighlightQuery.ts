import groq from 'groq';
import { COLOR_THEME } from './fragments/colorTheme';
import { IMAGE } from './fragments/image';

export const FEATURE_HIGHLIGHT_QUERY = groq`
*[_type == "layouts"] | order(_updatedAt desc) [0] {
  featureHighlight {
    items[] {
      _key,
      title,
      description,
      icon {
        ${IMAGE}
      },
      colorTheme->{
        ${COLOR_THEME}
      }
    }
  }
}
`;
