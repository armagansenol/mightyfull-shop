import productFragment from './product';

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
          sellingPlanAllocation {
            sellingPlan {
              id
              name
              description
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanPercentagePriceAdjustment {
                    adjustmentPercentage
                  }
                  ... on SellingPlanFixedAmountPriceAdjustment {
                    adjustmentAmount {
                      amount
                      currencyCode
                    }
                  }
                  ... on SellingPlanFixedPriceAdjustment {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${productFragment}
`;

export default cartFragment;
