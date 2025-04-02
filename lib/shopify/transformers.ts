import {
  Cart,
  Connection,
  Image,
  Product,
  ShopifyCart,
  ShopifyProduct
} from './types';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';

export class ShopifyTransformer {
  static removeEdgesAndNodes<T>(array: Connection<T>): T[] {
    return array.edges.map((edge) => edge?.node);
  }

  static reshapeCart(cart: ShopifyCart): Cart {
    if (!cart.cost?.totalTaxAmount) {
      cart.cost.totalTaxAmount = {
        amount: '0.0',
        currencyCode: cart.cost.totalAmount.currencyCode
      };
    }

    return {
      ...cart,
      lines: this.removeEdgesAndNodes(cart.lines)
    };
  }

  static reshapeImages(images: Connection<Image>, productTitle: string) {
    const flattened = this.removeEdgesAndNodes(images);

    return flattened.map((image) => {
      const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
      return {
        ...image,
        altText: image.altText || `${productTitle} - ${filename}`
      };
    });
  }

  static reshapeProduct(
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true
  ): Product | undefined {
    if (
      !product ||
      (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
    ) {
      return undefined;
    }

    const { images, variants, ...rest } = product;

    return {
      ...rest,
      images: this.reshapeImages(images, product.title),
      variants: this.removeEdgesAndNodes(variants)
    };
  }

  static reshapeProducts(products: ShopifyProduct[]): Product[] {
    return products
      .filter(Boolean)
      .map((product) => this.reshapeProduct(product))
      .filter((product): product is Product => product !== undefined);
  }

  static validateCart(cart: ShopifyCart): void {
    if (!cart.id) throw new Error('Cart ID is required');
    if (!cart.lines) throw new Error('Cart lines are required');
    if (!cart.cost) throw new Error('Cart cost is required');
  }

  static validateProduct(product: ShopifyProduct): void {
    if (!product.id) throw new Error('Product ID is required');
    if (!product.title) throw new Error('Product title is required');
    if (!product.handle) throw new Error('Product handle is required');
  }
}
