import groq from 'groq';

export const POLICY_IDS = {
  privacyPolicy: 'privacyPolicy',
  refundPolicy: 'refundPolicy',
  termsOfService: 'termsOfService'
} as const;

export type PolicyId = (typeof POLICY_IDS)[keyof typeof POLICY_IDS];

export const POLICY_QUERY = groq`
*[_type == "policy" && _id == $id][0]{
  _id,
  title,
  lastUpdated,
  body
}
`;
