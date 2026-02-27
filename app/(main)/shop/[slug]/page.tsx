import { CustomerReviews } from '@/components/customer-reviews';
import { CustomizedPortableText } from '@/components/customized-portable-text';
import { FollowUs } from '@/components/follow-us';
import { ProductCard } from '@/components/product-card';
import { ProductHighlightCarousel } from '@/components/product-highlight-carousel';
import { ProductImages } from '@/components/product-images';
import { ProductSpecs } from '@/components/product-specs';
import { PurchasePanel } from '@/components/purchase-panel';
import { Wrapper } from '@/components/wrapper';
import { getRelatedProducts } from '@/lib/actions/related-products';
import { sanityFetch } from '@/lib/sanity/client';
import { PRODUCT_PAGE_QUERY } from '@/lib/sanity/productPage';
import type { SanityProductPage } from '@/lib/sanity/types';
import { getProduct } from '@/lib/shopify';
import { cn, extractShopifyId } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetialPage({
  params
}: ProductDetailPageProps) {
  const { slug } = await params;
  const relatedProducts = await getRelatedProducts(slug);
  const sanityProduct = await sanityFetch<SanityProductPage>({
    query: PRODUCT_PAGE_QUERY,
    tags: ['productPage'],
    qParams: { slug }
  });

  const shopifyProduct = await getProduct(slug);
  const productId = extractShopifyId(shopifyProduct?.id as string);

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
      {shopifyProduct && <CustomerReviews productId={productId} />}
      {/* related products */}
      {relatedProducts.length > 0 && (
        <section className="pb-10 tablet:pb-20">
          {/* MOBILE */}
          <div className="block tablet:hidden">
            <ProductHighlightCarousel
              items={relatedProducts}
              options={{ loop: true }}
            />
          </div>
          {/* DESKTOP */}
          <div className="hidden tablet:block">
            <section className="flex flex-col items-center py-16">
              <h2 className="text-blue-ruin font-bomstad-display text-6xl font-black max-w-xl text-center mb-4">
                Impossible to Choose Just One!
              </h2>
              <p className="text-blue-ruin font-poppins text-lg font-normal max-w-xl text-center mb-16">
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
