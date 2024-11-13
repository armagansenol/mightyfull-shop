import { SanityColorTheme } from "@/lib/context/theme"
import { SanityAssetImage } from "@/lib/sanity"
import { PortableTextBlock } from "@portabletext/react"
import { ConnectionGenericForDoc } from "@shopify/hydrogen-react/flatten-connection"
import { Image, ProductVariant, Seo } from "@shopify/hydrogen-react/storefront-api-types"
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

type SellingPlanGroup = {
  name: string
  options: SellingPlanOption[]
  sellingPlans: SellingPlans
}

type SellingPlanOption = {
  name: string
  values: string[]
}

type SellingPlans = {
  nodes: SellingPlan[]
}

type SellingPlan = {
  name: string
}

export interface CartItemData {
  id: string
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
  title: string
  featuredImage: Image
  variants: {
    nodes: {
      price: ProductVariant["price"]
    }[]
  }
}
