const metafieldsFragment = /* GraphQL */ `
  fragment metafields on MetafieldConnection {
    edges {
      node {
        id
        namespace
        key
        value
        type
      }
    }
  }
`

export default metafieldsFragment
