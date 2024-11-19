import { createClient, QueryParams } from "@sanity/client"

export const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-10-23",
  // set CDN to live API in development mode
  useCdn: process.env.NODE_ENV === "development" ? true : false,
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
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    next: { tags },
  })
}
