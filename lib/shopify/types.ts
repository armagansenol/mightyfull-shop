/**
 * Shopify Types
 * This file contains TypeScript type definitions for Shopify API integration.
 */

// ===== Core Utility Types =====

/**
 * Represents a value that could be null
 */
export type Maybe<T> = T | null;

/**
 * Represents a Shopify connection with edges and nodes
 */
export type Connection<T> = {
  edges: Array<Edge<T>>;
};

/**
 * Represents an edge in a Shopify connection
 */
export type Edge<T> = {
  node: T;
};

// ===== Common Data Types =====

/**
 * Represents an image in the Shopify system
 */
export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

/**
 * Represents monetary values with currency information
 */
export type Money = {
  amount: string;
  currencyCode: string;
};

/**
 * Represents SEO metadata
 */
export type SEO = {
  title: string;
  description: string;
};

/**
 * Represents a menu item
 */
export type Menu = {
  title: string;
  path: string;
};

/**
 * Represents a selected option for a product variant
 */
export type SelectedOption = {
  name: string;
  value: string;
};

/**
 * Represents a policy document
 */
export type Policy = {
  title: string;
  body: string;
  handle: string;
};

/**
 * Base type for GraphQL operation variables
 */
export type BaseOperationVariables = Record<string, unknown>;

/**
 * Base type for GraphQL operation data
 */
export type BaseOperationData = {
  [key: string]: unknown;
};

/**
 * Base type for GraphQL operations
 */
export type BaseOperation<
  TData extends BaseOperationData = BaseOperationData,
  TVars extends BaseOperationVariables = BaseOperationVariables
> = {
  data: TData;
  variables: TVars;
};

// ===== Product Types =====

/**
 * Represents a product option (like size, color, etc.)
 */
export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

/**
 * Represents a product variant with its specific options and pricing
 */
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  sellingPlanAllocations: Connection<SellingPlanAllocation>;
  quantityAvailable: number;
};

/**
 * Represents a Shopify product
 */
export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  sellingPlanGroups: {
    nodes: SellingPlanGroup[];
  };
};

/**
 * Represents a product with flattened variants and images arrays
 */
export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

// ===== Collection Types =====

/**
 * Represents a Shopify collection
 */
export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

/**
 * Represents a collection with additional path information
 */
export type Collection = ShopifyCollection & {
  path: string;
};

// ===== Page Types =====

/**
 * Represents a Shopify page
 */
export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

// ===== Cart Types =====

/**
 * Represents a product in the cart
 */
export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
  sellingPlanGroups: {
    nodes: {
      name: string;
      sellingPlans: {
        nodes: {
          id: string;
          name: string;
        }[];
      };
    }[];
  };
  variants: Connection<ProductVariant>;
};

/**
 * Represents an item in the cart
 */
export type CartItem = {
  id: string | undefined;
  quantity: number;
  sellingPlanId?: string | null;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: CartProduct;
  };
  sellingPlanAllocation?: {
    sellingPlan: {
      id: string;
      name: string;
      description: string;
      priceAdjustments: {
        adjustmentValue: {
          adjustmentPercentage?: number;
          adjustmentAmount?: {
            amount: string;
            currencyCode: string;
          };
          price?: {
            amount: string;
            currencyCode: string;
          };
        };
      }[];
    };
  } | null;
};

/**
 * Represents cart cost information
 */
export type CartCost = {
  subtotalAmount: Money;
  totalAmount: Money;
  totalTaxAmount: Money;
};

/**
 * Represents a Shopify cart
 */
export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: CartCost;
  lines: Connection<CartItem>;
  totalQuantity: number;
};

/**
 * Represents a cart with flattened lines array
 */
export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

// ===== Selling Plan Types =====

/**
 * Represents a percentage-based price adjustment
 */
export type PercentagePriceAdjustment = {
  adjustmentPercentage: number;
};

/**
 * Represents a fixed amount price adjustment
 */
export type FixedAmountPriceAdjustment = {
  adjustmentAmount: Money;
};

/**
 * Represents a fixed price adjustment
 */
export type FixedPriceAdjustment = {
  price: Money;
};

