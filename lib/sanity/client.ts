import { createClient } from "@sanity/client"

console.log(process.env.SANITY_PROJECT_ID)

export const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-10-23",
  useCdn: process.env.NODE_ENV === "production",
}

export const sanityClient = createClient(config)
