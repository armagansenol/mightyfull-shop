import groq from 'groq';

export const STORE_QUERY = groq`
*[_type == "store"] | order(retailer asc, city asc, title asc) {
  _id,
  retailer,
  title,
  address,
  addressLine2,
  city,
  state,
  zip,
  country,
  phone,
  website,
  location
}
`;
