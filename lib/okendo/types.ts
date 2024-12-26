export interface ReviewData {
  areReviewsGrouped: boolean;
  reviews: Review[];
}

export interface Review {
  subscriberId: string;
  reviewId: string;
  subscriberId_productId: string;
  productId: string;
  body: string;
  dateCreated: string; // ISO 8601 date string
  dateUpdated: string; // ISO 8601 date string
  helpfulCount: number;
  isRecommended: boolean;
  languageCode: string;
  media?: Media[]; // Optional, as not all reviews have media
  productHandle: string;
  productImageUrl: string;
  productName: string;
  productUrl: string;
  rating: number;
  reviewer: Reviewer;
  isIncentivized: boolean;
  status: 'approved' | 'pending' | 'rejected';
  title: string;
  unhelpfulCount: number;
  variantId: string;
}

export interface Media {
  largePortraitThumbnailUrl: string;
  streamId: string;
  fullSizeUrl: string;
  largeUrl: string;
  dynamicKey: string;
  type: 'image' | 'video';
  thumbnailUrl: string;
}

export interface Reviewer {
  avatarUrl?: string; // Optional as not all reviews may have avatars
  customAvatar?: CustomAvatar; // Optional as not all reviews may have custom avatars
  displayName: string;
  isVerified: boolean;
  socialConnection?: string; // Optional if social connection isn't always provided
  verifiedStatus?: 'Verified Reviewer' | 'Unverified Reviewer'; // Optional, may not always be present
}

export interface CustomAvatar {
  streamId: string;
  dynamicKey: string;
}
