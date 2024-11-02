import { ProductCollection, ShopMenu } from "./index"
// Import types from any existing portable text definitions
import type { PortableTextBlock } from "@portabletext/types"
import { SanityAssetImage } from "lib/sanity"

// Define the base types
type SeoSettings = {
  title: string
  description?: string
}

type Link = {
  // Assuming LINKS fragment includes these fields
  title?: string
  url?: string
  // Add other fields from your LINKS fragment
}

type ColorTheme = {
  textColor: string
  backgroundColor: string
}

export type SocialLink = {
  platform: string
  url: string
}

type NotFoundPage = {
  body?: string
  collectionGid?: string
  colorTheme?: ColorTheme
  title: string
}

type Footer = {
  links: Link[]
  text: PortableTextBlock[]
}

// Main layout type
export type LayoutQueryResponse = {
  seo: SeoSettings
  menuLinks: Link[]
  footer: Footer
  socialLinks: SocialLink[]
  notFoundPage: NotFoundPage
  imageCarousel: SanityAssetImage[]
  shopMenu: ProductCollection[]
}
