import groq from 'groq';

export const NOTICEBAR_QUERY = groq`
*[_type == "noticebar"] {
  _id,
  title,
  active
}
`;
