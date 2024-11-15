"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function usePageChange(callback: (url: string) => void) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`
    callback(url)
  }, [pathname, searchParams, callback])
}
