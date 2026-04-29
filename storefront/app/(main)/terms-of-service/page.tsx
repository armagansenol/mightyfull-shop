import type { Metadata } from 'next';

import { PolicyPage } from '@/components/policy-page';
import { sanityFetch } from '@/lib/sanity/client';
import { POLICY_IDS, POLICY_QUERY } from '@/lib/sanity/policy';
import type { Policy } from '@/types';

export const metadata: Metadata = {
  title: 'Terms of Service | MIGHTYFULL'
};

export default async function TermsOfServiceRoute() {
  const policy = await sanityFetch<Policy | null>({
    query: POLICY_QUERY,
    qParams: { id: POLICY_IDS.termsOfService },
    tags: ['policy', `policy:${POLICY_IDS.termsOfService}`]
  });

  return <PolicyPage policy={policy} />;
}
