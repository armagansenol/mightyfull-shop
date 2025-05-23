'use client';

import s from './customer-reviews.module.scss';

import { cn, formatDate, parseISOToDate } from '@/lib/utils';
import { Star } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/utility/link';
import mockReviewData from '@/lib/okendo/mock-data';

interface CustomerReviewsProps {
  productId: string;
}

export function CustomerReviews(props: CustomerReviewsProps) {
  // const [limit, setLimit] = useState(DEFAULT_LIMIT);
  // const [items, setItems] = useState<ReviewData['reviews']>([]);

  const items = mockReviewData.reviews;

  // const { data, isFetching } = useQuery<ReviewData, Error>({
  //   queryKey: ['reviews', limit, props.productId],
  //   queryFn: () => getReviews(props.productId, { limit })
  // });

  // useEffect(() => {
  //   if (!data) return;

  //   const remainedItems = data.reviews.filter((review) => {
  //     return !items.some((item) => item.reviewId === review.reviewId);
  //   });

  //   console.log('remained', remainedItems);

  //   // setHasMore(remainedItems.length > 0);

  //   if (remainedItems.length > 0) {
  //     setItems([...items, ...remainedItems]);
  //   }
  // }, [items, data]);

  return (
    <Card className={cn(s.customerReviews, 'flex-flex-col items-center pb-20')}>
      <CardHeader className="flex flex-col items-center gap-10 px-0 py-16">
        <CardTitle className={s.title}>Customer Reviews</CardTitle>
        <Button
          className="h-14 mx-auto tablet:ml-auto"
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
        {/* {data?.reviews.length === 0 && items.length === 0 && (
          <div className="w-full h-[250px] tablet:h-[300px] flex items-center justify-center ">
            <p className={cn(s.message, '-mt-16 tablet:mt-0')}>
              Be the first to review this product – no reviews yet!
            </p>
          </div>
        )}
        {isFetching && (
          <div className="w-full h-[500px] flex items-center justify-center">
            <div className="h-10 w-10">
              <IconLoadingSpinner fill="var(--sugar-milk)" />
            </div>
          </div>
        )} */}
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
              <div className="flex flex-col tablet:grid grid-cols-12 gap-10 tablet:gap-0 relative">
                <div className="col-span-3 flex items-center gap-4">
                  <Avatar className="w-14 h-14 tablet:w-14 tablet:h-14">
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
                    <p className={cn(s.body, 'tablet:max-w-xl')}>
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
      {/* {items.length > 0 && (
        <CardFooter className="flex items-center justify-center py-10">
          <Button
            className="flex items-center gap-4"
            colorTheme="nakedFull"
            size="sm"
            onClick={() => setLimit((prev) => prev + 1)}
            // disabled={!hasMore}
          >
            Load More
            {isFetching && items.length > 0 && (
              <span className="h-2 w-2">
                <IconLoadingSpinner fill="var(--sugar-milk)" />
              </span>
            )}
          </Button>
        </CardFooter>
      )} */}
    </Card>
  );
}
