import s from "./customer-reviews.module.scss"

import cn from "clsx"
import { Star } from "lucide-react"
import { Review } from "types/okendo"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerReviewsProps {
  reviews: Review[]
}

export default function CustomerReviews(props: CustomerReviewsProps) {
  function parseISOToDate(isoString: string): Date {
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) {
        throw new Error("Invalid ISO date string")
      }
      return date
    } catch (error) {
      throw error
    }
  }

  function formatDate(inputDate: Date, thresholdDays: number = 10): string {
    const now = new Date()
    const timeDifference = now.getTime() - inputDate.getTime()
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) // Convert milliseconds to days

    if (daysDifference < thresholdDays) {
      return `${daysDifference} days ago`
    } else {
      // Format as DD.MM.YYYY
      const day = inputDate.getDate().toString().padStart(2, "0")
      const month = (inputDate.getMonth() + 1).toString().padStart(2, "0") // Months are 0-based
      const year = inputDate.getFullYear()
      return `${day}.${month}.${year}`
    }
  }

  return (
    <Card className={cn(s.customerReviews, "flex-flex-col items-center")}>
      <CardHeader className="flex flex-col items-center gap-10 px-0 py-16">
        <CardTitle className={s.title}>Customer Reviews</CardTitle>
        <Button className="mx-auto tablet:ml-auto" variant="inverted" size="sm" padding="fat">
          WRITE A REVIEW
        </Button>
      </CardHeader>
      <CardContent className={cn("p-0")}>
        {props.reviews.length >= 0 && (
          <>
            {props.reviews.map((review) => (
              <div className={cn(s.item, "pt-8 pb-14")} key={review.reviewId}>
                <div className="flex items-start gap-4">
                  {/* <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" alt={review.reviewer.displayName} />
                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                  </Avatar> */}
                  <div className="flex-1 grid grid-cols-12">
                    <div className="col-span-3 flex items-center">
                      <p className={s.author}>{review.reviewer.displayName}</p>
                    </div>
                    <div className="col-span-6 flex flex-col gap-5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p>{review.body}</p>
                    </div>
                    <div className="col-span-3 flex items-start justify-end">
                      <span className={s.date}>{formatDate(parseISOToDate(review.dateUpdated))}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center py-10">
        <Button variant="naked" size="sm">
          Load More
        </Button>
      </CardFooter>
    </Card>
  )
}