/**
 * Represents a price adjustment for a selling plan
 */
export type PriceAdjustment = {
  adjustmentValue:
    | PercentagePriceAdjustment
    | FixedAmountPriceAdjustment
    | FixedPriceAdjustment;
};

/**
 * Represents a selling plan
 */
export type SellingPlan = {
  id: string;
  name: string;
  priceAdjustments: PriceAdjustment[];
};

/**
 * Represents a selling plan option
 */
export type SellingPlanOption = {
  name: string;
  values: string[];
};

/**
 * Represents a group of selling plans
 */
export type SellingPlanGroup = {
  name: string;
  options: SellingPlanOption[];
  sellingPlans: {
    nodes: SellingPlan[];
  };
};

/**
 * Represents a selling plan with description
 */
export type SellingPlanWithDescription = SellingPlan & {
  description: string;
};

/**
 * Represents a selling plan allocation
 */
export type SellingPlanAllocation = {
  sellingPlan: SellingPlanWithDescription;
  priceAdjustments: {
    price: Money;
  }[];
};

// ===== Shop Types =====

/**
 * Represents a Shopify shop
 */
export type ShopifyShop = {
  id: string;
  name: string;
  shippingPolicy: Policy;
  refundPolicy: Policy;
  privacyPolicy: Policy;
  termsOfService: Policy;
  subscriptionPolicy: Policy;
};

// ===== Operation Types =====

/**
 * Represents a cart operation
 */
export type ShopifyCartOperation = BaseOperation<
  { cart: ShopifyCart },
  { cartId: string }
>;

/**
 * Represents a cart creation operation
 */
export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

/**
 * Represents a cart line item for operations
 */
export type CartLineItem = {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
};

/**
 * Represents an add to cart operation
 */
export type ShopifyAddToCartOperation = BaseOperation<
  { cartLinesAdd: { cart: ShopifyCart } },
  { cartId: string; lines: CartLineItem[] }
>;

/**
 * Represents a remove from cart operation
 */
export type ShopifyRemoveFromCartOperation = BaseOperation<
  { cartLinesRemove: { cart: ShopifyCart } },
  { cartId: string; lineIds: string[] }
>;

/**
 * Represents a cart update line item
 */
export type CartUpdateLineItem = CartLineItem & {
  id: string;
};

/**
 * Represents a cart update operation
 */
export type ShopifyUpdateCartOperation = BaseOperation<
  { cartLinesUpdate: { cart: ShopifyCart } },
  { cartId: string; lines: CartUpdateLineItem[] }
>;

/**
 * Represents a collection fetch operation
 */
export type ShopifyCollectionOperation = BaseOperation<
  { collection: ShopifyCollection },
  { handle: string }
>;

/**
 * Represents a collection products fetch operation
 */
export type ShopifyCollectionProductsOperation = BaseOperation<
  { collection: { products: Connection<ShopifyProduct> } },
  { handle: string; reverse?: boolean; sortKey?: string }
>;

/**
 * Represents a collections fetch operation
 */
export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

/**
 * Represents a menu fetch operation
 */
export type ShopifyMenuOperation = BaseOperation<
  { menu?: { items: { title: string; url: string }[] } },
  { handle: string }
>;

/**
 * Represents a page fetch operation
 */
export type ShopifyPageOperation = BaseOperation<
  { pageByHandle: Page },
  { handle: string }
>;

/**
 * Represents a pages fetch operation
 */
export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

/**
 * Represents a product fetch operation
 */
export type ShopifyProductOperation = BaseOperation<
  { product: ShopifyProduct },
  { handle: string }
>;

/**
 * Represents a product recommendations fetch operation
 */
export type ShopifyProductRecommendationsOperation = BaseOperation<
  { productRecommendations: ShopifyProduct[] },
  { productId: string }
>;

/**
 * Represents a products fetch operation
 */
export type ShopifyProductsOperation = BaseOperation<
  { products: Connection<ShopifyProduct> },
  { query?: string; reverse?: boolean; sortKey?: string }
>;

/**
 * Represents a shop fetch operation
 */
export type ShopifyShopOperation = {
  data: {
    shop: ShopifyShop;
  };
};
