import s from './shop.module.scss';

import cn from 'clsx';

import { ProductCard } from '@/components/product-card';
import { Wrapper } from '@/components/wrapper';
import { getAllProducts } from '@/lib/actions/all-products';
import { defaultColorTheme } from '@/lib/constants';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Wrapper colorTheme={defaultColorTheme}>
      <section className={cn(s.shop, 'flex flex-col items-center')}>
        <h2>Impossible to Choose Just One!</h2>
        <p>Can&apos;t decide? Try them all and discover your new favorite!</p>
        <div className="flex flex-col items-center tablet:grid grid-cols-4 gap-16 mt-10 tablet:mt-20 px-4 tablet:px-0">
          {products.map((item) => {
            const product = item.shopifyProduct;
            return (
              <ProductCard
                key={item.id}
                id={item.id}
                animatedCard={item}
                variantId={product?.variants[0].id as string}
                availableForSale={
                  product?.variants[0].availableForSale as boolean
                }
              />
            );
          })}
        </div>
      </section>
    </Wrapper>
  );
}
