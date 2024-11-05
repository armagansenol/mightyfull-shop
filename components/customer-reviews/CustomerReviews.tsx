import { Avatar, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"

import { Star } from "lucide-react"
import { Review } from "types/okendo"

interface CustomerReviewsProps {
  reviews: Review[]
}

export default function CustomerReviews(props: CustomerReviewsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
        <Button>WRITE A REVIEW</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {props.reviews.length >= 0 && (
          <>
            {props.reviews.map((review) => (
              <div key={review.reviewId} className="border-b border-blue-500 pb-6 last:border-none">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" alt={review.reviewer.displayName} />
                    {/* <AvatarFallback>{review.author[0]}</AvatarFallback> */}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{review.reviewer.displayName}</h3>
                      <span className="text-sm text-blue-100">{review.dateUpdated}</span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-50 mt-2">{review.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <Button>Load More</Button>
      </CardContent>
    </Card>
  )
}
