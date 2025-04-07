import groq from 'groq';

export const FAQ_QUERY = groq`
*[_type == "faq"]|order(orderRank) {
  _id,
  question,
  answer
}
`;
