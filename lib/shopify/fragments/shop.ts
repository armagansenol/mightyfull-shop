const shopFragment = /* GraphQL */ `
  fragment shop on Shop {
    id
    name
    shippingPolicy {
      title
      body
      handle
    }
    refundPolicy {
      title
      body
      handle
    }
    privacyPolicy {
      title
      body
      handle
    }
    termsOfService {
      title
      body
      handle
    }
    subscriptionPolicy {
      title
      body
      handle
    }
  }
`;

export default shopFragment;
