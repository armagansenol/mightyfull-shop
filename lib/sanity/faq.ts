import groq from 'groq';

export const FAQ_QUERY = groq`
*[_type == "faq"] {
  _id,
  question,
  answer
}
`;
