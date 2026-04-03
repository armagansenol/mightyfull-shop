import { createClient, type QueryParams } from '@sanity/client';

export const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: process.env.NODE_ENV !== 'development'
};

export const client = createClient(config);

export async function sanityFetch<QueryResponse>({
  query,
  qParams = {},
  tags
}: {
  query: string;
  qParams?: QueryParams;
  tags: string[];
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, qParams, {
    cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
    next: { tags }
  });
}
