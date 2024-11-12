"use client"

import s from "./cart.module.scss"

import cn from "clsx"

import { X } from "lucide-react"

import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCartStore } from "@/lib/store/cart"
import { useLenisStore } from "@/lib/store/lenis"
import { useEffect } from "react"

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore()
  const { setIsStopped } = useLenisStore()

  useEffect(() => {
    return setIsStopped(isOpen)
  }, [isOpen, setIsStopped])

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className={cn(s.cart, { [s.open]: isOpen }, "flex flex-col")} data-lenis-prevent>
      <div className="flex items-center justify-between">
        <div className={s.title}>Your Cart</div>
        <Button size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex h-[700px] flex-col gap-8 mt-auto">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-8">
            {items.map((item) => (
              <div key={item.id} className="space-y-3">
                <CartItem
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  defaultQuantity={item.quantity}
                  onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
                {item.subscriptionOffer && (
                  <Button className={cn("w-full var(--blue-ruin)", s.suscriptionOffer)}>
                    {item.subscriptionOffer.text}
                  </Button>
                )}
                {item.deliveryOffer && (
                  <Button className="w-full var(--blue-ruin)">
                    <span>{item.deliveryOffer.text}</span>
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">CHECKOUT ({subtotal.toFixed(2)}$)</Button>
          <button onClick={() => setIsOpen(false)} className="w-full text-center text-blue-600 hover:underline">
            Continue Shopping
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Shipping, taxes and discounts calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
