import groq from "groq"

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial"]{
    _id,
    _type,
    title,
    description
  }
`
