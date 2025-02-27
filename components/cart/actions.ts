'use server';

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from '@/lib/shopify';
import { TAGS } from '@/lib/constants';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  selectedVariantId: string | undefined,
  quantity: number,
  sellingPlanId?: string | undefined
) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID. Please refresh the page and try again.';
  }

  if (!selectedVariantId) {
    return 'Please select a product variant before adding to cart.';
  }

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, sellingPlanId, quantity }
    ]);
    revalidateTag(TAGS.cart);
    return { success: true };
  } catch (e) {
    console.error('Error adding item to cart:', e);
    return `Error adding item to cart: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function removeItem(merchandiseId: string) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  if (!merchandiseId) {
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
      return { success: true, message: 'Item removed from cart' };
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    console.error('Error removing item from cart:', e);
    return `Error removing item from cart: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function updateItemQuantity(payload: {
  merchandiseId: string;
  quantity: number;
}) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { merchandiseId, quantity } = payload;

  if (!merchandiseId) {
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
    return { success: true, message: 'Cart updated successfully' };
  } catch (e) {
    console.error('Error updating item quantity:', e);
    return `Error updating item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function redirectToCheckout() {
  try {
    const cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
      throw new Error('No cart found. Please add items to your cart first.');
    }

    const cart = await getCart(cartId);

    if (!cart) {
      throw new Error('Unable to find your cart. Please try again.');
    }

    if (!cart.checkoutUrl) {
      throw new Error('Checkout URL not available. Please try again later.');
    }

    if (cart.lines.length === 0) {
      throw new Error(
        'Your cart is empty. Please add items before checking out.'
      );
    }

    redirect(cart.checkoutUrl);
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    // Since we can't return an error from a redirect function,
    // we'll have to handle this error in the UI component that calls this function
    throw error;
  }
}

export async function createCartAndSetCookie() {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get('cartId')?.value;

  // Check if there's an existing cart first
  if (existingCartId) {
    try {
      const existingCart = await getCart(existingCartId);
      if (existingCart) {
        return existingCart;
      }
    } catch (error) {
      console.error('Error fetching existing cart:', error);
      // Continue to create a new cart if the existing one is invalid
    }
  }

  // Only create new cart if no existing valid cart is found
  try {
    const cart = await createCart();

    // Set the cart cookie with a 30-day expiration
    cookieStore.set('cartId', cart.id!, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return cart;
  } catch (error) {
    console.error('Error creating new cart:', error);
    throw new Error('Failed to create a new shopping cart');
  }
}

export async function updateItemSellingPlanOption(payload: {
  merchandiseId: string;
  sellingPlanId: string | null;
}) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { merchandiseId, sellingPlanId } = payload;

  if (!merchandiseId) {
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await updateCart(cartId, [
        {
          id: lineItem.id,
          merchandiseId,
          quantity: lineItem.quantity,
          sellingPlanId: sellingPlanId || undefined
        }
      ]);
      revalidateTag(TAGS.cart);
      return {
        success: true,
        message: sellingPlanId
          ? 'Subscription option updated'
          : 'One-time purchase option selected'
      };
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    console.error('Error updating selling plan:', e);
    return `Error updating selling plan: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

/**
 * Performs multiple cart operations in a single batch to reduce API calls
 * @param operations Array of cart operations to perform
 * @returns Result of the batch operation
 */
export async function batchUpdateCart(
  operations: {
    type: 'add' | 'remove' | 'update';
    merchandiseId: string;
    quantity?: number;
    sellingPlanId?: string | null;
  }[]
) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return {
      success: false,
      message: 'Missing cart ID. Please refresh the page and try again.'
    };
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return { success: false, message: 'Error fetching cart' };
    }

    // Group operations by type to minimize API calls
    const addOperations: {
      merchandiseId: string;
      quantity: number;
      sellingPlanId?: string;
    }[] = [];
    const removeLineIds: string[] = [];
    const updateOperations: {
      id: string;
      merchandiseId: string;
      quantity: number;
      sellingPlanId?: string;
    }[] = [];

    // Process each operation and group them
    for (const operation of operations) {
      const { type, merchandiseId, quantity = 1, sellingPlanId } = operation;

      // Convert null sellingPlanId to undefined as required by the API
      const formattedSellingPlanId =
        sellingPlanId === null ? undefined : sellingPlanId;

      if (type === 'add') {
        // Check if this item is already in the cart
        const existingLine = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );

        if (existingLine && existingLine.id) {
          // If it exists and has an ID, update it instead of adding
          updateOperations.push({
            id: existingLine.id,
            merchandiseId,
            quantity: existingLine.quantity + quantity,
            sellingPlanId: formattedSellingPlanId
          });
        } else {
          // Otherwise add it
          addOperations.push({
            merchandiseId,
            quantity,
            sellingPlanId: formattedSellingPlanId
          });
        }
      } else if (type === 'remove') {
        const lineItem = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );
        if (lineItem && lineItem.id) {
          removeLineIds.push(lineItem.id);
        }
      } else if (type === 'update') {
        const lineItem = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );
        if (lineItem && lineItem.id) {
          if (quantity === 0) {
            removeLineIds.push(lineItem.id);
          } else {
            updateOperations.push({
              id: lineItem.id,
              merchandiseId,
              quantity,
              sellingPlanId: formattedSellingPlanId
            });
          }
        } else if (quantity > 0) {
          // If the item doesn't exist in the cart and quantity > 0, add it
          addOperations.push({
            merchandiseId,
            quantity,
            sellingPlanId: formattedSellingPlanId
          });
        }
      }
    }

    // Execute the grouped operations
    await Promise.all([
      // Only call APIs if there are operations to perform
      addOperations.length > 0 ? addToCart(cartId, addOperations) : null,
      removeLineIds.length > 0 ? removeFromCart(cartId, removeLineIds) : null,
      updateOperations.length > 0 ? updateCart(cartId, updateOperations) : null
    ]);

    revalidateTag(TAGS.cart);
    return {
      success: true,
      message: 'Cart updated successfully',
      operations: {
        added: addOperations.length,
        removed: removeLineIds.length,
        updated: updateOperations.length
      }
    };
  } catch (e) {
    console.error('Error performing batch cart update:', e);
    return {
      success: false,
      message: `Error updating cart: ${e instanceof Error ? e.message : 'Unknown error'}`
    };
  }
}
