import groq from "groq"

export const PRODUCT_DETAIL_QUERY = groq`
  *[_type == "productDetail" && product->store.handle == $slug][0] {
    _id,
    hidden,
    titleProxy,
    images[]{
      asset->{
        url
      }
    },
    description,
    specs,
    store {
      title,
      status,
      isDeleted,
      "price": priceRange.minVariantPrice.amount,
      "currency": priceRange.minVariantPrice.currencyCode
    },
    seo,
    product->{
      _id,
      "shopifyTitle": store.title,
      "shopifyStatus": store.status,
      "previewImageUrl": store.previewImageUrl
    }
  }
`
