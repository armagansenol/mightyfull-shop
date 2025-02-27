'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { batchUpdateCart } from './actions';
import { Loader2 } from 'lucide-react';

type BatchCartItem = {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string | null;
  title: string; // For display purposes
};

export function BatchCartOperations({
  items,
  onComplete
}: {
  items: BatchCartItem[];
  onComplete?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBatchUpdate = async () => {
    if (items.length === 0) {
      toast.error('No items to add to cart');
      return;
    }

    setIsLoading(true);

    try {
      // Convert items to the format expected by batchUpdateCart
      const operations = items.map((item) => ({
        type: 'add' as const,
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
        sellingPlanId: item.sellingPlanId
      }));

      const result = await batchUpdateCart(operations);

      if (result.success) {
        toast.success(`Added ${result.operations?.added || 0} items to cart`);
        if (onComplete) onComplete();
      } else {
        toast.error(result.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error performing batch cart update:', error);
      toast.error('Failed to update cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium">Add Multiple Items to Cart</h3>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>{item.title}</span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={handleBatchUpdate}
        disabled={isLoading || items.length === 0}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          `Add ${items.length} Items to Cart`
        )}
      </Button>
    </div>
  );
}

export default BatchCartOperations;
