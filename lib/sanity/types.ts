import { ColorTheme } from '@/types';
import type { PortableTextBlock } from '@portabletext/types';
import type { Image, ImageAsset } from '@sanity/types';

export interface SanityAssetImage extends Image {
  _type: 'image';
  altText?: string;
  blurDataURL: string;
  height: number;
  url: string;
  width: number;
}

export type SanityLabel = {
  key: string;
  text: string;
};

export type SanityCustomProductOption =
  | SanityCustomProductOptionColor
  | SanityCustomProductOptionSize;

interface SanityCustomProductOptionBase {
  _key: string;
  title: string;
}
export interface SanityCustomProductOptionColor
  extends SanityCustomProductOptionBase {
  _type: 'customProductOption.color';
  colors: {
    hex: string;
    title: string;
  }[];
}

export interface SanityCustomProductOptionSize
  extends SanityCustomProductOptionBase {
  _type: 'customProductOption.size';
  sizes: {
    height: number;
    title: string;
    width: number;
  }[];
}

export type SanityImageWithProductHotspots = {
  _key?: string;
  _type: 'imageWithProductHotspots';
  image: SanityAssetImage;
  productHotspots: SanityProductHotspot[];
};

export type SanityLink = SanityLinkExternal | SanityLinkInternal;

export type SanityLinkExternal = {
  _key: string;
  _type: 'linkExternal';
  newWindow?: boolean;
  url: string;
  title: string;
};

export type SanityLinkInternal = {
  _key: string;
  _type: 'linkInternal';
  documentType: string;
  slug?: string;
  title: string;
};

export type SanityMenuLink = SanityLinkExternal | SanityLinkInternal;

export type SanityModule =
  | SanityModuleAccordion
  | SanityModuleCallout
  | SanityModuleCallToAction
  | SanityModuleGrid
  | SanityModuleImage
  | SanityModuleInstagram
  | SanityModuleProduct;

export type SanityModuleAccordion = {
  _key?: string;
  _type: 'module.accordion';
  groups: {
    _key: string;
    _type: 'group';
    body: PortableTextBlock[];
    title: string;
  }[];
};

export type SanityModuleCallout = {
  _key?: string;
  _type: 'module.callout';
  link: SanityLink;
  text: string;
};

export type SanityModuleCallToAction = {
  _key?: string;
  _type: 'module.callToAction';
  body?: string;
  content?: SanityAssetImage | SanityProductWithVariant;
  layout: 'left' | 'right';
  link: SanityLink;
  title: string;
};

export type SanityModuleImage =
  | SanityModuleImageCallToAction
  | SanityModuleImageCaption
  | SanityModuleImageProductHotspots
  | SanityModuleImageProductTags;

export type SanityModuleGrid = {
  _key?: string;
  _type: 'module.grid';
  items: {
    _key: string;
    _type: 'items';
    body: PortableTextBlock[];
    image: SanityAssetImage;
    title: string;
  }[];
};

export type SanityModuleImageBase = {
  _key?: string;
  _type: 'module.image';
  image: SanityAssetImage;
};

export interface SanityModuleImageCallToAction extends SanityModuleImageBase {
  _key?: string;
  callToAction?: {
    link: SanityLink;
    title?: string;
  };
  variant: 'callToAction';
}

export interface SanityModuleImageCaption extends SanityModuleImageBase {
  _key?: string;
  caption?: string;
  variant: 'caption';
}
export interface SanityModuleImageProductHotspots
  extends SanityModuleImageBase {
  _key?: string;
  productHotspots?: SanityProductHotspot[];
  variant: 'productHotspots';
}

export interface SanityModuleImageProductTags extends SanityModuleImageBase {
  _key?: string;
  productTags?: SanityProductWithVariant[];
  variant: 'productTags';
}

export type SanityModuleImages = {
  _key?: string;
  _type: 'module.images';
  fullWidth?: boolean;
  modules: SanityModuleImage[];
  verticalAlign?: 'bottom' | 'center' | 'top';
};

export type SanityModuleInstagram = {
  _key?: string;
  _type: 'module.instagram';
  url: string;
};

export type SanityModuleProduct = {
  _key?: string;
  _type: 'module.product';
  productWithVariant: SanityProductWithVariant;
};

export type SanityModuleTaggedProducts = {
  _key?: string;
  _type: 'module.taggedProducts';
  tag: string;
  number: number;
  layout?: 'card' | 'pill';
  products: SanityModuleProduct[];
};

export type SanityProductHotspot = {
  _key?: string;
  product: SanityProductWithVariant;
  x: number;
  y: number;
};

export type SanityProductWithVariant = {
  _id: string;
  _key?: string;
  _type: 'productWithVariant';
  available: boolean;
  gid: string;
  slug?: string;
  variantGid: string;
};

export type SanityProductPage = {
  _id: string;
  title: string;
  displayTitle: string;
  description: PortableTextBlock[];
  available: boolean;
  colorTheme: ColorTheme;
  customProductOptions?: SanityCustomProductOption[];
  gid: string;
  slug?: string;
  seo: SanitySeo;
  productSpecifications: {
    id: string;
    title: string;
    description: PortableTextBlock[];
  }[];
  images: ImageAsset[];
};

export type SanitySeo = {
  description?: string;
  image?: SanityAssetImage;
  title: string;
};

export type SanityPerson = {
  name: string;
  slug: string;
  bio: PortableTextBlock[];
  image: SanityAssetImage;
  seo: SanitySeo;
};

export type SanityPersonPage = SanityPerson & {
  seo: SanitySeo;
  products: SanityModuleProduct[];
};

export type SanityCreator = {
  _key: string;
  role: string;
  person: SanityPerson;
};

export type SanityMaterialAttributes = {
  environmentallyFriendly: boolean;
  dishwasherSafe: boolean;
};

export type SanityFaq = {
  _key: string;
  _type: 'group';
  title: string;
  body: PortableTextBlock[];
};

export type SanityFaqs = {
  groups: SanityFaq[];
  _type: 'module.accordion';
};

export type SanityMaterial = {
  name: string;
  attributes: SanityMaterialAttributes;
  story: PortableTextBlock[];
};

export type SanityComposition = {
  _key: string;
  material: SanityMaterial;
};

export type SanityGuideProducts = {
  title: string;
  slug: string;
  images: SanityModuleImage[];
};
