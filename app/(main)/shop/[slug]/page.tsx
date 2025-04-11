import s from './product-detail-page.module.scss';

import { cn } from '@/lib/utils';

import { CustomizedPortableText } from '@/components/customized-portable-text';
import { FollowUs } from '@/components/follow-us';
import { IconCloud } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import { ProductHighlightCarousel } from '@/components/product-highlight-carousel';
import { ProductImages } from '@/components/product-images';
import { ProductSpecs } from '@/components/product-specs';
import { PurchasePanel } from '@/components/purchase-panel';
import { Wrapper } from '@/components/wrapper';

import { getRelatedProducts } from '@/lib/actions/related-products';
import { sanityFetch } from '@/lib/sanity/client';
import { PRODUCT_PAGE_QUERY } from '@/lib/sanity/productPage';
import { SanityProductPage } from '@/lib/sanity/types';
import { getProduct } from '@/lib/shopify';
import { extractShopifyId } from '@/lib/utils';

import OkendoWidget from '@/components/okendo-widget';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetialPage({
  params
}: ProductDetailPageProps) {
  const relatedProducts = await getRelatedProducts(params.slug);
  const sanityProduct = await sanityFetch<SanityProductPage>({
    query: PRODUCT_PAGE_QUERY,
    tags: ['productPage'],
    qParams: { slug: params.slug }
  });

  const shopifyProduct = await getProduct(params.slug);
  const productId = extractShopifyId(shopifyProduct?.id as string);

  console.log('sanityProduct', sanityProduct);

  // const imgs = [s1.src, s2.src, s3.src, s4.src, s1.src, s2.src, s3.src, s4.src];

  return (
    <Wrapper className="mb-48" colorTheme={sanityProduct.colorTheme}>
      <section
        className={cn(
          'container flex flex-col items-center gap-5 tablet:gap-0 tablet:grid grid-cols-24 tablet:items-stretch justify-stretch py-6 tablet:py-12 mb-20'
        )}
      >
        <div className="col-span-12 space-y-10">
          <ProductImages images={sanityProduct.images} />
          <ProductSpecs
            className="hidden tablet:grid"
            specs={sanityProduct.productSpecifications}
          />
        </div>
        <div className="col-span-12 flex flex-col items-stretch px-0 tablet:pl-20 tablet:pr-14 text-center tablet:text-left">
          <h1 className="text-primary font-bomstad-display text-4xl font-black">
            {sanityProduct.title}
          </h1>
          <small className="text-primary font-bomstad-display text-lg font-medium mb-8">
            1 PACK ( 12 COOKIES )
          </small>
          <CustomizedPortableText
            wrapperClassName="prose text-primary font-poppins text-sm font-normal mb-10"
            content={sanityProduct.description}
          />
          {/* purchase panel */}
          {shopifyProduct && <PurchasePanel shopifyProduct={shopifyProduct} />}
          {/* product specs */}
          <ProductSpecs
            className="grid tablet:hidden mt-10"
            specs={sanityProduct.productSpecifications}
          />
        </div>
      </section>
      {/* product reviews */}
      <section className={cn(s.reviews, 'my-24 tablet:my-32')}>
        <div className={s.cloudTop}>
          <IconCloud fill="var(--primary)" />
        </div>
        {/* {shopifyProduct && <CustomerReviews productId={productId} />} */}
        <div className="h-[500px]">
          <OkendoWidget productId={productId} />
        </div>
        <div className={s.cloudBottom}>
          <IconCloud rotate={180} fill="var(--primary)" />
        </div>
      </section>
      {/* related products */}
      {relatedProducts.length > 0 && (
        <section className={cn(s.highlights, 'pb-10 tablet:pb-20')}>
          {/* MOBILE */}
          <div className="block tablet:hidden">
            <ProductHighlightCarousel
              items={relatedProducts}
              options={{ loop: true }}
            />
          </div>
          {/* DESKTOP */}
          <div className="hidden tablet:block">
            <section
              className={cn(s.relatedProducts, 'flex flex-col items-center')}
            >
              <h2>Impossible to Choose Just One!</h2>
              <p>
                Can&apos;t decide? Try them all and discover your new favorite!
              </p>
              <div className="flex items-center justify-center gap-10 px-32">
                {relatedProducts?.map((item) => {
                  return (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      animatedCard={item}
                      variantId={item.shopifyProduct?.variants[0].id as string}
                      availableForSale={
                        item.shopifyProduct?.variants[0]
                          .availableForSale as boolean
                      }
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      )}
      <FollowUs />
    </Wrapper>
  );
}
