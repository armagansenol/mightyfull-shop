import { Review } from "types/okendo"

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: BodyInit
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

type ApiResponse<T> = {
  data: T | null
  error: string | null
}

const API_BASE_URL = `https://api.okendo.io/v1/stores/${process.env.OKENDO_USER_ID}`

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, cache, next } = options

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next,
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`)
    }

    const data: T = await res.json()
    return { data, error: null }
  } catch (error) {
    console.error("Fetch error:", error)
    return { data: null, error: error instanceof Error ? error.message : "An unknown error occurred" }
  }
}

export type ReviewsResponse = {
  reviews: Review[]
}

export async function getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
  const response = await fetchApi<ReviewsResponse>(`/products/shopify-${productId}/reviews`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })

  return {
    data: response.data?.reviews || null,
    error: response.error,
  }
}

// Add more API functions here as needed

///// MERCHANT API ////

// type MerchantApiResponse = {
//   reviews: Review[];
// };

// export async function getReviews(): Promise<MerchantApiResponse> {
//   const okendoUserId = process.env.OKENDO_USER_ID;
//   const okendoApiKey = process.env.OKENDO_API_KEY;

//   if (!okendoUserId || !okendoApiKey) {
//     throw new Error('Okendo credentials are not set in environment variables');
//   }

//   const authHeader = Buffer.from(`${okendoUserId}:${okendoApiKey}`).toString('base64');

//   const res = await fetch('https://api.okendo.io/enterprise/reviews', {
//     headers: {
//       'Authorization': `Basic ${authHeader}`,
//     },
//     cache: 'no-store' // This ensures that the data is fetched fresh on every request
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch reviews');
//   }

//   return res.json();
// }
