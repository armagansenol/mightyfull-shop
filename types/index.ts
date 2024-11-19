import { SanityAssetImage } from "@/lib/sanity"
import { PortableTextBlock } from "@portabletext/react"
import { Image, ProductVariant, SellingPlanGroup, Seo } from "@shopify/hydrogen-react/storefront-api-types"
import { ImageAsset } from "sanity"

export interface AnimatedCardProps {
  id: string
  imgCookie: SanityAssetImage
  imgPackage: SanityAssetImage
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
  availableForSale: boolean
  hidden: string
  titleProxy: string
  images: ImageAsset[]
  description: string
  specs: ProductSpec[]
  store: StoreDetails
  seo: Seo
  product: ShopifyProduct
  sellingPlanGroups: SellingPlanGroups
  variants: {
    nodes: {
      id: string
      availableForSale: boolean
      quantityAvailable: number
      price: ProductVariant["price"]
    }[]
  }
}

export interface Theme {
  primary: string
  secondary: string
}

export enum SocialMedia {
  tiktok = "tiktok",
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

interface ProductItem {
  _id: string
  image: SanityAssetImage
  title: string
  slug: string
  colorTheme: SanityColorTheme
}

export interface ProductHighlightQueryResult {
  productHighlight: {
    items: ProductItem[]
  }
}

export interface FeatureHighLightCard {
  _key: string
  title: string
  description: string
  icon: SanityAssetImage
  colorTheme: SanityColorTheme
}

export interface FeatureHighlightQueryResult {
  featureHighlight: {
    items: FeatureHighLightCard[]
  }
}

export interface ProductSpec {
  title: string
  description: PortableTextBlock
}

export interface Testimonial {
  _id: string
  title: string
  description: string
}

type SellingPlanGroups = {
  nodes: SellingPlanGroup[]
}

// type SellingPlanGroup = {
//   name: string
//   options: SellingPlanOption[]
//   sellingPlans: SellingPlans
// }

export interface CartItemData {
  id: string
  sellingPlanId?: string
  // name: string
  // price: number
  // originalPrice?: number
  // image: string
  quantity: number

  // subscriptionOffer?: {
  //   text: string
  //   discount: number
  // }
  // deliveryOffer?: {
  //   text: string
  //   discount: number
  // }
}

export interface CartItemCard {
  id: string
  name: string
  price: number
  // originalPrice?: number
  image: SanityAssetImage
  quantity: number
}

export type CartLineItem = {
  id: string
  quantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  merchandise: {
    id: string
    title: string
    selectedOptions: {
      name: string
      value: string
    }[]
    product: Product
  }
}

// Define `Product` type if not already defined
type Product = {
  // Add relevant fields for the product
  // Example:
  id: string
  title: string
  handle: string
  // Additional fields as necessary
}

export interface CartProductNode {
  id: string
  sellingPlanId?: string
  handle: string
  title: string
  featuredImage: Image
  variants: {
    nodes: {
      id: string
      price: ProductVariant["price"]
    }[]
  }
}

export enum PurchaseOption {
  oneTime = "ONE_TIME",
  subscription = "SUBSCRIPTION",
}

export enum DeliveryInterval {
  thhreeMonth = "THREE_MONTH",
  sixMonth = "SIX_MONTH",
}

export type SanityColorTheme = {
  background: string
  text: string
  tertiary: string
}
