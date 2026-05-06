"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { IconClose } from "@/components/icons"
import { Link } from "@/components/utility/link"
import { cn } from "@/lib/utils"

type PopupState = "hidden" | "popup" | "badge"
type FormState = "idle" | "loading" | "success" | "error"

const STORAGE_KEY = "mf_welcome_popup"

export function WelcomePopup() {
  const [state, setState] = useState<PopupState>("hidden")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (seen === "dismissed") {
      setState("badge")
    } else {
      const timer = setTimeout(() => setState("popup"), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "dismissed")
    setState("badge")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const email = inputRef.current?.value.trim()

    if (!email) {
      setErrorMsg("Please enter your email address.")
      setFormState("error")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.")
      setFormState("error")
      return
    }

    setFormState("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message)
        setFormState("error")
      } else {
        setAlreadySubscribed(!!data.alreadySubscribed)
        setFormState("success")
        localStorage.setItem(STORAGE_KEY, "dismissed")
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setFormState("error")
    }
  }

  if (state === "hidden") return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300",
          state === "popup" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{ zIndex: "var(--z-index-modal)" }}
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100%-2rem)] max-w-sm",
          "border-2 border-nova-pink rounded-3xl overflow-hidden shadow-2xl",
          "transition-all duration-300",
          state === "popup" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none",
        )}
        style={{ zIndex: "var(--z-index-modal-content)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome offer"
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-nova-pink flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Dismiss offer"
        >
          <span className="w-3 h-3">
            <IconClose fill="var(--color-sugar-milk)" />
          </span>
        </button>

        <div className="bg-cherry-blush px-8 py-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {formState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center pt-4"
              >
                <h2 className="font-bomstad-display font-black text-nova-pink text-4xl leading-none mb-4">
                  {alreadySubscribed ? "Already got it!" : "Check your inbox!"}
                </h2>
                <p className="font-poppins text-sm text-nova-pink/80 mb-6 leading-relaxed">
                  {alreadySubscribed ? (
                    "You're already subscribed. Your discount code is waiting in your inbox — use it at checkout on your first order."
                  ) : (
                    <>
                      We sent your <strong>15% off code</strong> to your email. Use it at checkout on your first order.
                    </>
                  )}
                </p>
                <Link
                  href="/shop"
                  className={cn(
                    "block w-full py-3 rounded-xl text-center",
                    "border-2 border-nova-pink text-nova-pink",
                    "font-bomstad-display font-black text-xl",
                    "hover:bg-nova-pink hover:text-sugar-milk transition-colors",
                  )}
                  onClick={dismiss}
                >
                  SHOP NOW
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-bomstad-display font-black text-nova-pink text-4xl leading-none mb-4 pr-8 uppercase">
                  Unlock 15% Off Your First Order!
                </h2>
                <p className="font-poppins text-sm text-nova-pink/80 mb-6 leading-relaxed">
                  Enter your email and we'll send your exclusive discount code straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="Email"
                    onChange={() => formState === "error" && setFormState("idle")}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl",
                      "bg-sugar-milk border-2",
                      formState === "error" ? "border-red-400" : "border-nova-pink",
                      "font-poppins text-sm text-nova-pink placeholder:text-nova-pink/50 placeholder:font-semibold",
                      "outline-none transition-colors",
                    )}
                  />

                  {formState === "error" && <p className="font-poppins text-xs text-red-500">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className={cn(
                      "w-full py-3 rounded-xl",
                      "flex items-center justify-center",
                      "border-2 border-nova-pink text-nova-pink",
                      "font-bomstad-display font-black text-xl tracking-wide",
                      "hover:bg-nova-pink hover:text-sugar-milk transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    {formState === "loading" ? "SENDING..." : "SUBMIT"}
                  </button>

                  <p className="font-poppins text-[0.65rem] leading-relaxed text-nova-pink/60 mt-1">
                    By submitting this form, you consent to receive marketing emails from Mightyfull. Consent is not a
                    condition of purchase. Unsubscribe at any time by clicking the unsubscribe link.{" "}
                    <Link href="/privacy-policy" className="underline" onClick={dismiss}>
                      Privacy Policy
                    </Link>{" "}
                    &amp;{" "}
                    <Link href="/terms-of-service" className="underline" onClick={dismiss}>
                      Terms
                    </Link>
                    .
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Minimized badge */}
      <button
        onClick={() => setState("popup")}
        className={cn(
          "fixed bottom-24 left-0",
          "bg-nova-pink text-sugar-milk",
          "rounded-r-xl shadow-lg pl-4 pr-6 py-3",
          "transition-transform duration-300 ease-in-out",
          state === "badge" ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ zIndex: "var(--z-index-sticky)" }}
        aria-label="Reopen first order discount offer"
      >
        <span className="flex flex-col items-start font-bomstad-display font-black text-sm leading-tight text-left">
          <span className="whitespace-nowrap">First Order?</span>
          <span className="whitespace-nowrap">Save 15%</span>
        </span>
      </button>
    </>
  )
}
