export interface Review {
  subscriberId: string
  reviewId: string
  subscriberId_productId: string
  productId: string
  body: string
  dateCreated: string
  dateUpdated: string
  helpfulCount: number
  isRecommended: boolean
  languageCode: string
  media: Array<{ url: string; type: string }>
  productHandle: string
  productImageUrl: string
  productName: string
  productUrl: string
  rating: number
  reviewer: {
    displayName: string
    isVerified: boolean
  }
  isIncentivized: boolean
  status: string
  title: string
  unhelpfulCount: number
  variantId: string
}
