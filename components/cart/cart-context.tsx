'use client';

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant
} from '@/lib/shopify/types';
import { CartUpdateType } from '@/types';
import { createContext, useContext } from 'react';

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: {
        merchandiseId: string;
        updateType: CartUpdateType;
        sellingPlanId?: string | null;
      };
    }
  | {
      type: 'ADD_ITEM';
      payload: { variant: ProductVariant; product: Product };
    }
  | { type: 'SET_INITIAL_CART'; payload: Cart | undefined }
  | {
      type: 'UPDATE_SELLING_PLAN';
      payload: {
        merchandiseId: string;
        sellingPlanId: string | null;
        currentSellingPlanId?: string | null;
      };
    };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItemSellingPlan: (
    merchandiseId: string,
    sellingPlanId: string | null
  ) => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: CartUpdateType
): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString()
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount
      }
    }
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode
      }
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        sellingPlanGroups: product.sellingPlanGroups,
        variants: {
          edges: product.variants.map((variant) => ({ node: variant }))
        }
      }
    }
  };
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

export function createEmptyCart(): Cart {
  console.log('createEmptyCart');

  return {
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };
}

export function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { merchandiseId, updateType, sellingPlanId } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId &&
          // Match items with the same selling plan status
          ((sellingPlanId &&
            item.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
            // Or match items with no selling plan when sellingPlanId is null/undefined
            (!sellingPlanId && !item.sellingPlanAllocation))
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        const emptyCart = {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: '0' }
          }
        };
        console.log('Cart updated (UPDATE_ITEM - now empty):', emptyCart);
        return emptyCart;
      }

      const updatedCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines
      };
      console.log('Cart updated (UPDATE_ITEM):', {
        totalQuantity: updatedCart.totalQuantity,
        totalAmount: updatedCart.cost.totalAmount.amount,
        items: updatedCart.lines.map((item) => ({
          id: item.merchandise.id,
          title: item.merchandise.product.title,
          quantity: item.quantity,
          amount: item.cost.totalAmount.amount
        }))
      });
      return updatedCart;
    }
    case 'ADD_ITEM': {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      const updatedCart = {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines
      };
      console.log('Cart updated (ADD_ITEM):', {
        totalQuantity: updatedCart.totalQuantity,
        totalAmount: updatedCart.cost.totalAmount.amount,
        items: updatedCart.lines.map((item) => ({
          id: item.merchandise.id,
          title: item.merchandise.product.title,
          quantity: item.quantity,
          amount: item.cost.totalAmount.amount
        }))
      });
      return updatedCart;
    }
    case 'SET_INITIAL_CART': {
      const initialCart = action.payload || createEmptyCart();
      console.log('Cart initialized:', {
        totalQuantity: initialCart.totalQuantity,
        totalAmount: initialCart.cost.totalAmount.amount,
        items: initialCart.lines.map((item) => ({
          id: item.merchandise.id,
          title: item.merchandise.product.title,
          quantity: item.quantity,
          amount: item.cost.totalAmount.amount
        }))
      });
      return initialCart;
    }
    case 'UPDATE_SELLING_PLAN': {
      const { merchandiseId, sellingPlanId, currentSellingPlanId } =
        action.payload;

      // Find the current line item to preserve its quantity
      const currentLine = currentCart.lines.find(
        (line) =>
          line.merchandise.id === merchandiseId &&
          ((currentSellingPlanId &&
            line.sellingPlanAllocation?.sellingPlan?.id ===
              currentSellingPlanId) ||
            (!currentSellingPlanId && !line.sellingPlanAllocation))
      );

      if (!currentLine) return currentCart;

      // Create a new line item with the same quantity but updated selling plan
      const updatedLines = currentCart.lines.map((line) => {
        if (line.id === currentLine.id) {
          return {
            ...line,
            sellingPlanAllocation: sellingPlanId
              ? {
                  sellingPlan: {
                    id: sellingPlanId,
                    name: '', // This will be updated by the server
                    description: '',
                    priceAdjustments: []
                  },
                  priceAdjustments: []
                }
              : null
          };
        }
        return line;
      });

      // Update cart with new lines and recalculate totals
      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines
      };
    }
    default:
      return currentCart;
  }
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
