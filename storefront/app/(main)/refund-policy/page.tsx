import type { Metadata } from 'next';

import { PolicyPage } from '@/components/policy-page';
import { sanityFetch } from '@/lib/sanity/client';
import { POLICY_IDS, POLICY_QUERY } from '@/lib/sanity/policy';
import type { Policy } from '@/types';

export const metadata: Metadata = {
  title: 'Refund Policy | MIGHTYFULL'
};

export default async function RefundPolicyRoute() {
  const policy = await sanityFetch<Policy | null>({
    query: POLICY_QUERY,
    qParams: { id: POLICY_IDS.refundPolicy },
    tags: ['policy', `policy:${POLICY_IDS.refundPolicy}`]
  });

  return <PolicyPage policy={policy} />;
}
