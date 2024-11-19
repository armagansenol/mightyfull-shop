import { createClient, QueryParams } from "@sanity/client"

export const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-10-23",
  useCdn: process.env.NODE_ENV === "production",
}

export const client = createClient(config)

export async function sanityFetch<QueryResponse>({
  query,
  qParams = {},
  tags,
}: {
  query: string
  qParams?: QueryParams
  tags: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, qParams, {
    cache: "force-cache",
    next: { tags },
  })
}
