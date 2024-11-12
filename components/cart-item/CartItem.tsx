"use client"

import s from "./cart-item.module.scss"

import { Minus, Plus } from "lucide-react"
import cn from "clsx"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Img } from "@/components/utility/img"

interface CartItemProps {
  id: string
  name: string
  price: number
  image: string
  defaultQuantity?: number
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItem({
  id,
  name,
  price,
  image,
  defaultQuantity = 1,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10)
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onQuantityChange(newQuantity)
    }

    console.log(id)
  }

  return (
    <div className={s.cartItem}>
      <div className="flex items-start gap-4">
        <div className={s.imgC}>
          <Img src={image} alt={name} fill className="object-cover" height="500" width="500" />
        </div>
        <div className="flex-1">
          <h3 className={s.title}>{name}</h3>
          <div className="flex items-center justify-between">
            <div className={cn(s.quantity, "flex items-center justify-between")}>
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(Math.max(0, defaultQuantity - 1))}
              >
                <Minus className="w-4 h-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <Input
                className="w-12 text-center"
                type="number"
                min="0"
                value={defaultQuantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />
              <Button size="icon" className="h-8 w-8" onClick={() => onQuantityChange(defaultQuantity + 1)}>
                <Plus className="w-4 h-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <div className={s.price}>{price.toFixed(2)}$</div>
          </div>
          <button onClick={onRemove} className={s.remove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
