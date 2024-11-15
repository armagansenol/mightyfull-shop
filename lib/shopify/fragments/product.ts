const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    availableForSale
    sellingPlanGroups(first: 10) {
      nodes {
        name
        options {
          name
          values
        }
        sellingPlans(first: 10) {
          nodes {
            id
            name
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
    variants(first: 1) {
      nodes {
        id
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
      }
    }
  }
`

export default productFragment
