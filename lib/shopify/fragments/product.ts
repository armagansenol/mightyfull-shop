const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    variants(first: 1) {
      nodes {
        price {
          amount
          currencyCode
        }
      }
    }
    sellingPlanGroups(first: 10) {
      nodes {
        appName
        name
        sellingPlans(first: 10) {
          nodes {
            id
            name
            options {
              value
              name
            }
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
`

export default productFragment
