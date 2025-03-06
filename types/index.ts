import { SanityAssetImage } from '@/lib/sanity';
import { PortableTextBlock } from '@portabletext/react';
import {
  Image,
  ProductVariant,
  SellingPlanGroup,
  Seo
} from '@shopify/hydrogen-react/storefront-api-types';
import { ImageAsset } from 'sanity';

// Color theme types
export type ColorThemeHex = {
  hex: string;
};

export type SanityColorTheme = {
  background: string;
  text: string;
  tertiary: string;
};

export interface Theme {
  primary: string;
  secondary: string;
}

export interface AnimatedCardProps {
  id: string;
  displayTitle: PortableTextBlock[];
  imgCookie: SanityAssetImage;
  imgPackage: SanityAssetImage;
  product: {
    displayTitle: PortableTextBlock[];
    shopifySlug: string;
    shopifyTitle: string;
    colorTheme: {
      text: ColorThemeHex;
      background: ColorThemeHex;
    };
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
}

export interface ProductVariantNode {
  id: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: ProductVariant['price'];
}

export interface ProductDetail {
  id: string;
  availableForSale: boolean;
  hidden: string;
  titleProxy: string;
  images: ImageAsset[];
  description: string;
  specs: ProductSpec[];
  store: StoreDetails;
  seo: Seo;
  product: ShopifyProduct;
  sellingPlanGroups: SellingPlanGroups;
  variants: {
    nodes: ProductVariantNode[];
  };
}

export enum SocialMedia {
  tiktok = 'tiktok',
  facebook = 'facebook',
  instagram = 'instagram',
  x = 'x',
  youtube = 'youtube'
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
  colorTheme: SanityColorTheme;
}

export interface ProductHighlightQueryResult {
  productHighlight: {
    items: ProductItem[];
  };
}

export interface FeatureHighlightCard {
  _key: string;
  title: string;
  description: string;
  icon: SanityAssetImage;
  colorTheme: SanityColorTheme;
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

export interface CartProductNode {
  id: string;
  sellingPlanId?: string;
  handle: string;
  title: string;
  featuredImage: Image;
  variants: {
    nodes: {
      id: string;
      price: ProductVariant['price'];
    }[];
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
