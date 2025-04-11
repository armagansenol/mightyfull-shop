import { SanityAssetImage } from '@/lib/sanity';
import { PortableTextBlock } from '@portabletext/react';
import {
  ProductVariant,
  SellingPlanGroup
} from '@shopify/hydrogen-react/storefront-api-types';
import { ImageAsset } from 'sanity';

export type ColorTheme = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export interface AnimatedCardProps {
  id: string;
  displayTitle: PortableTextBlock[];
  imgCookie: SanityAssetImage;
  imgPackage: SanityAssetImage;
  product: {
    displayTitle: PortableTextBlock[];
    shopifySlug: string;
    shopifyTitle: string;
    variantId: string;
    availableForSale: boolean;
    colorTheme: ColorTheme;
  };
}

export interface StoreDetails {
  title: string;
  status: string;
  isDeleted: boolean;
  price: string;
  currency: string;
}

export interface ShopifyProduct {
  _id: string;
  shopifyTitle: string;
  shopifyStatus: string;
  previewImageUrl: string;
  variants: {
    nodes: ProductVariantNode[];
  };
}

export interface ProductVariantNode {
  id: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: ProductVariant['price'];
}

export enum SocialMedia {
  tiktok = 'tiktok',
  facebook = 'facebook',
  instagram = 'instagram',
  x = 'x',
  youtube = 'youtube',
  linkedin = 'linkedin'
}

export interface ProductCard {
  _id: string;
  title: string;
  featuredImage: ImageAsset;
}

export interface ProductCollection {
  _id: string;
  title: string;
  items: ProductCard[];
}

export interface ProductItem {
  _id: string;
  image: SanityAssetImage;
  title: string;
  slug: string;
  colorTheme: ColorTheme;
}

export interface ProductHighlightQueryResult {
  productHighlight: {
    items: AnimatedCardProps[];
  };
}

export interface FeatureHighlightCard {
  _key: string;
  title: string;
  description: string;
  icon: SanityAssetImage;
  colorTheme: ColorTheme;
}

export interface FeatureHighlightQueryResult {
  featureHighlight: {
    items: FeatureHighlightCard[];
  };
}

export interface ProductSpec {
  title: string;
  description: PortableTextBlock;
}

export interface Testimonial {
  _id: string;
  title: string;
  description: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: PortableTextBlock;
}

export type SellingPlanGroups = {
  nodes: SellingPlanGroup[];
};

export interface CartItemData {
  id: string;
  sellingPlanId?: string;
  quantity: number;
}

export interface CartItemCard {
  id: string;
  name: string;
  price: number;
  image: SanityAssetImage;
  quantity: number;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  // Add other product fields as they become necessary
}

export interface CartLineItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
}

export enum PurchaseOption {
  oneTime = 'ONE_TIME',
  subscription = 'SUBSCRIPTION'
}

export enum DeliveryInterval {
  threeMonth = 'THREE_MONTH',
  sixMonth = 'SIX_MONTH'
}

export type CartUpdateType = 'plus' | 'minus' | 'delete';

export interface Store {
  _id: string;
  title: string;
  address: string;
  city: string;
  country: string;
}

export interface SeoSettings {
  title: string;
  description?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface LayoutQueryResponse {
  noticebar: Noticebar;
  socialLinks: SocialLink[];
  imageCarousel: ImageAsset[];
}

export interface Noticebar {
  title: string;
  active: boolean;
}
