import s from "./modal.module.scss"

import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import cx from "clsx"

import { useLenisStore } from "@/lib/store/lenis"
import { useModalStore } from "@/lib/store/modal"
import { useCursorStore } from "@/lib/store/cursor"
import { Cross2Icon } from "@radix-ui/react-icons"

const Modal = () => {
  const { isOpen, content, setIsOpen, setContent } = useModalStore()
  const cursorStore = useCursorStore()
  const { lenis } = useLenisStore()
  const ref = useRef(null)
  const duration = 0.2

  useGSAP(
    () => {
      if (isOpen) {
        lenis?.stop()
        cursorStore.reset()
        gsap.to(ref.current, {
          duration,
          opacity: 1,
          pointerEvents: "auto",
        })
      } else {
        gsap.to(ref.current, {
          duration,
          opacity: 0,
          pointerEvents: "none",
          onComplete: () => {
            lenis?.start()
            cursorStore.reset()
            ScrollTrigger.refresh()
          },
        })
      }
    },
    {
      dependencies: [isOpen],
    }
  )

  function closeModal() {
    setContent(null)
    setIsOpen(false)
  }

  return (
    <div className={cx(s.modal, "flex items-center justify-center")} ref={ref}>
      <div className={cx(s.iconClose, "cursor-pointer z-10")} onClick={closeModal}>
        <Cross2Icon className="w-full h-full" />
      </div>
      <div className="relative z-0">{content}</div>
    </div>
  )
}

export default Modal
