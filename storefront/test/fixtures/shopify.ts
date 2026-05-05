import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
  ShopifyCart,
  ShopifyProduct
} from '@/lib/shopify/types';

const money = (amount: string, currencyCode = 'USD') => ({
  amount,
  currencyCode
});

export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  const quantity = overrides.quantity ?? 1;
  const amount = overrides.cost?.totalAmount.amount ?? String(quantity * 5);
  const variantId =
    overrides.merchandise?.id ?? 'gid://shopify/ProductVariant/1';

  return {
    id: 'gid://shopify/CartLine/1',
    quantity,
    cost: {
      totalAmount: money(amount)
    },
    merchandise: {
      id: variantId,
      title: 'Default Title',
      selectedOptions: [{ name: 'Title', value: 'Default Title' }],
      product: {
        id: 'gid://shopify/Product/1',
        handle: 'chocolate-chip',
        title: 'Chocolate Chip',
        featuredImage: {
          url: 'https://cdn.shopify.com/image.jpg',
          altText: 'Chocolate Chip',
          width: 100,
          height: 100
        },
        sellingPlanGroups: { nodes: [] },
        variants: {
          edges: [
            {
              node: createVariant({ id: variantId })
            }
          ]
        }
      },
      ...overrides.merchandise
    },
    ...overrides
  };
}

export function createCart(overrides: Partial<Cart> = {}): Cart {
  const lines = overrides.lines ?? [createCartItem()];
  const totalQuantity =
    overrides.totalQuantity ??
    lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount =
    overrides.cost?.totalAmount.amount ??
    lines
      .reduce((sum, line) => sum + Number(line.cost.totalAmount.amount), 0)
      .toString();

  return {
    id: 'gid://shopify/Cart/1',
    checkoutUrl: 'https://checkout.shopify.com/cart/1',
    lines,
    totalQuantity,
    cost: {
      subtotalAmount: money(totalAmount),
      totalAmount: money(totalAmount),
      totalTaxAmount: money('0')
    },
    ...overrides
  };
}

export function createVariant(
  overrides: Partial<ProductVariant> = {}
): ProductVariant {
  return {
    id: 'gid://shopify/ProductVariant/1',
    title: 'Default Title',
    availableForSale: true,
    selectedOptions: [{ name: 'Title', value: 'Default Title' }],
    price: money('5.00'),
    sellingPlanAllocations: { edges: [] },
    quantityAvailable: 10,
    ...overrides
  };
}

export function createProduct(overrides: Partial<Product> = {}): Product {
  const variant = createVariant();

  return {
    id: 'gid://shopify/Product/1',
    handle: 'chocolate-chip',
    availableForSale: true,
    title: 'Chocolate Chip',
    description: 'Protein cookie',
    descriptionHtml: '<p>Protein cookie</p>',
    options: [],
    priceRange: {
      maxVariantPrice: money('5.00'),
      minVariantPrice: money('5.00')
    },
    variants: [variant],
    featuredImage: {
      url: 'https://cdn.shopify.com/product.jpg',
      altText: 'Chocolate Chip',
      width: 100,
      height: 100
    },
    images: [],
    seo: {
      title: 'Chocolate Chip',
      description: 'Protein cookie'
    },
    tags: [],
    updatedAt: '2026-01-01T00:00:00Z',
    sellingPlanGroups: { nodes: [] },
    ...overrides
  };
}

export function createShopifyCart(
  overrides: Partial<ShopifyCart> = {}
): ShopifyCart {
  const line = createCartItem();

  return {
    id: 'gid://shopify/Cart/1',
    checkoutUrl: 'https://checkout.shopify.com/cart/1',
    totalQuantity: 1,
    cost: {
      subtotalAmount: money('5.00'),
      totalAmount: money('5.00'),
      totalTaxAmount: money('0')
    },
    lines: {
      edges: [{ node: line }]
    },
    ...overrides
  };
}

export function createShopifyProduct(
  overrides: Partial<ShopifyProduct> = {}
): ShopifyProduct {
  const product = createProduct();

  return {
    ...product,
    variants: {
      edges: product.variants.map((variant) => ({ node: variant }))
    },
    images: {
      edges: [
        {
          node: {
            url: 'https://cdn.shopify.com/files/chocolate-chip.jpg',
            altText: '',
            width: 100,
            height: 100
          }
        }
      ]
    },
    ...overrides
  };
}
