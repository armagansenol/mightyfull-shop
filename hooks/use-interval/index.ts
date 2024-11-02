import { useEffect, useState } from "react"

export const useInterval = (callback: () => void, delay: number) => {
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const tick = () => {
      if (isRunning) {
        callback()
      }
    }

    if (isRunning) {
      intervalId = setInterval(tick, delay)
    }

    return () => clearInterval(intervalId)
  }, [callback, delay, isRunning])

  const pause = () => setIsRunning(false)
  const start = () => setIsRunning(true)
  const reset = () => {
    setIsRunning(false)
    setIsRunning(true)
  }

  return { pause, start, reset }
}
