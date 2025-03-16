import s from './home.module.scss';

import { cn } from '@/lib/utils';

import { FadeInOutCarousel } from '@/components/fade-in-out-carousel';
import { FeatureHighlight } from '@/components/feature-highlight';
import { IconCloud2, IconLeftArm, IconRightArm } from '@/components/icons';
import { Marquee } from '@/components/marquee';
import { PackageAnimation } from '@/components/package-animation';
import { Parallax } from '@/components/parallax';
import { ProductCard } from '@/components/product-card';
import { ProductHighlightCarousel } from '@/components/product-highlight-carousel';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { getProductHighlight } from '@/lib/actions/product-highlight';
import { routes } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity/client';
import { FEATURE_HIGHLIGHT_QUERY } from '@/lib/sanity/featureHighlightQuery';
import { TESTIMONIALS_QUERY } from '@/lib/sanity/testimonials';
import { FeatureHighlightQueryResult, Testimonial } from '@/types';

export default async function HomePage() {
  const [productHighlight, { featureHighlight }, testimonials] =
    await Promise.all([
      getProductHighlight(),
      sanityFetch<FeatureHighlightQueryResult>({
        query: FEATURE_HIGHLIGHT_QUERY,
        tags: ['featureHighlight']
      }),
      sanityFetch<Testimonial[]>({
        query: TESTIMONIALS_QUERY,
        tags: ['testmonials']
      })
    ]);

  return (
    <>
      <section
        className={cn(
          s.intro,
          'flex flex-col items-stretch tablet:grid grid-cols-12'
        )}
      >
        <div
          className={cn(
            s.text,
            'col-span-6 flex flex-col items-center tablet:items-start justify-center'
          )}
        >
          <h1>
            This{' '}
            <span className={s.might}>
              <span>might</span>
            </span>{' '}
            be the{' '}
            <span className={s.best}>
              <span>best cookie</span>
            </span>{' '}
            ever!
          </h1>
          <p>Meet our mightyfull flavors</p>
          <Button
            asChild
            className="h-16 mt-10 font-black"
            size="md"
            padding="fat"
          >
            <Link href={routes.shop.url} prefetch>
              SHOP NOW
            </Link>
          </Button>
        </div>
        <div className="col-span-6">
          <div className={s.imgC}>
            <video className="w-full h-full" autoPlay loop playsInline muted>
              <source src="/video/mighty.mov" type="video/mp4; codecs=hvc1" />
              <source src="/video/mighty.webm" type="video/webm" />
            </video>
            {/* <video className="w-full h-full" autoPlay loop playsInline muted>
              <source src="/video/mighty-bottom.webm" />
              <source src="/video/mighty-bottom.mov" />
            </video> */}
          </div>
        </div>
        <div className={s.cloud}>
          <IconCloud2 />
        </div>
      </section>
      <section className={s.marquee}>
        <Marquee duration={10} repeat={5}>
          <div className="flex items-center">
            <div className={s.marqueeItem}>PROTEIN PACKED COOKIES!</div>
            <div className={s.imgC}>
              <Img
                src="/img/c-pb-jelly-choco-chip.png"
                height={100}
                width={100}
                alt="Cookie"
              />
            </div>
            <div className={s.marqueeItem}>
              FEEL THE MIGHT, SAVOR THE FULLNESS!
            </div>
            <div className={s.imgC}>
              <Img
                src="/img/c-double-choco-chip.png"
                height={100}
                width={100}
                alt="Cookie"
              />
            </div>
          </div>
        </Marquee>
      </section>
      {Array.isArray(productHighlight) && productHighlight.length > 0 && (
        <section className={cn(s.highlights, 'py-10 tablet:py-20')}>
          <section className={cn(s.shop, 'flex flex-col items-center')}>
            <h2>Impossible to Choose Just One!</h2>
            <p>
              Can&apos;t decide? Try them all and discover your new favorite!
            </p>
            {/* MOBILE */}
            <div className="block tablet:hidden">
              <ProductHighlightCarousel
                items={productHighlight}
                options={{ loop: true }}
              />
            </div>
            {/* DESKTOP */}
            <div className="hidden tablet:block">
              <div className="flex flex-col items-center tablet:grid grid-cols-4 gap-16 mt-10 tablet:mt-20 px-4 tablet:px-0">
                {Array.isArray(productHighlight) &&
                  productHighlight.length > 0 &&
                  productHighlight.map((item) => {
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
            </div>
          </section>
        </section>
      )}
      {Array.isArray(featureHighlight.items) &&
        featureHighlight.items.length > 0 && (
          <div className="bg-[var(--blue-ruin)] p-2 tablet:p-5">
            <FeatureHighlight items={featureHighlight.items} />
          </div>
        )}
      <div className="relative bg-[var(--blue-ruin)] p-2 tablet:p-5 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-2 tablet:h-5 bg-[var(--blue-ruin)] z-50"></div>
        <section
          className={cn(
            s.theStory,
            'flex flex-col items-stretch p-5 pt-24 tablet:pt-60 bg-[var(--sugar-milk)]'
          )}
        >
          <div className={cn('flex flex-col items-center flex-1')}>
            <div className={cn(s.titleC, 'flex items-center gap-3')}>
              <div className={s.iconC}>
                <IconLeftArm />
              </div>
              <h1 className={s.title}>
                <span>The</span>
                <span>Mightyfull</span>
                <span>Story</span>
                <div className={s.bg}>
                  <div className={s.transform}>
                    <Img
                      className="object-contain"
                      src="/img/lightrays.png"
                      height={1000}
                      width={1000}
                      alt="Lightrays Background Image"
                    />
                  </div>
                </div>
              </h1>
              <div className={s.iconC}>
                <IconRightArm />
              </div>
            </div>
            <p className={cn(s.p, s.desc)}>
              At Mightyfull, we believe snacking should do more than just
              satisfy cravings—it should fuel your body, uplift your day, and
              taste incredible.
              <br />
              <br />
              Our journey began with a simple moment in the kitchen.
            </p>
            <Button asChild className="h-16" size="md" padding="fat">
              <Link href={routes.ourStory.url}>READ OUR STORY</Link>
            </Button>
          </div>
          <PackageAnimation />
          <div className={cn(s.cookie, s.cookie3)}>
            <Parallax>
              <Img
                alt="Cookie Crumb"
                className="object-contain -rotate-12"
                src={'/img/c3.png'}
                height={200}
                width={200}
              />
            </Parallax>
          </div>
        </section>
      </div>
      <section
        className={cn(
          s.testimonials,
          'flex flex-col-reverse tablet:grid grid-cols-12'
        )}
      >
        <div className="col-span-5">
          <div className={s.imgC}>
            <Img
              className="object-cover"
              src="/img/lady.jpg"
              alt="Lady Eating a Cookie"
              height={1000}
              width={1000}
            />
          </div>
        </div>
        <div className="col-span-7 py-20 tablet:py-0 flex items-center justify-center">
          <div className={s.sliderC}>
            <FadeInOutCarousel options={{ loop: true }}>
              {Array.isArray(testimonials) &&
                testimonials.length > 0 &&
                testimonials.map((item) => {
                  return (
                    <div
                      className={cn(
                        s.item,
                        'flex flex-col items-center justify-center'
                      )}
                      key={item._id}
                    >
                      <div className={s.title}>{item.description}</div>
                      <div className={s.description}>{item.title}</div>
                    </div>
                  );
                })}
            </FadeInOutCarousel>
          </div>
        </div>
      </section>
    </>
  );
}
