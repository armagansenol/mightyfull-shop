# EditSellingPlanButton Component

This component allows users to switch between one-time purchases and subscription options for items in their cart.

## Features

- Displays a "Upgrade to Subscription and Save 10%" button when no subscription is selected
- Shows current subscription status when a subscription is active
- Provides a dropdown to select from available subscription plans
- Handles loading states during updates
- Displays error messages when updates fail
- Optimistic UI updates for better user experience

## Props

- `item`: The cart item to modify
- `sellingPlanGroups`: Available selling plan groups for the item
- `optimisticUpdate`: Function to update the UI optimistically before the server response

## Usage

```tsx
import { EditSellingPlanButton } from '@/components/cart/edit-selling-plan-button';

// Inside your component
<EditSellingPlanButton
  item={cartItem}
  sellingPlanGroups={cartItem.merchandise.product.sellingPlanGroups.nodes}
  optimisticUpdate={updateSellingPlan}
/>
```

## Implementation Details

- Uses the `updateItemSellingPlanOption` action to update the cart on the server
- Provides visual feedback during loading states
- Handles error states gracefully
- Shows different UI states based on current subscription status
- Allows users to easily switch between subscription options or revert to one-time purchase 