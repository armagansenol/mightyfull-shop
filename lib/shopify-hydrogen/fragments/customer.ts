const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    firstName
    lastName
    email
    orders(first: 10) {
      edges {
        node {
          id
          orderNumber
          totalAmount {
            amount
            currencyCode
          }
          lineItems {
            title
            quantity
            price {
              amount
              currencyCode
            }
          }
          createdAt
        }
      }
    }
  }
`

export default customerFragment
