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

/**
 * Helper function to check for and remove any zero-quantity items from the cart
 * @param cartId The cart ID to check
 * @returns True if any items were removed, false otherwise
 */
async function cleanupZeroQuantityItems(
  cartId: string,
  maxRetries = 2
): Promise<boolean> {
  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return false;
    }

    // Find any line items with zero quantity
    const zeroQuantityItems = cart.lines.filter((line) => line.quantity === 0);

    // Debug: Log zero quantity items if found
    if (zeroQuantityItems.length > 0) {
      console.log(
        `Found ${zeroQuantityItems.length} zero-quantity items to remove:`,
        JSON.stringify(
          zeroQuantityItems.map((item) => ({
            id: item.id,
            merchandiseId: item.merchandise.id,
            quantity: item.quantity
          })),
          null,
          2
        )
      );
    }

    if (zeroQuantityItems.length === 0) {
      return false; // No cleanup needed
    }

    // Extract the line IDs to remove
    const lineIdsToRemove = zeroQuantityItems
      .filter((item) => item.id)
      .map((item) => item.id as string);

    if (lineIdsToRemove.length > 0) {
      console.log(
        `Removing ${lineIdsToRemove.length} zero-quantity items:`,
        lineIdsToRemove
      );

      // Perform the removal
      await removeFromCart(cartId, lineIdsToRemove);
      revalidateTag(TAGS.cart);

      // Verify removal was successful
      const updatedCart = await getCart(cartId);
      const remainingZeroItems =
        updatedCart?.lines.filter((line) => line.quantity === 0) || [];

      if (remainingZeroItems.length > 0) {
        console.log(
          `Warning: ${remainingZeroItems.length} zero-quantity items still remain after cleanup`
        );

        // If we still have retries left, try again
        if (maxRetries > 0) {
          console.log(`Retrying cleanup (${maxRetries} retries left)...`);
          // Wait a short time before retrying to allow Shopify to process the previous request
          await new Promise((resolve) => setTimeout(resolve, 500));
          return await cleanupZeroQuantityItems(cartId, maxRetries - 1);
        }
      } else {
        console.log('Successfully removed all zero-quantity items');
      }

      return true;
    }

    return false;
  } catch (e) {
    console.error('Error cleaning up zero-quantity items:', e);
    return false;
  }
}

/**
 * Wrapper function to intercept cart operations and ensure cart integrity
 * @param cartId The cart ID
 * @param operation The cart operation to perform
 * @returns The result of the operation
 */
async function withCartCleanup<T>(
  cartId: string | undefined,
  operation: () => Promise<T>
): Promise<T> {
  if (!cartId) {
    return operation();
  }

  try {
    // Perform the requested operation
    const result = await operation();

    console.log('Operation completed, running cart cleanup...');

    // Clean up any zero-quantity items
    const cleanupResult = await cleanupZeroQuantityItems(cartId);

    if (cleanupResult) {
      console.log('Cart cleanup completed: items were removed');
    } else {
      console.log('Cart cleanup completed: no items needed removal');
    }

    return result;
  } catch (error) {
    // If the operation fails, still try to clean up the cart
    console.log('Operation failed, attempting cart cleanup anyway...');

    try {
      await cleanupZeroQuantityItems(cartId);
    } catch (cleanupError) {
      console.error('Error during cart cleanup:', cleanupError);
    }

    throw error;
  }
}

/**
 * Helper function to format error messages for toast display
 * @param error The error object or message
 * @returns A formatted error message string
 */
function formatErrorForToast(error: unknown): string {
  if (error instanceof Error) {
    // Extract the most user-friendly part of the error
    return error.message.includes('GraphQL error:')
      ? error.message.split('GraphQL error:')[1].trim()
      : error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}

export async function addItem(
  selectedVariantId: string | undefined,
  quantity: number,
  sellingPlanId?: string | undefined
) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return {
      success: false,
      message: 'Missing cart ID. Please refresh the page and try again.'
    };
  }

  if (!selectedVariantId) {
    return {
      success: false,
      message: 'Please select a product variant before adding to cart.'
    };
  }

  // Ensure quantity is at least 1
  if (quantity <= 0) {
    quantity = 1;
  }

  try {
    return await withCartCleanup(cartId, async () => {
      // First check if this item already exists in the cart
      const currentCart = await getCart(cartId);

      if (currentCart) {
        // Find existing line items with the same variant and selling plan
        const existingItems = currentCart.lines.filter(
          (line) =>
            line.merchandise.id === selectedVariantId &&
            // Match items with the same selling plan status
            ((sellingPlanId &&
              line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
              // Or match items with no selling plan when sellingPlanId is null/undefined
              (!sellingPlanId && !line.sellingPlanAllocation))
        );

        // If we found existing items, update them instead of adding new ones
        if (existingItems.length > 0) {
          // Get the first non-zero quantity item, or the first item if all are zero
          const itemToUpdate =
            existingItems.find((item) => item.quantity > 0) || existingItems[0];

          if (itemToUpdate && itemToUpdate.id) {
            const newQuantity =
              (itemToUpdate.quantity > 0 ? itemToUpdate.quantity : 0) +
              quantity;

            // Update the existing item
            await updateCart(cartId, [
              {
                id: itemToUpdate.id,
                merchandiseId: selectedVariantId,
                quantity: newQuantity,
                sellingPlanId: sellingPlanId || undefined
              }
            ]);

            revalidateTag(TAGS.cart);

            return {
              success: true,
              message: 'Item quantity updated successfully'
            };
          }
        }
      }

      // If no existing items or couldn't update, add as new
      await addToCart(cartId, [
        { merchandiseId: selectedVariantId, sellingPlanId, quantity }
      ]);

      revalidateTag(TAGS.cart);

      return { success: true, message: 'Item added to cart successfully' };
    });
  } catch (e) {
    console.error('Error adding item to cart:', e);
    return {
      success: false,
      message: formatErrorForToast(e)
    };
  }
}

