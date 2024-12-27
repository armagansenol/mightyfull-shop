'use client';

import React, { useCallback } from 'react';
import { addItemTest } from '@/app/actions/cart';

interface AddToCartButtonClientProps {
  productVariantId: string;
}

const AddToCartButtonClient: React.FC<AddToCartButtonClientProps> = ({
  productVariantId
}) => {
  const add = useCallback(async () => {
    const res = await addItemTest(productVariantId);
    console.log('lol', res);
  }, [productVariantId]);

  return (
    <form action={add}>
      <button type="submit">ADD</button>
    </form>
  );
};

export default AddToCartButtonClient;
