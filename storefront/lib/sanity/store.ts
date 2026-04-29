import groq from 'groq';

export const STORE_QUERY = groq`
*[_type == "store"]{
    title,
    address,
    city,
    country,
    location
  }
`;
