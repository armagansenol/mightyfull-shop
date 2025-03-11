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
    console.log('addItem: Missing cart ID');
    return 'Missing cart ID. Please refresh the page and try again.';
  }

  if (!selectedVariantId) {
    console.log('addItem: Missing variant ID');
    return 'Please select a product variant before adding to cart.';
  }

  try {
    console.log(
      `addItem: Adding item ${selectedVariantId} to cart, quantity: ${quantity}, sellingPlanId: ${sellingPlanId || 'none'}`
    );

    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, sellingPlanId, quantity }
    ]);
    revalidateTag(TAGS.cart);

    console.log(
      `addItem: Successfully added item ${selectedVariantId} to cart`
    );
    return { success: true };
  } catch (e) {
    console.error('Error adding item to cart:', e);
    return `Error adding item to cart: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function removeItem(
  merchandiseId: string,
  sellingPlanId?: string | null
) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    console.log('removeItem: Missing cart ID');
    return 'Missing cart ID';
  }

  if (!merchandiseId) {
    console.log('removeItem: Missing product information');
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      console.log('removeItem: Error fetching cart');
      return 'Error fetching cart';
    }

    // Find the line item matching both merchandiseId and sellingPlanId
    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        // Match items with the same selling plan status
        ((sellingPlanId &&
          line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
          // Or match items with no selling plan when sellingPlanId is null/undefined
          (!sellingPlanId && !line.sellingPlanAllocation))
    );

    if (lineItem && lineItem.id) {
      console.log(
        `removeItem: Removing item ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from cart`
      );

      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);

      console.log(
        `removeItem: Successfully removed item ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from cart`
      );
      return { success: true, message: 'Item removed from cart' };
    } else {
      console.log(
        `removeItem: Item not found in cart - ${merchandiseId} with selling plan ${sellingPlanId || 'none'}`
      );
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
  currentSellingPlanId?: string | null;
}) {
  console.log('payload', payload);

  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    console.log('updateItemSellingPlanOption: Missing cart ID');
    return 'Missing cart ID';
  }

  const { merchandiseId, sellingPlanId, currentSellingPlanId } = payload;

  if (!merchandiseId) {
    console.log('updateItemSellingPlanOption: Missing product information');
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      console.log('updateItemSellingPlanOption: Error fetching cart');
      return 'Error fetching cart';
    }

    // Find the line item matching both merchandiseId and currentSellingPlanId
    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        // Match items with the same selling plan status
        ((currentSellingPlanId &&
          line.sellingPlanAllocation?.sellingPlan?.id ===
            currentSellingPlanId) ||
          // Or match items with no selling plan when currentSellingPlanId is null/undefined
          (!currentSellingPlanId && !line.sellingPlanAllocation))
    );

    if (lineItem && lineItem.id) {
      console.log(
        `updateItemSellingPlanOption: Updating selling plan for ${merchandiseId} from ${currentSellingPlanId || 'one-time purchase'} to ${sellingPlanId || 'one-time purchase'}`
      );

      await updateCart(cartId, [
        {
          id: lineItem.id,
          merchandiseId,
          quantity: lineItem.quantity,
          sellingPlanId: sellingPlanId || undefined
        }
      ]);
      revalidateTag(TAGS.cart);

      console.log(
        `updateItemSellingPlanOption: Successfully updated selling plan for ${merchandiseId}`
      );
      return {
        success: true,
        message: sellingPlanId
          ? 'Subscription option updated'
          : 'One-time purchase option selected'
      };
    } else {
      console.log(
        `updateItemSellingPlanOption: Item not found in cart - ${merchandiseId} with selling plan ${currentSellingPlanId || 'none'}`
      );
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
    currentSellingPlanId?: string | null;
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
      const {
        type,
        merchandiseId,
        quantity = 1,
        sellingPlanId,
        currentSellingPlanId
      } = operation;

      // Convert null sellingPlanId to undefined as required by the API
      const formattedSellingPlanId =
        sellingPlanId === null ? undefined : sellingPlanId;

      if (type === 'add') {
        // Check if this item is already in the cart with the same selling plan
        const existingLine = cart.lines.find(
          (line) =>
            line.merchandise.id === merchandiseId &&
            // Match items with the same selling plan status
            ((sellingPlanId &&
              line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
              // Or match items with no selling plan when sellingPlanId is null/undefined
              (!sellingPlanId && !line.sellingPlanAllocation))
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
        // Find the line item matching both merchandiseId and sellingPlanId
        const lineItem = cart.lines.find(
          (line) =>
            line.merchandise.id === merchandiseId &&
            // Match items with the same selling plan status
            ((currentSellingPlanId &&
              line.sellingPlanAllocation?.sellingPlan?.id ===
                currentSellingPlanId) ||
              // Or match items with no selling plan when currentSellingPlanId is null/undefined
              (!currentSellingPlanId && !line.sellingPlanAllocation))
        );

        if (lineItem && lineItem.id) {
          removeLineIds.push(lineItem.id);
        }
      } else if (type === 'update') {
        // For updates, we need to find the item with the current selling plan
        const lineItem = cart.lines.find(
          (line) =>
            line.merchandise.id === merchandiseId &&
            // Match items with the same selling plan status
            ((currentSellingPlanId &&
              line.sellingPlanAllocation?.sellingPlan?.id ===
                currentSellingPlanId) ||
              // Or match items with no selling plan when currentSellingPlanId is null/undefined
              (!currentSellingPlanId && !line.sellingPlanAllocation))
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

export async function incrementItemQuantity(
  merchandiseId: string,
  maxQuantity: number = 10,
  sellingPlanId?: string | null
) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    console.log('incrementItemQuantity: Missing cart ID');
    return 'Missing cart ID';
  }

  if (!merchandiseId) {
    console.log('incrementItemQuantity: Missing product information');
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      console.log('incrementItemQuantity: Error fetching cart');
      return 'Error fetching cart';
    }

    // Find the line item matching both merchandiseId and sellingPlanId
    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        // Match items with the same selling plan status
        ((sellingPlanId &&
          line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
          // Or match items with no selling plan when sellingPlanId is null/undefined
          (!sellingPlanId && !line.sellingPlanAllocation))
    );

    if (!lineItem) {
      console.log(
        `incrementItemQuantity: Item not found in cart - ${merchandiseId} with selling plan ${sellingPlanId || 'none'}`
      );
      return 'Item not found in cart';
    }

    // Don't increment if already at max quantity
    if (lineItem.quantity >= maxQuantity) {
      console.log(
        `incrementItemQuantity: Maximum quantity (${maxQuantity}) reached for ${merchandiseId}`
      );
      return {
        success: false,
        message: `Maximum quantity (${maxQuantity}) reached`
      };
    }

    const newQuantity = lineItem.quantity + 1;
    console.log(
      `incrementItemQuantity: Increasing quantity for ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from ${lineItem.quantity} to ${newQuantity}`
    );

    if (lineItem.id) {
      await updateCart(cartId, [
        {
          id: lineItem.id,
          merchandiseId,
          quantity: newQuantity,
          sellingPlanId: sellingPlanId || undefined
        }
      ]);

      revalidateTag(TAGS.cart);
      console.log(
        `incrementItemQuantity: Successfully updated quantity for ${merchandiseId} with selling plan ${sellingPlanId || 'none'} to ${newQuantity}`
      );
      return {
        success: true,
        message: 'Quantity increased successfully',
        newQuantity
      };
    }

    console.log(
      `incrementItemQuantity: Error updating cart item - ${merchandiseId}`
    );
    return 'Error updating cart item';
  } catch (e) {
    console.error('Error incrementing item quantity:', e);
    return `Error incrementing item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function decrementItemQuantity(
  merchandiseId: string,
  sellingPlanId?: string | null
) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    console.log('decrementItemQuantity: Missing cart ID');
    return 'Missing cart ID';
  }

  if (!merchandiseId) {
    console.log('decrementItemQuantity: Missing product information');
    return 'Missing product information';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      console.log('decrementItemQuantity: Error fetching cart');
      return 'Error fetching cart';
    }

    // Find the line item matching both merchandiseId and sellingPlanId
    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        // Match items with the same selling plan status
        ((sellingPlanId &&
          line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
          // Or match items with no selling plan when sellingPlanId is null/undefined
          (!sellingPlanId && !line.sellingPlanAllocation))
    );

    if (!lineItem) {
      console.log(
        `decrementItemQuantity: Item not found in cart - ${merchandiseId} with selling plan ${sellingPlanId || 'none'}`
      );
      return 'Item not found in cart';
    }

    // If quantity is 1, remove the item
    if (lineItem.quantity <= 1) {
      console.log(
        `decrementItemQuantity: Removing item ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from cart (quantity was 1)`
      );
      if (lineItem.id) {
        await removeFromCart(cartId, [lineItem.id]);
        revalidateTag(TAGS.cart);
        console.log(
          `decrementItemQuantity: Successfully removed item ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from cart`
        );
        return {
          success: true,
          message: 'Item removed from cart',
          newQuantity: 0
        };
      }
    } else {
      // Otherwise decrement the quantity
      const newQuantity = lineItem.quantity - 1;
      console.log(
        `decrementItemQuantity: Decreasing quantity for ${merchandiseId} with selling plan ${sellingPlanId || 'none'} from ${lineItem.quantity} to ${newQuantity}`
      );

      if (lineItem.id) {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity: newQuantity,
            sellingPlanId: sellingPlanId || undefined
          }
        ]);

        revalidateTag(TAGS.cart);
        console.log(
          `decrementItemQuantity: Successfully updated quantity for ${merchandiseId} with selling plan ${sellingPlanId || 'none'} to ${newQuantity}`
        );
        return {
          success: true,
          message: 'Quantity decreased successfully',
          newQuantity
        };
      }
    }

    console.log(
      `decrementItemQuantity: Error updating cart item - ${merchandiseId}`
    );
    return 'Error updating cart item';
  } catch (e) {
    console.error('Error decrementing item quantity:', e);
    return `Error decrementing item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}
