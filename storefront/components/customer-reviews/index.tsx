'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { ScrollTrigger } from '@/components/gsap';
import { IconCloud } from '@/components/icons';
import { OkendoWidget } from '@/components/okendo-widget';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';
import { getReviews } from '@/lib/okendo/queries';
import type { ReviewData } from '@/lib/okendo/types';

interface CustomerReviewsProps {
  productId: string;
}

export function CustomerReviews(props: CustomerReviewsProps) {
  const { data, isFetching } = useQuery<ReviewData, Error>({
    queryKey: ['reviews', props.productId],
    queryFn: () => getReviews(props.productId),
    meta: {
      onSuccess: () => ScrollTrigger.refresh()
    }
  });

  if (isFetching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-[250px] md:h-[600px] flex items-center justify-center"
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="my-24 md:my-16"
      >
        <IconCloud fill="var(--primary)" />
        <div className="bg-primary">
          <div className="container">
            <AnimatePresence mode="wait">
              {data?.reviews.length === 0 ? (
                <motion.div
                  key="no-reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-[250px] md:h-[300px] flex flex-col items-center justify-center gap-10"
                >
                  <p className="font-bomstad-display font-bold text-4xl text-sugar-milk text-center max-w-xl">
                    Be the first to review this product – no reviews yet!
                  </p>
                  <Button
                    className="w-48 h-14 mx-auto md:ml-auto"
                    colorTheme="inverted-themed"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`https://okendo.reviews/?subscriberId=bd0d64e9-dd61-45c9-865a-1c3a59e98a1e&productId=shopify-${props.productId}&locale=en`}
                    >
                      WRITE A REVIEW
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onAnimationComplete={() => ScrollTrigger.refresh()}
                  className="w-full min-h-[250px] md:min-h-[300px] flex items-center justify-center"
                >
                  <OkendoWidget productId={props.productId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <IconCloud rotate={180} fill="var(--primary)" />
      </motion.section>
    </AnimatePresence>
  );
}

{
  /* <Card
        className={cn(s.customerReviews, 'flex-flex-col items-center pb-20')}
      >
        <CardHeader className="flex flex-col items-center gap-10 px-0 py-16">
          <CardTitle className={s.title}>Customer Reviews</CardTitle>
          <Button
            className="h-14 mx-auto md:ml-auto"
            colorTheme="inverted-themed"
            size="sm"
            padding="fat"
            asChild
          >
            <Link
              href={`https://okendo.reviews/?subscriberId=bd0d64e9-dd61-45c9-865a-1c3a59e98a1e&productId=shopify-${props.productId}&locale=en`}
            >
              WRITE A REVIEW
            </Link>
          </Button>
        </CardHeader>
        <CardContent className={cn('p-0')}>
          {data?.reviews.length === 0 && items.length === 0 && (
            <div className="w-full h-[250px] md:h-[300px] flex items-center justify-center ">
              <p className={cn(s.message, '-mt-16 md:mt-0')}>
                Be the first to review this product – no reviews yet!
              </p>
            </div>
          )}
          <AnimatePresence mode="sync">
            {items?.map((review) => (
              <motion.div
                key={review.reviewId}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(s.item, 'pt-8 pb-14')}
              >
                <div className="flex flex-col md:grid grid-cols-12 gap-10 md:gap-0 relative">
                  <div className="col-span-3 flex items-center gap-4">
                    <Avatar className="w-14 h-14 md:w-14 md:h-14">
                      <AvatarImage
                        className="object-cover"
                        src={review.reviewer.avatarUrl}
                        alt={review.reviewer.displayName}
                      />
                      <AvatarFallback>
                        {review.reviewer.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <p className={s.author}>{review.reviewer.displayName}</p>
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="flex flex-col gap-5 max-  w-lg">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className={cn(s.body, 'md:max-w-xl')}>
                        {review.body}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 flex items-start justify-end">
                    <span className={s.date}>
                      {formatDate(parseISOToDate(review.dateCreated))}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card> */
}