export async function removeItem(lineId: string) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  if (!lineId) {
    return 'Missing line ID';
  }

  try {
    return await withCartCleanup(cartId, async () => {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);

      return { success: true, message: 'Item removed from cart' };
    });
  } catch (e) {
    console.error('Error removing item from cart:', e);
    return `Error removing item from cart: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function updateItemQuantity(payload: {
  merchandiseId: string;
  quantity: number;
}) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { merchandiseId, quantity } = payload;

  if (!merchandiseId) {
    return 'Missing product information';
  }

  try {
    return await withCartCleanup(cartId, async () => {
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
    });
  } catch (e) {
    console.error('Error updating item quantity:', e);
    return `Error updating item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function redirectToCheckout() {
  try {
    const cartId = await cookies().get('cartId')?.value;

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
  lineId: string;
  merchandiseId: string;
  sellingPlanId: string | null;
  currentSellingPlanId?: string | null;
}) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, merchandiseId, sellingPlanId } = payload;

  if (!lineId || !merchandiseId) {
    return 'Missing required information';
  }

  try {
    return await withCartCleanup(cartId, async () => {
      // If we're trying to reset to one-time purchase (sellingPlanId is null)
      if (sellingPlanId === null) {
        // First, remove the item
        await removeFromCart(cartId, [lineId]);

        // Then add it back without a selling plan
        const cart = await getCart(cartId);
        const lineItem = cart?.lines.find((line) => line.id === lineId);
        const quantity = lineItem?.quantity || 1;

        await addToCart(cartId, [
          {
            merchandiseId,
            quantity
            // No sellingPlanId property at all
          }
        ]);
      } else {
        // For adding or changing a subscription, use the normal update approach
        const cart = await getCart(cartId);
        const lineItem = cart?.lines.find((line) => line.id === lineId);
        const quantity = lineItem?.quantity || 1;

        // Create the update object
        const updateObject = {
          id: lineId,
          merchandiseId,
          quantity,
          sellingPlanId
        };

        await updateCart(cartId, [updateObject]);
      }

      revalidateTag(TAGS.cart);

      return {
        success: true,
        message: sellingPlanId
          ? 'Subscription option updated'
          : 'One-time purchase option selected'
      };
    });
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
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return {
      success: false,
      message: 'Missing cart ID. Please refresh the page and try again.'
    };
  }

  try {
    return await withCartCleanup(cartId, async () => {
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
                line.sellingPlanAllocation?.sellingPlan?.id ===
                  sellingPlanId) ||
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
        updateOperations.length > 0
          ? updateCart(cartId, updateOperations)
          : null
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
    });
  } catch (e) {
    console.error('Error performing batch cart update:', e);
    return {
      success: false,
      message: `Error updating cart: ${e instanceof Error ? e.message : 'Unknown error'}`
    };
  }
}

export async function incrementItemQuantity(
  lineId: string,
  maxQuantity: number = 10
) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  if (!lineId) {
    return 'Missing line ID';
  }

  try {
    return await withCartCleanup(cartId, async () => {
      const cart = await getCart(cartId);

      if (!cart) {
        return 'Error fetching cart';
      }

      // Find the line item by lineId
      const lineItem = cart.lines.find((line) => line.id === lineId);

      if (!lineItem) {
        return 'Item not found in cart';
      }

      // Don't increment if already at max quantity
      if (lineItem.quantity >= maxQuantity) {
        return {
          success: false,
          message: `Maximum quantity (${maxQuantity}) reached`
        };
      }

      const newQuantity = lineItem.quantity + 1;

      await updateCart(cartId, [
        {
          id: lineId,
          merchandiseId: lineItem.merchandise.id,
          quantity: newQuantity,
          sellingPlanId:
            lineItem.sellingPlanAllocation?.sellingPlan?.id || undefined
        }
      ]);

      revalidateTag(TAGS.cart);
      return {
        success: true,
        message: 'Quantity increased successfully',
        newQuantity
      };
    });
  } catch (e) {
    console.error('Error incrementing item quantity:', e);
    return `Error incrementing item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

export async function decrementItemQuantity(lineId: string) {
  const cartId = await cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  if (!lineId) {
    return 'Missing line ID';
  }

  try {
    return await withCartCleanup(cartId, async () => {
      const cart = await getCart(cartId);

      if (!cart) {
        return 'Error fetching cart';
      }

      // Find the line item by lineId
      const lineItem = cart.lines.find((line) => line.id === lineId);

      if (!lineItem) {
        return 'Item not found in cart';
      }

      // If quantity is 1, remove the item
      if (lineItem.quantity <= 1) {
        await removeFromCart(cartId, [lineId]);
        revalidateTag(TAGS.cart);
        return {
          success: true,
          message: 'Item removed from cart',
          newQuantity: 0
        };
      } else {
        // Otherwise decrement the quantity
        const newQuantity = lineItem.quantity - 1;

        await updateCart(cartId, [
          {
            id: lineId,
            merchandiseId: lineItem.merchandise.id,
            quantity: newQuantity,
            sellingPlanId:
              lineItem.sellingPlanAllocation?.sellingPlan?.id || undefined
          }
        ]);

        revalidateTag(TAGS.cart);
        return {
          success: true,
          message: 'Quantity decreased successfully',
          newQuantity
        };
      }
    });
  } catch (e) {
    console.error('Error decrementing item quantity:', e);
    return `Error decrementing item quantity: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}
