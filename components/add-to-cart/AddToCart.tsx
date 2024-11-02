"use client"
import s from "./add-to-cart.module.scss"

import cx from "clsx"
import { Minus, Plus } from "lucide-react"

import { Button } from "components/ui/button"
import { Label } from "components/ui/label"
import { useCartStore } from "lib/store/cart"
import { usePurchaseStore } from "lib/store/purchase"

interface AddToCartProps {
  productName: string
  basePrice: number
}

export default function AddToCart({ productName, basePrice }: AddToCartProps) {
  const { purchaseType, deliveryInterval, quantity, incrementQuantity, decrementQuantity } = usePurchaseStore()

  const addItem = useCartStore((state) => state.addItem)
  const totalPrice = (basePrice * quantity).toFixed(2)

  const handleAddToCart = () => {
    addItem({
      name: productName,
      price: basePrice,
      quantity,
      purchaseType,
      ...(purchaseType === "subscribe" && { deliveryInterval }),
    })
  }

  return (
    <div className={cx(s.addToCart)}>
      <Label className={cx(s.label, "block")}>QUANTITY</Label>
      <div className="flex items-center space-x-2">
        <div className={cx(s.quantity, "flex items-center flex-shrink-0")}>
          <Button size="icon" onClick={decrementQuantity} className={s.action}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="flex-1 text-center">{quantity}</span>
          <Button size="icon" onClick={incrementQuantity} className={s.action}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button className={cx(s.button, "flex-1")} size="lg" onClick={handleAddToCart}>
          ADD TO CART ({totalPrice})
        </Button>
      </div>
    </div>
  )
}
