import groq from 'groq';

import { ANIMATED_CARD } from './fragments/animatedCard';

export const ANIMATED_CARDS_QUERY = groq`
*[_type == "animatedCard"] {
  ${ANIMATED_CARD}
}
`;
