import { MouseEvent } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const breakpoints = {
  mobile: 800,
  tablet: 1024,
}

export function lineBreak(text: string) {
  return text.replace("<br>", "\n")
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}

export function capitalize(sentence: string): string {
  const words: string[] = sentence.split(" ")
  const capitalizedWords: string[] = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  const result: string = capitalizedWords.join(" ")
  return result
}

export function shareOnSocialMedia(baseUrl: string) {
  const title = document.title
  const text = "Check this out!"
  const url = window.location.href

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${location.pathname}`)
      console.log("Content copied to clipboard", `${baseUrl}${location.pathname}`)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  if (navigator.share !== undefined) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log("Shared!"))
      .catch((err) => console.error(err))
  } else {
    // window.location.href = `mailto:?subject=${title}&body=${text}%0A${url}`
    copyContent()
  }
}

export function isEven(num: number) {
  if (num === 0) {
    return true
  }

  if (num % 2 === 0) {
    return true
  }

  return false
}

export function stopPropagation(e: MouseEvent) {
  e.stopPropagation()
}

import { ReadonlyURLSearchParams } from "next/navigation"

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`

  return `${pathname}${queryString}`
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_ACCESS_TOKEN"]
  const missingEnvironmentVariables = [] as string[]

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar)
    }
  })

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    )
  }

  if (process.env.SHOPIFY_STORE_DOMAIN?.includes("[") || process.env.SHOPIFY_STORE_DOMAIN?.includes("]")) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them."
    )
  }
}
