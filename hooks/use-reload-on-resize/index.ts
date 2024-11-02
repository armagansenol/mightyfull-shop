import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useRouter } from "next/router"
import { useEffect } from "react"

const useReloadOnResize = () => {
  const router = useRouter()

  useEffect(() => {
    if (ScrollTrigger.isTouch) return

    function callAfterResize(func: () => void, delay: number) {
      let dc = gsap.delayedCall(delay || 0.2, func).pause(),
        handler = () => dc.restart(true)
      window.addEventListener("resize", handler)
      return handler // in case you want to window.removeEventListener() later
    }

    callAfterResize(() => router.reload(), 0)
  }, [router])
}

export default useReloadOnResize
