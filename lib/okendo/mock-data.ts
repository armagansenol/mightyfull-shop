import { ReviewData } from './types'; // Assuming the types are defined in a file named types

const mockReviewData: ReviewData = {
  areReviewsGrouped: false,
  reviews: [
    {
      subscriberId: 'sub-12345',
      reviewId: 'rev-0001',
      subscriberId_productId: 'sub-12345_prod-6789',
      productId: 'prod-6789',
      body: 'These protein cookies are amazing! They taste great and are perfect for a quick post-workout snack. Love the chocolate chip flavor!',
      dateCreated: '2024-12-01T10:00:00Z',
      dateUpdated: '2024-12-01T12:00:00Z',
      helpfulCount: 10,
      isRecommended: true,
      languageCode: 'en',
      media: [
        {
          largePortraitThumbnailUrl: 'cookie1_large_thumb.jpg',
          streamId: 'stream-001',
          fullSizeUrl: 'cookie1_full.jpg',
          largeUrl: 'cookie1_large.jpg',
          dynamicKey: 'key1',
          type: 'image',
          thumbnailUrl: 'cookie1_thumb.jpg'
        }
      ],
      productHandle: 'protein-cookie-chocolate-chip',
      productImageUrl: 'chocolate-chip.jpg',
      productName: 'Protein Cookie - Chocolate Chip',
      productUrl: '/products/protein-cookie-chocolate-chip',
      rating: 5,
      reviewer: {
        avatarUrl: '/img/lady.jpg',
        displayName: 'Sarah J.',
        isVerified: true,
        verifiedStatus: 'Verified Reviewer'
      },
      isIncentivized: false,
      status: 'approved',
      title: 'Amazing Chocolate Chip Cookies!',
      unhelpfulCount: 0,
      variantId: 'var-101'
    },
    {
      subscriberId: 'sub-67890',
      reviewId: 'rev-0002',
      subscriberId_productId: 'sub-67890_prod-9876',
      productId: 'prod-9876',
      body: 'Good cookies, but I found them a bit too sweet for my liking. The peanut butter flavor is rich though!',
      dateCreated: '2024-12-02T14:30:00Z',
      dateUpdated: '2024-12-02T15:00:00Z',
      helpfulCount: 7,
      isRecommended: true,
      languageCode: 'en',
      media: [],
      productHandle: 'protein-cookie-peanut-butter',
      productImageUrl: 'peanut-butter.jpg',
      productName: 'Protein Cookie - Peanut Butter',
      productUrl: '/products/protein-cookie-peanut-butter',
      rating: 4,
      reviewer: {
        avatarUrl: undefined,
        displayName: 'Mark L.',
        isVerified: false
      },
      isIncentivized: false,
      status: 'approved',
      title: 'Rich Peanut Butter Flavor',
      unhelpfulCount: 2,
      variantId: 'var-102'
    },
    {
      subscriberId: 'sub-24680',
      reviewId: 'rev-0003',
      subscriberId_productId: 'sub-24680_prod-1357',
      productId: 'prod-1357',
      body: 'The double chocolate cookies are perfect for satisfying my sweet tooth while staying on track with my fitness goals. Great texture and flavor!',
      dateCreated: '2024-12-03T09:45:00Z',
      dateUpdated: '2024-12-03T10:00:00Z',
      helpfulCount: 15,
      isRecommended: true,
      languageCode: 'en',
      media: [
        {
          largePortraitThumbnailUrl: 'cookie2_large_thumb.jpg',
          streamId: 'stream-002',
          fullSizeUrl: 'cookie2_full.jpg',
          largeUrl: 'cookie2_large.jpg',
          dynamicKey: 'key2',
          type: 'image',
          thumbnailUrl: 'cookie2_thumb.jpg'
        }
      ],
      productHandle: 'protein-cookie-double-chocolate',
      productImageUrl: 'double-chocolate.jpg',
      productName: 'Protein Cookie - Double Chocolate',
      productUrl: '/products/protein-cookie-double-chocolate',
      rating: 5,
      reviewer: {
        avatarUrl: '/img/lady-2.jpg',
        customAvatar: {
          streamId: 'custom-avatar-stream-001',
          dynamicKey: 'custom-key-001'
        },
        displayName: 'Emma W.',
        isVerified: true,
        verifiedStatus: 'Verified Reviewer'
      },
      isIncentivized: false,
      status: 'approved',
      title: 'Best Double Chocolate Cookies!',
      unhelpfulCount: 1,
      variantId: 'var-103'
    }
  ]
};

export default mockReviewData;
