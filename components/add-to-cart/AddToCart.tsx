"use client"

import s from "./add-to-cart.module.scss"

import cn from "clsx"
import { Minus, Plus } from "lucide-react"

import { Button } from "components/ui/button"

interface AddToCartProps {
  quantity: number
  setQuantity: (val: number) => void
}

export default function AddToCart(props: AddToCartProps) {
  return (
    <div className={cn(s.quantity, "grid grid-cols-12 h-full")}>
      <Button
        variant="naked"
        size="icon"
        className={cn(s.action, "col-span-4 p-2")}
        onClick={() => props.setQuantity(props.quantity - 1)}
        disabled={props.quantity <= 1}
      >
        <Minus className="h-full w-full" />
      </Button>
      <div className={cn("col-span-4 flex items-center justify-center")}>{props.quantity}</div>
      <Button
        variant="naked"
        size="slim"
        className={cn(s.action, "col-span-4 p-2")}
        onClick={() => props.setQuantity(props.quantity + 1)}
      >
        <Plus className="h-full w-full" />
      </Button>
    </div>
  )
}
