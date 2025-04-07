import s from './product-detail-page.module.scss';

import cn from 'clsx';

import { CustomizedPortableText } from '@/components/customized-portable-text';
import { FollowUs } from '@/components/follow-us';
import { IconCloud } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import { ProductHighlightCarousel } from '@/components/product-highlight-carousel';
import { ProductImages } from '@/components/product-images';
import { PurchasePanel } from '@/components/purchase-panel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
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

  // const imgs = [s1.src, s2.src, s3.src, s4.src, s1.src, s2.src, s3.src, s4.src];

  return (
    <Wrapper colorTheme={sanityProduct.colorTheme}>
      <div
        className={cn(s.productPage, 'pt-7 tablet:pt-20 mb-20 tablet:mb-60')}
      >
        <section
          className={cn(
            s.intro,
            'flex flex-col items-center tablet:grid grid-cols-11 gap-10 tablet:gap-20 tablet:items-stretch justify-stretch py-20 mb-20 tablet:mb-52'
          )}
        >
          <div className="col-span-6 space-y-10">
            <ProductImages images={sanityProduct.images} />
            {sanityProduct.specs.length > 0 && (
              <section
                className={cn(s.specs, 'hidden tablet:grid grid-cols-12 gap-5')}
              >
                <Accordion
                  className="col-span-12 tablet:col-span-10 tablet:col-start-3"
                  type="multiple"
                >
                  {sanityProduct.specs.map((item, i) => {
                    return (
                      <AccordionItem value={`${i}`} className={s.spec} key={i}>
                        <AccordionTrigger
                          className={cn(
                            s.accordionTrigger,
                            'flex items-center justify-between py-10 w-full'
                          )}
                        >
                          <h3 className={s.title}>{item.title}</h3>
                        </AccordionTrigger>
                        <AccordionContent className="pb-10">
                          <div className={s.description}>
                            <CustomizedPortableText
                              content={item.description}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            )}
          </div>
          <div className="col-span-5 flex flex-col items-stretch">
            <h1 className={s.productTitle}>{sanityProduct.title}</h1>
            <p className={s.productPackInfo}>1 PACK ( 12 COOKIES )</p>
            <div className={s.productDescription}>
              <CustomizedPortableText content={sanityProduct.description} />
            </div>
            {/* {shopifyProduct && (
              <AddToCartButtonClient
                productVariantId={shopifyProduct.variants[0].id}
              />
            )} */}
            {shopifyProduct && (
              <PurchasePanel shopifyProduct={shopifyProduct} />
            )}
            {sanityProduct.specs.length > 0 && (
              <section
                className={cn(
                  s.specs,
                  'grid tablet:hidden grid-cols-12 gap-5 mt-10'
                )}
              >
                <Accordion
                  className="col-span-12 tablet:col-span-10 tablet:col-start-3"
                  type="multiple"
                >
                  {sanityProduct.specs.map((item, i) => {
                    return (
                      <AccordionItem value={`${i}`} className={s.spec} key={i}>
                        <AccordionTrigger
                          className={cn(
                            s.accordionTrigger,
                            'flex items-center justify-between py-10 w-full'
                          )}
                        >
                          <h3 className={s.title}>{item.title}</h3>
                        </AccordionTrigger>
                        <AccordionContent className="pb-10">
                          <div className={s.description}>
                            <CustomizedPortableText
                              content={item.description}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </section>
            )}
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
                  Can&apos;t decide? Try them all and discover your new
                  favorite!
                </p>
                <div className="flex items-center justify-center gap-10 px-32">
                  {relatedProducts?.map((item) => {
                    return (
                      <ProductCard
                        key={item.id}
                        id={item.id}
                        animatedCard={item}
                        variantId={
                          item.shopifyProduct?.variants[0].id as string
                        }
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
      </div>
    </Wrapper>
  );
}
