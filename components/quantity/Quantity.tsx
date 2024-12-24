import s from "./quantity.module.scss"

import cn from "clsx"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuantityProps {
  className?: string
  quantity: number
  setQuantity: (val: number) => void
}

export default function Quantity(props: QuantityProps) {
  return (
    <div className={cn(s.quantity, "grid grid-cols-12", props.className)}>
      <Button
        colorTheme="nakedThemed"
        size="md"
        padding="none"
        className="col-span-4"
        onClick={() => props.setQuantity(props.quantity - 1)}
        disabled={props.quantity <= 1}
      >
        <Minus className="h-full w-full" />
      </Button>
      <div className="col-span-4 flex items-center justify-center">{props.quantity}</div>
      <Button
        colorTheme="nakedThemed"
        size="md"
        padding="none"
        className="col-span-4"
        onClick={() => props.setQuantity(props.quantity + 1)}
      >
        <Plus className="h-full w-full" />
      </Button>
    </div>
  )
}
