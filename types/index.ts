import { Seo } from "@shopify/hydrogen-react/storefront-api-types"
import { ImageAsset } from "sanity"

export interface AnimatedCardProps {
  id: string
  imgCookie: {
    url: string
  }
  imgPackage: {
    url: string
  }
  product: {
    shopifySlug: string
    shopifyTitle: string
    colorTheme: {
      text: {
        hex: string
      }
      background: {
        hex: string
      }
    }
  }
}

interface StoreDetails {
  title: string
  status: string
  isDeleted: boolean
  price: string
  currency: string
}

interface ShopifyProduct {
  _id: string
  shopifyTitle: string
  shopifyStatus: string
  previewImageUrl: string
}

export interface ProductDetail {
  _id: string
  hidden: string
  titleProxy: string
  images: ImageAsset[]
  description: string
  specs: any[]
  store: StoreDetails
  seo: Seo
  product: ShopifyProduct
}

export interface Theme {
  primary: string
  secondary: string
}

export enum SocialMedia {
  tiktok = "tiktok",
  linkedin = "linkedin",
  facebook = "facebook",
  instagram = "instagram",
  x = "x",
  youtube = "youtube",
}

export interface ProductCard {
  _id: string
  title: string
  featuredImage: ImageAsset
}

export interface ProductCollection {
  _id: string
  title: string
  items: ProductCard[]
}
