import { describe, expect, it } from 'vitest';
import { cartReducer, createEmptyCart } from '@/components/cart/cart-context';
import {
  createCart,
  createCartItem,
  createProduct,
  createVariant
} from '@/test/fixtures/shopify';

describe('cartReducer', () => {
  it('creates an empty cart when initial cart payload is missing', () => {
    expect(
      cartReducer(undefined, { type: 'SET_INITIAL_CART', payload: undefined })
    ).toEqual(createEmptyCart());
  });

  it('adds a new product variant and recalculates totals', () => {
    const variant = createVariant({
      id: 'gid://shopify/ProductVariant/2',
      price: { amount: '7.50', currencyCode: 'USD' }
    });
    const product = createProduct({
      id: 'gid://shopify/Product/2',
      title: 'Peanut Butter',
      handle: 'peanut-butter',
      variants: [variant]
    });

    const cart = cartReducer(createEmptyCart(), {
      type: 'ADD_ITEM',
      payload: { variant, product }
    });

    expect(cart.lines).toHaveLength(1);
    expect(cart.totalQuantity).toBe(1);
    expect(cart.cost.totalAmount.amount).toBe('7.5');
  });

  it('increments and decrements the matching one-time purchase line', () => {
    const oneTimeLine = createCartItem({
      id: 'line-one-time',
      quantity: 2,
      cost: { totalAmount: { amount: '10', currencyCode: 'USD' } }
    });
    const subscriptionLine = createCartItem({
      id: 'line-subscription',
      quantity: 1,
      cost: { totalAmount: { amount: '4.5', currencyCode: 'USD' } },
      sellingPlanAllocation: {
        sellingPlan: {
          id: 'gid://shopify/SellingPlan/1',
          name: 'Monthly',
          description: '',
          priceAdjustments: []
        }
      }
    });
    const cart = createCart({
      lines: [oneTimeLine, subscriptionLine]
    });

    const incremented = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: {
        merchandiseId: oneTimeLine.merchandise.id,
        updateType: 'plus'
      }
    });

    expect(
      incremented.lines.find((line) => line.id === 'line-one-time')
    ).toMatchObject({
      quantity: 3,
      cost: { totalAmount: { amount: '15' } }
    });
    expect(
      incremented.lines.find((line) => line.id === 'line-subscription')
        ?.quantity
    ).toBe(1);

    const decremented = cartReducer(incremented, {
      type: 'UPDATE_ITEM',
      payload: {
        merchandiseId: oneTimeLine.merchandise.id,
        updateType: 'minus'
      }
    });

    expect(
      decremented.lines.find((line) => line.id === 'line-one-time')?.quantity
    ).toBe(2);
  });

  it('removes a line when quantity reaches zero', () => {
    const line = createCartItem({
      quantity: 1,
      cost: { totalAmount: { amount: '5', currencyCode: 'USD' } }
    });
    const cart = createCart({ lines: [line] });

    const updated = cartReducer(cart, {
      type: 'UPDATE_ITEM',
      payload: {
        merchandiseId: line.merchandise.id,
        updateType: 'minus'
      }
    });

    expect(updated.lines).toEqual([]);
    expect(updated.totalQuantity).toBe(0);
    expect(updated.cost.totalAmount.amount).toBe('0');
  });
});
