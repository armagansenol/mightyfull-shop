export const createCustomerAccessTokenMutation = `mutation customerAccessTokenCreate {
      customerAccessTokenCreate(input: {email: "ghaida@example.com", password: "7dx2gx2Z"}) {
        customerAccessToken {
          accessToken
        }
        customerUserErrors {
          message
        }
      }
    }`
