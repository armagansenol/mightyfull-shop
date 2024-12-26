import groq from "groq"

export const PRODUCT_SLIDER_QUERY = groq`
*[_type == "productSlider"]{
  _id,
  _type,
  "products": arrayOfProducts[]->{
    _id,
    title,
    description,
    price,
    mainImage
  }
}
`
