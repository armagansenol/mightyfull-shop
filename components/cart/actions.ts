"use server"

const SHOPIFY_STOREFRONT_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

const createCheckoutMutation = `
  mutation createCheckout($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: {
      lineItems: $lineItems
    }) {
      checkout {
        webUrl
        id
      }
      checkoutUserErrors {
        message
        field
      }
    }
  }
`

async function shopifyFetch({ query, variables }: { query: string; variables: unknown }) {
  try {
    const result = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const body = await result.json()

    if (body.errors) {
      throw new Error(body.errors[0].message)
    }

    return {
      status: result.status,
      body,
    }
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create checkout")
  }
}

export async function createCheckout(items: { variantId: string; quantity: number }[]) {
  try {
    const { body } = await shopifyFetch({
      query: createCheckoutMutation,
      variables: {
        lineItems: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    })

    const { checkout, checkoutUserErrors } = body.data.checkoutCreate

    if (checkoutUserErrors.length > 0) {
      throw new Error(checkoutUserErrors[0].message)
    }

    return checkout.webUrl
  } catch (error) {
    throw error
  }
}
