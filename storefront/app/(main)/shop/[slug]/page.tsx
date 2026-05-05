import { Container } from '@/components/container';
import { CustomerReviews } from '@/components/customer-reviews';
import { CustomizedPortableText } from '@/components/customized-portable-text';
import { FollowUs } from '@/components/follow-us';
import { ProductCard } from '@/components/product-card';
import { ProductFaq } from '@/components/product-faq';
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

const CHOCOLATE_CHIP_DESCRIPTION: SanityProductPage['description'] = [
  {
    _key: 'chocolate-chip-description',
    _type: 'block',
    children: [
      {
        _key: 'chocolate-chip-description-text',
        _type: 'span',
        marks: [],
        text: 'This is the one that disappears first. Soft, chewy, and loaded with melty chocolate. It tastes like the cookie you were never supposed to eat before dinner and absolutely did anyway. Every bite hits that classic, straight out of the oven feel, just with 10g of protein tagging along like it owns the place. No drama, no weird aftertaste, just a really good cookie doing a little extra.'
      }
    ],
    markDefs: [],
    style: 'normal'
  }
];

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
  const productDescription =
    slug === 'chocolate-chip'
      ? CHOCOLATE_CHIP_DESCRIPTION
      : sanityProduct.description;

  return (
    <Wrapper className="mb-48" colorTheme={sanityProduct.colorTheme}>
      <Container
        as="section"
        className={cn(
          'flex flex-col items-center gap-5 md:gap-0 md:grid grid-cols-24 md:items-stretch justify-stretch py-6 md:py-12 px-4 md:px-16 mb-20'
        )}
      >
        <div className="col-span-12 space-y-10">
          <ProductImages images={sanityProduct.images} />
          <ProductSpecs
            className="hidden md:grid"
            specs={sanityProduct.productSpecifications}
          />
        </div>
        <div className="col-span-12 flex flex-col items-stretch px-0 md:pl-20 md:pr-14 text-center md:text-left">
          <h1 className="text-primary font-bomstad-display text-4xl font-black">
            {sanityProduct.title}
          </h1>
          <small className="text-primary font-bomstad-display text-lg font-medium mb-8">
            1 BOX ( 6 COOKIES )
          </small>
          <CustomizedPortableText
            wrapperClassName="prose text-primary font-poppins text-sm font-normal mb-10"
            content={productDescription}
          />
          {/* purchase panel */}
          {shopifyProduct && <PurchasePanel shopifyProduct={shopifyProduct} />}
          {/* product specs */}
          <ProductSpecs
            className="grid md:hidden mt-10"
            specs={sanityProduct.productSpecifications}
          />
        </div>
      </Container>
      {/* product reviews */}
      {shopifyProduct && <CustomerReviews productId={productId} />}
      {/* product faq */}
      <ProductFaq faqs={sanityProduct.faqs} />
      {/* related products */}
      {relatedProducts.length > 0 && (
        <Container as="section" className="pb-10 md:pb-20">
          {/* MOBILE */}
          <div className="block md:hidden">
            <ProductHighlightCarousel
              items={relatedProducts}
              options={{ loop: true }}
            />
          </div>
          {/* DESKTOP */}
          <div className="hidden md:block">
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
        </Container>
      )}
      <FollowUs />
    </Wrapper>
  );
}
