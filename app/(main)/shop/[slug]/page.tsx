import s from './product-detail-page.module.scss';

import { cn } from '@/lib/utils';

import { CustomizedPortableText } from '@/components/customized-portable-text';
import { FollowUs } from '@/components/follow-us';
import { IconCloud } from '@/components/icons';
import { ProductHighlightCarousel } from '@/components/product-highlight-carousel';
import { ProductImages } from '@/components/product-images';
import { PurchasePanel } from '@/components/purchase-panel';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/constants';
import { ANIMATED_CARDS_QUERY } from '@/lib/sanity/animatedCards';
import { sanityFetch } from '@/lib/sanity/client';
import { LAYOUT_QUERY } from '@/lib/sanity/layout';
import { PRODUCT_PAGE_QUERY } from '@/lib/sanity/productPage';
import { getProduct } from '@/lib/shopify-test';
import { AnimatedCard } from 'components/animated-card';
import { CustomerReviews } from 'components/customer-reviews';
import { ThemeUpdater } from 'components/theme-updater';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/ui/accordion';
import { Link } from 'components/utility/link';
import { SanityProductPage } from 'lib/sanity/types';
import { AnimatedCardProps } from 'types';
import { LayoutQueryResponse } from 'types/layout';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetialPage({
  params
}: ProductDetailPageProps) {
  const sanityProduct = await sanityFetch<SanityProductPage>({
    query: PRODUCT_PAGE_QUERY,
    tags: ['productPage'],
    qParams: { slug: params.slug }
  });
  const layout = await sanityFetch<LayoutQueryResponse>({
    query: LAYOUT_QUERY,
    tags: ['layout']
  });
  const animatedCards = await sanityFetch<AnimatedCardProps[]>({
    query: ANIMATED_CARDS_QUERY,
    tags: ['animatedCards']
  });
  const relatedProducts = animatedCards.filter((card) => {
    return card.product.shopifySlug !== sanityProduct.slug;
  });

  const shopifyProduct = await getProduct(params.slug);

  console.log('sanity product', sanityProduct);

  return (
    <>
      {sanityProduct.colorTheme && (
        <ThemeUpdater {...sanityProduct.colorTheme} />
      )}
      <div
        className={cn(s.productPage, 'pt-7 tablet:pt-20 mb-20 tablet:mb-60')}
        style={
          {
            '--text-color': `${sanityProduct.colorTheme?.text}`,
            '--bg-color': `${sanityProduct.colorTheme?.background}`
          } as React.CSSProperties
        }
      >
        <section
          className={cn(
            s.intro,
            'flex flex-col items-center tablet:grid grid-cols-11 gap-10 tablet:gap-20 tablet:items-stretch justify-stretch py-20'
          )}
        >
          <div className="col-span-6 space-y-10">
            <ProductImages images={sanityProduct.images} />
            {sanityProduct.specs.length > 0 && (
              <section className={cn(s.specs, 'grid grid-cols-12 gap-5')}>
                <Accordion className="col-span-10 col-start-3" type="multiple">
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
            <p className={s.productPackInfo}>1 PACK (12 COOKIES)</p>
            <div className={s.productDescription}>
              <CustomizedPortableText content={sanityProduct.description} />
            </div>
            {shopifyProduct && (
              <PurchasePanel shopifyProduct={shopifyProduct} />
            )}
          </div>
        </section>
        {/* product reviews */}
        <section className={cn(s.reviews, 'my-12 tablet:my-32')}>
          <div className={s.cloudTop}>
            <IconCloud fill="var(--text-color)" />
          </div>
          <CustomerReviews productId={'8519377223832'} />
          <div className={s.cloudBottom}>
            <IconCloud rotate={180} fill="var(--text-color)" />
          </div>
        </section>
        {/* related products */}
        {relatedProducts.length > 0 && (
          <section className={cn(s.highlights, 'py-10 tablet:py-20')}>
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
                  Can’t decide? Try them all and discover your new favorite!
                </p>
                <div className="flex items-center justify-center gap-10 px-32">
                  {relatedProducts.map((item) => {
                    return (
                      <div
                        className={cn(
                          s.card,
                          'flex flex-col gap-10 flex-shrink-0'
                        )}
                        key={item.id}
                      >
                        <Link
                          href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                          prefetch={true}
                        >
                          <AnimatedCard {...item} />
                        </Link>
                        <div className="flex flex-row tablet:flex-col items-stretch gap-2">
                          <Button
                            colorTheme="blueRuin"
                            asChild
                            size="sm"
                            padding="slim"
                          >
                            <Link
                              href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                              prefetch={true}
                            >
                              SHOP NOW
                            </Link>
                          </Button>
                          <Button
                            colorTheme="invertedBlueRuin"
                            size="sm"
                            padding="slim"
                          >
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        )}
        <FollowUs
          socialLinks={layout.socialLinks}
          images={layout.imageCarousel.map((image) => image.url)}
        />
      </div>
    </>
  );
}
